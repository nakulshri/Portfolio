"use client"

import React from 'react';

interface FloorSelectorProps {
    setFloor: (floor: number) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ setFloor }) => {
    return (
        <div className="flex gap-2">
            {[1, 2, 3].map((floor) => (
                <button
                    key={floor}
                    onClick={() => setFloor(floor)}
                    className="px-4 py-2 bg-white text-[#1a237e] rounded-lg shadow-sm hover:shadow-md 
                             active:scale-95 transition-all font-medium border border-[#e8eaf6]
                             hover:bg-[#f5f7fa] focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
                >
                    Floor {floor}
                </button>
            ))}
        </div>
    );
};

export default FloorSelector;

