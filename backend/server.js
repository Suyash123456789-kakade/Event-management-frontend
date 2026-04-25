const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { initDb, getDbConnection } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'super_secret_jwt_key_12345';
const PORT = 5000;

let transporter;

// Initialize mailer
async function initMailer() {
  // Use Ethereal for testing - free fake SMTP service
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass, 
    },
  });
  console.log('Ethereal Email initialized.');
}

initMailer();

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Start DB and Server
initDb().then(() => {
  console.log('Database initialized');
  
  // Routes

  // 1. Send OTP
  app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const db = await getDbConnection();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    await db.run('INSERT INTO Otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt.toISOString()]);

    const otpMessage = `MOCK OTP SENT TO ${email}: ${otp}`;
    console.log(`\n========================================`);
    console.log(otpMessage);
    console.log(`========================================\n`);

    // Write OTP to file for easy local testing
    fs.writeFileSync(path.join(__dirname, '..', 'LATEST_OTP.txt'), otpMessage);

    try {
      let info = await transporter.sendMail({
        from: '"BookMyShow Clone" <no-reply@bookmyshow-clone.com>',
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      });
      console.log("Preview OTP Email URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (e) {
      console.error("Failed to send ethereal email, but OTP is in console.", e);
    }

    res.json({ message: 'OTP sent successfully' });
  });

  // 2. Verify OTP
  app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const db = await getDbConnection();
    
    // Check latest valid OTP
    const otpRecord = await db.get(
      'SELECT * FROM Otps WHERE email = ? AND otp = ? AND expires_at > ? ORDER BY id DESC LIMIT 1', 
      [email, otp, new Date().toISOString()]
    );

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Get or Create User
    let user = await db.get('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) {
      const result = await db.run('INSERT INTO Users (email) VALUES (?)', [email]);
      user = { id: result.lastID, email };
    }

    // Delete used OTPs
    await db.run('DELETE FROM Otps WHERE email = ?', [email]);

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user.id, email: user.email } });
  });

  // 3. Get Events
  app.get('/api/events', async (req, res) => {
    const db = await getDbConnection();
    const events = await db.all('SELECT * FROM Events ORDER BY id DESC');
    
    // Parse cast from string to array
    const parsedEvents = events.map(e => ({
      ...e,
      cast: e.cast ? JSON.parse(e.cast) : []
    }));
    
    res.json(parsedEvents);
  });

  // 3.5 Get Single Event
  app.get('/api/events/:id', async (req, res) => {
    const db = await getDbConnection();
    const event = await db.get('SELECT * FROM Events WHERE id = ?', [req.params.id]);
    
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    event.cast = event.cast ? JSON.parse(event.cast) : [];
    res.json(event);
  });

  // 4. Create Event (Protected)
  app.post('/api/events', authenticateToken, async (req, res) => {
    const { title, type, genre, rating, duration, image, synopsis, cast } = req.body;
    
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }

    const db = await getDbConnection();
    const result = await db.run(
      `INSERT INTO Events (title, type, genre, rating, duration, image, synopsis, cast, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, type, genre, rating || 'U', duration, image || '/hero_banner.png', synopsis, JSON.stringify(cast || []), req.user.id]
    );

    res.status(201).json({ id: result.lastID, message: 'Event created successfully' });
  });

  // 5. Create Booking (Protected)
  app.post('/api/bookings', authenticateToken, async (req, res) => {
    const { event_id, seats, total_price } = req.body;
    
    if (!event_id || !seats || !seats.length) {
      return res.status(400).json({ error: 'Event ID and Seats are required' });
    }

    const db = await getDbConnection();
    const result = await db.run(
      `INSERT INTO Bookings (user_id, event_id, seats, total_price) 
       VALUES (?, ?, ?, ?)`,
      [req.user.id, event_id, JSON.stringify(seats), total_price || 0]
    );

    res.status(201).json({ id: result.lastID, message: 'Booking successful' });
  });

  // 6. Get User Bookings (Protected)
  app.get('/api/bookings/my', authenticateToken, async (req, res) => {
    const db = await getDbConnection();
    const bookings = await db.all(
      `SELECT b.*, e.title, e.image, e.duration 
       FROM Bookings b 
       JOIN Events e ON b.event_id = e.id 
       WHERE b.user_id = ? 
       ORDER BY b.id DESC`,
      [req.user.id]
    );
    
    const parsedBookings = bookings.map(b => ({
      ...b,
      seats: b.seats ? JSON.parse(b.seats) : []
    }));
    
    res.json(parsedBookings);
  });

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('Failed to initialize database', err);
});
