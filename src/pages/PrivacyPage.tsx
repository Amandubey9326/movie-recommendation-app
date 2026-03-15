/**
 * PrivacyPage Component
 * 
 * Privacy policy page.
 */

export function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="glass-card p-8 space-y-6">
          <p className="text-gray-400 text-sm">Last updated: March 2026</p>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
            <p className="text-gray-300">
              Welcome to MovieRec, created by Aman Dubey. Your privacy is important to us. 
              This Privacy Policy explains how we collect, use, and protect your information 
              when you use our movie recommendation platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <p className="text-gray-300 mb-2">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Viewing history (stored locally on your device)</li>
              <li>Watchlist and favorites (stored locally on your device)</li>
              <li>Theme preferences (stored locally on your device)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
            <p className="text-gray-300">
              All your data is stored locally in your browser's localStorage. We use this 
              information solely to provide personalized movie recommendations and improve 
              your experience on our platform. We do not send your personal data to any 
              external servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p className="text-gray-300">
              We use The Movie Database (TMDB) API to fetch movie information. TMDB has its 
              own privacy policy which you can review on their website. We do not share your 
              personal viewing data with TMDB or any other third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
            <p className="text-gray-300">
              Since all data is stored locally on your device, you have full control over it. 
              You can clear your data at any time by clearing your browser's localStorage or 
              using your browser's privacy settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact Aman Dubey 
              through the Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
