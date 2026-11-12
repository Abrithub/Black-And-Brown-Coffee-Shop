/**
 * Seeds the coffee menu (Beverage category) into the database.
 * Run: node scripts/seedMenu.js
 */
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
  password: String(process.env.PG_PASSWORD || 'postgres'),
});

const { rows } = await pool.query("SELECT COUNT(*) FROM coffees WHERE category='Beverage'");
if (Number(rows[0].count) > 0) {
  console.log(`ℹ️  ${rows[0].count} menu items already exist. Skipping.`);
  await pool.end();
  process.exit(0);
}

const menuItems = [
  { name: 'Ethiopian Yirgacheffe', origin: 'Yirgacheffe, Ethiopia', price: 110, description: 'Floral and citrus notes with a delicate body', image: 'img/yirga ceffe.png', featured: true,  rating: 4.9, roast_level: 'Light',  flavor_profile: ['Floral','Citrus','Delicate'] },
  { name: 'Sidamo Coffee',         origin: 'Sidamo, Ethiopia',      price: 100, description: 'Wine-like characteristics with berry undertones', image: 'img/sidama.jpg', featured: true, rating: 4.8, roast_level: 'Medium', flavor_profile: ['Wine','Berry'] },
  { name: 'Harrar Wild Coffee',    origin: 'Harrar, Ethiopia',      price: 110, description: 'Bold and wild with mocha flavor',              image: 'img/harar wild.jpg', featured: true, rating: 4.7, roast_level: 'Dark',   flavor_profile: ['Bold','Mocha'] },
  { name: 'Jimma Special Blend',   origin: 'Jimma, Ethiopia',       price: 130, description: 'Local blend with chocolate and nutty notes',   image: 'img/jimma blend.jpg', featured: false, rating: 4.6, roast_level: 'Medium', flavor_profile: ['Chocolate','Nutty'] },
  { name: 'Espresso Classic',      origin: 'Blend',                 price: 180, description: 'Rich and intense traditional espresso',        image: 'img/Espresso Coffee Recipe.jpg', featured: false, rating: 4.5, roast_level: 'Dark' },
  { name: 'Macchiato',             origin: 'Italian Style',         price: 160, description: 'Espresso with a dollop of steamed milk',       image: 'img/Miccatto.png', featured: false, rating: 4.4 },
  { name: 'Cappuccino',            origin: 'Italian Style',         price: 220, description: 'Perfect balance of espresso, milk, and foam',  image: 'img/Cappuccino.jpg', featured: false, rating: 4.6 },
  { name: 'Latte Art',             origin: 'Specialty',             price: 150, description: 'Smooth latte with beautiful art presentation', image: 'img/jimma blend.jpg', featured: true, rating: 4.8 },
  { name: 'Cold Brew',             origin: 'Specialty',             price: 180, description: 'Smooth cold brew with low acidity',           image: 'img/cold brrew.png', featured: false, rating: 4.3 },
  { name: 'Turkish Coffee',        origin: 'Middle Eastern',        price: 140, description: 'Strong and aromatic traditional preparation',  image: 'img/turk.png', featured: false, rating: 4.7 },
  { name: 'Mocha Delight',         origin: 'Specialty',             price: 230, description: 'Chocolate-infused coffee with whipped cream', image: 'img/mocca.png', featured: true, rating: 4.5, flavor_profile: ['Chocolate','Cream'] },
  { name: 'Vanilla Latte',         origin: 'Specialty',             price: 220, description: 'Smooth latte with natural vanilla flavor',    image: 'img/Screenshot (821).png', featured: false, rating: 4.4, flavor_profile: ['Vanilla','Smooth'] },
];

for (const item of menuItems) {
  await pool.query(
    `INSERT INTO coffees (name, origin, price, description, image, category, rating, featured, roast_level, flavor_profile, stock)
     VALUES ($1,$2,$3,$4,$5,'Beverage',$6,$7,$8,$9,99)`,
    [item.name, item.origin, item.price, item.description, item.image,
     item.rating || 0, item.featured || false, item.roast_level || '', item.flavor_profile || []]
  );
}

console.log(`✅ Seeded ${menuItems.length} menu items (Beverage category)!`);
await pool.end();
process.exit(0);
