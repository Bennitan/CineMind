import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, Sparkles } from 'lucide-react'

function App() {
  const [movies, setMovies] = useState([])
  const [query, setQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // 1. Fetch all movies on startup
  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    const response = await fetch('http://127.0.0.1:8000/movies')
    const data = await response.json()
    setMovies(data)
  }

  // 2. Smart Search Logic (Talks to Python)
  const handleSearch = async (e) => {
    e.preventDefault() // Stop page refresh
    if (!query.trim()) {
      fetchMovies() // Reset if empty
      return
    }
    
    setIsSearching(true)
    try {
      // Ask Python to find movies based on meaning
      const response = await fetch(`http://127.0.0.1:8000/search?query=${query}`)
      const data = await response.json()
      setMovies(data)
    } catch (error) {
      console.error("Search failed:", error)
    }
    setIsSearching(false)
  }

  // 3. Recommendation Logic
  const selectMovie = async (movie) => {
    setSelectedMovie(movie)
    const response = await fetch(`http://127.0.0.1:8000/recommend?title=${movie.title}`)
    const data = await response.json()
    setRecommendations(data)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px' }}>
      
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '900', margin: 0, letterSpacing: '-2px', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          CineMind.
        </h1>
        <p style={{ color: '#666', marginTop: '10px', fontSize: '1.2rem' }}>AI-Powered Movie Discovery</p>
      </header>

      {selectedMovie ? (
        // === VIEW 2: RECOMMENDATION SCREEN ===
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button 
            onClick={() => setSelectedMovie(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#222', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', marginBottom: '40px', fontSize: '1rem', transition: '0.2s' }}
          >
            <ArrowLeft size={20} /> Back to Search
          </button>

          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700' }}>Because you liked <span style={{ color: '#ec4899' }}>{selectedMovie.title}</span>...</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {recommendations.map((movie, index) => (
              <motion.div 
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ backgroundColor: '#18181b', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              >
                <div style={{ height: '400px', overflow: 'hidden' }}>
                  <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{movie.title}</h3>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                     <span style={{ fontSize: '0.8rem', color: '#a78bfa', backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: '5px 10px', borderRadius: '15px' }}>{movie.genre}</span>
                     <span style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={12}/> {movie.rating}</span>
                  </div>
                  <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6' }}>{movie.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        // === VIEW 1: SEARCH SCREEN ===
        <>
          <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto 60px auto', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '25px', top: '20px', color: '#555' }} size={24} />
            <input 
              type="text" 
              placeholder="Describe a movie (e.g., 'scary hotel' or 'space travel')..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '20px 20px 20px 65px', borderRadius: '50px', border: 'none', fontSize: '1.2rem', backgroundColor: '#1a1a1a', color: 'white', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>

          {isSearching ? (
             <p style={{ textAlign: 'center', color: '#666' }}>Thinking...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
              {movies.map(movie => (
                <motion.div 
                  key={movie.id}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  onClick={() => selectMovie(movie)}
                  style={{ cursor: 'pointer', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}
                >
                  <div style={{ height: '380px', width: '100%' }}>
                      <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{movie.title}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                          <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{movie.genre}</span>
                          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem' }}>★ {movie.rating}</span>
                      </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App