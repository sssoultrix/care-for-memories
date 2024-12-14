// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Archive from './components/Archive';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/archive" element={<Archive />} />
          {/* Другие маршруты */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;