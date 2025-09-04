export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for great value Whitby accommodation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Discover Whitby, your go-to destination for great value accommodation in one of Yorkshire's most charming coastal towns. 
                We've been helping visitors find good places to stay in Whitby since our establishment, offering a selection of 
                properties that combine comfort, character, and convenience.
              </p>
              <p className="text-gray-700 mb-4">
                Our mission is simple: to provide you with the perfect home away from home while you explore the rich history, stunning landscapes, 
                and warm hospitality that make Whitby truly special.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Why Choose Us?</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🏠 Curated Properties</h3>
                  <p className="text-gray-700">
                    Each property in our portfolio has been personally selected and verified to ensure it meets our standards for 
                    comfort and location.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">💷 Best Value</h3>
                  <p className="text-gray-700">
                    We're committed to offering competitive rates and transparent pricing, ensuring you get great value for your stay 
                    without any hidden costs.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🐾 Pet Friendly</h3>
                  <p className="text-gray-700">
                    Many of our properties welcome your four-legged family members, so you can enjoy your Whitby adventure together 
                    without compromise.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">🅿️ Convenient Amenities</h3>
                  <p className="text-gray-700">
                    From free parking to fully equipped kitchens, we ensure your stay is as comfortable and convenient as possible.
                  </p>
                </div>
              </div>
            </div>



            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Ready to Discover Whitby?</h2>
              <p className="text-gray-700 mb-6">
                Start planning your perfect Whitby adventure today. Browse our properties and book your stay with confidence.
              </p>
              <a 
                href="/#booking" 
                className="inline-flex rounded-md bg-black px-6 py-3 text-lg font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Book Your Stay
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
