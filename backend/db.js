const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function getDbConnection() {
  return open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDbConnection();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      otp TEXT,
      expires_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS Events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      type TEXT,
      genre TEXT,
      rating TEXT,
      duration TEXT,
      image TEXT,
      synopsis TEXT,
      cast TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES Users(id)
    );

    CREATE TABLE IF NOT EXISTS Bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      event_id INTEGER,
      seats TEXT,
      total_price INTEGER,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES Users(id),
      FOREIGN KEY(event_id) REFERENCES Events(id)
    );
  `);

  // Seed events if none exist
  const eventCount = await db.get('SELECT COUNT(*) as count FROM Events');
  if (eventCount.count === 0) {
    const initialEvents = [
      {
        title: 'Rock the Arena 2026',
        type: 'Concert',
        rating: '9.8',
        image: '/event_poster.png',
        genre: 'Live Music',
        duration: '3h 30m',
        synopsis: 'The biggest rock concert of the year featuring legendary bands and mind-blowing pyrotechnics. Get ready to rock the night away!',
        cast: JSON.stringify(['The Rolling Stones', 'Foo Fighters'])
      },
      {
        title: 'Laugh Out Loud Tour',
        type: 'Comedy',
        rating: '9.5',
        image: '/event_comedy.png',
        genre: 'Standup Comedy',
        duration: '2h 00m',
        synopsis: 'A hilarious evening of standup comedy from the best comedians in the country. Prepare to laugh until your sides hurt.',
        cast: JSON.stringify(['Kevin Hart', 'Ali Wong'])
      },
      {
        title: 'Finals Slam Dunk',
        type: 'Sports',
        rating: '9.2',
        image: '/event_sports.png',
        genre: 'Basketball',
        duration: '2h 45m',
        synopsis: 'The ultimate showdown between the top two teams in the league. Expect high-flying dunks and intense defense in this winner-takes-all match.',
        cast: JSON.stringify(['LeBron James', 'Stephen Curry'])
      },
      {
        title: 'Tech Summit India',
        type: 'Workshop',
        rating: '8.9',
        image: '/event_poster.png',
        genre: 'Technology',
        duration: '6h 00m',
        synopsis: 'A deep dive into the future of AI and web technologies with industry leaders and hands-on workshops.',
        cast: JSON.stringify(['Sundar Pichai', 'Sam Altman'])
      }
    ];

    for (const event of initialEvents) {
      await db.run(
        `INSERT INTO Events (title, type, rating, image, genre, duration, synopsis, cast) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [event.title, event.type, event.rating, event.image, event.genre, event.duration, event.synopsis, event.cast]
      );
    }
  }

  return db;
}

module.exports = {
  getDbConnection,
  initDb
};
