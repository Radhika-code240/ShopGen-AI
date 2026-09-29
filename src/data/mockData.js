// Mock Data for ShopGen AI E-Commerce Platform

export const CATEGORIES = [
  { id: 'laptops', name: 'Laptops & PCs', icon: 'Laptop', count: 12 },
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone', count: 18 },
  { id: 'headphones', name: 'Headphones & Audio', icon: 'Headphones', count: 15 },
  { id: 'smartwatches', name: 'Smartwatches', icon: 'Watch', count: 10 },
  { id: 'tablets', name: 'Tablets', icon: 'Tablet', count: 8 },
  { id: 'smarthome', name: 'Smart Home', icon: 'Home', count: 9 }
];

export const BRANDS = [
  'TechPro', 'Zenith', 'AudioPulse', 'Vortex', 'PulseGear', 'NovaTech', 'AeroView'
];

export const PRODUCTS = [
  {
    id: 'prod-101',
    name: 'Zenith Book Pro 16 AI Laptop',
    brand: 'Zenith',
    category: 'laptops',
    price: 79999,
    originalPrice: 99999,
    rating: 4.8,
    reviewsCount: 142,
    stock: 24,
    isFeatured: true,
    isPopular: true,
    isTopRated: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The Zenith Book Pro 16 is engineered specifically for software developers, creators, and power users. Featuring a high-performance 14-core AI-accelerated processor, 16GB LPDDR5 RAM, and a stunning 3K OLED Display.',
    specifications: {
      'Processor': 'Intel Core Ultra 7 155H (14-Core, AI NPU Engine)',
      'RAM': '16GB LPDDR5X 7467MHz',
      'Storage': '512GB NVMe M.2 Gen4 SSD',
      'Display': '16" 3K (2880 x 1800) 120Hz OLED, 100% DCI-P3',
      'Battery Life': 'Up to 14 Hours (75Wh Battery)',
      'Weight': '1.58 kg (3.48 lbs)',
      'OS': 'Windows 11 Home / Linux Compatible'
    },
    aiReviewSummary: {
      score: 94,
      verdict: 'Best Developer Laptop under ₹80,000',
      pros: [
        'Exceptional 120Hz OLED display with vibrant colors',
        'Blazing fast coding compile times with dedicated AI NPU',
        'Lightweight build with premium aluminium alloy body',
        'Whisper-quiet dual-fan cooling system'
      ],
      cons: [
        'RAM is soldered and not user-upgradable',
        'Glossy display screen can catch reflections in direct sunlight'
      ]
    }
  },
  {
    id: 'prod-102',
    name: 'TechPro UltraBlade Slim 14',
    brand: 'TechPro',
    category: 'laptops',
    price: 54999,
    originalPrice: 69999,
    rating: 4.5,
    reviewsCount: 88,
    stock: 15,
    isFeatured: true,
    isPopular: false,
    isTopRated: false,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-portable 14-inch laptop featuring an all-day 18-hour battery, Ryzen 7 7730U processor, and backlit ergonomic keyboard designed for student developers and digital nomads.',
    specifications: {
      'Processor': 'AMD Ryzen 7 7730U (8-Core / 16-Thread)',
      'RAM': '16GB DDR4 3200MHz',
      'Storage': '512GB PCIe 4.0 SSD',
      'Display': '14" FHD (1920 x 1080) Anti-glare IPS',
      'Battery Life': 'Up to 18 Hours',
      'Weight': '1.3 kg (2.86 lbs)',
      'OS': 'Windows 11 Home'
    },
    aiReviewSummary: {
      score: 88,
      verdict: 'Incredible Battery & Value for Students',
      pros: [
        'Stellar 18-hour real-world battery performance',
        'Comfortable tactile keyboard for extended typing',
        'Extremely lightweight and travel-friendly'
      ],
      cons: [
        'Screen brightness maxes out at 300 nits',
        'Speakers are down-firing and lack deep bass'
      ]
    }
  },
  {
    id: 'prod-103',
    name: 'AudioPulse ANC Horizon 5 Headphones',
    brand: 'AudioPulse',
    category: 'headphones',
    price: 18999,
    originalPrice: 24999,
    rating: 4.9,
    reviewsCount: 310,
    stock: 40,
    isFeatured: true,
    isPopular: true,
    isTopRated: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Flagship wireless over-ear headphones with Industry-leading Active Noise Cancellation (ANC), 40mm Custom Titanium Drivers, and 50-hour playback with fast USB-C charging.',
    specifications: {
      'Driver Size': '40mm Custom Titanium Dynamic Drivers',
      'Noise Cancellation': 'Hybrid Active Noise Cancellation (Adaptive 4-Mic Array)',
      'Battery Life': '50 Hours (ANC On) / Fast Charge 10 min = 5 hrs',
      'Bluetooth': 'Bluetooth 5.3 + Multipoint Connection',
      'Audio Codecs': 'LDAC, AAC, SBC, Hi-Res Audio Wireless',
      'Weight': '245 grams'
    },
    aiReviewSummary: {
      score: 96,
      verdict: 'Top Choice for Travelers & Focus Work',
      pros: [
        'Silence airplane noise and chatty office environments',
        'Plush memory foam ear cushions for zero fatigue',
        'Rich audiophile-grade bass response and spatial soundstage'
      ],
      cons: [
        'Carrying case is slightly bulky in smaller backpacks'
      ]
    }
  },
  {
    id: 'prod-104',
    name: 'Vortex Edge 5G Smartphone 256GB',
    brand: 'Vortex',
    category: 'smartphones',
    price: 59999,
    originalPrice: 69999,
    rating: 4.7,
    reviewsCount: 95,
    stock: 18,
    isFeatured: true,
    isPopular: true,
    isTopRated: false,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Flagship smartphone featuring a 120Hz LTPO AMOLED curved display, 50MP Sony IMX Triple Camera with AI night mode, Snapdragon 8 Gen 3 chip, and 67W Turbo Flash charging.',
    specifications: {
      'Processor': 'Snapdragon 8 Gen 3 4nm Processor',
      'Display': '6.7" LTPO AMOLED 120Hz 2500-nits Peak Brightness',
      'Main Camera': '50MP Primary OIS + 50MP Telephoto 3x + 48MP Ultra-Wide',
      'Battery & Charging': '5000mAh with 67W Fast Charging (0-100% in 35 min)',
      'RAM & Storage': '12GB RAM + 256GB UFS 4.0 Storage',
      'Water Resistance': 'IP68 Dust & Water Resistant'
    },
    aiReviewSummary: {
      score: 91,
      verdict: 'Superb Camera & Performance Champion',
      pros: [
        'Stunning low-light camera portrait mode',
        'Silky smooth 120Hz OLED display with vibrant contrast',
        '67W charging tops off the phone in under 40 minutes'
      ],
      cons: [
        'Curved glass edges may cause occasional accidental palm touches'
      ]
    }
  },
  {
    id: 'prod-105',
    name: 'PulseGear Titan Watch 2 GPS',
    brand: 'PulseGear',
    category: 'smartwatches',
    price: 16999,
    originalPrice: 21999,
    rating: 4.6,
    reviewsCount: 120,
    stock: 30,
    isFeatured: false,
    isPopular: true,
    isTopRated: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rugged smartwatch built with Aircraft Grade Titanium case, Dual-frequency GPS, SpO2 heart monitor, sleep tracking, and 14-day battery life for fitness enthusiasts.',
    specifications: {
      'Material': 'Titanium Alloy Bezel + Sapphire Crystal Glass',
      'Display': '1.43" Always-On AMOLED 466 x 466',
      'Sensors': 'Optical Heart Rate, SpO2, ECG, Barometer, Temperature',
      'Battery': '14 Days Typical Usage / 40 Hours Continuous GPS',
      'Waterproof': '10 ATM (100 Meters Swimproof)',
      'Connectivity': 'Bluetooth 5.3, Dual Band GPS (L1+L5)'
    },
    aiReviewSummary: {
      score: 89,
      verdict: 'Unbeatable Outdoor Fitness Smartwatch',
      pros: [
        'Impressive 2-week battery life',
        'Scratch-resistant sapphire glass screen',
        'Precise multi-sport outdoor GPS tracking'
      ],
      cons: [
        'Third-party app ecosystem is smaller than Apple Watch or WearOS'
      ]
    }
  },
  {
    id: 'prod-106',
    name: 'NovaTech Pad Max 11" 128GB',
    brand: 'NovaTech',
    category: 'tablets',
    price: 32999,
    originalPrice: 39999,
    rating: 4.6,
    reviewsCount: 76,
    stock: 12,
    isFeatured: false,
    isPopular: false,
    isTopRated: true,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Versatile 11-inch tablet with 2.8K 144Hz display, Quad Dolby Atmos speakers, Stylus Pen support, and high-performance octacore chipset for creativity and media consumption.',
    specifications: {
      'Display': '11" 2.8K (2880 x 1800) IPS 144Hz HDR10',
      'Processor': 'Snapdragon 870 Octa-Core',
      'Audio': 'Quad Stereo Speakers with Dolby Atmos',
      'Battery': '8840mAh with 33W Fast Charge',
      'Stylus': 'Stylus Pen Compatible (4096 pressure levels)'
    },
    aiReviewSummary: {
      score: 87,
      verdict: 'Great Tablet for Note-taking & Netflix',
      pros: [
        '144Hz smooth display for reading and sketching',
        'Loud crystal clear quad speaker audio system'
      ],
      cons: [
        'Stylus pen sold separately'
      ]
    }
  },
  {
    id: 'prod-107',
    name: 'AeroView Hub Max Smart Display',
    brand: 'AeroView',
    category: 'smarthome',
    price: 14999,
    originalPrice: 18999,
    rating: 4.4,
    reviewsCount: 64,
    stock: 22,
    isFeatured: false,
    isPopular: false,
    isTopRated: false,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
    ],
    description: '10-inch HD smart home control center with built-in stereo speaker, camera auto-framing, video calls, smart lights automation, and AI voice assistance.',
    specifications: {
      'Screen': '10.1" HD Touchscreen',
      'Camera': '13MP Wide Angle with Auto-framing',
      'Audio': 'Stereo Speakers (2x 10W Tweeters + 3" Woofer)',
      'Smart Protocols': 'Matter, Zigbee, Thread, Wi-Fi 6'
    },
    aiReviewSummary: {
      score: 84,
      verdict: 'Convenient Central Hub for Modern Homes',
      pros: [
        'Seamless smart camera live monitoring',
        'Crisp voice pickup across large rooms'
      ],
      cons: [
        'Requires constant AC wall power outlet'
      ]
    }
  },
  {
    id: 'prod-108',
    name: 'AudioPulse Buds Pro Wireless',
    brand: 'AudioPulse',
    category: 'headphones',
    price: 8999,
    originalPrice: 12999,
    rating: 4.8,
    reviewsCount: 215,
    stock: 50,
    isFeatured: false,
    isPopular: true,
    isTopRated: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'True wireless earbuds with active noise cancellation, IPX7 waterproof rating, spatial audio head tracking, and 36-hour total playback with charging case.',
    specifications: {
      'Noise Cancellation': 'Active ANC (-42dB attenuation)',
      'Battery Life': '8 hrs single charge / 36 hrs total with wireless case',
      'Waterproof': 'IPX7 Sweat & Water Resistant',
      'Microphones': '6-Microphone HD Call System with AI Wind Noise Reduction'
    },
    aiReviewSummary: {
      score: 93,
      verdict: 'Best Workout & Daily Commute Earbuds',
      pros: [
        'Secure ergonomic fit during workouts',
        'Punchy bass response with clear voice calls'
      ],
      cons: [
        'Touch controls take a day to get used to'
      ]
    }
  },
  {
    id: 'prod-109',
    name: 'NovaTech Vision 13 OLED Tablet',
    brand: 'NovaTech',
    category: 'tablets',
    price: 42999,
    originalPrice: 49999,
    rating: 4.5,
    reviewsCount: 58,
    stock: 16,
    isFeatured: false,
    isPopular: false,
    isTopRated: true,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A slim OLED tablet for reading, note-taking, streaming, and everyday productivity, with a bright display and all-day battery life.',
    specifications: {
      'Display': '13-inch 2.8K OLED, 120Hz',
      'Processor': 'Octa-core performance chipset',
      'Storage': '256GB',
      'Battery': 'Up to 12 hours',
      'Connectivity': 'Wi-Fi 6 and Bluetooth 5.3'
    },
    aiReviewSummary: {
      score: 86,
      verdict: 'Balanced OLED Tablet for Work and Entertainment',
      pros: ['Sharp OLED display', 'Comfortable for long reading sessions'],
      cons: ['Keyboard accessory sold separately']
    }
  },
  {
    id: 'prod-110',
    name: 'Vortex Edge Lite 5G Smartphone',
    brand: 'Vortex',
    category: 'smartphones',
    price: 24999,
    originalPrice: 29999,
    rating: 4.4,
    reviewsCount: 71,
    stock: 25,
    isFeatured: false,
    isPopular: true,
    isTopRated: false,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A dependable 5G smartphone with a smooth AMOLED display, reliable camera system, and fast charging for everyday use.',
    specifications: {
      'Display': '6.5-inch AMOLED, 120Hz',
      'Processor': 'Octa-core 5G mobile platform',
      'Camera': '50MP main camera with optical stabilization',
      'Battery': '5000mAh with 45W fast charging',
      'Storage': '128GB'
    },
    aiReviewSummary: {
      score: 85,
      verdict: 'Strong Everyday 5G Phone at a Practical Price',
      pros: ['Smooth high-refresh display', 'Fast charging and dependable battery'],
      cons: ['No expandable storage']
    }
  }
];

