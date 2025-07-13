import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'

// Placeholder pages - will be implemented later
const Writing = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Writing Page</h1></div>
const Resources = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Resources Page</h1></div>
const Photos = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Photos Gallery</h1></div>
const Dana = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dāna - Support Page</h1></div>
const Terminal = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Terminal</h1></div>
const Chat = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Chat</h1></div>
const Feed = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Feed</h1></div>

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
            <Route path="/photos" element={<Photos />} />
            <Route path="/dana" element={<Dana />} />
            <Route path="/terminal" element={<Terminal />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
