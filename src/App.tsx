import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpiralDemo } from './components/SpiralDemo';
import Layout from './components/Layout';
import About from './pages/About';
import Writing from './pages/Writing';
import Dana from './pages/Dana';
import Resources from './pages/Resources';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SpiralDemo />} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/writing" element={<Layout><Writing /></Layout>} />
      <Route path="/dana" element={<Layout><Dana /></Layout>} />
      <Route path="/resources" element={<Layout><Resources /></Layout>} />
    </Routes>
  );
}
export default App;
