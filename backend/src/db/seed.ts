import { db } from './client.js';
import { destinations, seasonal_weather, tips } from './schema.js';

const mockDestinations = [
  {
    name: 'Sabarmati Ashram',
    description: 'Historic ashram founded by Mahatma Gandhi',
    image_url: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800',
    category: 'Historical',
    latitude: 23.1815,
    longitude: 72.6297,
    avg_budget: 500,
    avg_days: 1,
    popularity_score: 95,
    tags: ['history', 'culture', 'free', 'morning-visit'],
    highlights: ['Gandhi statue', 'Museum', 'Peaceful gardens', 'Free entry'],
  },
  {
    name: 'Kankaria Lake',
    description: 'Historic artificial lake with recreational facilities',
    image_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    category: 'Recreation',
    latitude: 23.0225,
    longitude: 72.5714,
    avg_budget: 1500,
    avg_days: 1,
    popularity_score: 90,
    tags: ['lake', 'evening', 'family', 'food-stalls'],
    highlights: ['Sunset views', 'Zoo', 'Water sports', 'Street food'],
  },
  {
    name: 'Old City Heritage Walk',
    description: 'Walk through the narrow lanes of historic Ahmedabad',
    image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    category: 'Heritage',
    latitude: 23.1903,
    longitude: 72.6247,
    avg_budget: 800,
    avg_days: 2,
    popularity_score: 88,
    tags: ['heritage', 'walking-tour', 'photography', 'morning'],
    highlights: ['Ancient havelis', 'Local markets', 'Temples', 'History'],
  },
  {
    name: 'Adalaj Stepwell',
    description: 'Ancient step well with stunning architecture',
    image_url: 'https://images.unsplash.com/photo-1513395970300-0c8eda34e45b?w=800',
    category: 'Architecture',
    latitude: 23.2097,
    longitude: 72.5483,
    avg_budget: 600,
    avg_days: 1,
    popularity_score: 92,
    tags: ['architecture', 'photography', 'historical'],
    highlights: ['Beautiful columns', 'Underground structure', 'Cool interiors'],
  },
  {
    name: 'Law Garden Night Market',
    description: 'Famous night market with handicrafts and food',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561a1b?w=800',
    category: 'Shopping',
    latitude: 23.1945,
    longitude: 72.6129,
    avg_budget: 2000,
    avg_days: 1,
    popularity_score: 85,
    tags: ['shopping', 'market', 'night', 'handicrafts'],
    highlights: ['Handicrafts', 'Textiles', 'Food stalls', 'Local artists'],
  },
  {
    name: 'Manek Chowk',
    description: 'Historic square with best street food and jewelry',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    category: 'Food',
    latitude: 23.1888,
    longitude: 72.6263,
    avg_budget: 1200,
    avg_days: 1,
    popularity_score: 93,
    tags: ['food', 'street-food', 'night-life', 'shopping'],
    highlights: ['Dhokla', 'Jalebi', 'Jewelry', 'Local experience'],
  },
  {
    name: 'Science City',
    description: 'Interactive science museum and entertainment hub',
    image_url: 'https://images.unsplash.com/photo-1578701222033-a771bb09fc41?w=800',
    category: 'Entertainment',
    latitude: 23.0634,
    longitude: 72.4747,
    avg_budget: 800,
    avg_days: 2,
    popularity_score: 88,
    tags: ['science', 'family', 'interactive', 'education'],
    highlights: ['Exhibits', 'IMAX theatre', 'Planetarium', 'Fun activities'],
  },
  {
    name: 'Calico Museum',
    description: 'World-renowned textile museum',
    image_url: 'https://images.unsplash.com/photo-1564399579883-451a5d3e95b3?w=800',
    category: 'Culture',
    latitude: 23.1894,
    longitude: 72.5889,
    avg_budget: 1500,
    avg_days: 2,
    popularity_score: 89,
    tags: ['textiles', 'museum', 'culture', 'history'],
    highlights: ['Ancient textiles', 'Guided tours', 'Collections', 'Art'],
  },
  {
    name: 'Sarkhej Roza',
    description: 'Beautiful mosque complex with serene gardens',
    image_url: 'https://images.unsplash.com/photo-1564399579883-451a5d3e95b3?w=800',
    category: 'Historical',
    latitude: 23.0242,
    longitude: 72.4875,
    avg_budget: 700,
    avg_days: 1,
    popularity_score: 87,
    tags: ['mosque', 'peaceful', 'photography', 'spiritual'],
    highlights: ['Architecture', 'Gardens', 'Serene environment', 'Historical'],
  },
  {
    name: 'ISKCON Temple',
    description: 'Modern temple dedicated to Lord Krishna',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
    category: 'Religious',
    latitude: 23.0255,
    longitude: 72.5033,
    avg_budget: 500,
    avg_days: 1,
    popularity_score: 85,
    tags: ['temple', 'spiritual', 'free', 'meditation'],
    highlights: ['Krishna deity', 'Spiritual atmosphere', 'Langar', 'Peace'],
  },
];

