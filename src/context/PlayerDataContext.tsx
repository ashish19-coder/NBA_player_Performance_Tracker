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
  // Map of player names to their NBA.com headshot IDs
  const playerImageIds: { [key: string]: string } = {
    'Aaron Gordon': '203932',
    'Aaron Holiday': '1628988',
    'Abdel Nader': '1627846',
    'Al Horford': '201143',
    'Al-Farouq Aminu': '202329',
    'Alan Williams': '1626210',
    'Alec Burks': '202692',
    'Alex Abrines': '203518',
    'Alex Caruso': '1627936',
    'Alex Len': '203458',
    'Anthony Davis': '203076',
    'Ben Simmons': '1627732',
    'Bradley Beal': '203078',
    'Brook Lopez': '201572',
    'CJ McCollum': '203468',
    'Chris Paul': '101108',
    'Damian Lillard': '203081',
    'DeMar DeRozan': '201942',
    'Devin Booker': '1626164',
    'Donovan Mitchell': '1628378',
    'Draymond Green': '203110',
    'Dwyane Wade': '2548',
    'Giannis Antetokounmpo': '203507',
    'James Harden': '201935',
    'Jayson Tatum': '1628369',
    'Jimmy Butler': '202710',
    'Joel Embiid': '203954',
    'Karl-Anthony Towns': '1626157',
    'Kawhi Leonard': '202695',
    'Kevin Durant': '201142',
    'Klay Thompson': '202691',
    'Kyle Lowry': '200768',
    'Kyrie Irving': '202681',
    'LaMarcus Aldridge': '200746',
    'LeBron James': '2544',
    'Luka Doncic': '1629029',
    'Nikola Jokic': '203999',
    'Paul George': '202331',
    'Pascal Siakam': '1627783',
    'Rudy Gobert': '203497',
    'Russell Westbrook': '201566',
    'Stephen Curry': '201939',
    'Trae Young': '1629027',
    'Victor Oladipo': '203506',
    'Zion Williamson': '1629627',
    'Zach LaVine': '203897',
    'Nikola Vucevic': '202696',
    'De\'Aaron Fox': '1628368',
    'Jamal Murray': '1627750',
    'Khris Middleton': '203114',
    'Bam Adebayo': '1628389',
    'Domantas Sabonis': '1627734',
    'Brandon Ingram': '1627742',
    'Jrue Holiday': '201950',
    'Shai Gilgeous-Alexander': '1628983',
    'Jaylen Brown': '1627759',
    'Kristaps Porzingis': '204001',
    'Deandre Ayton': '1629028',
    'John Collins': '1628381',
    'Tobias Harris': '202699',
    'Gordon Hayward': '202330',
    'Myles Turner': '1626167'
  };

  // Get the player's ID from the mapping
  const playerId = playerImageIds[playerName];

  // If we have an ID for the player, return their NBA.com headshot
  // Otherwise return the NBA logo as a fallback
  return playerId
    ? `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerId}.png`
    : 'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg';
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