

import { Product, Order, Notification, Category, StoreSettings, HeroSlide, FaqItem, ContactInfo, OurStoryContent, Rider } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Dresses' },
  { id: '2', name: 'Accessories' },
  { id: '3', name: "Men's Wear" },
  { id: '4', name: "Home Decor" },
];

const slugify = (text: string) => text.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

const tempProducts: Omit<Product, 'slug'>[] = [
  {
    id: '1',
    name: "Ankara Infinity Gown",
    sku: "AFB-DRE-001",
    categoryId: '1', // Dresses
    price: 120.00,
    rating: 4.8,
    reviewCount: 78,
    description: "A breathtaking, floor-length gown made from authentic Ankara wax print. Its versatile infinity design allows for multiple styling options, making it perfect for weddings, galas, and special occasions.",
    details: ["100% Cotton Ankara", "Versatile infinity wrap design", "Floor-length", "Handmade in Kenya"],
    images: ["https://picsum.photos/seed/gown1/800/1200", "https://picsum.photos/seed/gown2/800/1200", "https://picsum.photos/seed/gown3/800/1200"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Royal Blue", "Sunset Orange"],
    culturalInspiration: "Ankara Prints",
    material: "Cotton",
    isBestseller: true,
    stock: 25,
    isVisible: true,
  },
  {
    id: '2',
    name: "Masai Beaded Collar Necklace",
    sku: "AFB-ACC-001",
    categoryId: '2', // Accessories
    price: 75.50,
    rating: 4.9,
    reviewCount: 152,
    description: "An exquisite, handcrafted collar necklace featuring traditional Masai beadwork. This statement piece adds a vibrant and authentic touch to any outfit, celebrating the rich heritage of the Masai people.",
    details: ["Hand-laid glass beads", "Leather backing for comfort", "Adjustable tie closure", "Crafted by Masai artisans"],
    images: ["https://picsum.photos/seed/necklace1/800/800", "https://picsum.photos/seed/necklace2/800/800"],
    sizes: ["One Size"],
    colors: ["Rainbow", "Monochrome"],
    culturalInspiration: "Masai Beads",
    material: "Glass Beads, Leather",
    isNewArrival: true,
    stock: 50,
    isVisible: true,
  },
  {
    id: '3',
    name: "Kente Cloth Bomber Jacket",
    sku: "AFB-MEN-001",
    categoryId: '3', // Men's Wear
    price: 150.00,
    rating: 4.7,
    reviewCount: 45,
    description: "A modern bomber jacket with a classic silhouette, elevated by panels of authentic Kente cloth. This jacket is a perfect blend of contemporary urban style and traditional Ghanaian symbolism.",
    details: ["Satin lining", "Ribbed cuffs and hem", "Authentic Kente cloth panels", "Durable front zipper"],
    images: ["https://picsum.photos/seed/jacket1/800/800", "https://picsum.photos/seed/jacket2/800/800"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black/Gold", "Navy/Blue"],
    culturalInspiration: "Kente Cloth",
    material: "Cotton Blend",
    isBestseller: true,
    stock: 30,
    isVisible: true,
  },
  {
    id: '4',
    name: "Mudcloth Throw Pillow Set",
    sku: "AFB-DEC-001",
    categoryId: '4', // Home Decor
    price: 85.00,
    rating: 4.9,
    reviewCount: 95,
    description: "A set of two decorative throw pillows made from hand-dyed Malian mudcloth (Bògòlanfini). Each pillow features unique geometric patterns, bringing a piece of West African artistry into your home.",
    details: ["Set of two 18x18 inch pillows", "Authentic Bògòlanfini fabric", "Hidden zipper closure", "Pillow inserts included"],
    images: ["https://picsum.photos/seed/pillow1/800/800", "https://picsum.photos/seed/pillow2/800/800"],
    sizes: ["18x18 in"],
    colors: ["Black/White", "Rust/Cream"],
    culturalInspiration: "Malian Mudcloth",
    material: "Cotton",
    stock: 40,
    isVisible: true,
  },
  {
    id: '5',
    name: "Kitenge Wrap Skirt",
    sku: "AFB-DRE-002",
    categoryId: '1', // Dresses
    price: 65.00,
    rating: 4.6,
    reviewCount: 62,
    description: "A vibrant and flowing wrap skirt made from colorful East African Kitenge fabric. Its adjustable fit and breezy style make it perfect for warm weather and casual outings.",
    details: ["100% Cotton Kitenge", "Adjustable wrap-around tie", "Midi-length", "Machine washable"],
    images: ["https://picsum.photos/seed/skirt1/800/1200", "https://picsum.photos/seed/skirt2/800/1200"],
    sizes: ["One Size Fits Most"],
    colors: ["Emerald Green", "Ruby Red"],
    culturalInspiration: "Kitenge Fabric",
    material: "Cotton",
    isNewArrival: true,
    stock: 60,
    isVisible: true,
  },
  {
    id: '6',
    name: "Adire Tie-Dye Tunic",
    sku: "AFB-MEN-002",
    categoryId: '3', // Men's Wear
    price: 95.00,
    rating: 4.5,
    reviewCount: 33,
    description: "A stylish and comfortable men's tunic featuring intricate Adire tie-dye patterns from Nigeria. Made from lightweight, breathable fabric, it's ideal for both casual and semi-formal events.",
    details: ["Hand-dyed Adire patterns", "Soft, breathable cotton", "Mandarin collar", "Side slits for ease of movement"],
    images: ["https://picsum.photos/seed/tunic1/800/1200", "https://picsum.photos/seed/tunic2/800/1200"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Indigo Blue", "Forest Green"],
    culturalInspiration: "Adire Tie-Dye",
    material: "Cotton",
    stock: 15,
    isVisible: true,
  },
  {
    id: '7',
    name: "Shweshwe Flared Dress",
    sku: "AFB-DRE-003",
    categoryId: '1', // Dresses
    price: 135.00,
    rating: 4.8,
    reviewCount: 55,
    description: "A beautifully tailored flared dress made from authentic South African Shweshwe fabric, known for its intricate geometric patterns. Features a fitted bodice and a full, knee-length skirt.",
    details: ["100% Cotton Shweshwe", "Fitted bodice, flared skirt", "Knee-length", "Side pockets"],
    images: ["https://picsum.photos/seed/dress1/800/1200", "https://picsum.photos/seed/dress2/800/1200"],
    sizes: ["S", "M", "L"],
    colors: ["Indigo", "Red"],
    culturalInspiration: "South African Shweshwe",
    material: "Cotton",
    isBestseller: true,
    stock: 20,
    isVisible: true,
  },
  {
    id: '8',
    name: "Cowrie Shell Earrings",
    sku: "AFB-ACC-002",
    categoryId: '2', // Accessories
    price: 45.00,
    rating: 4.9,
    reviewCount: 110,
    description: "Elegant drop earrings featuring polished cowrie shells and brass details. These lightweight earrings are a symbol of prosperity and a stylish nod to pan-African culture.",
    details: ["Natural cowrie shells", "Polished brass hooks", "Lightweight design", "Hand-assembled"],
    images: ["https://picsum.photos/seed/earrings1/800/800", "https://picsum.photos/seed/earrings2/800/800"],
    sizes: ["One Size"],
    colors: ["Natural/Gold"],
    material: "Cowrie Shell, Brass",
    isNewArrival: true,
    stock: 80,
    isVisible: true,
  },
  {
    id: '9',
    name: "Bogolan Print Cushion Cover",
    sku: "AFB-DEC-002",
    categoryId: '4', // Home Decor
    price: 40.00,
    rating: 4.7,
    reviewCount: 60,
    description: "Add an artistic touch to your living space with this cushion cover featuring a modern Bogolan (mudcloth) inspired print. Made from durable cotton canvas.",
    details: ["18x18 inch size", "Cotton canvas", "Hidden zipper", "Cover only"],
    images: ["https://picsum.photos/seed/cushion1/800/800", "https://picsum.photos/seed/cushion2/800/800"],
    sizes: ["18x18 in"],
    colors: ["Black/Cream"],
    culturalInspiration: "Malian Mudcloth",
    material: "Cotton Canvas",
    stock: 100,
    isVisible: true,
  },
  {
    id: '10',
    name: "Dashiki Print Shirt",
    sku: "AFB-MEN-003",
    categoryId: '3', // Men's Wear
    price: 80.00,
    rating: 4.6,
    reviewCount: 70,
    description: "A vibrant and comfortable Dashiki shirt, perfect for making a bold style statement. Features the iconic Angelina print along the neckline and sleeves.",
    details: ["Angelina print detail", "100% breathable cotton", "Relaxed fit", "Two front pockets"],
    images: ["https://picsum.photos/seed/dashiki1/800/1200", "https://picsum.photos/seed/dashiki2/800/1200"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Royal Blue", "Black"],
    culturalInspiration: "Dashiki",
    material: "Cotton",
    stock: 45,
    isVisible: true,
  }
];

export const PRODUCTS: Product[] = tempProducts.map(p => ({
  ...p,
  slug: `${slugify(p.name)}-${p.id}`
}));

export const INITIAL_ORDERS: Order[] = [
    {
        id: '1',
        trackingId: 'AFB123XYZ',
        clientDetails: {
            name: 'Jane Doe',
            address: '123 Savanna St, Nairobi, Kenya',
            phone: '+254712345678'
        },
        items: [
            { ...(PRODUCTS.find(p => p.id === '1')!), quantity: 1, selectedColor: 'Royal Blue', selectedSize: 'M' },
            { ...(PRODUCTS.find(p => p.id === '2')!), quantity: 1, selectedColor: 'Rainbow', selectedSize: 'One Size' }
        ],
        total: 211.14,
        status: 'Out for Delivery',
        paymentStatus: 'Paid',
        riderId: 'rider_1',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        paymentMethod: 'M-Pesa Till',
    },
    {
        id: '2',
        trackingId: 'AFB456ABC',
        clientDetails: {
            name: 'John Smith',
            address: '456 Acacia Ave, Mombasa, Kenya',
            phone: '+254787654321'
        },
        items: [
            { ...(PRODUCTS.find(p => p.id === '3')!), quantity: 1, selectedColor: 'Black/Gold', selectedSize: 'L' }
        ],
        total: 177.00,
        status: 'Processing',
        paymentStatus: 'Unpaid',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        paymentMethod: 'Pochi la Biashara',
    },
    {
        id: '3',
        trackingId: 'AFB789DEF',
        clientDetails: {
            name: 'Amina Mohamed',
            address: '789 Baobab Ln, Kisumu, Kenya',
            phone: '+254798765432'
        },
        items: [
             { ...(PRODUCTS.find(p => p.id === '4')!), quantity: 2, selectedColor: 'Black/White', selectedSize: '18x18 in' }
        ],
        total: 199.80,
        status: 'Delivered',
        paymentStatus: 'Paid',
        riderId: 'rider_2',
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        paymentMethod: 'M-Pesa Till',
    }
];

export const INITIAL_NOTIFICATION: Notification = {
  isActive: false,
  title: "🎉 Special Sale!",
  message: "Get 20% off on all dresses this weekend. Don't miss out!",
  link: "/products?categoryId=1",
  linkLabel: "Shop Now",
  displayType: 'popup'
};

const INITIAL_HERO_SLIDES: HeroSlide[] = [
    {
        id: 'slide_1',
        src: 'https://picsum.photos/seed/slider1/1920/1080',
        alt: 'A model wearing a vibrant African print dress',
        title: 'Vibrant Traditions',
        subtitle: 'Explore our latest collection of Ankara styles',
        link: '/products?categoryId=1'
    },
    {
        id: 'slide_2',
        src: 'https://picsum.photos/seed/slider2/1920/1080',
        alt: 'A collection of handcrafted beaded jewelry',
        title: 'Artisan Crafted Jewelry',
        subtitle: 'Accessorize with unique, handcrafted pieces',
        link: '/products?categoryId=2'
    },
    {
        id: 'slide_3',
        src: 'https://picsum.photos/seed/slider3/1920/1080',
        alt: 'A man wearing a stylish Kente cloth bomber jacket',
        title: 'Modern Menswear',
        subtitle: 'Redefining style with a touch of heritage',
        link: "/products?categoryId=3"
    }
];

export const INITIAL_FAQS: FaqItem[] = [
    { 
        id: 'faq_1',
        q: "What are my shipping options?",
        a: "We offer standard and expedited shipping within Kenya. Standard shipping typically takes 3-5 business days, while expedited shipping takes 1-2 business days. Shipping costs are calculated at checkout."
    },
    {
        id: 'faq_2',
        q: "How do I track my order?",
        a: "Once your order is shipped, you will receive an email with a tracking ID. You can use this ID on our 'Track Order' page to see the real-time status of your delivery."
    },
    {
        id: 'faq_3',
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery for a full refund or exchange. Items must be in their original condition, unworn, and with all tags attached. Please visit our returns page for more details."
    },
    {
        id: 'faq_4',
        q: "Are your products handmade?",
        a: "Yes, a majority of our products are handcrafted by skilled artisans across Africa. We partner with cooperatives and individual creators to bring you authentic, high-quality pieces while supporting their communities."
    }
];

export const INITIAL_CONTACT_INFO: ContactInfo = {
    title: 'Get In Touch',
    subtitle: "Have a question or a special request? We'd love to hear from you.",
    contactFields: [
        { id: 'cf_1', label: 'Call Us', value: '+254 700 123 456', icon: 'Phone' },
        { id: 'cf_2', label: 'Email Us', value: 'contact@afriblend.com', icon: 'Mail' },
        { id: 'cf_3', label: 'Visit Us', value: '123 Afriblend House, Nairobi, Kenya', icon: 'MapPin' },
    ],
    socialLinks: [
      { id: 'sl_1', name: 'Instagram', url: '#', iconUrl: 'https://cdn.simpleicons.org/instagram' },
      { id: 'sl_2', name: 'Facebook', url: '#', iconUrl: 'https://cdn.simpleicons.org/facebook' },
      { id: 'sl_3', name: 'Pinterest', url: '#', iconUrl: 'https://cdn.simpleicons.org/pinterest' },
      { id: 'sl_4', name: 'Youtube', url: '#', iconUrl: 'https://cdn.simpleicons.org/youtube' },
      { id: 'sl_5', name: 'TikTok', url: '#', iconUrl: 'https://cdn.simpleicons.org/tiktok' },
      { id: 'sl_6', name: 'WhatsApp', url: '#', iconUrl: 'https://cdn.simpleicons.org/whatsapp' },
    ]
};

export const INITIAL_OUR_STORY_CONTENT: OurStoryContent = {
    title: 'Heritage Woven into Modern Style',
    text: "Afriblend was born from a single belief: that the soul of African artistry deserves a place in the modern wardrobe. We journey across the continent to partner with master artisans, honoring timeless techniques passed down through generations. Each piece in our collection is more than just fashion; it's a story woven in thread, a culture celebrated in color, and a future crafted with sustainable, ethical practices. We invite you to wear a piece of heritage, beautifully reimagined.",
    imageUrl: 'https://picsum.photos/seed/artisan-hands/800/1200',
};

export const INITIAL_RIDERS: Rider[] = [
    { id: 'rider_1', name: 'John Doe', phone: '+254711223344' },
    { id: 'rider_2', name: 'Peter Jones', phone: '+254755667788' },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  paymentMethods: [
    {
      id: 'pm_1',
      name: 'M-Pesa Till',
      enabled: true,
      instructions: 'Pay securely using an M-Pesa Till Number.',
      fields: [
        { id: 'f_1', label: 'Till Number', value: '123456' },
        { id: 'f_2', label: 'Account Number', value: '{{ORDER_ID}}' }
      ]
    },
    {
      id: 'pm_2',
      name: 'Pochi la Biashara',
      enabled: true,
      instructions: 'Pay directly to a business phone number.',
      fields: [
        { id: 'f_3', label: 'Phone Number', value: '0712345678' },
        { id: 'f_4', label: 'Reference', value: '{{CLIENT_NAME}}' }
      ]
    }
  ],
  heroSlides: INITIAL_HERO_SLIDES,
  fab: {
    enabled: true,
    iconUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228298/contact_vawnks.svg',
    whatsappIconUrl: 'https://res.cloudinary.com/dwwvh34yi/image/upload/v1753228296/whatsapp-svgrepo-com_q3mpio.svg',
    callIconUrl: 'https://icongr.am/feather/phone-call.svg?size=128&color=ffffff'
  }
};