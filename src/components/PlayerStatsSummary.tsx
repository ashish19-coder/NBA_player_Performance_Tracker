import React from 'react';
import { Player } from '../types/Player';

interface PlayerStatsSummaryProps {
  player: Player;
}

const PlayerStatsSummary: React.FC<PlayerStatsSummaryProps> = ({ player }) => {
  // Format height from inches to feet and inches
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  const getDraftStatus = () => {
    if (player['DRAFT ROUND'] === 'Undrafted') {
      return 'Undrafted';
    }
    return `${player['DRAFT YEAR']} Draft, Rd ${player['DRAFT ROUND']} Pick ${player['DRAFT NUMBER']}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-6">
        <div className="flex flex-col md:flex-row items-center">
          <img 
            src={player.imageUrl} 
            alt={player.PLAYER} 
            className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4 md:mb-0 md:mr-6"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{player.PLAYER}</h1>
            <div className="flex flex-col md:flex-row md:items-center text-blue-100 mt-2">
              <span className="font-semibold text-xl text-white">{player.TEAM}</span>
              <span className="hidden md:block mx-2">•</span>
              <span>Age: {player.AGE}</span>
              <span className="hidden md:block mx-2">•</span>
              <span>{formatHeight(player.HEIGHT)} | {player.WEIGHT} lbs</span>
            </div>
            <div className="mt-1 text-blue-100">
              <span>{player.COUNTRY}</span>
              {player.COLLEGE !== 'None' && (
                <>
                  <span className="mx-2">•</span>
                  <span>{player.COLLEGE}</span>
                </>
              )}
            </div>
            <div className="mt-1 text-blue-100">
              {getDraftStatus()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-sm">Points</span>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{player.PTS.toFixed(1)}</span>
            <span className="block text-gray-500 dark:text-gray-400 text-xs mt-1">Per Game</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-sm">Rebounds</span>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{player.REB.toFixed(1)}</span>
            <span className="block text-gray-500 dark:text-gray-400 text-xs mt-1">Per Game</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-sm">Assists</span>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{player.AST.toFixed(1)}</span>
            <span className="block text-gray-500 dark:text-gray-400 text-xs mt-1">Per Game</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <span className="block text-gray-500 dark:text-gray-400 text-sm">Net Rating</span>
            <span className={`text-3xl font-bold ${
              player.NETRTG > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {player.NETRTG > 0 ? '+' : ''}{player.NETRTG.toFixed(1)}
            </span>
            <span className="block text-gray-500 dark:text-gray-400 text-xs mt-1">Impact</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Advanced Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Usage Rate</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player['USG%'].toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${player['USG%']}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">True Shooting</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player['TS%'].toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${player['TS%']}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Assist Rate</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player['AST%'].toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${player['AST%']}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Off. Rebound %</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player['OREB%'].toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${player['OREB%'] * 3}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Def. Rebound %</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player['DREB%'].toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${player['DREB%']}%` }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Games Played</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player.GP}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: `${(player.GP / 82) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsSummary;