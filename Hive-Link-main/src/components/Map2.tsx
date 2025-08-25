import React, { useState } from 'react';
import Building3D from './Building3D';
import FloorPlan2D from './floor-plan-2d';
import Room from './Building3D';

const Map2: React.FC = () => {
    const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
    const [selectedTo, setSelectedTo] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
    const [selectedBuilding, setSelectedBuilding] = useState<'AB1' | 'AB2'>('AB2');
    const [roomNumber, setRoomNumber] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleRoomClick = (roomId: string) => {
        if (!selectedFrom) {
            setSelectedFrom(roomId);
        } else {
            setSelectedTo(roomId);
        }
    };

    const handleGetDirections = () => {
        if (selectedFrom && selectedTo) {
            // Handle directions logic
            console.log(`Getting directions from ${selectedFrom} to ${selectedTo}`);
        }
    };

    const handleReset = () => {
        setSelectedFrom(null);
        setSelectedTo(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-md p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Campus Navigation</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Controls Panel - Desktop */}
                <div className={`lg:w-80 bg-white shadow-lg p-4 lg:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                            <select
                                value={selectedBuilding}
                                onChange={(e) => setSelectedBuilding(e.target.value as 'AB1' | 'AB2')}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="AB1">AB1</option>
                                <option value="AB2">AB2</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                            <input
                                type="text"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                placeholder="Enter room number"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setViewMode('2D')}
                                className={`flex-1 p-2 rounded-md ${
                                    viewMode === '2D' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                            >
                                2D View
                            </button>
                            <button
                                onClick={() => setViewMode('3D')}
                                className={`flex-1 p-2 rounded-md ${
                                    viewMode === '3D' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                            >
                                3D View
                            </button>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={handleGetDirections}
                                disabled={!selectedFrom || !selectedTo}
                                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                Get Directions
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Reset Selection
                            </button>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>Selected From: {selectedFrom || 'None'}</p>
                            <p>Selected To: {selectedTo || 'None'}</p>
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="flex-1 relative">
                    {viewMode === '3D' ? (
                        <Building3D
                            selectedFrom={selectedFrom}
                            selectedTo={selectedTo}
                            onRoomClick={handleRoomClick}
                        />
                    ) : (
                        <FloorPlan2D
                            selectedFrom={selectedFrom}
                            selectedTo={selectedTo}
                            onRoomClick={handleRoomClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Map2; 