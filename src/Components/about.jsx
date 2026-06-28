import React from 'react'
import "../index.css"

const About = () => {
  return (
    <div className="font-intel flex flex-col justify-center items-center mt-[100px] text-white px-10 pb-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl mb-8 leading-tight">
          About <span className="text-yellow-500">CoinScope</span>
        </h1>
        
        <p className="text-xl mb-12 text-gray-300 leading-relaxed">
          CoinScope is a comprehensive cryptocurrency tracking and analysis platform. Our mission is to provide accessible, real-time data and powerful tools for both new and experienced investors in the digital asset market.
        </p>

        <div className="bg-gray-800 bg-opacity-80 p-8 rounded-lg border-2 border-gray-600 hover:border-yellow-500 hover:bg-gray-700 hover:bg-opacity-90 transition-all duration-300 shadow-lg">
          <h3 className="text-3xl font-semibold mb-6 text-yellow-500">Our Vision</h3>
          <p className="text-gray-200 leading-relaxed">
            We believe in a decentralized future where access to financial information is open and transparent. CoinScope is our contribution to this vision, empowering users with the knowledge they need to navigate the complexities of the cryptocurrency landscape.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About;
