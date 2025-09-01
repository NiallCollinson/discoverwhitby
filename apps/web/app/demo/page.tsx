"use client";

import Link from "next/link";

export default function DemoPage() {
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
              Experience our customized booking system powered by Beds24. This is the actual 
              Beds24 booking widget integrated seamlessly with our website design.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="/properties"
                className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                View All Properties
              </a>
              <a
                href="/"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Beds24 Widget Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Beds24 Booking Widget
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This is the actual Beds24 booking system integrated directly into our website. 
              Book your stay with real-time availability and pricing!
            </p>
          </div>

          {/* Beds24 Widget Container with Custom Styling */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              {/* Custom Header for the Widget */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                      Live Beds24 Integration
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Whitby Stay</h3>
                <p className="text-gray-600">Select dates, choose your property, and book instantly</p>
              </div>
              
              {/* Beds24 Iframe Widget */}
              <div className="relative">
                <iframe 
                  src="https://beds24.com/booking2.php?ownerid=75780&amp;advancedays=0&amp;referer=iframe" 
                  width="100%" 
                  height="2000" 
                  className="w-full border-0 rounded-lg shadow-lg"
                  style={{
                    maxWidth: '100%',
                    border: 'none',
                    overflow: 'auto',
                    minHeight: '2000px'
                  }}
                  title="Beds24 Booking Widget"
                >
                  <p>
                    <a 
                      href="https://beds24.com/booking2.php?ownerid=75780&amp;referer=iframe" 
                      title="Book Now"
                      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Book Now on Beds24
                    </a>
                  </p>
                </iframe>
              </div>
              
              {/* Custom Footer for the Widget */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">About This Integration</h4>
                    <p className="text-gray-700">
                      This booking widget is powered by Beds24, a professional property management system. 
                      We've integrated it directly into our website to provide you with a seamless booking 
                      experience while maintaining our brand identity and design aesthetic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes Our Beds24 Integration Special
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've seamlessly integrated the Beds24 platform while maintaining our own design and branding
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seamless Integration</h3>
              <p className="text-gray-600">
                The Beds24 widget is fully embedded within our website design, maintaining brand consistency
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
                Live calendar integration showing current availability, pricing, and instant booking
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional System</h3>
              <p className="text-gray-600">
                Powered by Beds24's industry-leading property management and booking platform
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
            Explore our complete property collection and see how our Beds24 integration 
            enhances your holiday planning experience.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/properties"
              className="inline-flex items-center rounded-md bg-white px-8 py-4 text-lg font-medium text-indigo-600 hover:bg-gray-100 transition-colors"
            >
              Browse All Properties
            </a>
            <a
              href="/"
              className="inline-flex items-center rounded-md border-2 border-white px-8 py-4 text-lg font-medium text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
