import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI not found in .env');
    process.exit(1);
}

await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
console.log('✅ MongoDB connected');

// Inline User schema to avoid any import chain issues
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const exists = await User.findOne({ role: 'admin' });
if (exists) {
    console.log('ℹ️  Admin already exists:', exists.email);
    await mongoose.disconnect();
    process.exit(0);
}

const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash('admin123', salt);

await User.create({
    name: 'admin',
    email: 'admin@coffeeshop.com',
    password: hashed,
    role: 'admin',
});

console.log('✅ Admin created!');
console.log('   Email:    admin@coffeeshop.com');
console.log('   Password: admin123');
console.log('⚠️  Change the password after first login!');

await mongoose.disconnect();
process.exit(0);
