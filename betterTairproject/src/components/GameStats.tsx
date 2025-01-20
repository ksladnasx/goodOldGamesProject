import React from 'react';

interface GameStatsProps {
  score: number;
  level: number;
  lines: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ score, level, lines }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-1">Score</h3>
        <p className="text-2xl font-mono">{score}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-1">Level</h3>
        <p className="text-2xl font-mono">{level}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">Lines</h3>
        <p className="text-2xl font-mono">{lines}</p>
      </div>
    </div>
  );
};