export const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'prod-101',
    userName: 'Alex Chen',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-06-14',
    title: 'Perfect machine for Full-Stack & Python AI Development',
    comment: 'I bought this laptop based on the AI assistant recommendation for coding under ₹80,000. Compile speeds on Docker and VS Code are blazing fast! OLED display is gorgeous. Battery gets me through 10-12 hours of active work easily.',
    helpfulCount: 34,
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-101',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: '2026-05-20',
    title: 'Solid performance, lightweight build',
    comment: 'Keyboard feedback is top notch. The only minor gripe is the glossy display screen which reflects light if sitting right by an open window, but the 120Hz refresh rate makes up for it.',
    helpfulCount: 19,
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-103',
    userName: 'Michael Torres',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-07-02',
    title: 'ANC is practically magic on flights!',
    comment: 'Wore these on a 14-hour flight from NY to Tokyo. The noise cancellation completely muted engine roar. Battery was still at 60% when I landed. Highly recommend.',
    helpfulCount: 42,
    verifiedPurchase: true
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-98421',
    date: '2026-07-15',
    status: 'Delivered',
    totalPrice: 98998,
    itemsCount: 2,
    items: [
      {
        id: 'prod-101',
        name: 'Zenith Book Pro 16 AI Laptop',
        price: 79999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prod-103',
        name: 'AudioPulse ANC Horizon 5 Headphones',
        price: 18999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Alex Chen',
      address: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States'
    }
  },
  {
    id: 'ORD-97104',
    date: '2026-06-28',
    status: 'Delivered',
    totalPrice: 16999,
    itemsCount: 1,
    items: [
      {
        id: 'prod-105',
        name: 'PulseGear Titan Watch 2 GPS',
        price: 16999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Alex Chen',
      address: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States'
    }
  }
];

export const AI_SUGGESTED_PROMPTS = [
  'Find me a laptop under ₹80,000 for coding',
  'Which headphones are best for travel and ANC?',
  'Compare Zenith Book Pro vs TechPro UltraBlade',
  'Summarize customer reviews for AudioPulse ANC Horizon 5',
  'What is the best smartwatch for fitness & 2-week battery?'
];
