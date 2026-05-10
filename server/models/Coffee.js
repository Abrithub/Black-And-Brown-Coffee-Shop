import mongoose from "mongoose";

const coffeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coffee name is required'],
      trim: true
    },
    origin: {
      type: String,
      default: "Unknown",
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['Coffee Beans', 'Brewing Equipment', 'Accessories', 'Additives', 'Coffee Capsules', 'Subscription', 'Decor', 'Beverage'],
      default: 'Beverage'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    stock: {
      type: Number,
      min: 0,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    weight: {
      type: String,
      trim: true
    },
    roastLevel: {
      type: String,
      enum: ['Light', 'Medium', 'Dark', ''],
      default: ''
    },
    flavorProfile: {
      type: [String],
      default: []
    },
    material: {
      type: String,
      trim: true
    },
    capacity: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Coffee", coffeeSchema);
