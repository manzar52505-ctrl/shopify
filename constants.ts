
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Neo-Noir Leather Jacket",
    price: 189.99,
    category: "Fashion",
    description: "A sleek, genuine leather jacket with a modern cut. Perfect for chilly evenings and urban exploration.",
    image: "https://picsum.photos/seed/jacket/400/400",
    images: ["https://picsum.photos/seed/jacket/400/400", "https://picsum.photos/seed/jacket2/400/400", "https://picsum.photos/seed/jacket3/400/400"],
    rating: 4.8,
    listingType: 'sale'
  },
  {
    id: 2,
    name: "Wireless Noise-Canceling Headphones",
    price: 249.50,
    category: "Electronics",
    description: "Immerse yourself in music with industry-leading noise cancellation and 30-hour battery life.",
    image: "https://picsum.photos/seed/headphones/400/400",
    images: ["https://picsum.photos/seed/headphones/400/400"],
    rating: 4.9,
    listingType: 'sale'
  },
  {
    id: 3,
    name: "Minimalist Analog Watch",
    price: 120.00,
    category: "Accessories",
    description: "Timeless design meeting modern precision. Features a sapphire crystal face and italian leather strap.",
    image: "https://picsum.photos/seed/watch/400/400",
    images: ["https://picsum.photos/seed/watch/400/400"],
    rating: 4.6,
    listingType: 'sale'
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 350.00,
    category: "Home",
    description: "Designed for comfort and productivity. Adjustable lumbar support and breathable mesh back.",
    image: "https://picsum.photos/seed/chair/400/400",
    images: ["https://picsum.photos/seed/chair/400/400"],
    rating: 4.7,
    listingType: 'sale'
  },
  {
    id: 5,
    name: "Smart Fitness Tracker",
    price: 89.99,
    category: "Electronics",
    description: "Track your steps, heart rate, and sleep patterns. Waterproof and stylish for everyday wear.",
    image: "https://picsum.photos/seed/tracker/400/400",
    images: ["https://picsum.photos/seed/tracker/400/400"],
    rating: 4.5,
    listingType: 'sale'
  },
  {
    id: 6,
    name: "Organic Cotton T-Shirt Set",
    price: 45.00,
    category: "Fashion",
    description: "A pack of 3 ultra-soft, sustainable cotton t-shirts in neutral colors.",
    image: "https://picsum.photos/seed/tshirt/400/400",
    images: ["https://picsum.photos/seed/tshirt/400/400"],
    rating: 4.3,
    listingType: 'sale'
  },
  {
    id: 7,
    name: "Ceramic Pour-Over Coffee Set",
    price: 65.00,
    category: "Home",
    description: "Brew the perfect cup of coffee with this artisanal ceramic pour-over set.",
    image: "https://picsum.photos/seed/coffee/400/400",
    images: ["https://picsum.photos/seed/coffee/400/400"],
    rating: 4.8,
    listingType: 'sale'
  },
  {
    id: 8,
    name: "Running Shoes 'Velocity'",
    price: 110.00,
    category: "Sports",
    description: "Lightweight, high-traction running shoes designed for speed and stability on any terrain.",
    image: "https://picsum.photos/seed/shoes/400/400",
    images: ["https://picsum.photos/seed/shoes/400/400"],
    rating: 4.6,
    listingType: 'sale'
  },
  {
    id: 9,
    name: "Vintage Polaroid Camera",
    price: 150.00,
    category: "Electronics",
    description: "Capture memories instantly with this refurbished vintage style instant camera.",
    image: "https://picsum.photos/seed/camera/400/400",
    images: ["https://picsum.photos/seed/camera/400/400"],
    rating: 4.4,
    listingType: 'sale'
  },
  {
    id: 10,
    name: "Canvas Weekend Bag",
    price: 95.00,
    category: "Accessories",
    description: "Durable canvas duffel bag with leather accents. The perfect size for a short getaway.",
    image: "https://picsum.photos/seed/bag/400/400",
    images: ["https://picsum.photos/seed/bag/400/400"],
    rating: 4.7,
    listingType: 'sale'
  },
  {
    id: 11,
    name: "Smart Home Speaker",
    price: 199.00,
    category: "Electronics",
    description: "High-fidelity sound with built-in voice assistant. Controls your smart home devices seamlessly.",
    image: "https://picsum.photos/seed/speaker/400/400",
    images: ["https://picsum.photos/seed/speaker/400/400"],
    rating: 4.5,
    listingType: 'sale'
  },
  {
    id: 12,
    name: "Yoga Mat & Block Set",
    price: 55.00,
    category: "Sports",
    description: "Non-slip eco-friendly yoga mat including two cork blocks for stability.",
    image: "https://picsum.photos/seed/yoga/400/400",
    images: ["https://picsum.photos/seed/yoga/400/400"],
    rating: 4.8,
    listingType: 'sale'
  },
  // SWAP ITEMS
  {
    id: 13,
    name: "Vintage Film Cameras Collection",
    price: 0,
    category: "Electronics",
    description: "A set of 3 working film cameras from the 80s. Good condition, just need film.",
    image: "https://picsum.photos/seed/oldcamera/400/400",
    images: ["https://picsum.photos/seed/oldcamera/400/400"],
    rating: 0,
    listingType: 'swap',
    swapPreferences: "Looking for a modern DSLR lens or a mechanical keyboard."
  },
  {
    id: 14,
    name: "Stack of Sci-Fi Novels",
    price: 0,
    category: "Books",
    description: "10 classic sci-fi paperbacks including Dune and Foundation. Read once.",
    image: "https://picsum.photos/seed/books/400/400",
    images: ["https://picsum.photos/seed/books/400/400"],
    rating: 0,
    listingType: 'swap',
    swapPreferences: "Will trade for philosophy books or a ukulele."
  },
  {
    id: 15,
    name: "iPhone 11 (64GB) - Gently Used",
    price: 0,
    category: "Electronics",
    description: "Fully functional, minor scratches on the back. Battery health 85%.",
    image: "https://picsum.photos/seed/iphone/400/400",
    images: ["https://picsum.photos/seed/iphone/400/400"],
    rating: 0,
    listingType: 'swap',
    swapPreferences: "Open to offers. Ideally a tablet or smart watch."
  }
];
