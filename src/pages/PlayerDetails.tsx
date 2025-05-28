import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlayerData } from '../context/PlayerDataContext';
import PlayerStatsSummary from '../components/PlayerStatsSummary';
import StatsChart from '../components/StatsChart';
import { Player } from '../types/Player';
import { ChevronLeft, AlertTriangle, TrendingUp, Award, Users } from 'lucide-react';
import SimpleLinearRegression from 'ml-regression-simple-linear';

const PlayerDetails: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const { players, isLoading } = usePlayerData();
  const [player, setPlayer] = useState<Player | null>(null);
  const [similarPlayers, setSimilarPlayers] = useState<Player[]>([]);
  const [predictedStats, setPredictedStats] = useState<{
    points: number;
    rebounds: number;
    assists: number;
  }>({
    points: 0,
    rebounds: 0,
    assists: 0,
  });

  useEffect(() => {
    if (!isLoading && players.length > 0 && playerId) {
      const id = parseInt(playerId);
      const foundPlayer = players.find(p => p.id === id) || null;
      setPlayer(foundPlayer);
      
      if (foundPlayer) {
        // Find similar players (players with similar usage rates and positions)
        const similar = players
          .filter(p => p.id !== id)
          .map(p => ({
            player: p,
            similarity: calculateSimilarity(foundPlayer, p),
          }))
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 3)
          .map(item => item.player);
        
        setSimilarPlayers(similar);
        
        // Predict future stats using simple linear regression
        predictPlayerStats(foundPlayer);
      }
    }
  }, [playerId, players, isLoading]);

  const calculateSimilarity = (player1: Player, player2: Player) => {
    // Calculate similarity score based on usage rate, true shooting, and other stats
    const usageDiff = Math.abs(player1['USG%'] - player2['USG%']);
    const tsDiff = Math.abs(player1['TS%'] - player2['TS%']);
    const ptsDiff = Math.abs(player1.PTS - player2.PTS) / 30; // Normalize by max points
    const rebDiff = Math.abs(player1.REB - player2.REB) / 15; // Normalize by max rebounds
    const astDiff = Math.abs(player1.AST - player2.AST) / 10; // Normalize by max assists
    
    // Weighted similarity (lower is more similar)
    const weightedDiff = usageDiff * 0.3 + tsDiff * 0.3 + ptsDiff * 0.2 + rebDiff * 0.1 + astDiff * 0.1;
    
    // Convert to similarity score (higher is more similar)
    return 1 / (1 + weightedDiff);
  };

  const predictPlayerStats = (player: Player) => {
    // Simple linear regression model
    // Using age and minutes as predictors (in a real app, we'd use more advanced models)
    const averageMinutes = 30; // Average minutes per game
    const nextYearAge = player.AGE + 1;
    
    // Create a simple dataset to train model (age vs. stats)
    // In a real app this would use historical data
    const xValues = [player.AGE - 2, player.AGE - 1, player.AGE];
    
    // Assume slight improvements/declines based on age
    const pointsYValues = [
      player.PTS * 0.85,
      player.PTS * 0.95,
      player.PTS
    ];
    
    const reboundsYValues = [
      player.REB * 0.9,
      player.REB * 0.95,
      player.REB
    ];
    
    const assistsYValues = [
      player.AST * 0.85,
      player.AST * 0.95,
      player.AST
    ];
    
    try {
      // Train models
      const pointsModel = new SimpleLinearRegression(xValues, pointsYValues);
      const reboundsModel = new SimpleLinearRegression(xValues, reboundsYValues);
      const assistsModel = new SimpleLinearRegression(xValues, assistsYValues);
      
      // Predict next season
      setPredictedStats({
        points: Math.max(0, pointsModel.predict(nextYearAge)),
        rebounds: Math.max(0, reboundsModel.predict(nextYearAge)),
        assists: Math.max(0, assistsModel.predict(nextYearAge)),
      });
    } catch (err) {
      console.error('Prediction error:', err);
      // Fallback to simple projection
      setPredictedStats({
        points: player.PTS * (player.AGE < 27 ? 1.05 : 0.95),
        rebounds: player.REB * (player.AGE < 27 ? 1.03 : 0.97),
        assists: player.AST * (player.AGE < 27 ? 1.04 : 0.96),
      });
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading player data...</div>;
  }

  if (!player) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg flex items-center text-red-800 dark:text-red-200">
        <AlertTriangle size={24} className="mr-3" />
        <div>
          <h2 className="text-lg font-semibold">Player Not Found</h2>
          <p>Sorry, we couldn't find the player you're looking for.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ChevronLeft size={18} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <PlayerStatsSummary player={player} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <TrendingUp size={20} className="text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Metrics</h2>
            </div>
            
            <StatsChart 
              title="Player Stats Comparison"
              labels={['Points', 'Rebounds', 'Assists']}
              datasets={[
                {
                  label: 'Current Season',
                  data: [player.PTS, player.REB, player.AST],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                },
                {
                  label: 'League Average',
                  data: [12, 5, 3], // Example league averages
                  borderColor: 'rgb(107, 114, 128)',
                  backgroundColor: 'rgba(107, 114, 128, 0.5)',
                }
              ]}
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Award size={20} className="text-orange-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Statistical Ranks</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Points', value: player.PTS, rank: players.filter(p => p.PTS > player.PTS).length + 1 },
                { label: 'Rebounds', value: player.REB, rank: players.filter(p => p.REB > player.REB).length + 1 },
                { label: 'Assists', value: player.AST, rank: players.filter(p => p.AST > player.AST).length + 1 },
                { label: 'Net Rating', value: player.NETRTG, rank: players.filter(p => p.NETRTG > player.NETRTG).length + 1 },
                { label: 'True Shooting', value: player['TS%'], rank: players.filter(p => p['TS%'] > player['TS%']).length + 1 },
              ].map((stat, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3/5">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{stat.label}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className={`${
                          stat.rank <= players.length * 0.1 ? 'bg-green-500' :
                          stat.rank <= players.length * 0.33 ? 'bg-blue-500' :
                          stat.rank <= players.length * 0.67 ? 'bg-yellow-500' : 'bg-red-500'
                        } h-2 rounded-full`}
                        style={{ 
                          width: `${100 - (stat.rank / players.length * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-2/5 pl-4 flex items-center">
                    <div className={`
                      text-xs font-bold px-2 py-1 rounded-full
                      ${stat.rank <= players.length * 0.1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        stat.rank <= players.length * 0.33 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        stat.rank <= players.length * 0.67 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }
                    `}>
                      Rank #{stat.rank} of {players.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <TrendingUp size={20} className="text-purple-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">ML Predictions</h2>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Based on our machine learning model, here are the predicted stats for {player.PLAYER} next season:
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-1">Points</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {predictedStats.points.toFixed(1)}
                  </p>
                  <p className={`text-xs font-medium ${
                    predictedStats.points > player.PTS ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {predictedStats.points > player.PTS ? '↑' : '↓'} 
                    {Math.abs(predictedStats.points - player.PTS).toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-1">Rebounds</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {predictedStats.rebounds.toFixed(1)}
                  </p>
                  <p className={`text-xs font-medium ${
                    predictedStats.rebounds > player.REB ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {predictedStats.rebounds > player.REB ? '↑' : '↓'} 
                    {Math.abs(predictedStats.rebounds - player.REB).toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                  <p className="text-purple-700 dark:text-purple-300 text-sm mb-1">Assists</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {predictedStats.assists.toFixed(1)}
                  </p>
                  <p className={`text-xs font-medium ${
                    predictedStats.assists > player.AST ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {predictedStats.assists > player.AST ? '↑' : '↓'} 
                    {Math.abs(predictedStats.assists - player.AST).toFixed(1)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm">
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Note:</strong> Predictions are based on a simple linear regression model analyzing age and performance trajectory.
                  Many other factors like team changes, injuries, and minutes played will affect actual performance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Users size={20} className="text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Similar Players</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Players with similar statistical profiles to {player.PLAYER}:
            </p>
            
            <div className="space-y-4">
              {similarPlayers.map(similarPlayer => (
                <Link key={similarPlayer.id} to={`/player/${similarPlayer.id}`}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <img src={similarPlayer.imageUrl} alt={similarPlayer.PLAYER} className="w-12 h-12 rounded-full mr-4" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{similarPlayer.PLAYER}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{similarPlayer.TEAM}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{similarPlayer.PTS.toFixed(1)} PPG</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{similarPlayer.AGE} yrs old</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${similarPlayer['USG%']}%` }}></div>
                        </div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${similarPlayer['TS%']}%` }}></div>
                        </div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${similarPlayer['AST%']}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;