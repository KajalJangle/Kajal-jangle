// AromaCraft Coffee Roasters Data Store

const COFFEE_DATA = {
  categories: [
    { id: 'all', name: 'All Menu', icon: '☕' },
    { id: 'hot', name: 'Hot Brews', icon: '♨️' },
    { id: 'cold', name: 'Iced & Cold Brew', icon: '🧊' },
    { id: 'specialty', name: 'Signature Specials', icon: '✨' },
    { id: 'beans', name: 'Artisan Beans', icon: '🫘' },
    { id: 'bakery', name: 'Bakery & Treats', icon: '🥐' }
  ],

  products: [
    {
      id: 'prod-1',
      name: 'Caramel Macchiato Royale',
      category: 'specialty',
      categoryName: 'Signature Specials',
      price: 5.49,
      rating: 4.9,
      reviewsCount: 142,
      roastLevel: 'Medium Roast',
      tags: ['Bestseller', 'Customer Choice'],
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
      description: 'Velvety steamed milk with rich espresso, infused with Madagascan vanilla and topped with artisan salted caramel drizzle.',
      isCustomizable: true,
      calories: '240 kcal',
      caffeine: '150 mg'
    },
    {
      id: 'prod-2',
      name: 'Vanilla Oat Milk Flat White',
      category: 'hot',
      categoryName: 'Hot Brews',
      price: 4.99,
      rating: 4.8,
      reviewsCount: 98,
      roastLevel: 'Medium-Dark',
      tags: ['Vegan', 'Popular'],
      image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
      description: 'Expertly micro-foamed oat milk poured gently over double shots of our signature Colombian single-origin espresso.',
      isCustomizable: true,
      calories: '160 kcal',
      caffeine: '175 mg'
    },
    {
      id: 'prod-3',
      name: 'Nitro Cold Brew Supreme',
      category: 'cold',
      categoryName: 'Iced & Cold Brew',
      price: 5.25,
      rating: 4.9,
      reviewsCount: 215,
      roastLevel: 'Dark Roast',
      tags: ['Signature', 'High Caffeine'],
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      description: 'Steeped for 20 hours and micro-infused with pure nitrogen for an ultra-creamy head and silky smooth cascade.',
      isCustomizable: true,
      calories: '5 kcal',
      caffeine: '260 mg'
    },
    {
      id: 'prod-4',
      name: 'Hazelnut Praline Iced Latte',
      category: 'cold',
      categoryName: 'Iced & Cold Brew',
      price: 5.75,
      rating: 4.7,
      reviewsCount: 88,
      roastLevel: 'Medium Roast',
      tags: ['New', 'Sweet'],
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
      description: 'Freshly pulled espresso poured over cold milk, roasted hazelnut syrup, crushed pralines, and crystalline ice cubes.',
      isCustomizable: true,
      calories: '280 kcal',
      caffeine: '150 mg'
    },
    {
      id: 'prod-5',
      name: 'Classic Double Espresso',
      category: 'hot',
      categoryName: 'Hot Brews',
      price: 3.49,
      rating: 4.9,
      reviewsCount: 164,
      roastLevel: 'Dark Roast',
      tags: ['Pure Coffee', 'Single Origin'],
      image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
      description: 'Two pure shots of intense, full-bodied espresso with thick golden crema and distinct notes of dark chocolate and toasted walnut.',
      isCustomizable: true,
      calories: '5 kcal',
      caffeine: '180 mg'
    },
    {
      id: 'prod-6',
      name: 'Spanish Cortado',
      category: 'hot',
      categoryName: 'Hot Brews',
      price: 4.25,
      rating: 4.8,
      reviewsCount: 76,
      roastLevel: 'Dark Roast',
      tags: ['Barista Pick'],
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
      description: 'Equal parts robust espresso and silky warm milk to reduce the acidity without losing the intense coffee punch.',
      isCustomizable: true,
      calories: '75 kcal',
      caffeine: '150 mg'
    },
    {
      id: 'prod-7',
      name: 'Matcha Blossom Latte',
      category: 'specialty',
      categoryName: 'Signature Specials',
      price: 5.95,
      rating: 4.8,
      reviewsCount: 110,
      roastLevel: 'Ceremonial Grade',
      tags: ['Organic', 'Antioxidants'],
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
      description: 'First-harvest Uji ceremonial matcha whisked with warm oat milk, organic agave, and a gentle hint of cherry blossom essence.',
      isCustomizable: true,
      calories: '190 kcal',
      caffeine: '70 mg'
    },
    {
      id: 'prod-8',
      name: 'Ethiopian Yirgacheffe Beans (250g)',
      category: 'beans',
      categoryName: 'Artisan Beans',
      price: 18.50,
      rating: 5.0,
      reviewsCount: 64,
      roastLevel: 'Light Roast',
      tags: ['Direct Trade', 'Floral Notes'],
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
      description: 'Hand-picked heirloom Arabica beans. Boasts exquisite notes of jasmine blossom, bergamot, and sweet lemon citrus.',
      isCustomizable: false,
      calories: '0 kcal',
      caffeine: 'Whole Bean / Ground'
    },
    {
      id: 'prod-9',
      name: 'Sumatra Mandheling Dark Beans (250g)',
      category: 'beans',
      categoryName: 'Artisan Beans',
      price: 17.00,
      rating: 4.9,
      reviewsCount: 52,
      roastLevel: 'Dark Roast',
      tags: ['Organic', 'Earthy & Bold'],
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
      description: 'Triple-picked Indonesian beans offering deep body, low acidity, earthy cedar wood, and semi-sweet dark cocoa finish.',
      isCustomizable: false,
      calories: '0 kcal',
      caffeine: 'Whole Bean / Ground'
    },
    {
      id: 'prod-10',
      name: 'French Butter Croissant',
      category: 'bakery',
      categoryName: 'Bakery & Treats',
      price: 3.95,
      rating: 4.9,
      reviewsCount: 189,
      roastLevel: 'Freshly Baked Daily',
      tags: ['Oven Fresh', 'Butter Rich'],
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      description: 'Authentic 27-layered French viennoiserie pastry, baked golden-crisp with pure Normandy churned butter.',
      isCustomizable: false,
      calories: '310 kcal',
      caffeine: '0 mg'
    },
    {
      id: 'prod-11',
      name: 'Dark Chocolate Fudge Brownie',
      category: 'bakery',
      categoryName: 'Bakery & Treats',
      price: 4.25,
      rating: 4.8,
      reviewsCount: 130,
      roastLevel: 'Belgian Cocoa',
      tags: ['Gluten Friendly', 'Decadent'],
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      description: 'Ultra-dense fudge brownie made with 72% Belgian dark chocolate, sea salt crystals, and roasted pecan pieces.',
      isCustomizable: false,
      calories: '380 kcal',
      caffeine: '15 mg'
    },
    {
      id: 'prod-12',
      name: 'Cinnamon Swirl Brioche',
      category: 'bakery',
      categoryName: 'Bakery & Treats',
      price: 4.50,
      rating: 4.7,
      reviewsCount: 94,
      roastLevel: 'Freshly Baked Daily',
      tags: ['Warm Treat', 'Spiced'],
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      description: 'Pillowy brioche dough swirled with Ceylon cinnamon sugar and drizzled with cream cheese frosting.',
      isCustomizable: false,
      calories: '340 kcal',
      caffeine: '0 mg'
    }
  ],

  customizationOptions: {
    sizes: [
      { id: 'regular', name: 'Regular (12 oz)', extraPrice: 0.00 },
      { id: 'medium', name: 'Grande (16 oz)', extraPrice: 0.60 },
      { id: 'large', name: 'Venti (20 oz)', extraPrice: 1.20 }
    ],
    milks: [
      { id: 'whole', name: 'Whole Dairy Milk', extraPrice: 0.00 },
      { id: 'oat', name: 'Barista Oat Milk', extraPrice: 0.65 },
      { id: 'almond', name: 'Roasted Almond Milk', extraPrice: 0.60 },
      { id: 'soy', name: 'Organic Soy Milk', extraPrice: 0.50 },
      { id: 'skim', name: 'Skim / Non-Fat Milk', extraPrice: 0.00 }
    ],
    sweetness: [
      { id: '0', name: 'Unsweetened (0%)' },
      { id: '25', name: 'Light Sweet (25%)' },
      { id: '50', name: 'Standard (50%)' },
      { id: '100', name: 'Extra Sweet (100%)' }
    ],
    temperatures: [
      { id: 'hot', name: 'Hot (Standard Temp)' },
      { id: 'extra_hot', name: 'Extra Hot' },
      { id: 'iced', name: 'Served with Crushed Ice' }
    ],
    addons: [
      { id: 'extra_shot', name: 'Extra Espresso Shot', price: 0.85 },
      { id: 'whipped_cream', name: 'Fresh Whipped Cream', price: 0.50 },
      { id: 'caramel_drizzle', name: 'Salted Caramel Drizzle', price: 0.60 },
      { id: 'vanilla_syrup', name: 'Madagascar Vanilla Syrup', price: 0.55 },
      { id: 'cinnamon_dust', name: 'Ceylon Cinnamon Dusting', price: 0.00 }
    ]
  },

  promoCodes: {
    'COFFEE10': { discountPercent: 10, minSpend: 10, description: '10% OFF on orders over $10' },
    'WELCOME20': { discountPercent: 20, minSpend: 15, description: '20% OFF your first artisanal brew' },
    'FREESHIP': { freeShipping: true, minSpend: 12, description: 'Free Express Doorstep Delivery' }
  },

  quizQuestions: [
    {
      id: 1,
      question: 'What is your coffee vibe today?',
      options: [
        { label: '🚀 Need an energetic power boost for work', value: 'bold' },
        { label: '🛋️ Cozy and warm comfort drink', value: 'cozy' },
        { label: '🧊 Cool, refreshing and crisp iced drink', value: 'cold' },
        { label: '🍫 Sweet, dessert-like indulgence', value: 'sweet' }
      ]
    },
    {
      id: 2,
      question: 'How strong do you like your coffee intensity?',
      options: [
        { label: '🔥 Deep, intense & bold dark roast', value: 'intense' },
        { label: '⚖️ Perfectly balanced & smooth medium roast', value: 'balanced' },
        { label: '🍃 Light, gentle with subtle aromatic notes', value: 'light' }
      ]
    },
    {
      id: 3,
      question: 'What is your milk preference?',
      options: [
        { label: '☕ Pure black coffee, no milk', value: 'black' },
        { label: '🌾 Creamy plant milk (Oat / Almond)', value: 'plant' },
        { label: '🥛 Rich steamed dairy & froth', value: 'dairy' }
      ]
    }
  ],

  testimonials: [
    {
      id: 1,
      name: 'Sophia Sterling',
      role: 'Coffee Connoisseur & Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      comment: 'The Caramel Macchiato Royale and Vanilla Oat Flat White are unmatched in quality. The aroma greets you before you even take the first sip. 10/10 service!',
      date: '2 days ago'
    },
    {
      id: 2,
      name: 'Marcus Vance',
      role: 'Software Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      comment: 'Their Nitro Cold Brew powers my coding sprints every morning. Ordering online is seamless, and delivery was at my doorstep in 20 minutes hot & fresh!',
      date: '1 week ago'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      role: 'Food & Lifestyle Blogger',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      comment: 'AromaCraft has the best single-origin Ethiopian beans I have ever ground at home. Love their sustainability promise and ethical direct trade.',
      date: '3 weeks ago'
    }
  ]
};
