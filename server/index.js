import dotenv from 'dotenv';
dotenv.config();

import connectDB from './database/connectdb.js';
import app from './app.js';

await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
