import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { TransitionProvider } from './contexts/TransitionContext'
import { Layout } from './components/Layout'
import { SpiralDemo } from './components/SpiralDemo'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Writing } from './pages/Writing'
import { Resources } from './pages/Resources'
import { Photos } from './pages/Photos'
import { Terminal } from './pages/Terminal'
import { Chat } from './pages/Chat'
import { Feed } from './pages/Feed'
import { Dana } from './pages/Dana'
import { EntropyDemo } from './components/EntropyDemo'
import { CommitsGridDemo } from './components/CommitsGridDemo'

function App() {
  const [showLoading, setShowLoading] = useState(true)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  return (
    <ThemeProvider>
      {showLoading ? (
        <SpiralDemo onComplete={handleLoadingComplete} />
      ) : (
        <TransitionProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/photos" element={<Photos />} />
                <Route path="/dana" element={<Dana />} />
                <Route path="/terminal" element={<Terminal />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/entropy" element={<EntropyDemo />} />
                <Route path="/commits-grid" element={<CommitsGridDemo />} />
              </Routes>
            </Layout>
          </Router>
        </TransitionProvider>
      )}
    </ThemeProvider>
  )
}

export default App
