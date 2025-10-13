import React from 'react';

const Home = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="min-h-screen flex flex-col justify-center items-start px-8">
      <h1 className="text-7xl font-bold text-white text-left mb-6">
        Savor the Perfect<br />Brew!
      </h1>
      <p className="text-white text-left mb-8 text-lg max-w-lg">
        Crafted with care, roasted for character. let Begin <br /> your day with us .
      </p>

      {/* Buttons container */}
      <div className="flex gap-4">
        <button 
          onClick={() => scrollToSection('menu')}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Order Now
        </button>
        <button 
          onClick={() => scrollToSection('contact')}
          className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg border-2 border-white transition duration-300"
        >
          Contact
        </button>
      </div>
    </div>
  );
}

export default Home;