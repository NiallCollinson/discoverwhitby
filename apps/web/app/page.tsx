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
                    <div className="b24bookingbutton mt-6">
                      <form method='GET' action='https://beds24.com/booking2.php' target='_blank' style={{display: 'inline'}}>
                        <input 
                          type='submit' 
                          value='Book Now'  
                          style={{
                            width: 'auto', 
                            height: 'auto', 
                            textShadow: '0 -1px 1px rgba(0, 0, 0, 0.1)', 
                            WebkitBoxShadow: '0px 0px 1px #777777', 
                            MozBoxShadow: '0px 0px 1px #777777', 
                            boxShadow: '0px 0px 1px #777777', 
                            cursor: 'pointer', 
                            display: 'inline-block', 
                            fontSize: '24px', 
                            fontWeight: 'bold',  
                            padding: '10px', 
                            position: 'relative', 
                            textAlign: 'center', 
                            fontFamily: 'inherit', 
                            background: '#000000', 
                            border: '1px solid #000000', 
                            color: '#ffffff',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out'
                          }}
                        />
                        <input type='hidden' name='ownerid' value='73864'/>
                        <input type='hidden' name='type' value='0'/>
                        <input type='hidden' name='referer' value='BookingButton'/>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Feature Badges */}
              <section className="py-2.5 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium">
                      <span aria-hidden="true">🐾</span>
                      <span>PET FRIENDLY</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium">
                      <span aria-hidden="true">🅿️</span>
                      <span>PARKING</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium">
                      <span aria-hidden="true">💷</span>
                      <span>FANTASTIC VALUE</span>
                    </div>
                  </div>
                </div>
              </section>
      
      {/* Beds24 Booking Widget */}
      <section id="booking" className="pb-16 bg-white">
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
            
          </div>
        </div>
      </section>
      
            {/* About Us & Properties Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">About Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our mission is to make great holidays accessible to everyone</p>
          </div>
          
          <div className="space-y-8">
            {/* Hero Video Panel */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                <video
                  className="h-full w-full object-cover"
                  src="/hero-whitby.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="text-lg font-semibold">Experience Whitby</div>
              <div className="mt-2 text-sm text-gray-600">Discover the beauty and charm of our coastal town</div>
            </div>
            
            {/* Properties Panel */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Our Properties</h3>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-sm font-semibold">Cottages</div>
                  <p className="text-xs text-gray-600">Charming traditional cottages with modern amenities</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="text-sm font-semibold">Suites</div>
                  <p className="text-xs text-gray-600">Comfortable suites with stunning sea views</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏡</div>
                  <div className="text-sm font-semibold">Houses</div>
                  <p className="text-xs text-gray-600">Spacious family homes perfect for groups</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>
      
      {/* Additional Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Free parking</div>
              <p className="mt-1 text-gray-600">Some properties come with free parking</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Large houses</div>
              <p className="mt-1 text-gray-600">Space for the whole group.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="text-xl font-semibold">Why book with us</div>
              <ul className="mt-3 grid list-disc gap-2 pl-5 text-gray-700 sm:grid-cols-2">
                <li>Best price guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to book your perfect Whitby stay</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Online</h3>
              <p className="text-gray-600">Book your accommodation online through our secure booking system.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Self Check-in</h3>
              <p className="text-gray-600">Receive a room code on check-in day and complete self check-in.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Out Anytime</h3>
              <p className="text-gray-600">Check out anytime - it's super easy, convenient and incredible value.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
