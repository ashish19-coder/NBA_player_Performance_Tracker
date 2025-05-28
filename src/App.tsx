import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PlayerDetails from './pages/PlayerDetails';
import PlayerComparison from './pages/PlayerComparison';
import Navigation from './components/Navigation';
import { PlayerDataProvider } from './context/PlayerDataContext';

function App() {
  return (
    <PlayerDataProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/player/:playerId" element={<PlayerDetails />} />
              <Route path="/compare" element={<PlayerComparison />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PlayerDataProvider>
  );
}

export default App;