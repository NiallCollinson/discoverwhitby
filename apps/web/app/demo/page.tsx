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
                className="inline-flex items-center rounded-full bg-gray-900 px-8 py-4 text-base font-medium text-white hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View All Properties
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
              
              {/* Beds24 Iframe Widget */}
              <div className="relative">
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
              className="inline-flex items-center rounded-full bg-white px-10 py-5 text-lg font-medium text-gray-900 hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse All Properties
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
