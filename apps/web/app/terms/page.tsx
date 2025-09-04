export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before booking your accommodation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-lg mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">1. Booking and Payment</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  All bookings are subject to availability and confirmation. A valid credit or debit card is required to secure your reservation.
                </p>
                <p>
                  Payment is processed through our secure booking system. Full payment is typically required at the time of booking, 
                  unless otherwise specified in your booking confirmation.
                </p>
                <p>
                  Prices are quoted in British Pounds (GBP) and include VAT where applicable. All prices are subject to change without notice.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">2. Cancellation Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Cancellation policies vary by property and booking type. Please refer to your specific booking confirmation 
                  for detailed cancellation terms.
                </p>
                <p>
                  Generally, cancellations made more than 7 days before arrival may be eligible for a full refund, 
                  while cancellations within 7 days may incur charges.
                </p>
                <p>
                  We recommend purchasing travel insurance to protect against unexpected cancellations or changes to your travel plans.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">3. Check-in and Check-out</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Check-in is typically available from 3:00 PM onwards. Early check-in may be available upon request, 
                  subject to availability and additional charges.
                </p>
                <p>
                  Check-out is required by 10:00 AM on your departure date. Late check-out may be available upon request, 
                  subject to availability and additional charges.
                </p>
                <p>
                  Please ensure you have your booking confirmation and identification ready upon arrival.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">4. House Rules and Conduct</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Guests are expected to respect the property and its contents, as well as the peace and quiet of neighbouring properties.
                </p>
                <p>
                  Smoking is not permitted in any of our properties. Designated smoking areas may be available outside.
                </p>
                <p>
                  Pets are welcome in designated pet-friendly properties only. Additional cleaning fees may apply.
                </p>
                <p>
                  Maximum occupancy limits must be strictly adhered to. Additional guests are not permitted without prior approval.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">5. Property Care and Damages</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Guests are responsible for any damage caused to the property or its contents during their stay.
                </p>
                <p>
                  A security deposit may be required and will be refunded after inspection, less any costs for damages or additional cleaning.
                </p>
                <p>
                  Please report any issues or damages immediately to ensure prompt resolution.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">6. Liability and Insurance</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our liability is limited to the cost of your accommodation booking. We recommend purchasing comprehensive travel insurance.
                </p>
                <p>
                  We are not responsible for any personal injury, loss, or damage to personal belongings during your stay.
                </p>
                <p>
                  Guests are responsible for their own safety and the safety of their children and pets while on the property.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">7. Privacy and Data Protection</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We are committed to protecting your privacy and will only use your personal information in accordance with our Privacy Policy.
                </p>
                <p>
                  Your booking information may be shared with the property owner and our booking system provider to facilitate your stay.
                </p>
                <p>
                  We will never sell or share your personal information with third parties for marketing purposes.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">8. Complaints and Disputes</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any concerns during your stay, please contact us immediately so we can address them promptly.
                </p>
                <p>
                  We aim to resolve all issues to your satisfaction. If you remain dissatisfied, please submit a formal complaint in writing.
                </p>
                <p>
                  These terms are governed by English law, and any disputes will be subject to the jurisdiction of English courts.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">9. Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
                </p>
                <p>
                  Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these terms and conditions, please don't hesitate to contact us.
              </p>
              <a 
                href="/about" 
                className="inline-flex rounded-md bg-black px-6 py-3 text-lg font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
