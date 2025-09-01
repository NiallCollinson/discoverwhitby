"use client";

import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-semibold text-gray-900 sm:text-6xl lg:text-7xl tracking-tight">
              Beds24 Booking Widget
            </h1>
            <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience our beautifully designed booking system powered by Beds24. 
              Seamlessly integrated with Apple-inspired aesthetics.
            </p>
            <div className="mt-12 flex justify-center gap-6">
              <a
                href="/properties"
                className="inline-flex items-center rounded-full bg-black px-8 py-4 text-base font-medium text-white hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book
              </a>
              <a
                href="/"
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Beds24 Widget Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              Live Booking Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of property booking with our beautifully integrated Beds24 system. 
              Real-time availability, instant pricing, and seamless booking.
            </p>
          </div>

          {/* Beds24 Widget Container with Apple-style Styling */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 overflow-hidden">
              {/* Custom Header for the Widget */}
              <div className="text-center mb-12 pb-8 border-b border-gray-100">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-6 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  Live Integration Active
                </div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Book Your Whitby Stay</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Select dates, choose your property, and book instantly with our premium booking experience</p>
              </div>
              
              {/* Custom Apple-Style Booking Widget */}
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Custom Apple-Style Widget</h4>
                  <p className="text-gray-600">Our own booking widget built with Apple design principles</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Property Selection */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Select Property</label>
                        <select className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900">
                          <option>Harbour View Cottage</option>
                          <option>Abbey Loft Apartment</option>
                          <option>Sea Breeze House</option>
                          <option>Whitby Lighthouse Suite</option>
                        </select>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h5 className="font-semibold text-gray-900 mb-3">Property Details</h5>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                            </svg>
                            2 bedrooms
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Sleeps 4
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            £120/night
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking Form */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Check-in</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Check-out</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900"
                            min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Guests</label>
                        <select className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900">
                          <option value="1">1 Guest</option>
                          <option value="2" selected>2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="5">5 Guests</option>
                          <option value="6">6 Guests</option>
                        </select>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">3 nights</span>
                          <span className="text-sm text-gray-600">£360</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Service fee</span>
                          <span className="text-sm text-gray-600">£18</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-semibold text-gray-900">£378</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beds24 Iframe Widget */}
              <div className="relative">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Live Beds24 Integration</h4>
                  <p className="text-gray-600">The actual Beds24 booking system</p>
                </div>
                
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                  <iframe 
                    src="https://beds24.com/booking2.php?ownerid=75780&amp;advancedays=0&amp;referer=iframe" 
                    width="100%" 
                    height="2000" 
                    className="w-full border-0"
                    style={{
                      maxWidth: '100%',
                      border: 'none',
                      overflow: 'auto',
                      minHeight: '2000px'
                    }}
                    title="Beds24 Booking Widget"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                
                {/* Fallback message in case iframe fails to load */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-50 text-gray-600 text-sm border border-gray-200">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Having trouble?{" "}
                    <a 
                      href="https://beds24.com/booking2.php?ownerid=75780&amp;referer=iframe" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-700 underline ml-1 font-medium"
                    >
                      Book directly on Beds24
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Custom Footer for the Widget */}
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">About This Integration</h4>
                    <p className="text-gray-600 leading-relaxed">
                      This booking widget is powered by Beds24, a professional property management system. 
                      We've seamlessly integrated it into our platform to provide you with a premium booking 
                      experience while maintaining our sophisticated design aesthetic and brand identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              What Makes Our Integration Special
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've seamlessly integrated the Beds24 platform while maintaining our sophisticated design aesthetic and premium user experience
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">Seamless Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                The Beds24 widget is beautifully embedded within our website design, maintaining perfect brand consistency and user experience
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">Real-time Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                Live calendar integration showing current availability, dynamic pricing, and instant booking capabilities
              </p>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">Professional System</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by Beds24's industry-leading property management and booking platform with enterprise-grade reliability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-semibold text-white mb-6 tracking-tight">
            Ready to Experience the Full Platform?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Explore our complete property collection and discover how our beautifully integrated Beds24 system 
            transforms your holiday planning experience with premium design and seamless functionality.
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="/properties"
              className="inline-flex items-center rounded-full bg-black px-10 py-5 text-lg font-medium text-white hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Book
            </a>
            <a
              href="/"
              className="inline-flex items-center rounded-full border-2 border-gray-600 bg-transparent px-10 py-5 text-lg font-medium text-white hover:bg-gray-800 hover:border-gray-700 transition-all duration-200"
            >
              Return Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
