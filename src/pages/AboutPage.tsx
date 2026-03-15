/**
 * AboutPage Component
 * 
 * About page with information about the creator and the project.
 */

export function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">About MovieRec</h1>
        
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">The Creator</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
              AD
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Aman Dubey</h3>
              <p className="text-gray-300 mb-4">
                A passionate movie enthusiast who loves both Bollywood and Hollywood cinema. 
                I created MovieRec to help fellow movie lovers discover their next favorite film 
                through AI-powered recommendations.
              </p>
              <p className="text-gray-400 mb-4">
                When I'm not coding, you'll find me watching the latest releases, exploring 
                classic cinema, or discussing film theories with friends.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/Amandubey9326" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/amann.__03/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">About This Project</h2>
          <p className="text-gray-300 mb-4">
            MovieRec is a modern movie recommendation platform built with cutting-edge web technologies. 
            It features a cinematic dark theme, smooth 3D animations, and an intuitive user interface 
            designed to make movie discovery enjoyable.
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>AI-powered movie recommendations based on your viewing history</li>
            <li>Real-time movie data from TMDB API</li>
            <li>Personalized watchlist and favorites</li>
            <li>Advanced search with genre filters</li>
            <li>Beautiful glassmorphism UI with 3D effects</li>
            <li>Dark and light theme support</li>
          </ul>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['React', 'TypeScript', 'Tailwind CSS', 'TMDB API'].map((tech) => (
              <div key={tech} className="bg-white/5 rounded-lg p-3 text-center">
                <span className="text-gray-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
