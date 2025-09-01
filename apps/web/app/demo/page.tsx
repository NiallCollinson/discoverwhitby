"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Extend Window interface for global handler
declare global {
  interface Window {
    handlePropertyChange?: (propertyId: string) => void;
  }
}

export default function DemoPage() {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("demo-1");

  useEffect(() => {
    // Load Beds24 widget script
    const script = document.createElement("script");
    script.src = "https://www.beds24.com/widgets/booking-widget.js";
    script.async = true;
    script.onload = () => {
      setIsWidgetLoaded(true);
      // Initialize the widget after script loads
      initializeBeds24Widget();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedProperty]);

  const initializeBeds24Widget = () => {
    // This is a placeholder for the actual Beds24 widget initialization
    // In a real implementation, you would use the Beds24 widget API
    // For now, we'll create a custom styled booking form
    
    const widgetContainer = document.getElementById("beds24-widget");
    if (widgetContainer && isWidgetLoaded) {
      widgetContainer.innerHTML = `
        <div class="w-full max-w-4xl mx-auto">
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Book Your Stay</h3>
              <p class="text-gray-600">Experience our custom-styled Beds24 integration</p>
            </div>
            
            <div class="grid gap-6 md:grid-cols-2">
              <!-- Property Selection -->
              <div class="space-y-4">
                <label class="block text-sm font-medium text-gray-700">Select Property</label>
                <select 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onchange="window.handlePropertyChange && window.handlePropertyChange(this.value)"
                >
                  <option value="demo-1">Harbour View Cottage</option>
                  <option value="demo-2">Abbey Loft Apartment</option>
                  <option value="demo-3">Sea Breeze House</option>
                </select>
                
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-900 mb-2">Property Details</h4>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div>🏠 <span id="property-name">Harbour View Cottage</span></div>
                    <div>🛏️ <span id="property-beds">2</span> bedrooms</div>
                    <div>👥 Sleeps <span id="property-guests">4</span></div>
                    <div>💰 £<span id="property-price">120</span>/night</div>
                  </div>
                </div>
              </div>
              
              <!-- Booking Form -->
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                    <input 
                      type="date" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="${new Date().toISOString().split('T')[0]}"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                    <input 
                      type="date" 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="${new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="1">1 Guest</option>
                    <option value="2" selected>2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                  </select>
                </div>
                
                <button class="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Check Availability & Book
                </button>
              </div>
            </div>
            
            <div class="mt-8 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    This is a demonstration of our custom-styled Beds24 integration. 
                    In production, this would connect directly to the Beds24 API for 
                    real-time availability and booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add global handler for property changes
      window.handlePropertyChange = (propertyId: string) => {
        setSelectedProperty(propertyId);
        updatePropertyDetails(propertyId);
      };
      
      // Initialize property details
      updatePropertyDetails(selectedProperty);
    }
  };

  const updatePropertyDetails = (propertyId: string) => {
    const properties = {
      "demo-1": { name: "Harbour View Cottage", beds: 2, guests: 4, price: 120 },
      "demo-2": { name: "Abbey Loft Apartment", beds: 1, guests: 2, price: 90 },
      "demo-3": { name: "Sea Breeze House", beds: 3, guests: 6, price: 180 }
    };
    
    const property = properties[propertyId as keyof typeof properties];
    if (property) {
      const nameEl = document.getElementById("property-name");
      const bedsEl = document.getElementById("property-beds");
      const guestsEl = document.getElementById("property-guests");
      const priceEl = document.getElementById("property-price");
      
      if (nameEl) nameEl.textContent = property.name;
      if (bedsEl) bedsEl.textContent = property.beds.toString();
      if (guestsEl) guestsEl.textContent = property.guests.toString();
      if (priceEl) priceEl.textContent = property.price.toString();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Beds24 Booking Widget Demo
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our customized booking system powered by Beds24. See how seamlessly 
              we've integrated their widget with our own styling and branding.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                View All Properties
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Widget Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Try Our Customized Booking Widget
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This widget is fully integrated with our property management system and styled 
              to match our website design. Book your stay directly through our platform!
            </p>
          </div>

          {/* Beds24 Widget Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              {isWidgetLoaded ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Widget Loaded Successfully
                    </div>
                  </div>
                  
                  {/* Beds24 Widget will be inserted here */}
                  <div 
                    id="beds24-widget"
                    className="min-h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  >
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-lg font-medium">Beds24 Widget</p>
                      <p className="text-sm">The booking widget will appear here</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading Beds24 booking widget...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes Our Booking System Special
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've enhanced the Beds24 platform with our own customizations and integrations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Styling</h3>
              <p className="text-gray-600">
                Fully integrated with our website design, maintaining brand consistency
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Availability</h3>
              <p className="text-gray-600">
                Live calendar integration showing current availability and pricing
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Booking</h3>
              <p className="text-gray-600">
                Secure, direct booking through our platform with immediate confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience the Full Platform?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Explore our complete property collection and see how our custom booking system 
            enhances your holiday planning experience.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center rounded-md bg-white px-8 py-4 text-lg font-medium text-indigo-600 hover:bg-gray-100 transition-colors"
            >
              Browse All Properties
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-md border-2 border-white px-8 py-4 text-lg font-medium text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
