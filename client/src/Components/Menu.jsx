import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import api from '../utils/api';

// Fallback menu shown while DB loads or if API is unreachable
const FALLBACK_MENU = [
  { id: 1,  name: 'Ethiopian Yirgacheffe', origin: 'Yirgacheffe, Ethiopia', price: 110, description: 'Floral and citrus notes with a delicate body',           image: 'img/yirga ceffe.png',               featured: true,  rating: 4.9, roastLevel: 'Light'  },
  { id: 2,  name: 'Sidamo Coffee',          origin: 'Sidamo, Ethiopia',      price: 100, description: 'Wine-like characteristics with berry undertones',       image: 'img/sidama.jpg',                     featured: true,  rating: 4.8, roastLevel: 'Medium' },
  { id: 3,  name: 'Harrar Wild Coffee',     origin: 'Harrar, Ethiopia',      price: 110, description: 'Bold and wild with mocha flavor',                       image: 'img/harar wild.jpg',                 featured: true,  rating: 4.7, roastLevel: 'Dark'   },
  { id: 4,  name: 'Jimma Special Blend',    origin: 'Jimma, Ethiopia',       price: 130, description: 'Local blend with chocolate and nutty notes',            image: 'img/jimma blend.jpg',                featured: false, rating: 4.6, roastLevel: 'Medium' },
  { id: 5,  name: 'Espresso Classic',       origin: 'Blend',                 price: 180, description: 'Rich and intense traditional espresso',                 image: 'img/Espresso Coffee Recipe.jpg',     featured: false, rating: 4.5, roastLevel: 'Dark'   },
  { id: 6,  name: 'Macchiato',              origin: 'Italian Style',         price: 160, description: 'Espresso with a dollop of steamed milk',                image: 'img/Miccatto.png',                   featured: false, rating: 4.4 },
  { id: 7,  name: 'Cappuccino',             origin: 'Italian Style',         price: 220, description: 'Perfect balance of espresso, milk, and foam',           image: 'img/Cappuccino.jpg',                 featured: false, rating: 4.6 },
  { id: 8,  name: 'Latte Art',              origin: 'Specialty',             price: 150, description: 'Smooth latte with beautiful art presentation',          image: 'img/jimma blend.jpg',                featured: true,  rating: 4.8 },
  { id: 9,  name: 'Cold Brew',              origin: 'Specialty',             price: 180, description: 'Smooth cold brew with low acidity',                     image: 'img/cold brrew.png',                 featured: false, rating: 4.3 },
  { id: 10, name: 'Turkish Coffee',         origin: 'Middle Eastern',        price: 140, description: 'Strong and aromatic traditional preparation',           image: 'img/turk.png',                       featured: false, rating: 4.7 },
  { id: 11, name: 'Mocha Delight',          origin: 'Specialty',             price: 230, description: 'Chocolate-infused coffee with whipped cream',           image: 'img/mocca.png',                      featured: true,  rating: 4.5 },
  { id: 12, name: 'Vanilla Latte',          origin: 'Specialty',             price: 220, description: 'Smooth latte with natural vanilla flavor',              image: 'img/Screenshot (821).png',           featured: false, rating: 4.4 },
];

