/**
 * TermsPage Component
 * 
 * Terms of service page.
 */

export function TermsPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="glass-card p-8 space-y-6">
          <p className="text-gray-400 text-sm">Last updated: March 2026</p>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Agreement to Terms</h2>
            <p className="text-gray-300">
              By accessing MovieRec, created by Aman Dubey, you agree to be bound by these 
              Terms of Service. If you disagree with any part of these terms, you may not 
              access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Use of Service</h2>
            <p className="text-gray-300 mb-2">MovieRec is provided for personal, non-commercial use. You agree to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to interfere with the proper functioning of the service</li>
              <li>Not use automated systems to access the service without permission</li>
              <li>Respect intellectual property rights of movie content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Movie Data</h2>
            <p className="text-gray-300">
              Movie information, images, and data are provided by The Movie Database (TMDB). 
              This product uses the TMDB API but is not endorsed or certified by TMDB. All 
              movie-related content belongs to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Recommendations</h2>
            <p className="text-gray-300">
              Movie recommendations are generated based on algorithms and your viewing history. 
              These are suggestions only and we make no guarantees about the quality or 
              suitability of recommended content for any individual user.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Disclaimer</h2>
            <p className="text-gray-300">
              MovieRec is provided "as is" without warranties of any kind. We do not guarantee 
              that the service will be uninterrupted, secure, or error-free. Use of the service 
              is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify these terms at any time. Continued use of the 
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p className="text-gray-300">
              For questions about these Terms of Service, please contact Aman Dubey through 
              the Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
