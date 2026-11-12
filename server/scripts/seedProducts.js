import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import pg from 'pg';

const pool = new pg.Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'coffeedb',
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASSWORD || '',
});

const { rows } = await pool.query('SELECT COUNT(*) FROM coffees');
if (Number(rows[0].count) > 0) {
  console.log(`ℹ️  ${rows[0].count} products already exist. Skipping seed.`);
  await pool.end();
  process.exit(0);
}

const products = [
  { name: 'Premium Coffee Beans Pack', category: 'Coffee Beans', price: 450, origin: 'Ethiopia', description: 'Freshly roasted premium coffee beans from Ethiopian highlands', image: 'img/pack.jpg', featured: true, rating: 4.9, weight: '670g', roast_level: 'Medium', flavor_profile: ['Floral','Citrus','Berry'], stock: 25 },
  { name: 'Artisan Coffee Mug Set', category: 'Accessories', price: 820, origin: 'Local Artisan', description: 'Handcrafted ceramic mugs perfect for your coffee experience', image: 'img/Set of 4 Artisan Mugs.jpg', featured: true, rating: 4.8, stock: 15 },
  { name: 'French Press Brewer', category: 'Brewing Equipment', price: 5800, origin: 'Italy', description: 'Professional French press for the perfect coffee extraction', image: 'img/Small Frenchpress bewer.jpg', featured: false, rating: 4.7, stock: 8 },
  { name: 'Coffee Grinder Pro', category: 'Brewing Equipment', price: 10890, origin: 'Germany', description: 'Adjustable burr grinder for consistent coffee grounds', image: 'img/Coffee Grinder.jpg', featured: true, rating: 4.9, stock: 12 },
  { name: 'Ethiopian Single Origin', category: 'Coffee Beans', price: 720, origin: 'Yirgacheffe, Ethiopia', description: 'Single origin beans from the birthplace of coffee', image: 'img/Ethiopian Yirgacheffe - Rare Yirgacheffe Coffee.jpg', featured: false, rating: 4.8, weight: '500g', roast_level: 'Light', flavor_profile: ['Jasmine','Lemon','Tea-like'], stock: 18 },
  { name: 'Coffee Syrup Collection', category: 'Additives', price: 280, origin: 'France', description: 'Natural flavored syrups to enhance your coffee experience', image: 'img/Monin coffee syrup.jpg', featured: false, rating: 4.6, stock: 30 },
  { name: 'Portable Espresso Maker', category: 'Brewing Equipment', price: 3320, origin: 'USA', description: 'Compact espresso maker for coffee on the go', image: 'img/Espresso Machine.jpg', featured: true, rating: 4.5, stock: 10 },
  { name: 'Organic Coffee Capsules', category: 'Coffee Capsules', price: 380, origin: 'Brazil Blend', description: 'Eco-friendly coffee capsules compatible with most machines', image: 'img/Organic Ethiopia Decaf - Espresso.jpg', featured: false, rating: 4.4, roast_level: 'Dark', stock: 40 },
  { name: 'Barista Tool Kit', category: 'Accessories', price: 8650, origin: 'Italy', description: 'Complete set of professional barista tools', image: 'img/Breville Espresso Machine Accessories Kit.jpg', featured: true, rating: 4.7, stock: 6 },
  { name: 'Cold Brew Kit', category: 'Brewing Equipment', price: 4200, origin: 'Japan', description: 'Everything you need to make perfect cold brew at home', image: 'img/OXO Cold Brew Kit.jpg', featured: false, rating: 4.6, stock: 14 },
  { name: 'Coffee Subscription Box', category: 'Subscription', price: 1200, origin: 'Various Origins', description: 'Monthly box with 500g bag, 250g coffee, 2 mugs and accessories', image: 'img/subscriotion box.jpg', featured: true, rating: 4.9, stock: 50 },
  { name: 'Coffee Art Prints', category: 'Decor', price: 1800, origin: 'Local Artists', description: 'Beautiful coffee-themed art prints for your space', image: 'img/arts.jpg', featured: false, rating: 4.3, stock: 25 },
];

for (const p of products) {
  await pool.query(
    `INSERT INTO coffees
       (name,origin,price,description,image,category,rating,stock,featured,
        weight,roast_level,flavor_profile)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      p.name, p.origin || 'Unknown', p.price, p.description, p.image,
      p.category, p.rating || 0, p.stock || 0, p.featured || false,
      p.weight || null, p.roast_level || '', p.flavor_profile || [],
    ]
  );
}

console.log(`✅ Seeded ${products.length} products!`);
await pool.end();
process.exit(0);