const Menu = () => {
  const { addToCart } = useCart();
  const { t, lang } = useLang();
  const [filter, setFilter] = useState('all');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [menuItems, setMenuItems] = useState(FALLBACK_MENU);
  const [loading, setLoading] = useState(true);

  const exchangeRate = 144.5;

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get('/api/coffees?category=Beverage');
        const items = res.data?.coffees || [];
        if (items.length > 0) {
          setMenuItems(items);
        }
        // If DB has no Beverage items yet, keep the fallback — don't show empty
      } catch {
        // Keep fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const calculateDollarPrice = (price) => (price / exchangeRate).toFixed(2);

  const filteredItems = () => {
    switch (filter) {
      case 'featured':    return menuItems.filter(c => c.featured);
      case 'lightRoast':  return menuItems.filter(c => c.roastLevel === 'Light');
      case 'mediumRoast': return menuItems.filter(c => c.roastLevel === 'Medium');
      case 'darkRoast':   return menuItems.filter(c => c.roastLevel === 'Dark');
      case 'lowPrice':    return menuItems.filter(c => c.price <= 150);
      case 'mediumPrice': return menuItems.filter(c => c.price > 150 && c.price <= 200);
      case 'highPrice':   return menuItems.filter(c => c.price > 200);
      case 'highRating':  return menuItems.filter(c => c.rating >= 4.7);
      default:            return menuItems;
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < full ? 'text-yellow-400' : 'text-gray-500'}>★</span>
    ));
  };

  return (
    <div id="menu" className="bg-[#45291B] py-12 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-[#C19976]">
              {lang === 'am' ? 'የቡና ምናሌ' : 'Our Coffee Menu'}
            </h1>
            <p className="text-gray-300">
              {lang === 'am' ? 'ከሐበሻ ቡና ቤት ቡናዎቻችን' : 'Handcrafted beverages from the finest Ethiopian beans'}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {/* Roast dropdown */}
            <div className="relative">
              <button
                className="bg-[#2A1A10] border border-[#5D4030] rounded-lg px-4 py-2 flex items-center gap-2 hover:border-[#C19976] text-white text-sm"
                onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowPriceDropdown(false); }}
              >
                {lang === 'am' ? 'ዓይነት' : 'Roast'} ▾
              </button>
              {showTypeDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-[#2A1A10] rounded-lg shadow-lg z-20 border border-[#5D4030]">
                  {[
                    ['lightRoast',  lang === 'am' ? 'ቀላል ሮስት' : 'Light Roast'],
                    ['mediumRoast', lang === 'am' ? 'መካከለኛ ሮስት' : 'Medium Roast'],
                    ['darkRoast',   lang === 'am' ? 'ጥቁር ሮስት' : 'Dark Roast'],
                  ].map(([val, label]) => (
                    <button key={val} onClick={() => { setFilter(val); setShowTypeDropdown(false); }}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-black w-full text-left">
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price dropdown */}
            <div className="relative">
              <button
                className="bg-[#2A1A10] border border-[#5D4030] rounded-lg px-4 py-2 flex items-center gap-2 hover:border-[#C19976] text-white text-sm"
                onClick={() => { setShowPriceDropdown(!showPriceDropdown); setShowTypeDropdown(false); }}
              >
                {lang === 'am' ? 'ዋጋ' : 'Price'} ▾
              </button>
              {showPriceDropdown && (
                <div className="absolute right-0 mt-1 w-44 bg-[#2A1A10] rounded-lg shadow-lg z-20 border border-[#5D4030]">
                  {[
                    ['lowPrice',    lang === 'am' ? 'ከ150 ብር በታች' : 'Under 150 birr'],
                    ['mediumPrice', lang === 'am' ? '150–200 ብር'  : '150–200 birr'],
                    ['highPrice',   lang === 'am' ? 'ከ200 ብር በላይ' : 'Over 200 birr'],
                  ].map(([val, label]) => (
                    <button key={val} onClick={() => { setFilter(val); setShowPriceDropdown(false); }}
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#C19976] hover:text-black w-full text-left">
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg border text-sm ${filter === 'featured' ? 'bg-[#C19976] text-black border-[#C19976]' : 'bg-[#2A1A10] text-gray-200 border-[#5D4030] hover:border-[#C19976]'}`}>
              {t('featured')}
            </button>
            <button onClick={() => setFilter('highRating')}
              className={`px-4 py-2 rounded-lg border text-sm ${filter === 'highRating' ? 'bg-[#C19976] text-black border-[#C19976]' : 'bg-[#2A1A10] text-gray-200 border-[#5D4030] hover:border-[#C19976]'}`}>
              {lang === 'am' ? 'ከፍተኛ ደረጃ' : 'Top Rated'}
            </button>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 text-sm hover:border-[#C19976]">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Exchange rate */}
        <div className="bg-[#C19976]/20 border border-[#C19976]/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-[#C19976] font-medium text-sm">
            {lang === 'am' ? `የምንዛሪ ምጣኔ: 1$ = ${exchangeRate} ብር` : `Exchange Rate: 1$ = ${exchangeRate} birr`}
          </p>
        </div>

        {/* Loading shimmer */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#2A1A10] rounded-lg h-72 animate-pulse border border-[#5D4030]" />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems().map(item => (
              <div key={item.id || item._id}
                className="bg-[#2A1A10] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition border border-[#5D4030]">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image || 'img/pack.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'img/pack.jpg'; }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-[#C19976] leading-tight">{item.name}</h3>
                    {item.featured && (
                      <span className="bg-[#C19976] text-black text-xs px-2 py-0.5 rounded-full ml-1 shrink-0">
                        {t('featured')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mb-1 gap-1">
                    {item.roastLevel && <><span>{item.roastLevel} Roast</span><span>•</span></>}
                    <span>{item.origin}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-gray-300 text-sm font-semibold">{item.rating}</span>
                    <div className="flex text-sm">{renderStars(item.rating)}</div>
                  </div>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => addToCart({ ...item, id: item.id || item._id })}
                      className="bg-[#C19976] text-black px-3 py-2 rounded-lg hover:bg-[#b38966] transition font-semibold text-sm"
                    >
                      {t('addToCart')}
                    </button>
                    <div className="text-right">
                      <p className="text-[#C19976] font-bold text-sm">{item.price} {lang === 'am' ? 'ብር' : 'birr'}</p>
                      <p className="text-gray-500 text-xs">(${calculateDollarPrice(item.price)})</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filteredItems().length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl">☕ {lang === 'am' ? 'ምንም አልተገኘም' : 'No items found'}</p>
            <button onClick={() => setFilter('all')} className="mt-3 text-[#C19976] underline text-sm">
              {lang === 'am' ? 'ሁሉንም አሳይ' : 'Show all'}
            </button>
          </div>
        )}

        {/* Special offer */}
        <div className="mt-12 bg-gradient-to-r from-[#2A1A10] to-[#45291B] rounded-lg p-6 border border-[#C19976]/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-[#C19976]">
                {lang === 'am' ? 'የቡና ቀመስ ዝግጅት' : 'Special Coffee Tasting Event'}
              </h3>
              <p className="text-gray-300">
                {lang === 'am'
                  ? 'በየሳምንቱ አርብ ወደ ልዩ ቡና ቀመስ ዝግጅታችን ይቀላቀሉ'
                  : 'Join us every Friday for our exclusive Ethiopian coffee tasting experience'}
              </p>
            </div>
            <button className="bg-[#C19976] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#b38966] transition whitespace-nowrap">
              {lang === 'am' ? 'ቦታ ያስይዙ' : 'Reserve Your Spot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
