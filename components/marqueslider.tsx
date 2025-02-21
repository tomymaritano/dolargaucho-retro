// components/MarqueeSlider.tsx
import React from 'react';

const logos = [
  '/logos/bitcoin.svg',
  '/logos/ethereum.svg',
  '/logos/binance.svg',
  '/logos/solana.svg',
  '/logos/cardano.svg',
  '/logos/polkadot.svg',
];

const MarqueeSlider: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-gray-200 py-6 border-t border-gray-600 shadow-md">
      {/* Efecto de fade en los costados */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-200 to-transparent pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-200 to-transparent pointer-events-none"></div>
      
      <div className="flex space-x-24 animate-marquee">
        {logos.map((logo, index) => (
          <img key={index} src={logo} alt="logo" className="h-12 w-auto opacity-90 hover:opacity-100 transition-all duration-300 filter drop-shadow-lg border border-gray-600 p-2 bg-white" />
        ))}
        {logos.map((logo, index) => (
          <img key={index + logos.length} src={logo} alt="logo" className="h-12 w-auto opacity-90 hover:opacity-100 transition-all duration-300 filter drop-shadow-lg border border-gray-600 p-2 bg-white" />
        ))}
      </div>
    </div>
  );
};

export default MarqueeSlider;