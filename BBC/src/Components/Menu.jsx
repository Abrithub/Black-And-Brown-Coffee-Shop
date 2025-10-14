import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const { addToCart } = useCart();

  const [filter, setFilter] = useState('all');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  const exchangeRate = 144.5;

  const coffeeMenu = [
    { id: 1, name: "Ethiopian Yirgacheffe", type: "Light Roast", price: 110, description: "Floral and citrus notes with a delicate body", origin: "Yirgacheffe, Ethiopia", image: "img/yirga ceffe.png", featured: true, rating: 4.9 },
    { id: 2, name: "Sidamo Coffee", type: "Medium Roast", price: 100, description: "Wine-like characteristics with berry undertones", origin: "Sidamo, Ethiopia", image: "img/sidama.jpg", featured: true, rating: 4.8 },
    { id: 3, name: "Harrar Wild Coffee", type: "Dark Roast", price: 110, description: "Bold and wild with mocha flavor", origin: "Harrar, Ethiopia", image: "img/harar wild.jpg", featured: true, rating: 4.7 },
    { id: 4, name: "Jimma Special Blend", type: "Medium Roast", price: 130, description: "Local blend with chocolate and nutty notes", origin: "Jimma, Ethiopia", image: "img/jimma blend.jpg", featured: false, rating: 4.6 },
    { id: 5, name: "Espresso Classic", type: "Dark Roast", price: 180, description: "Rich and intense traditional espresso", origin: "Blend", image: "img/Espresso Coffee Recipe.jpg", featured: false, rating: 4.5 },
    { id: 6, name: "Macchiato", type: "Espresso", price: 160, description: "Espresso with a dollop of steamed milk", origin: "Italian Style", image: "img/Miccatto.png", featured: false, rating: 4.4 },
    { id: 7, name: "Cappuccino", type: "Milk Coffee", price: 220, description: "Perfect balance of espresso, milk, and foam", origin: "Italian Style", image: "img/Cappuccino.jpg", featured: false, rating: 4.6 },
    { id: 8, name: "Latte Art", type: "Milk Coffee", price: 150, description: "Smooth latte with beautiful art presentation", origin: "Specialty", image: "img/jimma blend.jpg", featured: true, rating: 4.8 },
    { id: 9, name: "Cold Brew", type: "Cold Coffee", price: 180, description: "Smooth cold brew with low acidity", origin: "Specialty", image: "img/cold brrew.png", featured: false, rating: 4.3 },
    { id: 10, name: "Turkish Coffee", type: "Traditional", price: 140, description: "Strong and aromatic traditional preparation", origin: "Middle Eastern", image: "img/turk.png", featured: false, rating: 4.7 },
    { id: 11, name: "Mocha Delight", type: "Flavored", price: 230, description: "Chocolate-infused coffee with whipped cream", origin: "Specialty", image: "img/mocca.png", featured: true, rating: 4.5 },
    { id: 12, name: "Vanilla Latte", type: "Flavored", price: 220, description: "Smooth latte with natural vanilla flavor", origin: "Specialty", image: "img/Screenshot (821).png", featured: false, rating: 4.4 }
  ];

  const calculateDollarPrice = (birrPrice) => (birrPrice / exchangeRate).toFixed(2);

  // ✅ Fixed filter keys to match cases correctly
  const filteredCoffee = () => {
    switch (filter) {
      case 'featured': return coffeeMenu.filter(c => c.featured);
      case 'lightRoast': return coffeeMenu.filter(c => c.type === "Light Roast");
      case 'mediumRoast': return coffeeMenu.filter(c => c.type === "Medium Roast");
      case 'darkRoast': return coffeeMenu.filter(c => c.type === "Dark Roast");
      case 'espresso': return coffeeMenu.filter(c => c.type === "Espresso");
      case 'milkCoffee': return coffeeMenu.filter(c => c.type === "Milk Coffee");
      case 'flavored': return coffeeMenu.filter(c => c.type === "Flavored");
      case 'lowPrice': return coffeeMenu.filter(c => c.price <= 150);
      case 'mediumPrice': return coffeeMenu.filter(c => c.price > 150 && c.price <= 200);
      case 'highPrice': return coffeeMenu.filter(c => c.price > 200);
      case 'highRating': return coffeeMenu.filter(c => c.rating >= 4.7);
      default: return coffeeMenu;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<span key={i} className="text-yellow-400">★</span>);
    if (half) stars.push(<span key="half" className="text-yellow-400">★</span>);
    for (let i = stars.length; i < 5; i++) stars.push(<span key={`e-${i}`} className="text-gray-400">★</span>);
    return stars;
  };

  return (
    <div id="menu" className="bg-[#45291B] py-12 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-left text-[#C19976]">Our Coffee Menu</h1>
            <p className="text-left text-gray-300">Handcrafted beverages from the finest Ethiopian beans</p>
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            {/* Type Dropdown */}
            <div className="relative">
              <button
                className="bg-[#2A1A10] border border-[#5D4030] rounded-lg px-4 py-2 flex items-center hover:border-[#C19976] text-white"
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowPriceDropdown(false);
                }}
              >
                <span className="mr-2">Type</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {showTypeDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-[#2A1A10] rounded-md shadow-lg z-10 border border-[#5D4030]">
                  <div className="py-1">
                    <button onClick={() => { setFilter('lightRoast'); setShowTypeDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Light Roast</button>
                    <button onClick={() => { setFilter('mediumRoast'); setShowTypeDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Medium Roast</button>
                    <button onClick={() => { setFilter('darkRoast'); setShowTypeDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Dark Roast</button>
                    <button onClick={() => { setFilter('espresso'); setShowTypeDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Espresso</button>
                    <button onClick={() => { setFilter('milkCoffee'); setShowTypeDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Milk Coffee</button>
                    <button onClick={() => { setFilter('flavored'); setShowTypeDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Flavored</button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative">
              <button
                className="bg-[#2A1A10] border border-[#5D4030] rounded-lg px-4 py-2 flex items-center hover:border-[#C19976] text-white"
                onClick={() => {
                  setShowPriceDropdown(!showPriceDropdown);
                  setShowTypeDropdown(false);
                }}
              >
                <span className="mr-2">Price</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {showPriceDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-[#2A1A10] rounded-md shadow-lg z-10 border border-[#5D4030]">
                  <div className="py-1">
                    <button onClick={() => { setFilter('lowPrice'); setShowPriceDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Under 150 birr</button>
                    <button onClick={() => { setFilter('mediumPrice'); setShowPriceDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">150–200 birr</button>
                    <button onClick={() => { setFilter('highPrice'); setShowPriceDropdown(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-gray-900 w-full text-left">Over 200 birr</button>
                  </div>
                </div>
              )}
            </div>

            {/* Featured + Top Rated */}
            <button className={`px-4 py-2 rounded-lg border ${filter === 'featured' ? 'bg-[#C19976] text-black border-[#C19976]' : 'bg-[#2A1A10] text-gray-200 border-[#5D4030] hover:border-[#C19976]'}`} onClick={() => setFilter('featured')}>Featured</button>
            <button className={`px-4 py-2 rounded-lg border ${filter === 'highRating' ? 'bg-[#C19976] text-black border-[#C19976]' : 'bg-[#2A1A10] text-gray-200 border-[#5D4030] hover:border-[#C19976]'}`} onClick={() => setFilter('highRating')}>Top Rated</button>
          </div>
        </div>

        {/* Currency Info */}
        <div className="bg-[#C19976]/20 border border-[#C19976]/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-[#C19976] font-medium">Exchange Rate: 1$ = 144.5 birr</p>
        </div>

        {/* Coffee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCoffee().map(coffee => (
            <div key={coffee.id} className="bg-[#2A1A10] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition border border-[#5D4030]">
              <div className="h-48 overflow-hidden">
                <img src={coffee.image} alt={coffee.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#C19976]">{coffee.name}</h3>
                  {coffee.featured && <span className="bg-[#C19976] text-black text-xs px-2 py-1 rounded-full">Featured</span>}
                </div>
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <span className="font-medium">{coffee.type}</span>
                  <span className="mx-2">•</span>
                  <span>{coffee.origin}</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-gray-300 font-semibold mr-2">{coffee.rating}</span>
                  <div className="flex">{renderStars(coffee.rating)}</div>
                </div>
                <p className="text-gray-400 text-sm mt-2">{coffee.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => addToCart(coffee)} // ✅ works now
                    className="bg-[#C19976] text-black px-4 py-2 rounded-lg hover:bg-[#b38966] transition font-semibold"
                  >
                    Add to Cart
                  </button>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-[#C19976] font-bold">
                      {coffee.price} birr <span className="text-gray-500 text-sm">(${calculateDollarPrice(coffee.price)})</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Offers */}
        <div className="mt-12 bg-gradient-to-r from-[#2A1A10] to-[#45291B] rounded-lg p-6 border border-[#C19976]/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-[#C19976]">Special Coffee Tasting Event</h3>
              <p className="text-gray-300">Join us every Friday for our exclusive Ethiopian coffee tasting experience</p>
            </div>
            <button className="mt-4 md:mt-0 bg-[#C19976] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#b38966] transition">
              Reserve Your Spot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
