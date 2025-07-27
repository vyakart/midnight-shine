import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SpiralDemo } from './components/SpiralDemo'
import Layout from './components/Layout'
import About from './pages/About'
import Writing from './pages/Writing'
import Dana from './pages/Dana'
import Resources from './pages/Resources'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SpiralDemo />} />
      <Route path="/about" element={<Layout />}>
        <Route index element={<About />} />
      </Route>
      <Route path="/writing" element={<Layout />}>
        <Route index element={<Writing />} />
      </Route>
      <Route path="/dana" element={<Layout />}>
        <Route index element={<Dana />} />
      </Route>
      <Route path="/resources" element={<Layout />}>
        <Route index element={<Resources />} />
      </Route>
    </Routes>
  )
}

export default App
