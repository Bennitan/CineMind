import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [allMovies, setAllMovies] = useState([])

  // 1. Fetch movies from your Python Backend when the page loads
  useEffect(() => {
    fetch('http://127.0.0.1:8000/movies')
      .then(response => response.json())
      .then(data => {
        setAllMovies(data) // Save the full list
        setMovies(data)    // Show the full list initially
      })
      .catch(error => console.error("Error connecting to backend:", error))
  }, [])

  // 2. Filter movies when you type
  const handleSearch = (e) => {
    const text = e.target.value
    setQuery(text)
    if (text === '') {
      setMovies(allMovies)
    } else {
      const filtered = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(text.toLowerCase())
      )
      setMovies(filtered)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', padding: '20px' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          CineMind
        </h1>
      </header>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px auto', position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '15px', top: '12px', color: 'gray' }} />
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          placeholder="Search for movies..." 
          style={{
            width: '100%',
            padding: '12px 12px 12px 45px',
            borderRadius: '25px',
            border: 'none',
            fontSize: '1.1rem',
            backgroundColor: '#333',
            color: 'white'
          }}
        />
      </div>

      {/* Movie Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {movies.map(movie => (
          <motion.div 
            key={movie.id}
            whileHover={{ scale: 1.05 }}
            style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '10px' }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>{movie.title}</h3>
            <p style={{ color: '#aaa', margin: '0' }}>{movie.genre}</p>
            <span style={{ display: 'block', marginTop: '10px', color: '#fbbf24' }}>★ {movie.rating}</span>
          </motion.div>
        ))}
      </div>

    </div>
  )
}

export default App