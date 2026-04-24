export const movies = [
  {
    id: 'm1',
    title: 'Intergalactic Voyager',
    genre: 'Sci-Fi • Thriller',
    duration: '2h 15m',
    rating: 'UA',
    image: '/hero_banner.png',
    synopsis: 'A lone astronaut discovers an ancient alien ring in deep space that could save humanity, but the journey to unlock its secrets is fraught with peril.',
    cast: ['Chris Pratt', 'Zoe Saldana', 'Dave Bautista']
  },
  {
    id: 'm2',
    title: 'Neon Rush',
    genre: 'Action • Crime',
    duration: '1h 58m',
    rating: 'A',
    image: '/hero_action.png',
    synopsis: 'An underground street racer gets tangled in a massive heist set in a cyberpunk city filled with neon lights, fast cars, and ruthless cartels.',
    cast: ['Ryan Gosling', 'Ana de Armas']
  },
  {
    id: 'm3',
    title: 'Midnight in Paris',
    genre: 'Romance • Drama',
    duration: '2h 05m',
    rating: 'U',
    image: '/hero_romance.png',
    synopsis: 'Two strangers meet under the glowing Eiffel tower on a rainy night, sparking a romance that forces them to choose between their pasts and their future.',
    cast: ['Emma Stone', 'Timothée Chalamet']
  }
];

export const events = [
  {
    id: 'e1',
    title: 'Rock the Arena 2026',
    type: 'Concert',
    rating: '9.8',
    image: '/event_poster.png',
    genre: 'Live Music',
    duration: '3h 30m',
    synopsis: 'The biggest rock concert of the year featuring legendary bands and mind-blowing pyrotechnics. Get ready to rock the night away!',
    cast: ['The Rolling Stones', 'Foo Fighters']
  },
  {
    id: 'e2',
    title: 'Laugh Out Loud Tour',
    type: 'Comedy',
    rating: '9.5',
    image: '/event_comedy.png',
    genre: 'Standup Comedy',
    duration: '2h 00m',
    synopsis: 'A hilarious evening of standup comedy from the best comedians in the country. Prepare to laugh until your sides hurt.',
    cast: ['Kevin Hart', 'Ali Wong']
  },
  {
    id: 'e3',
    title: 'Finals Slam Dunk',
    type: 'Sports',
    rating: '9.2',
    image: '/event_sports.png',
    genre: 'Basketball',
    duration: '2h 45m',
    synopsis: 'The ultimate showdown between the top two teams in the league. Expect high-flying dunks and intense defense in this winner-takes-all match.',
    cast: ['LeBron James', 'Stephen Curry']
  },
  {
    id: 'e4',
    title: 'Tech Summit India',
    type: 'Workshop',
    rating: '8.9',
    image: '/event_poster.png', // reusing one for the 4th to save time
    genre: 'Technology',
    duration: '6h 00m',
    synopsis: 'A deep dive into the future of AI and web technologies with industry leaders and hands-on workshops.',
    cast: ['Sundar Pichai', 'Sam Altman']
  }
];

export const getItemById = (id) => {
  const movie = movies.find(m => m.id === id);
  if (movie) return movie;
  return events.find(e => e.id === id);
};
