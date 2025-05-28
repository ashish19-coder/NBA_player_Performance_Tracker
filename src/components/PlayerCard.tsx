import React from 'react';
import { Link } from 'react-router-dom';
import { Player } from '../types/Player';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  // Format height from inches to feet and inches
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  const getRatingIndicator = () => {
    if (player.NETRTG > 3) {
      return <TrendingUp className="text-green-500" size={18} />;
    } else if (player.NETRTG < -3) {
      return <TrendingDown className="text-red-500" size={18} />;
    }
    return <Minus className="text-gray-500" size={18} />;
  };

  return (
    <Link to={`/player/${player.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-2 py-1 text-xs font-semibold">
              {player.TEAM}
            </div>
          </div>
          <img 
            src={player.imageUrl} 
            alt={player.PLAYER} 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
          />
        </div>
        
        <div className="pt-16 pb-6 px-6">
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">{player.PLAYER}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-4">{player.POSITION || 'NBA Player'}</p>
          
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{player.PTS.toFixed(1)}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">PPG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{player.REB.toFixed(1)}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">RPG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{player.AST.toFixed(1)}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">APG</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400 mr-1">Rating:</span>
              {getRatingIndicator()}
              <span className={`ml-1 font-medium ${
                player.NETRTG > 3 ? 'text-green-500' : 
                player.NETRTG < -3 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {player.NETRTG > 0 ? '+' : ''}{player.NETRTG.toFixed(1)}
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {formatHeight(player.HEIGHT)} | {player.WEIGHT} lbs
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlayerCard;