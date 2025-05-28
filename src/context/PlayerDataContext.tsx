import React, { createContext, useState, useEffect, useContext } from 'react';
import { Player } from '../types/Player';
import rawPlayerData from '../data/nbaPlayerData';

interface PlayerDataContextType {
  players: Player[];
  isLoading: boolean;
  error: string | null;
}

const PlayerDataContext = createContext<PlayerDataContextType>({
  players: [],
  isLoading: true,
  error: null,
});

export const usePlayerData = () => useContext(PlayerDataContext);

const getPlayerImageUrl = (playerName: string): string => {
  // Map of player names to their image URLs from NBA.com or other reliable sources
  const playerImages: { [key: string]: string } = {
    'Aaron Gordon': 'https://www.nba.com/players/headshots/203932.png',
    'Aaron Holiday': 'https://www.nba.com/players/headshots/1628988.png',
    'Abdel Nader': 'https://www.nba.com/players/headshots/1627846.png',
    'Al Horford': 'https://www.nba.com/players/headshots/201143.png',
    'Al-Farouq Aminu': 'https://www.nba.com/players/headshots/202329.png',
    'Alan Williams': 'https://www.nba.com/players/headshots/1626210.png',
    'Alec Burks': 'https://www.nba.com/players/headshots/202692.png',
    'Alex Abrines': 'https://www.nba.com/players/headshots/203518.png',
    'Alex Caruso': 'https://www.nba.com/players/headshots/1627936.png',
    'Alex Len': 'https://www.nba.com/players/headshots/203458.png',
  };

  // Return the player's image URL if available, otherwise return a default image
  return playerImages[playerName] || 'https://www.nba.com/assets/logos/teams/primary/web/NBA.svg';
};

export const PlayerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Process CSV data from the rawPlayerData
      const lines = rawPlayerData.trim().split('\n');
      const headers = lines[0].split(',');
      
      const processedPlayers = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const player: Record<string, any> = {};
        
        headers.forEach((header, i) => {
          // Convert numeric strings to numbers
          if (['AGE', 'HEIGHT', 'WEIGHT', 'DRAFT YEAR', 'DRAFT ROUND', 'DRAFT NUMBER', 'GP', 'PTS', 'REB', 'AST'].includes(header)) {
            player[header] = values[i] === '' ? null : Number(values[i]);
          } else if (['NETRTG', 'OREB%', 'DREB%', 'USG%', 'TS%', 'AST%'].includes(header)) {
            // Convert percentage strings to numbers
            player[header] = values[i] === '' ? null : parseFloat(values[i].replace('%', ''));
          } else {
            player[header] = values[i];
          }
        });
        
        // Add a unique ID
        player.id = index;
        
        // Add real player image URL
        player.imageUrl = getPlayerImageUrl(player.PLAYER);
        
        return player as Player;
      });
      
      setPlayers(processedPlayers);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing player data:', err);
      setError('Failed to load player data');
      setIsLoading(false);
    }
  }, []);

  return (
    <PlayerDataContext.Provider value={{ players, isLoading, error }}>
      {children}
    </PlayerDataContext.Provider>
  );
};