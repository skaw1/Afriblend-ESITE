

export type UserRole = 'Developer' | 'Store Owner';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name:string;
  slug: string;
  sku: string;
  categoryId: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  images: string[];
  sizes: string[];
  colors: string[];
  culturalInspiration?: string;
  material?: string;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  stock: number;
  isVisible?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  phone: string;
}

export type OrderStatus = 'Pending Payment' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Unpaid';

export interface Order {
  id: string;
  trackingId: string;
  clientDetails: ClientDetails;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  riderId?: string;
  orderDate: string; // ISO string
  paymentMethod: string;
  isDeleted?: boolean;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
}

export interface Notification {
  isActive: boolean;
  title: string;
  message: string;
  link: string;
  linkLabel: string;
  displayType: 'popup' | 'modal';
}

// --- Icon Definitions ---
export const IconNames = [
  'Phone', 'Mail', 'MapPin'
] as const;
export type IconName = typeof IconNames[number];


// --- Store Settings ---
export interface ContactField {
  id: string;
  label: string;
  value: string;
  icon: IconName;
}

export interface SocialLink {
  id: string;
  name:string;
  url: string;
  iconUrl: string;
}

export interface ContactInfo {
  title: string;
  subtitle: string;
  contactFields: ContactField[];
  socialLinks: SocialLink[];
}

export interface OurStoryContent {
  title: string;
  text: string;
  imageUrl: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface PaymentMethodDetails {
  id: string;
  name: string;
  enabled: boolean;
  instructions: string;
  fields: CustomField[];
}

export interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FabSettings {
  enabled: boolean;
  iconUrl: string;
  whatsappIconUrl: string;
  callIconUrl: string;
}

export interface StoreSettings {
  paymentMethods: PaymentMethodDetails[];
  heroSlides: HeroSlide[];
  fab: FabSettings;
}