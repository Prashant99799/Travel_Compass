import { Destination, Tip } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Sabarmati Ashram',
    description: 'Historic ashram where Mahatma Gandhi lived and launched the Salt March. A peaceful retreat showcasing Gandhian principles and Indian independence movement.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F1.bp.blogspot.com%2F-4OZHU-6orII%2FXo_ddnOYCNI%2FAAAAAAAAAkA%2FR5A-041UCPoKquFvqgUyqa60zC0s9fsvgCLcBGAsYHQ%2Fs1600%2FMahatma-Gandhi-Ashram-at-Sabarmati-Ahmedabad-Gujarat2.jpg&f=1&nofb=1&ipt=ba7f5586f08951af36d735fcc48c33296bca784136efbd60df80b7c95600bed5',
    category: 'Historical',
    avgBudget: 200,
    avgDays: 1,
    popularity: 95,
    tags: ['heritage', 'peaceful', 'history', 'museum'],
    highlights: ['Gandhi Museum', 'Prayer Ground', 'Hriday Kunj'],
    seasonal: {
      summer: { score: 60, temp: '35-42°C', description: 'Hot but shaded areas available', activities: ['Early morning visit', 'Museum tour'] },
      monsoon: { score: 75, temp: '28-32°C', description: 'Pleasant with occasional rain', activities: ['Indoor museum', 'Reading room'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Comfortable weather', activities: ['Full tour', 'Photography'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect weather for exploration', activities: ['Walking tour', 'Meditation'] }
    }
  },
  {
    id: '2',
    name: 'Kankaria Lake',
    description: 'Historic lakefront with entertainment hub featuring zoo, toy train, and beautiful gardens. Popular for evening walks and family outings.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.gujarattourism.com%2Fcontent%2Fdam%2Fgujrattourism%2Fimages%2Fjune%2Fkankaria-lake-banner.jpg&f=1&nofb=1&ipt=2b97ab0d0627f739580b126d136f4fe3d8a162a1f2186f00d5fe6944c893b3a9',
    category: 'Recreation',
    avgBudget: 500,
    avgDays: 1,
    popularity: 90,
    tags: ['family', 'lake', 'entertainment', 'evening'],
    highlights: ['Nagina Wadi', 'Zoo', 'Toy Train', 'Balloon Safari'],
    seasonal: {
      summer: { score: 50, temp: '35-42°C', description: 'Hot, visit in evening only', activities: ['Evening walk', 'Balloon ride'] },
      monsoon: { score: 70, temp: '28-32°C', description: 'Lake looks beautiful', activities: ['Boating', 'Photography'] },
      autumn: { score: 80, temp: '25-32°C', description: 'Pleasant evenings', activities: ['Zoo visit', 'Toy train'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect for full day visit', activities: ['All activities', 'Picnic'] }
    }
  },
  {
    id: '3',
    name: 'Adalaj Stepwell',
    description: 'Stunning 15th-century stepwell with intricate carvings. Five-story structure showcasing Indo-Islamic architecture.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.gosahin.com%2Fgo%2Fp%2Ff%2F1545473329_adalaj-stepwell1.jpg&f=1&nofb=1&ipt=a254cf6b0c59728cca91b8af01ae2b230495a36b0ad4a1aa810e677f39559832',
    category: 'Heritage',
    avgBudget: 100,
    avgDays: 1,
    popularity: 88,
    tags: ['architecture', 'photography', 'history', 'heritage'],
    highlights: ['Stone carvings', 'Octagonal pavilion', 'Underground chambers'],
    seasonal: {
      summer: { score: 85, temp: '35-42°C', description: 'Naturally cool inside', activities: ['Photography', 'Architecture tour'] },
      monsoon: { score: 70, temp: '28-32°C', description: 'Can be slippery', activities: ['Quick visit', 'Photography'] },
      autumn: { score: 90, temp: '25-32°C', description: 'Perfect for exploration', activities: ['Full tour', 'Photography'] },
      winter: { score: 95, temp: '15-25°C', description: 'Ideal visiting conditions', activities: ['All activities'] }
    }
  },
  {
    id: '4',
    name: 'Law Garden Night Market',
    description: 'Vibrant night market famous for traditional Gujarati handicrafts, textiles, and street food. Shopping paradise after sunset.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.fabhotels.com%2Fblog%2Fwp-content%2Fuploads%2F2020%2F02%2FLaw-Garden-Night-Market-Ahmedabad-600-1280x720.jpg&f=1&nofb=1&ipt=7524e6a13461a08f63d463d6fdfa94dc029d5e72b336a454ca193f461ad25540',
    category: 'Shopping',
    avgBudget: 1500,
    avgDays: 1,
    popularity: 85,
    tags: ['shopping', 'food', 'nightlife', 'handicrafts'],
    highlights: ['Bandhani textiles', 'Street food', 'Handicrafts'],
    seasonal: {
      summer: { score: 65, temp: '30-38°C', description: 'Warm evenings', activities: ['Late night shopping', 'Ice cream'] },
      monsoon: { score: 50, temp: '26-30°C', description: 'May close during rain', activities: ['Quick shopping'] },
      autumn: { score: 85, temp: '22-28°C', description: 'Pleasant shopping weather', activities: ['Shopping', 'Street food'] },
      winter: { score: 95, temp: '12-22°C', description: 'Perfect night market weather', activities: ['Full experience'] }
    }
  },
  {
    id: '5',
    name: 'Sidi Saiyyed Mosque',
    description: 'Famous for its iconic "Tree of Life" stone lattice window. A masterpiece of Indo-Saracenic architecture from 1573.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F4.bp.blogspot.com%2F-B1AwiIPsIUI%2FVOCv__8Z5lI%2FAAAAAAAAUlE%2FjuboGih9yIo%2Fs1600%2FSidi%252BSaiyyed%252BMosque%252Bahmedabad.jpeg&f=1&nofb=1&ipt=187a6e2344818ff6a961a18d9a0ea57f6eecda66c4b60b732845d2b286b04c45',
    category: 'Religious',
    avgBudget: 50,
    avgDays: 1,
    popularity: 82,
    tags: ['architecture', 'religious', 'photography', 'iconic'],
    highlights: ['Jali windows', 'Tree of Life carving', 'Historical ambiance'],
    seasonal: {
      summer: { score: 70, temp: '35-42°C', description: 'Best in early morning', activities: ['Photography', 'Quick visit'] },
      monsoon: { score: 75, temp: '28-32°C', description: 'Atmospheric with clouds', activities: ['Photography'] },
      autumn: { score: 90, temp: '25-32°C', description: 'Good lighting for photos', activities: ['Full visit', 'Photography'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect conditions', activities: ['All activities'] }
    }
  },
  {
    id: '6',
    name: 'Manek Chowk',
    description: 'Bustling market by day, street food paradise by night. Experience authentic Ahmedabadi cuisine and jewelry shopping.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.holidify.com%2Fimages%2Fcmsuploads%2Fcompressed%2FManekchok_20180105205625.jpg&f=1&nofb=1&ipt=6d931261e7c67e44a1dcb4513ec265ff536d863bd3e3fdf85958ad2a13bf95fc',
    category: 'Food',
    avgBudget: 400,
    avgDays: 1,
    popularity: 92,
    tags: ['food', 'shopping', 'nightlife', 'local'],
    highlights: ['Street food', 'Jewelry market', 'Night life'],
    seasonal: {
      summer: { score: 60, temp: '32-40°C', description: 'Hot, late night better', activities: ['Night food tour'] },
      monsoon: { score: 55, temp: '26-30°C', description: 'Some stalls may close', activities: ['Indoor jewelry shopping'] },
      autumn: { score: 85, temp: '22-28°C', description: 'Great food weather', activities: ['Food tour', 'Shopping'] },
      winter: { score: 95, temp: '12-22°C', description: 'Best time for street food', activities: ['Full experience'] }
    }
  },
  {
    id: '7',
    name: 'Science City',
    description: 'Interactive science museum with IMAX theatre, energy park, and Hall of Space. Perfect for families and curious minds.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fahmedabadtourism.in%2Fimages%2Fplaces-to-visit%2Fheaders%2Fgujarat-science-city-ahmedabad-tourism-entry-fee-timings-holidays-reviews-header.jpg&f=1&nofb=1&ipt=5445d9e857db078367bfb32bccab418b51ba4039e780dacb1c8db7107000bdbc',
    category: 'Education',
    avgBudget: 600,
    avgDays: 1,
    popularity: 78,
    tags: ['family', 'education', 'interactive', 'kids'],
    highlights: ['IMAX', 'Energy Park', 'Hall of Space', 'Amphitheatre'],
    seasonal: {
      summer: { score: 90, temp: '35-42°C', description: 'Air-conditioned interiors', activities: ['All indoor activities'] },
      monsoon: { score: 85, temp: '28-32°C', description: 'Perfect indoor destination', activities: ['IMAX', 'Exhibits'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Can enjoy outdoor areas too', activities: ['Full tour'] },
      winter: { score: 90, temp: '15-25°C', description: 'Comfortable for all areas', activities: ['All activities'] }
    }
  },
  {
    id: '8',
    name: 'Akshardham Temple',
    description: 'Magnificent Hindu temple complex showcasing traditional architecture and spiritual exhibitions. A visual and spiritual feast.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.mrIfZHj2plnsrgySk0blYgHaEK%3Fpid%3DApi&f=1&ipt=d1ae872b1ba35f81802477e99f13fffc46c445edac10c7a6742e5e0508f56c03&ipo=images',
    category: 'Religious',
    avgBudget: 200,
    avgDays: 1,
    popularity: 94,
    tags: ['temple', 'architecture', 'spiritual', 'cultural'],
    highlights: ['Main temple', 'Water show', 'Exhibitions', 'Gardens'],
    seasonal: {
      summer: { score: 65, temp: '35-42°C', description: 'Visit early or late', activities: ['Temple visit', 'Evening show'] },
      monsoon: { score: 70, temp: '28-32°C', description: 'Water show may cancel', activities: ['Temple tour', 'Exhibitions'] },
      autumn: { score: 88, temp: '25-32°C', description: 'Pleasant weather', activities: ['Full experience'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect for all activities', activities: ['All activities', 'Water show'] }
    }
  },
  {
    id: '9',
    name: 'Calico Museum',
    description: 'World-renowned textile museum housing rare collection of Indian textiles, crafts, and religious art spanning 500 years.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.-P1XEDntsUCvTzDHt9R90gHaE5%3Fpid%3DApi&f=1&ipt=051242762426032b3201a8703297adafb8e9e9abef5212631ee742e39d420c29&ipo=images',
    category: 'Museum',
    avgBudget: 150,
    avgDays: 1,
    popularity: 75,
    tags: ['museum', 'textiles', 'art', 'culture'],
    highlights: ['Textile gallery', 'Religious art', 'Guided tours'],
    seasonal: {
      summer: { score: 95, temp: '35-42°C', description: 'Air-conditioned museum', activities: ['Full tour'] },
      monsoon: { score: 90, temp: '28-32°C', description: 'Perfect indoor activity', activities: ['Guided tour'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Comfortable visit', activities: ['All exhibits'] },
      winter: { score: 90, temp: '15-25°C', description: 'Great museum weather', activities: ['Full experience'] }
    }
  },
  {
    id: '10',
    name: 'Sarkhej Roza',
    description: 'Stunning mosque and tomb complex with blend of Hindu and Islamic architecture. Peaceful lakeside monument from 15th century.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fsomanytraveltales.com%2Fwp-content%2Fuploads%2F2022%2F11%2FQUeens-Palace-2_edited-1-scaled.jpg&f=1&nofb=1&ipt=f19cc6968f09a81106d636b6af1994f17ed315a0d57ca88b8e90b1bd08c888b9',
    category: 'Heritage',
    avgBudget: 100,
    avgDays: 1,
    popularity: 80,
    tags: ['heritage', 'architecture', 'peaceful', 'photography'],
    highlights: ['Tomb of Ahmed Shah', 'Mosque', 'Stepped tank'],
    seasonal: {
      summer: { score: 55, temp: '35-42°C', description: 'Very hot, visit early', activities: ['Early morning visit'] },
      monsoon: { score: 80, temp: '28-32°C', description: 'Lake fills up beautifully', activities: ['Photography', 'Walk'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Good exploration weather', activities: ['Full tour'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect conditions', activities: ['All activities'] }
    }
  },
  {
    id: '11',
    name: 'Sanskar Kendra',
    description: 'Le Corbusier-designed museum showcasing city history. Brutalist architecture housing artifacts and cultural exhibits.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2Fce%2F28%2F5e%2Fce285ead5900b52766f51153b0f77586--ahmedabad-the-architect.jpg&f=1&nofb=1&ipt=99adabc1557ce9f4852d41ffa9a51e9e72897a8f8cffe0d9c83a2924b7091eb4',
    category: 'Museum',
    avgBudget: 100,
    avgDays: 1,
    popularity: 68,
    tags: ['museum', 'architecture', 'history', 'art'],
    highlights: ['Le Corbusier design', 'City history', 'Art exhibitions'],
    seasonal: {
      summer: { score: 85, temp: '35-42°C', description: 'Cool interiors', activities: ['Museum tour'] },
      monsoon: { score: 80, temp: '28-32°C', description: 'Indoor museum', activities: ['Full visit'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Pleasant weather', activities: ['All exhibits'] },
      winter: { score: 90, temp: '15-25°C', description: 'Comfortable visit', activities: ['Full experience'] }
    }
  },
  {
    id: '12',
    name: 'Riverfront Flower Park',
    description: 'Beautiful gardens along Sabarmati River with colorful flowers, walking paths, and stunning river views.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.mericity.com%2FMeriCityMedia%2FCity%2F207%2FRiverfront_Flower_Park_Gujarat_Ahmedabad_Mericity_6.JPG%3Fv%3D4&f=1&nofb=1&ipt=51a60012f45f6071794debaeef15d5097c0d6c6304f766643583c394c302cf12',
    category: 'Nature',
    avgBudget: 50,
    avgDays: 1,
    popularity: 83,
    tags: ['nature', 'walking', 'photography', 'relaxation'],
    highlights: ['Flower gardens', 'River views', 'Walking paths'],
    seasonal: {
      summer: { score: 40, temp: '35-42°C', description: 'Too hot during day', activities: ['Early morning only'] },
      monsoon: { score: 75, temp: '28-32°C', description: 'Green and lush', activities: ['Photography', 'Walk'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Flowers in bloom', activities: ['Full visit'] },
      winter: { score: 95, temp: '15-25°C', description: 'Peak bloom season', activities: ['All activities'] }
    }
  },
  {
    id: '13',
    name: 'Auto World Vintage Car Museum',
    description: 'Private collection of over 100 vintage automobiles including rare models from early 1900s. Car enthusiast paradise.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fhamburgtalks.com%2Fwp-content%2Fuploads%2F2024%2F02%2Fauto-world-vintage-car-museum-in-ahmedabad.jpg&f=1&nofb=1&ipt=c5a0c6af2859f946d3a1123953e69bb3003baff3f8d927f75ee224851054974d',
    category: 'Museum',
    avgBudget: 300,
    avgDays: 1,
    popularity: 72,
    tags: ['cars', 'vintage', 'museum', 'unique'],
    highlights: ['Vintage cars', 'Royal collection', 'Photography'],
    seasonal: {
      summer: { score: 90, temp: '35-42°C', description: 'Air-conditioned museum', activities: ['Full tour'] },
      monsoon: { score: 85, temp: '28-32°C', description: 'Indoor activity', activities: ['Car viewing'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Comfortable visit', activities: ['Full experience'] },
      winter: { score: 90, temp: '15-25°C', description: 'Pleasant conditions', activities: ['All activities'] }
    }
  },
  {
    id: '14',
    name: 'Hutheesing Jain Temple',
    description: 'Ornate 19th-century Jain temple with exquisite marble carvings. Finest example of temple architecture in the city.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.y1B0gzhT4YMaUCGhibaH_wHaE8%3Fpid%3DApi&f=1&ipt=dd493872cc6c9611afe5726e6285094b98f263f74e784e4d25d3dade3050840a&ipo=images',
    category: 'Religious',
    avgBudget: 50,
    avgDays: 1,
    popularity: 76,
    tags: ['temple', 'architecture', 'peaceful', 'marble'],
    highlights: ['Marble carvings', 'Main shrine', 'Peaceful ambiance'],
    seasonal: {
      summer: { score: 70, temp: '35-42°C', description: 'Early morning best', activities: ['Morning visit', 'Prayer'] },
      monsoon: { score: 75, temp: '28-32°C', description: 'Atmospheric visit', activities: ['Temple tour'] },
      autumn: { score: 88, temp: '25-32°C', description: 'Comfortable weather', activities: ['Full visit'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect for exploration', activities: ['All activities'] }
    }
  },
  {
    id: '15',
    name: 'Vechaar Utensils Museum',
    description: 'Unique museum showcasing 4,500+ utensils from across India. A glimpse into Indian culinary heritage and craftsmanship.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgumlet.assettype.com%2Fknocksense%2F2023-01%2Fd72a5eba-2d0c-4b06-a332-27cc4d719436%2FE89M6tcVoBEUFJb.jpg%3Fauto%3Dformat%252Ccompress%26w%3D1200&f=1&nofb=1&ipt=4aad719bfae16549527b9ccad21fb5d311a480aa34c8c8e50d2569e8adc67980',
    category: 'Museum',
    avgBudget: 100,
    avgDays: 1,
    popularity: 65,
    tags: ['museum', 'unique', 'culture', 'art'],
    highlights: ['Rare utensils', 'Craft demonstration', 'History'],
    seasonal: {
      summer: { score: 85, temp: '35-42°C', description: 'Indoor museum', activities: ['Full tour'] },
      monsoon: { score: 80, temp: '28-32°C', description: 'Perfect indoor visit', activities: ['Museum tour'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Comfortable', activities: ['All exhibits'] },
      winter: { score: 90, temp: '15-25°C', description: 'Pleasant visit', activities: ['Full experience'] }
    }
  },
  {
    id: '16',
    name: 'Vastrapur Lake',
    description: 'Urban lake with jogging tracks, amphitheatre, and serene environment. Popular spot for morning walks and evening relaxation.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.KSfC4-L5EF_ylKpgqq1UcAHaDt%3Fpid%3DApi&f=1&ipt=9a7ce23b575dae3bbfa46ee0f7d0c457fbf5771673f7fece9dd80169359d3dea&ipo=images',
    category: 'Nature',
    avgBudget: 0,
    avgDays: 1,
    popularity: 80,
    tags: ['free', 'nature', 'walking', 'relaxation'],
    highlights: ['Jogging track', 'Lake views', 'Bird watching'],
    seasonal: {
      summer: { score: 45, temp: '35-42°C', description: 'Early morning only', activities: ['5-7 AM walk'] },
      monsoon: { score: 70, temp: '28-32°C', description: 'Lake fills up', activities: ['Evening walk'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Pleasant weather', activities: ['Jogging', 'Relaxation'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect outdoor weather', activities: ['All activities'] }
    }
  },
  {
    id: '17',
    name: 'Bhadra Fort',
    description: 'Historic citadel built in 1411 AD, now a gateway to the old city. Teen Darwaza leads to vibrant local markets.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.f7t-NJIHRDA9OKOzIrlhMwHaDt%3Fpid%3DApi&f=1&ipt=7e5493a099fa1d10fd9a1daa285495dd752e1eae135fc99b6638fd547fdab4ad&ipo=images',
    category: 'Historical',
    avgBudget: 50,
    avgDays: 1,
    popularity: 74,
    tags: ['history', 'fort', 'architecture', 'local'],
    highlights: ['Teen Darwaza', 'Fort complex', 'Local markets'],
    seasonal: {
      summer: { score: 55, temp: '35-42°C', description: 'Very hot', activities: ['Quick visit'] },
      monsoon: { score: 70, temp: '28-32°C', description: 'Atmospheric', activities: ['Fort tour'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Good weather', activities: ['Full exploration'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect conditions', activities: ['All activities'] }
    }
  },
  {
    id: '18',
    name: 'IIM Ahmedabad Campus',
    description: 'Iconic Louis Kahn-designed campus. World-renowned B-school with stunning brick architecture and peaceful grounds.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.AhE-OZgLlFfybjsF2QznXgHaD4%3Fpid%3DApi&f=1&ipt=d13dd2b2acf1ce4025c0bf2efcfb943339ef05730c1bdccb919b1137084cdc64&ipo=images',
    category: 'Architecture',
    avgBudget: 0,
    avgDays: 1,
    popularity: 77,
    tags: ['architecture', 'free', 'peaceful', 'photography'],
    highlights: ['Louis Kahn design', 'Campus walk', 'Library'],
    seasonal: {
      summer: { score: 60, temp: '35-42°C', description: 'Hot outdoor walk', activities: ['Evening visit'] },
      monsoon: { score: 75, temp: '28-32°C', description: 'Green campus', activities: ['Campus walk'] },
      autumn: { score: 88, temp: '25-32°C', description: 'Pleasant weather', activities: ['Full tour'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect for walking', activities: ['All activities'] }
    }
  },
  {
    id: '19',
    name: 'Rani no Hajiro',
    description: 'Royal tombs of Ahmed Shah queens with beautiful lattice work and peaceful atmosphere. Hidden gem in old city.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.rY3fuCctuKksKrQl3DGO9AHaFj%3Fpid%3DApi&f=1&ipt=da8397c3d85407948df6e5f07ee64414ecb8715787cf8ec13a32f49a6cbe3010&ipo=images',
    category: 'Heritage',
    avgBudget: 50,
    avgDays: 1,
    popularity: 70,
    tags: ['heritage', 'peaceful', 'architecture', 'hidden'],
    highlights: ['Royal tombs', 'Lattice work', 'Peaceful ambiance'],
    seasonal: {
      summer: { score: 65, temp: '35-42°C', description: 'Shaded area', activities: ['Quick visit'] },
      monsoon: { score: 75, temp: '28-32°C', description: 'Atmospheric', activities: ['Photography'] },
      autumn: { score: 85, temp: '25-32°C', description: 'Pleasant visit', activities: ['Full exploration'] },
      winter: { score: 95, temp: '15-25°C', description: 'Perfect conditions', activities: ['All activities'] }
    }
  },
  {
    id: '20',
    name: 'Dada Hari Stepwell',
    description: 'Lesser-known 15th century stepwell with intricate carvings. More intimate experience than Adalaj, equally beautiful.',
    imageUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.yQkigHqImqUF53A8wLi3jQHaFj%3Fpid%3DApi&f=1&ipt=f8261b03048c90e1cc4cdb82d37a491188f5e822d3293a5bad483753f4b3a4ad&ipo=images',
    category: 'Heritage',
    avgBudget: 50,
    avgDays: 1,
    popularity: 72,
    tags: ['heritage', 'architecture', 'peaceful', 'photography'],
    highlights: ['Stone carvings', 'Underground levels', 'Photography'],
    seasonal: {
      summer: { score: 85, temp: '35-42°C', description: 'Naturally cool inside', activities: ['All activities'] },
      monsoon: { score: 70, temp: '28-32°C', description: 'Can be slippery', activities: ['Careful visit'] },
      autumn: { score: 88, temp: '25-32°C', description: 'Perfect weather', activities: ['Full tour'] },
      winter: { score: 95, temp: '15-25°C', description: 'Ideal conditions', activities: ['All activities'] }
    }
  }
];

export const TIPS: Tip[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Priya Shah',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    destinationId: '1',
    destinationName: 'Sabarmati Ashram',
    content: 'Visit during morning aarti at 6:30 AM for a spiritual experience. The ashram is peaceful and uncrowded at this time. Don\'t miss the museum and Gandhi\'s original living quarters.',
    season: 'winter',
    tags: ['morning', 'spiritual', 'tip'],
    upvotes: 45,
    downvotes: 2,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Rahul Patel',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    destinationId: '6',
    destinationName: 'Manek Chowk',
    content: 'The real magic happens after 10 PM! Try the famous sandwich and pav bhaji. During winter, the hot chocolate and malai kulfi are must-haves. Bring cash, most vendors don\'t accept cards.',
    season: 'winter',
    tags: ['food', 'nightlife', 'local'],
    upvotes: 78,
    downvotes: 3,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Meera Joshi',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
    destinationId: '2',
    destinationName: 'Kankaria Lake',
    content: 'Book the balloon safari online to avoid long queues! Best visited on weekday evenings. The toy train ride is a must for kids. Food stalls have improved a lot recently.',
    season: null,
    tags: ['family', 'booking', 'tips'],
    upvotes: 56,
    downvotes: 4,
    createdAt: '2024-01-08'
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Aditya Kumar',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
    destinationId: '3',
    destinationName: 'Adalaj Stepwell',
    content: 'Go early morning for photography - the light streaming through the carvings creates magical patterns. Carry water as there are no shops inside. The drive from city takes about 40 mins.',
    season: 'autumn',
    tags: ['photography', 'morning', 'tips'],
    upvotes: 62,
    downvotes: 1,
    createdAt: '2024-01-05'
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Sneha Desai',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    destinationId: '4',
    destinationName: 'Law Garden Night Market',
    content: 'Bargaining is expected! Start at 40% of quoted price. The chaniya cholis and bandhani dupattas here are much cheaper than retail stores. Visit on weekdays for less crowd.',
    season: 'winter',
    tags: ['shopping', 'bargaining', 'local'],
    upvotes: 89,
    downvotes: 5,
    createdAt: '2024-01-03'
  },
  {
    id: '6',
    userId: 'u6',
    userName: 'Vikram Singh',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    destinationId: '8',
    destinationName: 'Akshardham Temple',
    content: 'No phones/cameras allowed inside - use the free locker service. The water show in evening is spectacular but gets very crowded in winter. Wear comfortable walking shoes.',
    season: 'winter',
    tags: ['temple', 'tips', 'evening'],
    upvotes: 71,
    downvotes: 2,
    createdAt: '2024-01-01'
  },
  {
    id: '7',
    userId: 'u7',
    userName: 'Anjali Mehta',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
    destinationId: '9',
    destinationName: 'Calico Museum',
    content: 'Book guided tour in advance - they only allow limited visitors per session. The textile collection is world-class. Photography is not allowed. Morning session at 10:30 AM is best.',
    season: null,
    tags: ['museum', 'booking', 'guided'],
    upvotes: 34,
    downvotes: 1,
    createdAt: '2023-12-28'
  },
  {
    id: '8',
    userId: 'u8',
    userName: 'Karan Thakur',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
    destinationId: '5',
    destinationName: 'Sidi Saiyyed Mosque',
    content: 'The famous jali (lattice) window is on the western wall - visit during afternoon for best lighting. The motif was inspiration for IIM Ahmedabad logo! Respect the religious nature of the site.',
    season: 'autumn',
    tags: ['photography', 'history', 'architecture'],
    upvotes: 52,
    downvotes: 0,
    createdAt: '2023-12-25'
  },
  {
    id: '9',
    userId: 'u9',
    userName: 'Nidhi Sharma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nidhi',
    destinationId: '7',
    destinationName: 'Science City',
    content: 'Combo ticket gives best value. The IMAX show is worth it! Energy park activities require separate tickets. Plan at least 4-5 hours for full experience. Cafeteria food is okay.',
    season: null,
    tags: ['family', 'tickets', 'planning'],
    upvotes: 41,
    downvotes: 3,
    createdAt: '2023-12-22'
  },
  {
    id: '10',
    userId: 'u10',
    userName: 'Dev Patel',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev',
    destinationId: '10',
    destinationName: 'Sarkhej Roza',
    content: 'One of the most underrated heritage sites! The lake reflects beautifully during monsoon. Very peaceful compared to other tourist spots. Best to hire a local guide for ₹200-300.',
    season: 'monsoon',
    tags: ['heritage', 'peaceful', 'guide'],
    upvotes: 38,
    downvotes: 1,
    createdAt: '2023-12-20'
  },
  {
    id: '11',
    userId: 'u11',
    userName: 'Pooja Gupta',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja',
    destinationId: '12',
    destinationName: 'Riverfront Flower Park',
    content: 'Winter mornings are magical here! Flower bloom is at peak from December to February. Great for photography and family picnics. Avoid weekends as it gets very crowded.',
    season: 'winter',
    tags: ['nature', 'photography', 'family'],
    upvotes: 67,
    downvotes: 2,
    createdAt: '2023-12-18'
  },
  {
    id: '12',
    userId: 'u12',
    userName: 'Arjun Rao',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    destinationId: '13',
    destinationName: 'Auto World Vintage Car Museum',
    content: 'Car enthusiasts will love this place! The collection includes rare models from early 1900s. Entry is bit expensive but worth it. Guided tours available on request.',
    season: null,
    tags: ['cars', 'museum', 'unique'],
    upvotes: 29,
    downvotes: 2,
    createdAt: '2023-12-15'
  },
  {
    id: '13',
    userId: 'u13',
    userName: 'Kavya Reddy',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya',
    destinationId: '16',
    destinationName: 'Vastrapur Lake',
    content: 'Best jogging track in the city! Early morning (5-7 AM) you\'ll find serious runners. Evening has families and couples. Free entry and good security. Food stalls nearby.',
    season: 'winter',
    tags: ['jogging', 'free', 'morning'],
    upvotes: 55,
    downvotes: 1,
    createdAt: '2023-12-12'
  },
  {
    id: '14',
    userId: 'u14',
    userName: 'Rohan Jain',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    destinationId: '18',
    destinationName: 'IIM Ahmedabad Campus',
    content: 'Louis Kahn\'s masterpiece! The brick architecture is stunning. Campus is open for visitors but check timing. The library and main academic block are highlights. Free entry!',
    season: 'autumn',
    tags: ['architecture', 'free', 'photography'],
    upvotes: 44,
    downvotes: 0,
    createdAt: '2023-12-10'
  },
  {
    id: '15',
    userId: 'u15',
    userName: 'Ishita Chopra',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita',
    destinationId: '17',
    destinationName: 'Bhadra Fort',
    content: 'Combine with Teen Darwaza and old city walking tour. The area comes alive in evenings with local markets. Be careful with belongings in crowded areas. Street food here is amazing!',
    season: null,
    tags: ['history', 'walking', 'food'],
    upvotes: 36,
    downvotes: 2,
    createdAt: '2023-12-08'
  },
  {
    id: '16',
    userId: 'u16',
    userName: 'Manish Verma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manish',
    destinationId: '14',
    destinationName: 'Hutheesing Jain Temple',
    content: 'The marble carving work is exquisite! Best visited early morning when devotees perform puja. Remove shoes before entering. Photography allowed in courtyard only.',
    season: 'winter',
    tags: ['temple', 'morning', 'architecture'],
    upvotes: 31,
    downvotes: 1,
    createdAt: '2023-12-05'
  },
  {
    id: '17',
    userId: 'u17',
    userName: 'Shreya Iyer',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shreya',
    destinationId: '20',
    destinationName: 'Dada Hari Stepwell',
    content: 'Less crowded than Adalaj but equally beautiful! The underground mosque is unique. Naturally cool even in summer. Great spot for architecture photography enthusiasts.',
    season: 'summer',
    tags: ['heritage', 'photography', 'peaceful'],
    upvotes: 27,
    downvotes: 0,
    createdAt: '2023-12-03'
  },
  {
    id: '18',
    userId: 'u18',
    userName: 'Akash Trivedi',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Akash',
    destinationId: '11',
    destinationName: 'Sanskar Kendra',
    content: 'Architecture lovers must visit! Le Corbusier\'s design is fascinating. The kite museum inside is interesting. Check for cultural events happening here. Very affordable entry.',
    season: null,
    tags: ['architecture', 'museum', 'culture'],
    upvotes: 22,
    downvotes: 1,
    createdAt: '2023-12-01'
  },
  {
    id: '19',
    userId: 'u19',
    userName: 'Riya Gandhi',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya',
    destinationId: '15',
    destinationName: 'Vechaar Utensils Museum',
    content: 'Most unique museum in Ahmedabad! Over 4500 utensils from across India. The curator gives amazing insights. Perfect for those interested in Indian culinary heritage.',
    season: null,
    tags: ['museum', 'unique', 'culture'],
    upvotes: 19,
    downvotes: 0,
    createdAt: '2023-11-28'
  },
  {
    id: '20',
    userId: 'u20',
    userName: 'Vivek Sinha',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vivek',
    destinationId: '19',
    destinationName: 'Rani no Hajiro',
    content: 'Hidden gem in the old city! The brass lattice work is beautiful. Very peaceful compared to other heritage sites. Combine with Bhadra Fort and Ahmed Shah mosque visit.',
    season: 'autumn',
    tags: ['heritage', 'peaceful', 'hidden'],
    upvotes: 24,
    downvotes: 1,
    createdAt: '2023-11-25'
  }
];
