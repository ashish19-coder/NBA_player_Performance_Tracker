import React, { useState } from 'react';
import PlayersTable from '../components/PlayersTable';
import PlayerCard from '../components/PlayerCard';
import { usePlayerData } from '../context/PlayerDataContext';
import { Filter, Award, Loader } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { players, isLoading, error } = usePlayerData();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPts: 0,
    maxPts: 50,
    minReb: 0,
    maxReb: 20,
    minAst: 0,
    maxAst: 15,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="animate-spin w-12 h-12 text-blue-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading player data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  const filteredPlayers = players.filter(player => 
    player.PTS >= filters.minPts && player.PTS <= filters.maxPts &&
    player.REB >= filters.minReb && player.REB <= filters.maxReb &&
    player.AST >= filters.minAst && player.AST <= filters.maxAst
  );

  const topScorers = [...players]
    .sort((a, b) => b.PTS - a.PTS)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NBA Player Performance Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore, analyze, and compare NBA player statistics with advanced analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Total Players</h2>
          <p className="text-4xl font-bold">{players.length}</p>
          <p className="mt-2 text-blue-100">From {new Set(players.map(p => p.TEAM)).size} different teams</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Average Points</h2>
          <p className="text-4xl font-bold">
            {(players.reduce((acc, player) => acc + player.PTS, 0) / players.length).toFixed(1)}
          </p>
          <p className="mt-2 text-purple-100">Points per game across all players</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Top Scorer</h2>
          <p className="text-4xl font-bold">
            {players.sort((a, b) => b.PTS - a.PTS)[0].PTS.toFixed(1)} pts
          </p>
          <p className="mt-2 text-orange-100">{players.sort((a, b) => b.PTS - a.PTS)[0].PLAYER}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <Award className="text-orange-500 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Scorers</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topScorers.map(player => (
            <div key={player.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <img src={player.imageUrl} alt={player.PLAYER} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{player.PLAYER}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{player.TEAM}</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">{player.PTS.toFixed(1)} PPG</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Player Statistics</h2>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            
            <div className="flex rounded-lg shadow overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Card View
              </button>
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Players</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Points Per Game
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.minPts}
                    onChange={(e) => setFilters({...filters, minPts: Number(e.target.value)})}
                    min="0"
                    max="50"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.maxPts}
                    onChange={(e) => setFilters({...filters, maxPts: Number(e.target.value)})}
                    min="0"
                    max="50"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rebounds Per Game
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.minReb}
                    onChange={(e) => setFilters({...filters, minReb: Number(e.target.value)})}
                    min="0"
                    max="20"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.maxReb}
                    onChange={(e) => setFilters({...filters, maxReb: Number(e.target.value)})}
                    min="0"
                    max="20"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assists Per Game
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.minAst}
                    onChange={(e) => setFilters({...filters, minAst: Number(e.target.value)})}
                    min="0"
                    max="15"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.maxAst}
                    onChange={(e) => setFilters({...filters, maxAst: Number(e.target.value)})}
                    min="0"
                    max="15"
                    className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'table' ? (
          <PlayersTable players={filteredPlayers} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.slice(0, 20).map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;