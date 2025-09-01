"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Beds24Property {
  id: string;
  name: string;
  bedrooms: number;
  maxGuests: number;
  priceNight: number;
  images?: Array<{ url: string }>;
}

interface BookingQuote {
  total: number;
  nights: number;
  serviceFee: number;
  basePrice: number;
}

export default function DemoPage() {
  const [properties, setProperties] = useState<Beds24Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Beds24Property | null>(null);
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

  // Initialize Beds24 Apple-style widget
  useEffect(() => {
    // Load Beds24 widget script
    const script = document.createElement('script');
    script.src = 'https://media.xmlcal.com/widget/1.00/js/bookWidget.min.js';
    script.onload = () => {
      // Initialize the Apple-style widget
      if ((window as any).bookWidget) {
        (window as any).$('#bookWidget-75780-0-1234567890').bookWidget({
          propid: 75780,
          formAction: 'https://beds24.com/booking.php',
          widgetLang: 'en',
          widgetType: 'BookingBox',
          widgetTitle: 'Book Your Stay',
          width: '100%',
          alignment: 'center',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          color: '#111827',
          buttonBackgroundColor: '#000000',
          buttonColor: '#ffffff',
          boxShadow: true,
          fontSize: '16px',
          dateSelection: 2,
          defaultNumAdult: 2,
          defaultNumChild: 0,
          peopleSelection: 2,
          showLabels: true,
          dateFormat: 'dd/mm/yy',
          weekFirstDay: 1,
          customParameter: 'theme=apple'
        });
      }
    };
    document.head.appendChild(script);

    // Load jQuery if not already loaded
    if (!(window as any).jQuery) {
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
      document.head.appendChild(jqueryScript);
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Fetch Beds24 properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/beds24/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
          if (data.length > 0) {
            setSelectedProperty(data[0]);
          }
        } else {
          // Fallback to demo properties if API fails
          const demoProperties: Beds24Property[] = [
            { id: "demo-1", name: "Harbour View Cottage", bedrooms: 2, maxGuests: 4, priceNight: 120 },
            { id: "demo-2", name: "Abbey Loft Apartment", bedrooms: 1, maxGuests: 2, priceNight: 90 },
            { id: "demo-3", name: "Sea Breeze House", bedrooms: 3, maxGuests: 6, priceNight: 180 },
            { id: "demo-4", name: "Whitby Lighthouse Suite", bedrooms: 2, maxGuests: 4, priceNight: 150 },
          ];
          setProperties(demoProperties);
          setSelectedProperty(demoProperties[0]);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        // Fallback to demo properties
        const demoProperties: Beds24Property[] = [
          { id: "demo-1", name: "Harbour View Cottage", bedrooms: 2, maxGuests: 4, priceNight: 120 },
          { id: "demo-2", name: "Abbey Loft Apartment", bedrooms: 1, maxGuests: 2, priceNight: 90 },
          { id: "demo-3", name: "Sea Breeze House", bedrooms: 3, maxGuests: 6, priceNight: 180 },
          { id: "demo-4", name: "Whitby Lighthouse Suite", bedrooms: 2, maxGuests: 4, priceNight: 150 },
        ];
        setProperties(demoProperties);
        setSelectedProperty(demoProperties[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Calculate quote when dates or property changes
  useEffect(() => {
    const calculateQuote = async () => {
      if (!selectedProperty || !checkIn || !checkOut) {
        setQuote(null);
        return;
      }

      setQuoteLoading(true);
      try {
        const response = await fetch('/api/beds24/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId: selectedProperty.id,
            checkIn,
            checkOut,
            guests
          })
        });

        if (response.ok) {
          const data = await response.json();
          const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
          const basePrice = nights * selectedProperty.priceNight;
          const serviceFee = Math.round(basePrice * 0.05); // 5% service fee
          
          setQuote({
            total: basePrice + serviceFee,
            nights,
            serviceFee,
            basePrice
          });
        } else {
          // Fallback calculation
          const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
          const basePrice = nights * selectedProperty.priceNight;
          const serviceFee = Math.round(basePrice * 0.05);
          
          setQuote({
            total: basePrice + serviceFee,
            nights,
            serviceFee,
            basePrice
          });
        }
      } catch (error) {
        console.error('Failed to calculate quote:', error);
        // Fallback calculation
        const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
        const basePrice = nights * selectedProperty.priceNight;
        const serviceFee = Math.round(basePrice * 0.05);
        
        setQuote({
          total: basePrice + serviceFee,
          nights,
          serviceFee,
          basePrice
        });
      } finally {
        setQuoteLoading(false);
      }
    };

    calculateQuote();
  }, [selectedProperty, checkIn, checkOut, guests]);

  const handleBooking = async () => {
    if (!selectedProperty || !checkIn || !checkOut || !quote) return;

    try {
      const response = await fetch('/api/beds24/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          checkIn,
          checkOut,
          guests,
          guest: {
            name: "Demo User",
            email: "demo@example.com"
          }
        })
      });

      if (response.ok) {
        alert('Booking submitted successfully! (This is a demo)');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <>
      {/* Custom CSS for Apple-style Beds24 widget */}
      <style jsx global>{`
        .apple-style-widget .book-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: none !important;
        }

        .apple-style-widget .book-widget input,
        .apple-style-widget .book-widget select {
          border-radius: 12px !important;
          border: 2px solid #e5e7eb !important;
          padding: 16px !important;
          font-size: 16px !important;
          transition: all 0.2s ease !important;
          background-color: #ffffff !important;
        }

        .apple-style-widget .book-widget input:focus,
        .apple-style-widget .book-widget select:focus {
          border-color: #000000 !important;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
          outline: none !important;
        }

        .apple-style-widget .book-widget button {
          border-radius: 25px !important;
          padding: 16px 32px !important;
          font-weight: 600 !important;
          letter-spacing: -0.025em !important;
          transition: all 0.2s ease !important;
          background-color: #000000 !important;
          color: #ffffff !important;
          border: none !important;
        }

        .apple-style-widget .book-widget button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
          background-color: #1f2937 !important;
        }

        .apple-style-widget .book-widget label {
          font-weight: 500 !important;
          color: #374151 !important;
          margin-bottom: 8px !important;
          font-size: 14px !important;
        }

        .apple-style-widget .book-container {
          padding: 24px !important;
        }

        .apple-style-widget .book-row {
          margin-bottom: 20px !important;
        }

        .apple-style-widget .book-widget-title {
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #111827 !important;
          margin-bottom: 16px !important;
          text-align: center !important;
        }
      `}</style>
      
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
                        {loading ? (
                          <div className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                            <span className="ml-2 text-gray-600">Loading properties...</span>
                          </div>
                        ) : (
                          <select 
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900"
                            value={selectedProperty?.id || ""}
                            onChange={(e) => {
                              const property = properties.find(p => p.id === e.target.value);
                              setSelectedProperty(property || null);
                            }}
                          >
                            {properties.map((property) => (
                              <option key={property.id} value={property.id}>
                                {property.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      
                      {selectedProperty && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h5 className="font-semibold text-gray-900 mb-3">Property Details</h5>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                              </svg>
                              {selectedProperty.bedrooms} bedroom{selectedProperty.bedrooms !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              Sleeps {selectedProperty.maxGuests}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                              </svg>
                              £{selectedProperty.priceNight}/night
                            </div>
                          </div>
                        </div>
                      )}
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
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Check-out</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900"
                            min={new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]}
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Guests</label>
                        <select 
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-200 bg-white text-gray-900"
                          value={guests}
                          onChange={(e) => setGuests(parseInt(e.target.value))}
                        >
                          {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                              {num} Guest{num !== 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        {quoteLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                            <span className="ml-2 text-gray-600">Calculating...</span>
                          </div>
                        ) : quote ? (
                          <>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{quote.nights} night{quote.nights !== 1 ? 's' : ''}</span>
                              <span className="text-sm text-gray-600">£{quote.basePrice}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Service fee</span>
                              <span className="text-sm text-gray-600">£{quote.serviceFee}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-semibold text-gray-900">£{quote.total}</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">Select dates to see pricing</p>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleBooking}
                        disabled={!quote || !selectedProperty || !checkIn || !checkOut}
                      >
                        {quoteLoading ? 'Calculating...' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apple-Style Beds24 Widget */}
              <div className="relative mb-12">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Apple-Style Beds24 Widget</h4>
                  <p className="text-gray-600">Professional Beds24 widget with Apple design aesthetics</p>
                </div>
                
                {/* Apple-style container for Beds24 widget */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
                  {/* Apple-style header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white text-sm font-medium mb-4">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Premium Booking Experience
                    </div>
                    <h5 className="text-xl font-semibold text-gray-900 mb-2">Book Your Whitby Stay</h5>
                    <p className="text-sm text-gray-600">Select dates, choose your property, and book instantly</p>
                  </div>
                  
                  {/* Beds24 Widget Container */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
                    <div id="bookWidget-75780-0-1234567890" className="apple-style-widget"></div>
                  </div>
                  
                  {/* Apple-style footer */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Secure & Professional
                    </div>
                  </div>
                </div>
              </div>

              {/* Styled Beds24 Widget */}
              <div className="relative">
                <div className="text-center mb-8">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Styled Beds24 Widget</h4>
                  <p className="text-gray-600">Beds24 widget with Apple-style customization</p>
                </div>
                
                {/* Custom styling wrapper for Beds24 widget */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Powered by Beds24
                    </div>
                    <h5 className="text-lg font-semibold text-gray-900">Book Your Stay</h5>
                    <p className="text-sm text-gray-600">Select dates and book directly through our system</p>
                  </div>
                  
                  {/* Beds24 iframe with custom styling */}
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <iframe 
                      src="https://beds24.com/booking2.php?ownerid=75780&amp;advancedays=0&amp;referer=iframe" 
                      width="100%" 
                      height="1800" 
                      className="w-full border-0"
                      style={{
                        maxWidth: '100%',
                        border: 'none',
                        overflow: 'auto',
                        minHeight: '1800px',
                        backgroundColor: 'transparent'
                      }}
                      title="Beds24 Booking Widget"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                  
                  {/* Custom footer for the widget */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-sm border border-gray-200">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Secure booking powered by Beds24
                    </div>
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
    </>
  );
}
