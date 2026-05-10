import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
console.log('✅ Connected');

const coffeeSchema = new mongoose.Schema({
  name: String, origin: String, price: Number, description: String,
  image: String, category: String, rating: Number, stock: Number,
  featured: Boolean, weight: String, roastLevel: String, flavorProfile: [String],
}, { timestamps: true });

const Coffee = mongoose.models.Coffee || mongoose.model('Coffee', coffeeSchema);

const existing = await Coffee.countDocuments();
if (existing > 0) {
  console.log(`ℹ️  ${existing} products already exist. Skipping seed.`);
  await mongoose.disconnect();
  process.exit(0);
}

const products = [
  { name: 'Premium Coffee Beans Pack', category: 'Coffee Beans', price: 450, origin: 'Ethiopia', description: 'Freshly roasted premium coffee beans from Ethiopian highlands', image: 'img/pack.jpg', featured: true, rating: 4.9, weight: '670g', roastLevel: 'Medium', flavorProfile: ['Floral', 'Citrus', 'Berry'], stock: 25 },
  { name: 'Artisan Coffee Mug Set', category: 'Accessories', price: 820, origin: 'Local Artisan', description: 'Handcrafted ceramic mugs perfect for your coffee experience', image: 'img/Set of 4 Artisan Mugs.jpg', featured: true, rating: 4.8, stock: 15 },
  { name: 'French Press Brewer', category: 'Brewing Equipment', price: 5800, origin: 'Italy', description: 'Professional French press for the perfect coffee extraction', image: 'img/Small Frenchpress bewer.jpg', featured: false, rating: 4.7, stock: 8 },
  { name: 'Coffee Grinder Pro', category: 'Brewing Equipment', price: 10890, origin: 'Germany', description: 'Adjustable burr grinder for consistent coffee grounds', image: 'img/Coffee Grinder.jpg', featured: true, rating: 4.9, stock: 12 },
  { name: 'Ethiopian Single Origin', category: 'Coffee Beans', price: 720, origin: 'Yirgacheffe, Ethiopia', description: 'Single origin beans from the birthplace of coffee', image: 'img/Ethiopian Yirgacheffe - Rare Yirgacheffe Coffee.jpg', featured: false, rating: 4.8, weight: '500g', roastLevel: 'Light', flavorProfile: ['Jasmine', 'Lemon', 'Tea-like'], stock: 18 },
  { name: 'Coffee Syrup Collection', category: 'Additives', price: 280, origin: 'France', description: 'Natural flavored syrups to enhance your coffee experience', image: 'img/Monin coffee syrup.jpg', featured: false, rating: 4.6, stock: 30 },
  { name: 'Portable Espresso Maker', category: 'Brewing Equipment', price: 3320, origin: 'USA', description: 'Compact espresso maker for coffee on the go', image: 'img/Espresso Machine.jpg', featured: true, rating: 4.5, stock: 10 },
  { name: 'Organic Coffee Capsules', category: 'Coffee Capsules', price: 380, origin: 'Brazil Blend', description: 'Eco-friendly coffee capsules compatible with most machines', image: 'img/Organic Ethiopia Decaf - Espresso.jpg', featured: false, rating: 4.4, roastLevel: 'Dark', stock: 40 },
  { name: 'Barista Tool Kit', category: 'Accessories', price: 8650, origin: 'Italy', description: 'Complete set of professional barista tools', image: 'img/Breville Espresso Machine Accessories Kit.jpg', featured: true, rating: 4.7, stock: 6 },
  { name: 'Cold Brew Kit', category: 'Brewing Equipment', price: 4200, origin: 'Japan', description: 'Everything you need to make perfect cold brew at home', image: 'img/OXO Cold Brew Kit.jpg', featured: false, rating: 4.6, stock: 14 },
  { name: 'Coffee Subscription Box', category: 'Subscription', price: 1200, origin: 'Various Origins', description: 'Monthly box with 500g bag, 250g coffee, 2 mugs and accessories', image: 'img/subscriotion box.jpg', featured: true, rating: 4.9, stock: 50 },
  { name: 'Coffee Art Prints', category: 'Decor', price: 1800, origin: 'Local Artists', description: 'Beautiful coffee-themed art prints for your space', image: 'img/arts.jpg', featured: false, rating: 4.3, stock: 25 },
];

await Coffee.insertMany(products);
console.log(`✅ Seeded ${products.length} products!`);
await mongoose.disconnect();
process.exit(0);
