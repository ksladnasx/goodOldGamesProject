import React from 'react';

export const Controls: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h3 className="text-lg font-bold mb-2">Controls</h3>
      <ul className="space-y-2">
        <li>← → : Move</li>
        <li>↓ : Soft Drop</li>
        <li>↑ : Rotate</li>
        <li>Space : Hard Drop</li>
        <li>P : Pause</li>
        <li>R : Reset</li>
      </ul>
    </div>
  );
};