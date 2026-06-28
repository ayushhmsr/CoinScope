import React from 'react'; 
import "../index.css"; 

const Pricing = () => { 
  const plans = [ 
    {
      name: "Free", 
      price: "$0", 
      period: "/month", 
      features: [ 
        "Basic price tracking",
        "Portfolio overview",
        "Community support",
        "Limited alerts"
      ],
      popular: false 
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      features: [
        "Advanced analytics",
        "Unlimited alerts",
        "Portfolio insights",
        "Priority support",
        "API access",
        "Custom dashboards"
      ],
      popular: true 
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "/month",
      features: [
        "All Pro features",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "Advanced security",
        "Team collaboration"
      ],
      popular: false
    }
  ];

  return ( 
    <div className="font-intel flex flex-col justify-center items-center mt-[100px] text-white px-10 pb-16"> 
      <div className="max-w-6xl"> 
        <h1 className="text-6xl mb-8 leading-tight text-center"> 
          <span className="text-yellow-500">We are working on it</span>
        </h1>
        
        {/*
        <p className="text-xl mb-16 text-gray-300 leading-relaxed text-center"> 
          Select the perfect plan for your cryptocurrency tracking and analysis needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
          {plans.map((plan, index) => ( 
            <div 
              key={index} 
              className={`bg-gray-800 bg-opacity-80 p-8 rounded-lg border-2 ${
                plan.popular 
                  ? 'border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50' 
                  : 'border-gray-600' 
              } hover:border-yellow-400 hover:bg-gray-700 hover:bg-opacity-90 transition-all duration-300 hover:transform hover:scale-105 relative shadow-lg`}
            >
              {plan.popular && ( 
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold"> 
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8"> 
                <h3 className="text-2xl font-semibold mb-4 text-yellow-500">{plan.name}</h3> 
                <div className="mb-4"> 
                  <span className="text-4xl font-bold">{plan.price}</span> 
                  <span className="text-gray-400">{plan.period}</span> 
                </div>
              </div>
              
              <ul className="space-y-3 mb-8"> 
                {plan.features.map((feature, featureIndex) => ( 
                  <li key={featureIndex} className="flex items-center text-gray-300"> 
                    <span className="text-yellow-500 mr-3">✓</span> 
                    {feature} 
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                  : 'bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black' 
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
        */}
      </div>
    </div>
  );
};

export default Pricing; 