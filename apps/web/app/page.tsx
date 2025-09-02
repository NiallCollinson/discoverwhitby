export default async function Home() {
  const heroVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero-whitby.mp4";

  return (
    <main className="min-h-screen">
      <section className="relative h-[60vh] w-full overflow-hidden sm:h-[70vh] lg:h-[80vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <div>
            <h1 className="text-3xl font-semibold text-black sm:text-4xl lg:text-5xl">Discover Whitby</h1>
            <p className="mt-3 max-w-2xl text-black/80">Get away for less, cottages and more starting at £50 a night!</p>
            <a href="#booking" className="mt-6 inline-flex rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-black hover:bg-white">
              Book Now
            </a>
          </div>
        </div>
      </section>
      
      {/* Beds24 Booking Widget */}
      <section id="booking" className="py-16 bg-white">
        <div className="text-center mb-12 px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Book Your Stay</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Check availability and book your Whitby accommodation directly through our secure booking system.</p>
        </div>
        <div className="w-full">
          <div className="bg-white border-t border-b border-gray-200 overflow-hidden">
            <iframe 
              src="https://beds24.com/booking2.php?ownerid=73864&numadult=2&advancedays=0&referer=iframe" 
              width="100%" 
              height="2000" 
              style={{border: 'none', overflow: 'auto'}}
              title="Beds24 Booking Widget"
              frameBorder="0"
              allowFullScreen
              className="w-full border-0"
            />
            <div className="text-center py-6 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Having trouble with the widget? <a href="https://beds24.com/booking2.php?ownerid=73864&referer=iframe" className="text-blue-600 hover:text-blue-800 underline">Book directly here</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotional Sections */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Why Choose Whitby?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the charm and beauty of our coastal town</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
              <span aria-hidden="true">🐾</span>
              <span>PET FRIENDLY</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
              <span aria-hidden="true">🅿️</span>
              <span>PARKING</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium">
              <span aria-hidden="true">💷</span>
              <span>FANTASTIC VALUE</span>
            </div>
          </div>
          
          <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 text-center">
            <div className="text-lg font-semibold">The longer the stay, the bigger the discount</div>
            <div className="mt-2 text-sm text-gray-600">Save more when you book 7+ nights.</div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Free parking</div>
              <p className="mt-1 text-gray-600">Stays with on-site parking included.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Large houses</div>
              <p className="mt-1 text-gray-600">Space for the whole group.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Why book with us</div>
              <ul className="mt-3 grid list-disc gap-2 pl-5 text-gray-700 sm:grid-cols-2">
                <li>Best price guaranteed</li>
                <li>Verified local hosts</li>
                <li>Secure payments</li>
                <li>Flexible cancellation on many stays</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
