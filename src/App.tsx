import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'

// Placeholder pages - will be implemented later
const Writing = () => <div className="section-padding container-width"><h1>Writing Page</h1></div>
const Resources = () => <div className="section-padding container-width"><h1>Resources Page</h1></div>
const Art = () => <div className="section-padding container-width"><h1>Art Gallery</h1></div>
const Support = () => <div className="section-padding container-width"><h1>Support Page</h1></div>

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/art" element={<Art />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