const mockSeasonalWeather = [
  // Summer (March-May)
  { season: 'summer', avg_temp: 38, humidity: 40, rainfall: 5, comfort_score: 30, seasonal_score: 40 },
  // Monsoon (June-August)
  { season: 'monsoon', avg_temp: 30, humidity: 75, rainfall: 200, comfort_score: 55, seasonal_score: 60 },
  // Autumn (September-October)
  { season: 'autumn', avg_temp: 28, humidity: 60, rainfall: 80, comfort_score: 75, seasonal_score: 85 },
  // Winter (November-February)
  { season: 'winter', avg_temp: 18, humidity: 45, rainfall: 10, comfort_score: 90, seasonal_score: 95 },
];

const mockTips = [
  {
    destination_name: 'Sabarmati Ashram',
    content: 'Visit early morning around 6 AM for a peaceful and spiritual experience. The ashram is less crowded and you can enjoy the gardens in solitude.',
    season: 'winter',
    tags: ['morning', 'peaceful', 'photography'],
  },
  {
    destination_name: 'Sabarmati Ashram',
    content: 'Free entry but donations are appreciated. Bring a scarf or dupatta to cover your head as a sign of respect.',
    season: 'winter',
    tags: ['tips', 'respect', 'free'],
  },
  {
    destination_name: 'Kankaria Lake',
    content: 'The best time to visit is during sunset. Come around 5 PM to enjoy the changing colors and have dinner at the lake-side restaurants.',
    season: 'winter',
    tags: ['sunset', 'photography', 'dinner'],
  },
  {
    destination_name: 'Kankaria Lake',
    content: 'Avoid visiting during summer noon hours - it gets extremely hot. The lake is magical during monsoon evenings with misty weather.',
    season: 'monsoon',
    tags: ['timing', 'weather', 'avoid-summer'],
  },
  {
    destination_name: 'Law Garden Night Market',
    content: 'Open every night but Thursday evening has special handicraft sections. Best visited after 8 PM when the market is fully packed.',
    season: 'winter',
    tags: ['thursday', 'evening', 'timing'],
  },
  {
    destination_name: 'Manek Chowk',
    content: 'The food stalls open after 9 PM. Try the local specialties: Khichiyu, Jalebi-Fafda, and Kachumber. Don\'t miss the night life atmosphere!',
    season: 'winter',
    tags: ['food', 'night', 'local-food'],
  },
  {
    destination_name: 'Old City Heritage Walk',
    content: 'Hire a local guide for better insights into the 600-year-old city. The early morning walks (6-9 AM) are best to avoid the heat and crowds.',
    season: 'winter',
    tags: ['guide', 'morning', 'photography'],
  },
  {
    destination_name: 'Adalaj Stepwell',
    content: 'The interiors stay cool and pleasant. Perfect escape from summer heat. The underground structure maintains a temperature around 25°C even in peak summer.',
    season: 'summer',
    tags: ['cool', 'summer', 'relief'],
  },
  {
    destination_name: 'Science City',
    content: 'Plan for 2-3 hours minimum. The IMAX shows are popular - book tickets in advance. Weekend mornings are less crowded.',
    season: 'winter',
    tags: ['planning', 'booking', 'timing'],
  },
  {
    destination_name: 'Calico Museum',
    content: 'Photography is not allowed inside. The museum collections span over 5000 textiles. Allow at least 2-3 hours for a proper tour.',
    season: 'winter',
    tags: ['photography-rules', 'timing', 'tour'],
  },
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    // Note: This might fail if there are foreign key constraints
    // In production, use proper migration strategies

    // Insert destinations
    console.log('Seeding destinations...');
    for (const dest of mockDestinations) {
      await db.insert(destinations).values({
        name: dest.name,
        description: dest.description,
        image_url: dest.image_url,
        category: dest.category,
        latitude: dest.latitude.toString() as any,
        longitude: dest.longitude.toString() as any,
        avg_budget: dest.avg_budget,
        avg_days: dest.avg_days,
        popularity_score: dest.popularity_score,
        tags: dest.tags,
        highlights: dest.highlights,
      });
    }

    // Get inserted destinations
    const insertedDestinations = await db.select().from(destinations);

    // Insert seasonal weather for each destination and season
    console.log('Seeding seasonal weather...');
    for (const dest of insertedDestinations) {
      for (const weather of mockSeasonalWeather) {
        await db.insert(seasonal_weather).values({
          destination_id: dest.id,
          season: weather.season as any,
          avg_temp: weather.avg_temp,
          humidity: weather.humidity,
          rainfall: weather.rainfall,
          comfort_score: weather.comfort_score,
          seasonal_score: weather.seasonal_score,
          description: `${weather.season.charAt(0).toUpperCase() + weather.season.slice(1)} weather in ${dest.name}`,
          best_activities: ['walking', 'photography', 'exploration'],
        });
      }
    }

    // Insert tips for destinations
    console.log('Seeding tips...');
    interface InsertedDest { id: string; name: string | null }
    const destinationMap = new Map(insertedDestinations.map((d: InsertedDest) => [d.name, d.id]));

    for (const tip of mockTips) {
      const destinationId = destinationMap.get(tip.destination_name);
      if (destinationId) {
        await db.insert(tips).values({
          user_id: '550e8400-e29b-41d4-a716-446655440000', // Mock user ID
          destination_id: destinationId,
          destination_name: tip.destination_name,
          content: tip.content,
          season: tip.season,
          tags: tip.tags,
          upvotes: Math.floor(Math.random() * 50),
          downvotes: Math.floor(Math.random() * 5),
          featured: Math.random() > 0.7, // 30% featured
        });
      }
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
