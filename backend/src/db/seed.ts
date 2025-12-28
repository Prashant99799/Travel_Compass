import { db } from './client.js';
import { destinations, seasonal_weather, tips, users } from './schema.js';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const mockDestinations = [
  {
    name: 'Sabarmati Ashram',
    description: 'Historic ashram founded by Mahatma Gandhi in 1917. This serene riverside retreat was the nerve center of India\'s freedom movement and Gandhi\'s home for 12 years.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sabarmati_Ashram.jpg/1280px-Sabarmati_Ashram.jpg',
    category: 'Historical',
    latitude: 23.0607,
    longitude: 72.5803,
    avg_budget: 200,
    avg_days: 1,
    popularity_score: 98,
    tags: ['history', 'culture', 'free', 'morning-visit', 'gandhi', 'freedom-movement'],
    highlights: ['Gandhi Museum', 'Hriday Kunj (Gandhi\'s residence)', 'Prayer Ground', 'Photo Gallery', 'Spinning Wheel Collection'],
  },
  {
    name: 'Kankaria Lake',
    description: 'A 500-year-old polygonal lake built in 1451, now transformed into Ahmedabad\'s favorite entertainment hub with zoo, rides, and stunning evening views.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Kankaria_Lake%2C_Ahmedabad.jpg/1280px-Kankaria_Lake%2C_Ahmedabad.jpg',
    category: 'Recreation',
    latitude: 23.0070,
    longitude: 72.6004,
    avg_budget: 300,
    avg_days: 1,
    popularity_score: 95,
    tags: ['lake', 'evening', 'family', 'food-stalls', 'sunset', 'kids'],
    highlights: ['Nagina Wadi (Island Garden)', 'Kankaria Zoo', 'Toy Train', 'Balloon Safari', 'Food Zone', 'Musical Fountain'],
  },
  {
    name: 'Adalaj Stepwell',
    description: 'A stunning five-story stepwell built in 1498, showcasing intricate Indo-Islamic architecture. The cool underground structure stays pleasant even in peak summer.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Adalaj_Stepwell_02.jpg/1280px-Adalaj_Stepwell_02.jpg',
    category: 'Architecture',
    latitude: 23.1667,
    longitude: 72.5833,
    avg_budget: 50,
    avg_days: 1,
    popularity_score: 94,
    tags: ['architecture', 'photography', 'historical', 'cool', 'stepwell', 'unesco'],
    highlights: ['Five Storeys Underground', 'Intricate Carvings', 'Cool Interiors (25°C)', 'Photography Paradise', 'Sunset Views'],
  },
  {
    name: 'Manek Chowk',
    description: 'The heart of old Ahmedabad - a jewelry market by day and legendary street food paradise by night. Experience authentic Gujarati street food culture.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Manek_Chowk_Ahmedabad.jpg/1280px-Manek_Chowk_Ahmedabad.jpg',
    category: 'Food',
    latitude: 23.0258,
    longitude: 72.5873,
    avg_budget: 500,
    avg_days: 1,
    popularity_score: 96,
    tags: ['food', 'street-food', 'night-life', 'shopping', 'jewelry', 'local-experience'],
    highlights: ['Khichiyu', 'Jalebi-Fafda', 'Pav Bhaji', 'Kulfi', 'Gold Jewelry Market', 'Night Food Stalls (9PM onwards)'],
  },
  {
    name: 'Old City Heritage Walk',
    description: 'UNESCO World Heritage City walk through 600-year-old pols (residential clusters). Discover hidden havelis, bird feeders, chabutaros, and ancient temples.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ahmedabad_Pol_House.jpg/800px-Ahmedabad_Pol_House.jpg',
    category: 'Heritage',
    latitude: 23.0258,
    longitude: 72.5873,
    avg_budget: 500,
    avg_days: 1,
    popularity_score: 92,
    tags: ['heritage', 'walking-tour', 'photography', 'morning', 'unesco', 'architecture'],
    highlights: ['Wooden Havelis', 'Secret Doors', 'Bird Feeders (Chabutaro)', 'Temple Streets', 'Swaminarayan Temple', 'Rani no Hajiro'],
  },
  {
    name: 'Law Garden Night Market',
    description: 'Ahmedabad\'s most vibrant night market famous for traditional Gujarati handicrafts, bandhani textiles, and delicious street food. A shopper\'s paradise!',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Law_Garden_Night_Market.jpg/1280px-Law_Garden_Night_Market.jpg',
    category: 'Shopping',
    latitude: 23.0330,
    longitude: 72.5610,
    avg_budget: 1500,
    avg_days: 1,
    popularity_score: 89,
    tags: ['shopping', 'market', 'night', 'handicrafts', 'textiles', 'bargaining'],
    highlights: ['Bandhani Textiles', 'Embroidered Garments', 'Silver Jewelry', 'Handmade Bags', 'Street Food Corner', 'Local Artisans'],
  },
  {
    name: 'Sarkhej Roza',
    description: 'A stunning mosque and tomb complex from the 15th century, often called the "Acropolis of Ahmedabad". Beautiful blend of Hindu and Islamic architecture.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sarkhej_Roza_Overview.jpg/1280px-Sarkhej_Roza_Overview.jpg',
    category: 'Historical',
    latitude: 22.9833,
    longitude: 72.5000,
    avg_budget: 50,
    avg_days: 1,
    popularity_score: 88,
    tags: ['mosque', 'peaceful', 'photography', 'spiritual', 'architecture', 'sufi'],
    highlights: ['Sultan\'s Palace', 'Royal Pavilion', 'Sacred Tank', 'Tomb of Sheikh Ahmed Khattu', 'Sunset Views', 'Peaceful Gardens'],
  },
  {
    name: 'Science City',
    description: 'India\'s largest science park spread over 107 hectares. Features interactive exhibits, IMAX theater, musical fountain, and thrilling science shows.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gujarat_Science_City.jpg/1280px-Gujarat_Science_City.jpg',
    category: 'Entertainment',
    latitude: 23.0872,
    longitude: 72.5147,
    avg_budget: 600,
    avg_days: 1,
    popularity_score: 91,
    tags: ['science', 'family', 'interactive', 'education', 'kids', 'imax'],
    highlights: ['Hall of Science', 'IMAX 3D Theater', 'Energy Park', 'Planet Earth', 'Musical Fountain', 'Aquatic Gallery'],
  },
  {
    name: 'Calico Museum of Textiles',
    description: 'World\'s finest collection of Indian textiles spanning 500 years. A must-visit for art lovers, housed in a beautiful carved haveli.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Calico_Museum_Ahmedabad.jpg/1024px-Calico_Museum_Ahmedabad.jpg',
    category: 'Culture',
    latitude: 23.0405,
    longitude: 72.5656,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 87,
    tags: ['textiles', 'museum', 'culture', 'history', 'art', 'free'],
    highlights: ['Mughal Textiles', 'Royal Costumes', 'Temple Hangings', 'Patola Collection', 'Guided Tours Only', 'No Photography'],
  },
  {
    name: 'Akshardham Temple',
    description: 'Magnificent modern temple complex showcasing 10,000 years of Indian culture through stunning architecture, exhibitions, and light shows.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Akshardham_Gandhinagar.jpg/1280px-Akshardham_Gandhinagar.jpg',
    category: 'Religious',
    latitude: 23.2108,
    longitude: 72.6500,
    avg_budget: 100,
    avg_days: 1,
    popularity_score: 97,
    tags: ['temple', 'spiritual', 'architecture', 'light-show', 'evening', 'gandhinagar'],
    highlights: ['Main Mandir', 'Sahaj Anand Water Show', 'Exhibition Halls', 'Gardens', 'Prasadam', 'Evening Light Show'],
  },
  {
    name: 'Sidi Saiyyed Mosque',
    description: 'Famous for its iconic stone latticework (Jali) depicting the "Tree of Life" - the unofficial symbol of Ahmedabad adopted by IIM-A.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sidi_Saiyyed_Mosque_Jali.jpg/1024px-Sidi_Saiyyed_Mosque_Jali.jpg',
    category: 'Architecture',
    latitude: 23.0566,
    longitude: 72.5674,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 90,
    tags: ['mosque', 'architecture', 'jali', 'photography', 'iconic', 'free'],
    highlights: ['Tree of Life Jali', 'Stone Latticework', 'IIM-A Logo Inspiration', 'Sunset Photography', 'Historic Architecture'],
  },
  {
    name: 'Auto World Vintage Car Museum',
    description: 'One of Asia\'s largest vintage car collections with over 100 rare automobiles including Rolls Royces, Bentleys, and cars owned by royalty.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Auto_World_Ahmedabad.jpg/1024px-Auto_World_Ahmedabad.jpg',
    category: 'Entertainment',
    latitude: 23.0312,
    longitude: 72.5063,
    avg_budget: 300,
    avg_days: 1,
    popularity_score: 82,
    tags: ['cars', 'museum', 'vintage', 'unique', 'photography', 'collection'],
    highlights: ['Rolls Royce Collection', 'Royal Cars', 'Vintage Motorcycles', 'Unique Photo Ops', 'Guided Tours'],
  },
  {
    name: 'Sabarmati Riverfront',
    description: 'A stunning 11 km urban riverfront development with promenades, gardens, and event spaces. Perfect for morning walks and evening strolls.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sabarmati_Riverfront_Ahmedabad.jpg/1280px-Sabarmati_Riverfront_Ahmedabad.jpg',
    category: 'Recreation',
    latitude: 23.0350,
    longitude: 72.5700,
    avg_budget: 100,
    avg_days: 1,
    popularity_score: 93,
    tags: ['riverfront', 'walking', 'evening', 'photography', 'cycling', 'events'],
    highlights: ['Lower Promenade', 'Flower Garden', 'Event Arena', 'Cycling Track', 'Sunset Views', 'Food Stalls'],
  },
  {
    name: 'Hutheesing Jain Temple',
    description: 'The most beautiful Jain temple in Ahmedabad, built in 1848. Stunning white marble architecture with intricate carvings.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Hutheesing_Jain_Temple.jpg/1024px-Hutheesing_Jain_Temple.jpg',
    category: 'Religious',
    latitude: 23.0397,
    longitude: 72.5706,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 84,
    tags: ['temple', 'jain', 'architecture', 'marble', 'peaceful', 'free'],
    highlights: ['White Marble Architecture', '52 Shrine Cells', 'Intricate Carvings', 'Peaceful Atmosphere', 'Morning Prayers'],
  },
  {
    name: 'Gujarat Vidyapith',
    description: 'University founded by Mahatma Gandhi in 1920 to promote Indian education. Houses a library and museum with Gandhi\'s personal belongings.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Gujarat_Vidyapith.jpg/1024px-Gujarat_Vidyapith.jpg',
    category: 'Historical',
    latitude: 23.0427,
    longitude: 72.5478,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 78,
    tags: ['gandhi', 'education', 'history', 'library', 'museum', 'free'],
    highlights: ['Gandhi Museum', 'Historic Library', 'Spinning Wheel Collection', 'Freedom Movement Archives', 'Peaceful Campus'],
  },
  {
    name: 'Vastrapur Lake',
    description: 'A peaceful urban lake surrounded by lush gardens. Popular spot for morning joggers, bird watchers, and families seeking tranquility.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vastrapur_Lake_Garden.jpg/1024px-Vastrapur_Lake_Garden.jpg',
    category: 'Recreation',
    latitude: 23.0369,
    longitude: 72.5269,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 80,
    tags: ['lake', 'morning', 'jogging', 'birds', 'peaceful', 'free'],
    highlights: ['Jogging Track', 'Bird Watching', 'Children\'s Play Area', 'Amphitheater', 'Early Morning Views'],
  },
  {
    name: 'Rani no Hajiro',
    description: 'Royal queens\' tombs from the 15th century, located in the bustling Manek Chowk area. A hidden gem of Islamic architecture.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rani_no_Hajiro.jpg/800px-Rani_no_Hajiro.jpg',
    category: 'Heritage',
    latitude: 23.0253,
    longitude: 72.5864,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 75,
    tags: ['heritage', 'tomb', 'islamic', 'history', 'free', 'hidden-gem'],
    highlights: ['Queens\' Tombs', 'Brass Screens', 'Local Market Around', 'Historic Architecture', 'Peaceful Interiors'],
  },
  {
    name: 'Jama Masjid',
    description: 'One of India\'s largest mosques built in 1424 by Sultan Ahmed Shah. Features 260 pillars supporting 15 domes.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Jama_Masjid_Ahmedabad.jpg/1280px-Jama_Masjid_Ahmedabad.jpg',
    category: 'Architecture',
    latitude: 23.0262,
    longitude: 72.5865,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 86,
    tags: ['mosque', 'architecture', 'historical', 'islamic', 'free', 'sultan'],
    highlights: ['260 Pillars', '15 Domes', 'Yellow Sandstone', 'Ahmed Shah\'s Tomb', 'Courtyard', 'Historic Architecture'],
  },
  {
    name: 'IIM Ahmedabad Campus',
    description: 'Iconic red-brick campus designed by Louis Kahn, one of the finest examples of modern institutional architecture in the world.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/IIM_Ahmedabad_Building.jpg/1280px-IIM_Ahmedabad_Building.jpg',
    category: 'Architecture',
    latitude: 23.0329,
    longitude: 72.5248,
    avg_budget: 0,
    avg_days: 1,
    popularity_score: 83,
    tags: ['architecture', 'education', 'modern', 'louis-kahn', 'iconic', 'free'],
    highlights: ['Louis Kahn Architecture', 'Red Brick Buildings', 'Geometric Design', 'Library', 'Lake View', 'Campus Walk'],
  },
  {
    name: 'Parimal Garden',
    description: 'Beautiful public garden with diverse flora, walking paths, and peaceful ambiance. Popular spot for morning yoga and evening relaxation.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Parimal_Garden_Ahmedabad.jpg/1024px-Parimal_Garden_Ahmedabad.jpg',
    category: 'Recreation',
    latitude: 23.0117,
    longitude: 72.5225,
    avg_budget: 20,
    avg_days: 1,
    popularity_score: 77,
    tags: ['garden', 'morning', 'yoga', 'peaceful', 'family', 'walking'],
    highlights: ['Walking Paths', 'Diverse Flora', 'Morning Yoga Spot', 'Children\'s Area', 'Peaceful Ambiance'],
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
  // Sabarmati Ashram Tips
  {
    destination_name: 'Sabarmati Ashram',
    content: 'Visit early morning around 6-7 AM for a peaceful and spiritual experience. The ashram is less crowded and you can enjoy the gardens in complete solitude. Watch the sunrise over the Sabarmati river!',
    season: 'winter',
    tags: ['morning', 'peaceful', 'photography', 'sunrise'],
  },
  {
    destination_name: 'Sabarmati Ashram',
    content: 'Entry is completely FREE but donations are appreciated. The museum closes at 6 PM. Spend at least 2 hours to properly experience Gandhi\'s life through the exhibits.',
    season: 'winter',
    tags: ['free', 'timing', 'museum'],
  },
  {
    destination_name: 'Sabarmati Ashram',
    content: 'Avoid visiting in summer afternoons - temperatures can reach 45°C! If you must visit in summer, come before 9 AM or after 5 PM.',
    season: 'summer',
    tags: ['weather', 'timing', 'avoid-heat'],
  },
  // Kankaria Lake Tips
  {
    destination_name: 'Kankaria Lake',
    content: 'The best time to visit is during sunset around 5-6 PM. Come early to grab a spot for the musical fountain show which starts at 7:30 PM. Entry fee is just ₹25!',
    season: 'winter',
    tags: ['sunset', 'photography', 'musical-fountain'],
  },
  {
    destination_name: 'Kankaria Lake',
    content: 'Tuesday is the lake\'s weekly closure day - don\'t plan your visit then! Weekends are very crowded, prefer weekday evenings for a peaceful experience.',
    season: 'winter',
    tags: ['timing', 'closure', 'crowds'],
  },
  {
    destination_name: 'Kankaria Lake',
    content: 'The monsoon evenings are magical with misty weather and cool breeze. The lake overflows during heavy rains creating beautiful waterfalls!',
    season: 'monsoon',
    tags: ['monsoon', 'scenic', 'unique'],
  },
  // Adalaj Stepwell Tips
  {
    destination_name: 'Adalaj Stepwell',
    content: 'The stepwell maintains a cool temperature of 25°C even when it\'s 45°C outside - perfect summer escape! The underground structure was designed for this exact purpose.',
    season: 'summer',
    tags: ['cool', 'summer', 'architecture'],
  },
  {
    destination_name: 'Adalaj Stepwell',
    content: 'Visit around 10-11 AM when sunlight streams through the stepwell creating magical photo opportunities. The play of light and shadow is spectacular!',
    season: 'winter',
    tags: ['photography', 'lighting', 'timing'],
  },
  {
    destination_name: 'Adalaj Stepwell',
    content: 'Entry is only ₹25 for Indians. Hire a local guide (₹200-300) to understand the fascinating history and hidden symbols carved in the walls.',
    season: 'winter',
    tags: ['guide', 'history', 'budget'],
  },
  // Manek Chowk Tips
  {
    destination_name: 'Manek Chowk',
    content: 'The food stalls open ONLY after 9 PM and close by 2 AM. Must-try items: Khichiyu (₹60), Pav Bhaji (₹80), Kulfi (₹40), and the famous Sandwich Stalls!',
    season: 'winter',
    tags: ['food', 'night', 'local-food', 'timing'],
  },
  {
    destination_name: 'Manek Chowk',
    content: 'During the day (11 AM - 7 PM), it transforms into Gujarat\'s biggest jewelry market. Gold rates here are among the lowest in India!',
    season: 'winter',
    tags: ['shopping', 'jewelry', 'daytime'],
  },
  {
    destination_name: 'Manek Chowk',
    content: 'Summer nights are too hot for comfortable street food experience. Visit in winter when you can enjoy hot Khichiyu in the cool 15°C evening breeze!',
    season: 'winter',
    tags: ['weather', 'winter', 'food'],
  },
  // Old City Heritage Walk Tips
  {
    destination_name: 'Old City Heritage Walk',
    content: 'Join the official Municipal Corporation heritage walk starting at 7:30 AM from Swaminarayan Temple. Cost is just ₹100 with an expert guide. Booking required!',
    season: 'winter',
    tags: ['guided-tour', 'morning', 'official'],
  },
  {
    destination_name: 'Old City Heritage Walk',
    content: 'Wear comfortable walking shoes - you\'ll cover 2-3 km through narrow pol lanes. The walk includes hidden temples, 500-year-old havelis, and secret escape routes!',
    season: 'winter',
    tags: ['walking', 'shoes', 'exploration'],
  },
  {
    destination_name: 'Old City Heritage Walk',
    content: 'Don\'t miss the Chabutaros (bird feeders) - unique to Ahmedabad! These elevated platforms were built for feeding birds as an act of charity.',
    season: 'winter',
    tags: ['unique', 'birds', 'culture'],
  },
  // Law Garden Night Market Tips
  {
    destination_name: 'Law Garden Night Market',
    content: 'Best visited after 8 PM when all stalls are fully set up. Thursday evenings have special handicraft sections. Bargaining is expected - start at 40% of quoted price!',
    season: 'winter',
    tags: ['evening', 'timing', 'bargaining'],
  },
  {
    destination_name: 'Law Garden Night Market',
    content: 'For authentic Kutchi embroidery, look for the stalls run by women from Kutch. They sell genuine handwork, not machine-made replicas.',
    season: 'winter',
    tags: ['handicrafts', 'authentic', 'kutch'],
  },
  // Sarkhej Roza Tips
  {
    destination_name: 'Sarkhej Roza',
    content: 'Visit during sunset for the most magical experience. The reflection of the tombs in the sacred tank during golden hour is photographer\'s dream!',
    season: 'winter',
    tags: ['sunset', 'photography', 'scenic'],
  },
  {
    destination_name: 'Sarkhej Roza',
    content: 'Completely FREE entry! This hidden gem is surprisingly less crowded despite being one of the most beautiful monuments in Gujarat.',
    season: 'winter',
    tags: ['free', 'hidden-gem', 'peaceful'],
  },
  // Science City Tips
  {
    destination_name: 'Science City',
    content: 'Book IMAX tickets online in advance - weekend shows sell out quickly! The 3D shows at 11 AM and 3 PM are most popular. Entry ₹150, IMAX extra ₹250.',
    season: 'winter',
    tags: ['booking', 'imax', 'planning'],
  },
  {
    destination_name: 'Science City',
    content: 'Plan for minimum 4-5 hours to cover everything. Don\'t miss the Musical Fountain show in the evening at 7:30 PM - it\'s spectacular!',
    season: 'winter',
    tags: ['timing', 'musical-fountain', 'planning'],
  },
  {
    destination_name: 'Science City',
    content: 'Science City is fully air-conditioned - perfect escape from summer heat! All indoor exhibits maintain 24°C even when outside is 45°C.',
    season: 'summer',
    tags: ['ac', 'summer', 'cool'],
  },
  // Calico Museum Tips
  {
    destination_name: 'Calico Museum of Textiles',
    content: 'Entry is FREE but only through guided tours at 10:30 AM and 2:30 PM. Maximum 20 people per tour - arrive 30 minutes early to secure your spot!',
    season: 'winter',
    tags: ['free', 'guided-tour', 'timing'],
  },
  {
    destination_name: 'Calico Museum of Textiles',
    content: 'Photography is strictly PROHIBITED inside the museum. The textiles are centuries old and flash photography can damage them.',
    season: 'winter',
    tags: ['no-photography', 'rules', 'preservation'],
  },
  // Akshardham Temple Tips
  {
    destination_name: 'Akshardham Temple',
    content: 'The Sahaj Anand Water Show at 7:45 PM is MUST SEE! Arrive by 6 PM to explore the temple complex before the show starts. Show lasts 45 minutes.',
    season: 'winter',
    tags: ['water-show', 'evening', 'timing'],
  },
  {
    destination_name: 'Akshardham Temple',
    content: 'No phones, cameras, or electronic devices allowed inside - FREE lockers available at entrance. Dress modestly - no shorts or sleeveless tops.',
    season: 'winter',
    tags: ['rules', 'dress-code', 'lockers'],
  },
  // Sidi Saiyyed Mosque Tips
  {
    destination_name: 'Sidi Saiyyed Mosque',
    content: 'Visit during golden hour (5-6 PM) when sunlight illuminates the famous Tree of Life Jali from behind - absolutely magical for photography!',
    season: 'winter',
    tags: ['photography', 'golden-hour', 'jali'],
  },
  {
    destination_name: 'Sidi Saiyyed Mosque',
    content: 'This Jali design inspired the IIM Ahmedabad logo! Take the same photo angle used in IIM\'s official branding - facing the western window at sunset.',
    season: 'winter',
    tags: ['iim', 'iconic', 'photography'],
  },
  // Sabarmati Riverfront Tips
  {
    destination_name: 'Sabarmati Riverfront',
    content: 'Best for evening walks between 5-7 PM. Rent a bicycle (₹40/hour) from the rental stations and cycle the entire 11 km stretch!',
    season: 'winter',
    tags: ['cycling', 'evening', 'walking'],
  },
  {
    destination_name: 'Sabarmati Riverfront',
    content: 'The flower market near Ellis Bridge is stunning early morning (6-8 AM). Fresh flowers, cool breeze, and beautiful sunrise views over the river!',
    season: 'winter',
    tags: ['morning', 'flowers', 'sunrise'],
  },
  // Jama Masjid Tips
  {
    destination_name: 'Jama Masjid',
    content: 'Visit during non-prayer times for peaceful exploration. The courtyard can hold 25,000 people - best experienced in the soft morning light around 8-9 AM.',
    season: 'winter',
    tags: ['timing', 'morning', 'peaceful'],
  },
  // IIM Ahmedabad Tips
  {
    destination_name: 'IIM Ahmedabad Campus',
    content: 'Weekend visits are easier as campus is less busy. The Louis Kahn Plaza and Library are architectural masterpieces - photography allowed in common areas.',
    season: 'winter',
    tags: ['weekend', 'architecture', 'photography'],
  },
  // Vastrapur Lake Tips
  {
    destination_name: 'Vastrapur Lake',
    content: 'Perfect for early morning jogs (6-7 AM). The lake attracts migratory birds in winter - bring binoculars for bird watching from November to February!',
    season: 'winter',
    tags: ['jogging', 'birds', 'morning'],
  },
];

// Demo user credentials
const DEMO_EMAIL = 'demo@travelcompass.com';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME = 'Demo User';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Hash password properly using bcrypt
    const password_hash = await bcrypt.hash(DEMO_PASSWORD, 12);

    // Create demo user first
    console.log('Creating demo user...');
    let demoUserId: string;
    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, DEMO_EMAIL))
      .limit(1);

    if (existingUser.length > 0) {
      // Update password hash in case it was wrong
      await db
        .update(users)
        .set({ password_hash })
        .where(eq(users.email, DEMO_EMAIL));
      demoUserId = existingUser[0].id;
      console.log('Demo user already exists, updated password hash');
    } else {
      const newUser = await db.insert(users).values({
        email: DEMO_EMAIL,
        password_hash,
        name: DEMO_NAME,
        is_native: true,
        bio: 'Local Ahmedabad explorer sharing travel tips!',
      }).returning();
      demoUserId = newUser[0].id;
      console.log('Demo user created');
    }

    // Clear existing data (except users)
    console.log('Clearing existing data...');

    // Insert destinations
    console.log('Seeding destinations...');
    for (const dest of mockDestinations) {
      // Check if destination already exists
      const existing = await db
        .select()
        .from(destinations)
        .where(eq(destinations.name, dest.name))
        .limit(1);

      if (existing.length === 0) {
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
    }

    // Get inserted destinations
    const insertedDestinations = await db.select().from(destinations);

    // Insert seasonal weather for each destination and season
    console.log('Seeding seasonal weather...');
    for (const dest of insertedDestinations) {
      for (const weather of mockSeasonalWeather) {
        // Check if already exists
        const existing = await db
          .select()
          .from(seasonal_weather)
          .where(
            and(
              eq(seasonal_weather.destination_id, dest.id),
              eq(seasonal_weather.season, weather.season)
            )
          )
          .limit(1);

        if (existing.length === 0) {
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
    }

    // Insert tips for destinations
    console.log('Seeding tips...');
    interface InsertedDest { id: string; name: string | null }
    const destinationMap = new Map(insertedDestinations.map((d: InsertedDest) => [d.name, d.id]));

    for (const tip of mockTips) {
      const destinationId = destinationMap.get(tip.destination_name);
      if (destinationId) {
        // Check if tip already exists
        const existing = await db
          .select()
          .from(tips)
          .where(
            and(
              eq(tips.destination_id, destinationId),
              eq(tips.content, tip.content)
            )
          )
          .limit(1);

        if (existing.length === 0) {
          await db.insert(tips).values({
            user_id: demoUserId,
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
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`
╔════════════════════════════════════════════╗
║   🎉 Seed Complete!                        ║
║                                            ║
║   Demo User Credentials:                   ║
║   Email: demo@travelcompass.com            ║
║   Password: demo123                        ║
╚════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed when file is executed directly
seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
