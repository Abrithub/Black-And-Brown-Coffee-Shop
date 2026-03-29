import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext"; // ✅ for cart functionality
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  const exchangeRate = 144.5;

  // ✅ Updated Product data (your latest)
  const coffeeProducts = [
    {
      id: 1,
      name: "Premium Coffee Beans Pack",
      category: "Coffee Beans",
      price: 450,
      description: "Freshly roasted premium coffee beans from Ethiopian highlands",
      origin: "Ethiopia",
      image: "img/pack.jpg",
      featured: true,
      rating: 4.9,
      weight: "670g",
      roastLevel: "Medium",
      flavorProfile: ["Floral", "Citrus", "Berry"],
      stock: 25
    },
    {
      id: 2,
      name: "Artisan Coffee Mug Set",
      category: "Accessories",
      price: 820,
      description: "Handcrafted ceramic mugs perfect for your coffee experience",
      origin: "Local Artisan",
      image: "img/Set of 4 Artisan Mugs.jpg",
      featured: true,
      rating: 4.8,
      weight: "Set of 4",
      material: "Ceramic",
      capacity: "350ml",
      stock: 15
    },
    {
      id: 3,
      name: "French Press Brewer",
      category: "Brewing Equipment",
      price: 5800,
      description: "Professional French press for the perfect coffee extraction",
      origin: "Italy",
      image: "img/Small Frenchpress bewer.jpg",
      featured: false,
      rating: 4.7,
      capacity: "1L",
      material: "Glass & Stainless Steel",
      stock: 8
    },
    {
      id: 4,
      name: "Coffee Grinder Pro",
      category: "Brewing Equipment",
      price: 10890,
      description: "Adjustable burr grinder for consistent coffee grounds",
      origin: "Germany",
      image: "img/Coffee Grinder.jpg",
      featured: true,
      rating: 4.9,
      type: "Burr Grinder",
      settings: "15 grind levels",
      stock: 12
    },
    {
      id: 5,
      name: "Ethiopian Single Origin",
      category: "Coffee Beans",
      price: 720,
      description: "Single origin beans from the birthplace of coffee",
      origin: "Yirgacheffe, Ethiopia",
      image: "img/Ethiopian Yirgacheffe - Rare Yirgacheffe Coffee.jpg",
      featured: false,
      rating: 4.8,
      weight: "500g",
      roastLevel: "Light",
      flavorProfile: ["Jasmine", "Lemon", "Tea-like"],
      stock: 18
    },
    {
      id: 6,
      name: "Coffee Syrup Collection",
      category: "Additives",
      price: 280,
      description: "Natural flavored syrups to enhance your coffee experience",
      origin: "France",
      image: "img/Monin coffee syrup.jpg",
      featured: false,
      rating: 4.6,
      flavors: ["Vanilla", "Caramel", "Hazelnut"],
      size: "250ml each",
      stock: 30
    },
    {
      id: 7,
      name: "Portable Espresso Maker",
      category: "Brewing Equipment",
      price: 3320,
      description: "Compact espresso maker for coffee on the go",
      origin: "USA",
      image: "img/Espresso Machine.jpg",
      featured: true,
      rating: 4.5,
      pressure: "15 bar",
      portable: true,
      stock: 10
    },
    {
      id: 8,
      name: "Organic Coffee Capsules",
      category: "Coffee Capsules",
      price: 380,
      description: "Eco-friendly coffee capsules compatible with most machines",
      origin: "Brazil Blend",
      image: "img/Organic Ethiopia Decaf - Espresso.jpg",
      featured: false,
      rating: 4.4,
      count: "20 capsules",
      roastLevel: "Medium-Dark",
      stock: 40
    },
    {
      id: 9,
      name: "Barista Tool Kit",
      category: "Accessories",
      price: 8650,
      description: "Complete set of professional barista tools",
      origin: "Italy",
      image: "img/Breville Espresso Machine Accessories Kit.jpg",
      featured: true,
      rating: 4.7,
      includes: ["Tamper", "Pitcher", "Thermometer", "Brush"],
      stock: 6
    },
    {
      id: 10,
      name: "Cold Brew Kit",
      category: "Brewing Equipment",
      price: 4200,
      description: "Everything you need to make perfect cold brew at home",
      origin: "Japan",
      image: "img/OXO Cold Brew Kit.jpg",
      featured: false,
      rating: 4.6,
      capacity: "1.5L",
      includes: ["Brewer", "Filter", "Recipe Book"],
      stock: 14
    },
    {
      id: 11,
      name: "Coffee Subscription Box",
      category: "Subscription",
      price: 1200,
      description: "Let get all together! one 500g bag of coffee ,250g of coffee and 2 coffee mugs and other 10 small pieces of coffee accessories.",
      origin: "Various Origins",
      image: "img/subscriotion box.jpg",
      featured: true,
      rating: 4.9,
      duration: "Monthly",
      includes: ["3 different beans", "Tasting notes", "Brewing guide"],
      stock: 50
    },
    {
      id: 12,
      name: "Coffee Art Prints",
      category: "Decor",
      price: 1800,
      description: "Beautiful coffee-themed art prints for your space",
      origin: "Local Artists",
      image: "img/arts.jpg",
      featured: false,
      rating: 4.3,
      size: "A3",
      framed: false,
      stock: 25
    }
  ];

  const calculateDollarPrice = (birrPrice) => (birrPrice / exchangeRate).toFixed(2);

  // ✅ Filter logic
  const filteredProducts = () => {
    switch (filter) {
      case "featured":
        return coffeeProducts.filter((p) => p.featured);
      case "coffeeBeans":
        return coffeeProducts.filter((p) => p.category === "Coffee Beans");
      case "brewingEquipment":
        return coffeeProducts.filter((p) => p.category === "Brewing Equipment");
      case "accessories":
        return coffeeProducts.filter((p) => p.category === "Accessories");
      case "additives":
        return coffeeProducts.filter((p) => p.category === "Additives");
      case "coffeeCapsules":
        return coffeeProducts.filter((p) => p.category === "Coffee Capsules");
      case "subscription":
        return coffeeProducts.filter((p) => p.category === "Subscription");
      case "decor":
        return coffeeProducts.filter((p) => p.category === "Decor");
      case "lowPrice":
        return coffeeProducts.filter((p) => p.price <= 1000);
      case "mediumPrice":
        return coffeeProducts.filter((p) => p.price > 1000 && p.price <= 5000);
      case "highPrice":
        return coffeeProducts.filter((p) => p.price > 5000);
      case "highRating":
        return coffeeProducts.filter((p) => p.rating >= 4.7);
      default:
        return coffeeProducts;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++)
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    if (half) stars.push(<span key="half" className="text-yellow-400">★</span>);
    for (let i = stars.length; i < 5; i++)
      stars.push(<span key={`e-${i}`} className="text-gray-400">★</span>);
    return stars;
  };

  const renderStock = (stock) => {
    if (stock > 20) return <span className="text-green-400">In Stock</span>;
    if (stock > 10) return <span className="text-yellow-400">Low Stock</span>;
    return <span className="text-red-400">Almost Gone</span>;
  };

  // ✅ Auto-close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target) &&
        priceRef.current &&
        !priceRef.current.contains(e.target)
      ) {
        setShowCategoryDropdown(false);
        setShowPriceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section id="products" className="bg-[#2A1A10] py-12 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#C19976]">
              Our Coffee Products
            </h1>
            <p className="text-gray-300">
              Shop our exclusive line of Ethiopian coffee products
            </p>
          </div>

          {/* ✅ Filters */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            {/* Category Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowPriceDropdown(false);
                }}
                className="flex items-center gap-2 bg-[#1a0f0a] border border-[#C19976] px-4 py-2 rounded-lg text-gray-200 hover:bg-[#C19976] hover:text-black transition"
              >
                Category
                <span className="text-sm">
                  {showCategoryDropdown ? "▲" : "▼"}
                </span>
              </button>

              {showCategoryDropdown && (
                <div className="absolute right-0 mt-2 bg-[#1a0f0a] border border-[#C19976] rounded-lg z-10 w-48">
                  {[
                    { value: "coffeeBeans", label: "Coffee Beans" },
                    { value: "brewingEquipment", label: "Brewing Equipment" },
                    { value: "accessories", label: "Accessories" },
                    { value: "additives", label: "Additives" },
                    { value: "coffeeCapsules", label: "Coffee Capsules" },
                    { value: "subscription", label: "Subscription" },
                    { value: "decor", label: "Decor" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setFilter(item.value);
                        setShowCategoryDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#C19976] hover:text-black"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative" ref={priceRef}>
              <button
                onClick={() => {
                  setShowPriceDropdown(!showPriceDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="flex items-center gap-2 bg-[#1a0f0a] border border-[#C19976] px-4 py-2 rounded-lg text-gray-200 hover:bg-[#C19976] hover:text-black transition"
              >
                Price
                <span className="text-sm">
                  {showPriceDropdown ? "▲" : "▼"}
                </span>
              </button>

              {showPriceDropdown && (
                <div className="absolute right-0 mt-2 bg-[#1a0f0a] border border-[#C19976] rounded-lg z-10 w-48">
                  <button
                    onClick={() => {
                      setFilter("lowPrice");
                      setShowPriceDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#C19976] hover:text-black"
                  >
                    Under 1000 birr (${calculateDollarPrice(1000)})
                  </button>
                  <button
                    onClick={() => {
                      setFilter("mediumPrice");
                      setShowPriceDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#C19976] hover:text-black"
                  >
                    1000–5000 birr
                  </button>
                  <button
                    onClick={() => {
                      setFilter("highPrice");
                      setShowPriceDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-[#C19976] hover:text-black"
                  >
                    Over 5000 birr
                  </button>
                </div>
              )}
            </div>

            {/* Quick buttons */}
            <button
              onClick={() => setFilter("featured")}
              className={`px-4 py-2 rounded-lg border ${filter === "featured"
                ? "bg-[#C19976] text-black border-[#C19976]"
                : "bg-[#1a0f0a] text-gray-200 border-[#5D4030] hover:border-[#C19976]"
                }`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilter("highRating")}
              className={`px-4 py-2 rounded-lg border ${filter === "highRating"
                ? "bg-[#C19976] text-black border-[#C19976]"
                : "bg-[#1a0f0a] text-gray-200 border-[#5D4030] hover:border-[#C19976]"
                }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts().map((product) => (
            <div
              key={product.id}
              className="bg-[#3b2315] rounded-lg shadow-lg border border-[#5D4030] overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#C19976]">{product.name}</h3>
                  {product.featured && (
                    <span className="bg-[#C19976] text-black text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-2">{product.description}</p>

                <div className="flex items-center mb-3">
                  <span className="text-gray-300 font-semibold mr-2">
                    {product.rating}
                  </span>
                  <div className="flex">{renderStars(product.rating)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      if (!user) {
                        window.dispatchEvent(new Event('requestAuth'));
                        return;
                      }
                      addToCart(product);
                    }}
                    className="bg-[#C19976] text-black px-4 py-2 rounded-lg hover:bg-[#b38966] transition font-semibold"
                  >
                    Add to Cart
                  </button>

                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-[#C19976] font-bold">{product.price} birr</p>
                    <p className="text-gray-500 text-xs">
                      ${calculateDollarPrice(product.price)}
                    </p>
                    {renderStock(product.stock)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;