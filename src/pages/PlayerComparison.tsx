import React, { useState } from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import { Search, X, ArrowRight } from 'lucide-react';
import StatsChart from '../components/StatsChart';

const PlayerComparison: React.FC = () => {
  const { players, isLoading } = usePlayerData();
  const [playerOneId, setPlayerOneId] = useState<number | null>(null);
  const [playerTwoId, setPlayerTwoId] = useState<number | null>(null);
  const [searchQueryOne, setSearchQueryOne] = useState('');
  const [searchQueryTwo, setSearchQueryTwo] = useState('');
  const [showPlayerOneSearch, setShowPlayerOneSearch] = useState(false);
  const [showPlayerTwoSearch, setShowPlayerTwoSearch] = useState(false);

  const playerOne = players.find(p => p.id === playerOneId);
  const playerTwo = players.find(p => p.id === playerTwoId);

  const handleSelectPlayerOne = (id: number) => {
    setPlayerOneId(id);
    setShowPlayerOneSearch(false);
    setSearchQueryOne('');
  };

  const handleSelectPlayerTwo = (id: number) => {
    setPlayerTwoId(id);
    setShowPlayerTwoSearch(false);
    setSearchQueryTwo('');
  };

  const filteredPlayersOne = players.filter(p => 
    p.PLAYER.toLowerCase().includes(searchQueryOne.toLowerCase()) ||
    p.TEAM.toLowerCase().includes(searchQueryOne.toLowerCase())
  ).slice(0, 5);

  const filteredPlayersTwo = players.filter(p => 
    p.PLAYER.toLowerCase().includes(searchQueryTwo.toLowerCase()) ||
    p.TEAM.toLowerCase().includes(searchQueryTwo.toLowerCase())
  ).slice(0, 5);

  if (isLoading) {
    return <div className="text-center p-8">Loading player data...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Compare statistics and performance metrics between any two NBA players
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Player One Selection */}
        <div className="relative">
          {playerOne ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="relative px-6 pb-6">
                <img 
                  src={playerOne.imageUrl} 
                  alt={playerOne.PLAYER} 
                  className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
                />
                <button 
                  className="absolute top-2 right-4 p-1 rounded-full bg-white dark:bg-gray-700 text-gray-500 hover:text-gray-700"
                  onClick={() => setPlayerOneId(null)}
                >
                  <X size={16} />
                </button>
                <div className="mt-14">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{playerOne.PLAYER}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{playerOne.TEAM} | Age: {playerOne.AGE}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{playerOne.PTS.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PPG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{playerOne.REB.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">RPG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{playerOne.AST.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">APG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select First Player</h3>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a player..."
                  value={searchQueryOne}
                  onChange={(e) => {
                    setSearchQueryOne(e.target.value);
                    setShowPlayerOneSearch(true);
                  }}
                  onFocus={() => setShowPlayerOneSearch(true)}
                  className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              {showPlayerOneSearch && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-64 overflow-y-auto">
                  {filteredPlayersOne.length > 0 ? (
                    filteredPlayersOne.map(player => (
                      <div
                        key={player.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleSelectPlayerOne(player.id)}
                      >
                        <img 
                          src={player.imageUrl} 
                          alt={player.PLAYER} 
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{player.PLAYER}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{player.TEAM}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                      No players found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Player Two Selection */}
        <div className="relative">
          {playerTwo ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-purple-500 to-purple-700"></div>
              <div className="relative px-6 pb-6">
                <img 
                  src={playerTwo.imageUrl} 
                  alt={playerTwo.PLAYER} 
                  className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800"
                />
                <button 
                  className="absolute top-2 right-4 p-1 rounded-full bg-white dark:bg-gray-700 text-gray-500 hover:text-gray-700"
                  onClick={() => setPlayerTwoId(null)}
                >
                  <X size={16} />
                </button>
                <div className="mt-14">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{playerTwo.PLAYER}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{playerTwo.TEAM} | Age: {playerTwo.AGE}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{playerTwo.PTS.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PPG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{playerTwo.REB.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">RPG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{playerTwo.AST.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">APG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Second Player</h3>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a player..."
                  value={searchQueryTwo}
                  onChange={(e) => {
                    setSearchQueryTwo(e.target.value);
                    setShowPlayerTwoSearch(true);
                  }}
                  onFocus={() => setShowPlayerTwoSearch(true)}
                  className="w-full px-4 py-2 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
              
              {showPlayerTwoSearch && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 max-h-64 overflow-y-auto">
                  {filteredPlayersTwo.length > 0 ? (
                    filteredPlayersTwo.map(player => (
                      <div
                        key={player.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleSelectPlayerTwo(player.id)}
                      >
                        <img 
                          src={player.imageUrl} 
                          alt={player.PLAYER} 
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{player.PLAYER}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{player.TEAM}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                      No players found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {playerOne && playerTwo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Player Comparison</h2>
          
          <div className="mb-8">
            <StatsChart 
              title="Key Statistics Comparison"
              labels={['Points', 'Rebounds', 'Assists', 'Net Rating', 'True Shooting %']}
              datasets={[
                {
                  label: playerOne.PLAYER,
                  data: [playerOne.PTS, playerOne.REB, playerOne.AST, playerOne.NETRTG, playerOne['TS%']],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.4)',
                },
                {
                  label: playerTwo.PLAYER,
                  data: [playerTwo.PTS, playerTwo.REB, playerTwo.AST, playerTwo.NETRTG, playerTwo['TS%']],
                  borderColor: 'rgb(168, 85, 247)',
                  backgroundColor: 'rgba(168, 85, 247, 0.4)',
                }
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Stats</h3>
              
              {[
                { label: 'Points Per Game', player1: playerOne.PTS, player2: playerTwo.PTS },
                { label: 'Rebounds Per Game', player1: playerOne.REB, player2: playerTwo.REB },
                { label: 'Assists Per Game', player1: playerOne.AST, player2: playerTwo.AST },
                { label: 'Games Played', player1: playerOne.GP, player2: playerTwo.GP },
              ].map((stat, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/5 text-right pr-3">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{stat.player1.toFixed(1)}</span>
                    </div>
                    <div className="w-3/5 flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ 
                          width: `${(stat.player1 / (stat.player1 + stat.player2)) * 100}%` 
                        }}></div>
                      </div>
                      <ArrowRight className="mx-2 text-gray-400" size={16} />
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ 
                          width: `${(stat.player2 / (stat.player1 + stat.player2)) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    <div className="w-1/5 pl-3">
                      <span className="font-medium text-purple-600 dark:text-purple-400">{stat.player2.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Advanced Metrics</h3>
              
              {[
                { label: 'Net Rating', player1: playerOne.NETRTG, player2: playerTwo.NETRTG },
                { label: 'True Shooting %', player1: playerOne['TS%'], player2: playerTwo['TS%'] },
                { label: 'Usage Rate %', player1: playerOne['USG%'], player2: playerTwo['USG%'] },
                { label: 'Assist %', player1: playerOne['AST%'], player2: playerTwo['AST%'] },
              ].map((stat, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/5 text-right pr-3">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{stat.player1.toFixed(1)}</span>
                    </div>
                    <div className="w-3/5 flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ 
                          width: `${(stat.player1 / (stat.player1 + stat.player2)) * 100}%` 
                        }}></div>
                      </div>
                      <ArrowRight className="mx-2 text-gray-400" size={16} />
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ 
                          width: `${(stat.player2 / (stat.player1 + stat.player2)) * 100}%` 
                        }}></div>
                      </div>
                    </div>
                    <div className="w-1/5 pl-3">
                      <span className="font-medium text-purple-600 dark:text-purple-400">{stat.player2.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
            <p><strong>Comparison Summary:</strong> {playerOne.PLAYER} {playerOne.PTS > playerTwo.PTS ? 'scores more points' : 'scores fewer points'} than {playerTwo.PLAYER}, 
            while {playerTwo.PLAYER} {playerTwo.AST > playerOne.AST ? 'provides more assists' : 'provides fewer assists'}. 
            {playerOne.NETRTG > playerTwo.NETRTG 
              ? `${playerOne.PLAYER} has a better net rating (${playerOne.NETRTG.toFixed(1)} vs ${playerTwo.NETRTG.toFixed(1)})`
              : `${playerTwo.PLAYER} has a better net rating (${playerTwo.NETRTG.toFixed(1)} vs ${playerOne.NETRTG.toFixed(1)})`
            }.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerComparison;