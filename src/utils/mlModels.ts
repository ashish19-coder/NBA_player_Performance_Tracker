import KMeans from 'ml-kmeans';
import SimpleLinearRegression from 'ml-regression-simple-linear';
import { Player } from '../types/Player';

/**
 * Clusters players into groups based on their statistics
 * @param players Array of player objects
 * @param numClusters Number of clusters to create
 * @returns Object containing cluster assignments and centroids
 */
export const clusterPlayers = (players: Player[], numClusters: number = 5) => {
  // Extract features for clustering (using key stats)
  const dataset = players.map(player => [
    player.PTS,
    player.REB,
    player.AST,
    player['USG%'],
    player['TS%']
  ]);

  // Run K-means clustering
  const result = KMeans.kmeans(dataset, numClusters, {
    seed: 42,
    maxIterations: 100,
  });

  // Map cluster results back to players
  const playerClusters = players.map((player, i) => ({
    ...player,
    cluster: result.clusters[i],
  }));

  return {
    clusterAssignments: result.clusters,
    centroids: result.centroids,
    playerClusters
  };
};

/**
 * Predicts player points based on age and usage rate
 * @param player The player to predict for
 * @param players Array of all players for training
 * @returns Predicted points per game
 */
export const predictPlayerPoints = (player: Player, players: Player[]) => {
  // Simple features: age and usage rate
  const trainingX = players
    .filter(p => p.id !== player.id) // Exclude the target player
    .map(p => [p.AGE, p['USG%']]);
  
  const trainingY = players
    .filter(p => p.id !== player.id)
    .map(p => p.PTS);

  // Create and train a simple linear regression model
  const model = new SimpleLinearRegression(trainingX, trainingY);
  
  // Predict points for the target player
  const predictedPoints = model.predict([player.AGE, player['USG%']]);
  
  return predictedPoints;
};

/**
 * Gets similar players based on statistical profile
 * @param player Target player
 * @param allPlayers All players to compare against
 * @param count Number of similar players to return
 * @returns Array of similar players
 */
export const getSimilarPlayers = (player: Player, allPlayers: Player[], count: number = 5) => {
  // Calculate similarity based on key stats
  const similarities = allPlayers
    .filter(p => p.id !== player.id)
    .map(p => {
      // Calculate Euclidean distance for key metrics
      const ptsDiff = Math.pow((p.PTS - player.PTS) / 30, 2); // Normalize by max possible
      const rebDiff = Math.pow((p.REB - player.REB) / 15, 2);
      const astDiff = Math.pow((p.AST - player.AST) / 15, 2);
      const usageDiff = Math.pow((p['USG%'] - player['USG%']) / 40, 2);
      const tsDiff = Math.pow((p['TS%'] - player['TS%']) / 70, 2);
      
      // Weighted distance calculation
      const distance = Math.sqrt(
        ptsDiff * 0.3 + 
        rebDiff * 0.2 + 
        astDiff * 0.2 + 
        usageDiff * 0.15 + 
        tsDiff * 0.15
      );
      
      return {
        player: p,
        similarity: 1 / (1 + distance) // Convert distance to similarity score
      };
    })
    .sort((a, b) => b.similarity - a.similarity) // Sort by most similar
    .slice(0, count) // Take top N
    .map(item => item.player);
  
  return similarities;
};