
# Afriblend - Modern African Fashion E-commerce Store

![Afriblend Logo](https://res.cloudinary.com/dwwvh34yi/image/upload/v1753865210/Afriblend_uyhbef.png)

Afriblend is a sophisticated e-commerce platform specializing in modern African fashion, accessories, and home decor. The store is designed to celebrate the richness of African design by blending traditional artistry with contemporary style. It features a beautiful, responsive storefront for customers and a comprehensive admin panel for store owners to manage products, orders, and site content.

---

## ✨ Features

### 🛍️ Customer-Facing Store
- **Beautiful Homepage:** Engaging hero section, featured products, and clear navigation.
- **Product Discovery:** Advanced filtering by category, price, size, color, and material.
- **Detailed Product Pages:** Multiple images, detailed descriptions, size/color selectors.
- **Shopping Cart & Checkout:** A seamless and intuitive purchasing process.
- **Order Tracking:** Customers can track their order status using their order ID, tracking ID, or phone number.
- **Responsive Design:** Fully optimized for a great experience on desktops, tablets, and mobile devices.
- **Dark Mode:** A beautiful, eye-friendly dark theme is available.

### ⚙️ Admin Panel
- **Secure Authentication:** Protected routes for store administrators.
- **Dashboard:** At-a-glance overview of sales, orders, and product counts.
- **Product Management:** Add, edit, and delete products, including images, stock levels, and visibility.
- **Order Management:** View all orders, update payment and fulfillment statuses, and dispatch to riders.
- **Category & Rider Management:** Easily manage product categories and delivery riders.
- **Content Management:** Update site content like FAQs, "Our Story," and contact information.
- **Site Settings:** Configure payment methods, hero section slides, and other site-wide settings.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase (Firestore, Authentication, Storage)
- **Deployment:** Vercel

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps. For a more detailed guide, see [SETUP.md](SETUP.md).

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/afriblend-esite.git
   cd afriblend-esite
   ```

2. **Install NPM packages:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root of the project.
   - Add your Firebase configuration. See [SETUP.md](SETUP.md) for instructions on how to get this.
   ```
   # No VITE_ prefix is needed for this variable in the context of this specific project setup.
   API_KEY="YOUR_GEMINI_API_KEY" 
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions are welcome! Please read [SETUP.md](SETUP.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
