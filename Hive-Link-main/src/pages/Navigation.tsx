"use client"

import React, { useState, useEffect, useCallback } from "react"
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Navigation as NavigationIcon, X } from "lucide-react"
import FloorPlanCanvas from "../components/FloorPlanCanvas"
import FloorSelector from "../components/floor-selector"
import { findShortestPath, generateDirections, NavigationPreference } from "../utils/graph-utils"
import Building3D from '../components/Building3D'
import ARView from "../components/ARView"

interface Room {
    id: string;
    building: 'AB1' | 'AB2';
    roomNumber: string;
    name: string;
    x: number;
    y: number;
    floor: number;
    type: "room" | "corridor" | "junction" | "stairs" | "elevator";
}

// Generate room data for both buildings
const generateRooms = (): Room[] => {
    const rooms: Room[] = [];
    const buildings: ('AB1' | 'AB2')[] = ['AB1', 'AB2'];
    const floors = [0, 1, 2, 3]; // Include floor 3
    const roomsPerFloor = 40;

    buildings.forEach(building => {
        floors.forEach(floor => {
            for (let i = 1; i <= roomsPerFloor; i++) {
                // Create room numbers like 001, 101, 201, 301 for each floor
                const roomNumber = `${floor}${i.toString().padStart(2, '0')}`;
                const x = 20 + (i % 10) * 6; // Maintain the same layout
                const y = 20 + Math.floor(i / 10) * 6;

                rooms.push({
                    id: `${building}-${roomNumber}`,
                    building,
                    roomNumber,
                    name: `${roomNumber}`, // Just show the room number without building prefix
                    x,
                    y,
                    floor,
                    type: "room"
                });
            }

            // Add corridors for each floor
            rooms.push({
                id: `${building}-${floor}-corridor`,
                building,
                roomNumber: `corridor-${floor}`,
                name: "Corridor",
                x: 15,
                y: 15,
                floor,
                type: "corridor"
            });

            // Add stairs for each floor
            if (floor < 3) { // Stairs connect floors 0-3
                rooms.push({
                    id: `${building}-${floor}-stairs`,
                    building,
                    roomNumber: `stairs-${floor}`,
                    name: "Stairs",
                    x: 10,
                    y: 10,
                    floor,
                    type: "stairs"
                });
            }

            // Add elevators for each floor
            rooms.push({
                id: `${building}-${floor}-elevator`,
                building,
                roomNumber: `elevator-${floor}`,
                name: "Elevator",
                x: 5,
                y: 5,
                floor,
                type: "elevator"
            });
        });
    });
    return rooms;
};

const rooms = generateRooms();

interface RoomSelectionProps {
    label: string;
    selectedBuilding: string;
    selectedRoom: string;
    onBuildingChange: (building: string) => void;
    onRoomChange: (room: string) => void;
    id: string;
    suggestions: string[];
    showSuggestions: boolean;
    onSuggestionClick: (suggestion: string) => void;
    isValid: boolean;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
    label,
    selectedBuilding,
    selectedRoom,
    onBuildingChange,
    onRoomChange,
    id,
    suggestions,
    showSuggestions,
    onSuggestionClick,
    isValid
}) => {
    return (
        <div role="group" aria-labelledby={`${id}-label`} className="relative">
            <label id={`${id}-label`} className="flex items-center gap-2 mb-2 text-[#666666]">
                <MapPin className="w-5 h-5 text-[#1a237e]" />
                {label}
            </label>
            <div className="flex gap-2">
                <select
                    value={selectedBuilding}
                    onChange={(e) => onBuildingChange(e.target.value)}
                    className="w-1/3 p-3 border border-[#e8eaf6] rounded-xl text-sm bg-[#f5f7fa] focus:ring-2 focus:ring-[#1a237e] focus:border-transparent transition-all"
                    aria-label={`Select ${label} building`}
                    id={`${id}-building`}
                >
                    <option value="">Building</option>
                    <option value="AB1">AB1</option>
                    <option value="AB2">AB2</option>
                </select>
                <div className="relative w-2/3">
                    <input
                        type="text"
                        placeholder="Room (e.g., 101)"
                        value={selectedRoom}
                        onChange={(e) => onRoomChange(e.target.value)}
                        className={`w-full p-3 border rounded-xl text-sm bg-[#f5f7fa] focus:ring-2 focus:ring-[#1a237e] focus:border-transparent transition-all ${
                            !isValid ? 'border-red-500' : 'border-[#e8eaf6]'
                        }`}
                        aria-label={`Enter ${label} room number`}
                        id={`${id}-room`}
                        aria-invalid={!isValid}
                    />
                    {!isValid && selectedRoom !== '' && (
                        <p className="text-red-500 text-xs mt-1">
                            Please enter a valid room number (e.g., 101)
                        </p>
                    )}
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-[#e8eaf6] max-h-48 overflow-y-auto">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    className="w-full text-left px-4 py-2 text-sm text-[#666666] hover:bg-[#f5f7fa] focus:bg-[#f5f7fa] focus:outline-none"
                                    onClick={() => onSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Navigation: React.FC = () => {
    const [currentScale, setCurrentScale] = useState(1)
    const [selectedFromBuilding, setSelectedFromBuilding] = useState("")
    const [selectedFromRoom, setSelectedFromRoom] = useState("")
    const [selectedToBuilding, setSelectedToBuilding] = useState("")
    const [selectedToRoom, setSelectedToRoom] = useState("")
    const [directions, setDirections] = useState<string[]>([])
    const [pathRooms, setPathRooms] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<'2d' | '3d' | 'ar'>('2d')
    const [currentFloor, setCurrentFloor] = useState(1)
    const isMobile = window.innerWidth < 768;
    const [isCalculating, setIsCalculating] = useState(false)
    const [roomSuggestions, setRoomSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeField, setActiveField] = useState<'from' | 'to' | null>(null)
    const [preference, setPreference] = useState<NavigationPreference>('auto');

    // Compute full room IDs
    const selectedFrom = selectedFromBuilding && selectedFromRoom ? `${selectedFromBuilding}-${selectedFromRoom}` : null;
    const selectedTo = selectedToBuilding && selectedToRoom ? `${selectedToBuilding}-${selectedToRoom}` : null;

    // Filter rooms by current floor
    const floorRooms = rooms.filter(room => room.floor === currentFloor)

    const handleRoomClick = (roomId: string) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        if (!selectedFrom) {
            setSelectedFromBuilding(room.building);
            setSelectedFromRoom(room.roomNumber);
            updateDirections();
        } else if (!selectedTo) {
            setSelectedToBuilding(room.building);
            setSelectedToRoom(room.roomNumber);
            updateDirections();
        } else {
            setSelectedFromBuilding(room.building);
            setSelectedFromRoom(room.roomNumber);
            setSelectedToBuilding("");
            setSelectedToRoom("");
            setDirections([]);
        }
    };

    const handleZoomIn = () => {
        setCurrentScale((prev) => Math.min(prev + 0.1, 2))
    }

    const handleZoomOut = () => {
        setCurrentScale((prev) => Math.max(prev - 0.1, 0.5))
    }

    const handleResetView = () => {
        setCurrentScale(1)
    }

    const updateDirections = () => {
        if (!selectedFrom || !selectedTo) {
            setDirections([])
            setPathRooms([])
            return
        }

        setIsCalculating(true)
        // Only generate directions in 2D mode, 3D mode will use onPathFound
        if (viewMode === '2d') {
            const path = findShortestPath(rooms, selectedFrom, selectedTo, preference)
            if (!path) {
                setDirections(["No path found between these rooms."])
                setPathRooms([])
                setIsCalculating(false)
                return
            }

            const { directions: newDirections, pathRooms: newPathRooms } = generateDirections(rooms, path, preference)
            setDirections(newDirections)
            setPathRooms(newPathRooms)
        }
        setIsCalculating(false)
    }

    const handlePathFound = (result: { directions: string[], pathRooms: string[] }) => {
        setIsCalculating(false)
        setDirections(result.directions)
        setPathRooms(result.pathRooms)
    }

    // Validate room number format
    const isValidRoomNumber = (room: string) => {
        return /^[0-3][0-9]{2}$/.test(room)
    }

    // Generate room suggestions based on input
    const generateRoomSuggestions = (input: string, building: string) => {
        if (!building || !input) return []
        
        const buildingRooms = rooms
            .filter(room => room.building === building && room.type === "room")
            .map(room => room.roomNumber)
        
        return buildingRooms.filter(room => 
            room.toLowerCase().startsWith(input.toLowerCase())
        ).slice(0, 5) // Limit to 5 suggestions
    }

    // Handle room input change with validation
    const handleRoomChange = (value: string, type: 'from' | 'to') => {
        const building = type === 'from' ? selectedFromBuilding : selectedToBuilding
        
        // Allow empty input or partial valid input
        if (value === '' || /^[0-3]?[0-9]{0,2}$/.test(value)) {
            if (type === 'from') {
                setSelectedFromRoom(value)
            } else {
                setSelectedToRoom(value)
            }
        }

        // Generate suggestions
        if (building) {
            const suggestions = generateRoomSuggestions(value, building)
            setRoomSuggestions(suggestions)
            setShowSuggestions(suggestions.length > 0)
            setActiveField(type)
        }
    }

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion: string) => {
        if (activeField === 'from') {
            setSelectedFromRoom(suggestion)
        } else {
            setSelectedToRoom(suggestion)
        }
        setShowSuggestions(false)
    }

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowSuggestions(false)
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f7fa]">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-md p-4">
                <h1 className="text-xl font-semibold text-[#1a237e]">Campus Navigation</h1>
            </div>

            {/* Main Content - Mobile First Layout */}
            <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-4" role="main">
                {/* Navigation Controls - Always on top for mobile */}
                <div className="w-full lg:w-[35%] bg-white rounded-2xl shadow-sm p-4 lg:p-5">
                    <div className="space-y-4">
                        <RoomSelection
                            label="Starting Point"
                            selectedBuilding={selectedFromBuilding}
                            selectedRoom={selectedFromRoom}
                            onBuildingChange={setSelectedFromBuilding}
                            onRoomChange={(value) => handleRoomChange(value, 'from')}
                            id="from-room"
                            suggestions={activeField === 'from' ? roomSuggestions : []}
                            showSuggestions={showSuggestions && activeField === 'from'}
                            onSuggestionClick={handleSuggestionClick}
                            isValid={selectedFromRoom === '' || isValidRoomNumber(selectedFromRoom)}
                        />

                        <RoomSelection
                            label="Destination"
                            selectedBuilding={selectedToBuilding}
                            selectedRoom={selectedToRoom}
                            onBuildingChange={setSelectedToBuilding}
                            onRoomChange={(value) => handleRoomChange(value, 'to')}
                            id="to-room"
                            suggestions={activeField === 'to' ? roomSuggestions : []}
                            showSuggestions={showSuggestions && activeField === 'to'}
                            onSuggestionClick={handleSuggestionClick}
                            isValid={selectedToRoom === '' || isValidRoomNumber(selectedToRoom)}
                        />

                        <button
                            onClick={updateDirections}
                            disabled={!selectedFrom || !selectedTo}
                            className="w-full py-3 bg-[#1a237e] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md active:scale-98 transition-all
                                disabled:bg-[#e8eaf6] disabled:text-[#666666] disabled:shadow-none"
                            aria-label="Get directions"
                        >
                            <NavigationIcon className="w-5 h-5" />
                            Get Directions
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2" role="radiogroup" aria-label="View mode">
                            <button
                                onClick={() => setViewMode('2d')}
                                className={`flex-1 p-2 rounded-lg ${
                                    viewMode === '2d' ? 'bg-[#1a237e] text-white' : 'bg-[#f5f7fa] text-[#1a237e]'
                                }`}
                                aria-pressed={viewMode === '2d'}
                                aria-label="2D View"
                            >
                                2D View
                            </button>
                            <button
                                onClick={() => setViewMode('3d')}
                                className={`flex-1 p-2 rounded-lg ${
                                    viewMode === '3d' ? 'bg-[#1a237e] text-white' : 'bg-[#f5f7fa] text-[#1a237e]'
                                }`}
                                aria-pressed={viewMode === '3d'}
                                aria-label="3D View"
                            >
                                3D View
                            </button>
                            <button
                                onClick={() => setViewMode('ar')}
                                className={`flex-1 p-2 rounded-lg ${
                                    viewMode === '3d' ? 'bg-[#1a237e] text-white' : 'bg-[#f5f7fa] text-[#1a237e]'
                                }`}
                                aria-pressed={viewMode === '3d'}
                                aria-label="3D View"
                            >
                                AR View
                            </button>
                        </div>

                        {/* Add preference selector */}
                        
                    </div>
                </div>

                {/* Map View */}
                <div className="w-full lg:w-[55%] bg-white rounded-2xl shadow-sm p-4 lg:p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[#1a237e]">Building Floor Plan</h2>
                        <div className="flex items-center gap-4">
                            {/* Legend */}
                            <div className="hidden lg:flex items-center gap-3 text-sm text-[#666666]">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#2196f3]"></div>
                                    <span>Room</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#1a237e]"></div>
                                    <span>Start</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-[#f50057]"></div>
                                    <span>End</span>
                                </div>
                            </div>
                            {viewMode === '2d' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleZoomIn}
                                        className="p-2 rounded-lg hover:bg-[#f5f7fa] active:bg-[#e8eaf6] transition-colors"
                                        title="Zoom In"
                                    >
                                        <ZoomIn className="w-5 h-5 text-[#1a237e]" />
                                    </button>
                                    <button
                                        onClick={handleZoomOut}
                                        className="p-2 rounded-lg hover:bg-[#f5f7fa] active:bg-[#e8eaf6] transition-colors"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut className="w-5 h-5 text-[#1a237e]" />
                                    </button>
                                    <button
                                        onClick={handleResetView}
                                        className="p-2 rounded-lg hover:bg-[#f5f7fa] active:bg-[#e8eaf6] transition-colors"
                                        title="Reset View"
                                    >
                                        <RotateCcw className="w-5 h-5 text-[#1a237e]" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floor Selector and Clear Selection */}
                    <div className="flex justify-between items-center mb-4">
                        <FloorSelector setFloor={setCurrentFloor} />
                        {(selectedFrom || selectedTo) && (
                            <button
                                onClick={() => {
                                    setSelectedFromBuilding("")
                                    setSelectedFromRoom("")
                                    setSelectedToBuilding("")
                                    setSelectedToRoom("")
                                    setDirections([])
                                    setPathRooms([])
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#666666] hover:bg-[#f5f7fa] rounded-lg transition-colors"
                                title="Clear Selection"
                            >
                                <X className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Room Type Indicators */}
                    <div className="flex gap-2 mb-4 text-sm text-[#666666] flex-wrap">
                        <div className="flex items-center gap-1 bg-[#f5f7fa] px-2 py-1 rounded-lg">
                            <div className="w-2 h-4 bg-[#ffcc00]"></div>
                            <span>Stairs</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#f5f7fa] px-2 py-1 rounded-lg">
                            <div className="w-2 h-4 bg-[#ff9800]"></div>
                            <span>Elevator</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#f5f7fa] px-2 py-1 rounded-lg">
                            <div className="w-2 h-4 bg-[#e0e0e0]"></div>
                            <span>Corridor</span>
                        </div>
                    </div>

                    <div className="bg-[#f5f7fa] rounded-xl h-[calc(100%-12rem)] relative overflow-hidden">
                        {viewMode === '2d' ? (
                            <div
                                className="w-full h-full relative transition-transform duration-300"
                                style={{ transform: `scale(${currentScale})` }}
                            >
                                {floorRooms.map(room => (
                                    <div
                                        key={room.id}
                                        className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white font-medium shadow-sm cursor-pointer
                                            ${selectedFrom === room.id ? 'bg-[#1a237e]' :
                                              selectedTo === room.id ? 'bg-[#f50057]' : 'bg-[#2196f3]'}`}
                                        style={{ left: `${room.x}%`, top: `${room.y}%` }}
                                        title={room.name}
                                        onClick={() => handleRoomClick(room.id)}
                                    >
                                        {selectedFrom === room.id ? 'F' :
                                         selectedTo === room.id ? 'T' : ''}
                                    </div>
                                ))}
                            </div>
                        ) : viewMode === '3d' ? (
                            <Building3D
                                selectedFrom={selectedFrom}
                                selectedTo={selectedTo}
                                onRoomClick={handleRoomClick}
                                onPathFound={handlePathFound}
                            />
                        ) : selectedFrom && selectedTo ? (
                            <ARView
                                source={rooms.find(r => r.id === selectedFrom)!}
                                destination={rooms.find(r => r.id === selectedTo)!}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-center p-4">
                                Please select both starting and destination rooms to use AR View.
                            </div>
                        )}
                    </div>

                </div>

                {/* Navigation Instructions - Below map on mobile */}
                <div className="w-full lg:w-[35%] bg-white rounded-2xl shadow-sm p-4 lg:p-5 mt-4 lg:mt-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[#1a237e]">Navigation Instructions</h2>
                        {isCalculating && (
                            <div className="flex items-center gap-2 text-sm text-[#666666]">
                                <div className="w-4 h-4 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin"></div>
                                Calculating...
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        {directions.length > 0 ? (
                            <>
                                {selectedFrom && selectedTo && (
                                    <div className="bg-[#f5f7fa] p-4 rounded-xl text-sm">
                                        <div className="flex items-center gap-2 text-[#1a237e] font-medium">
                                            <MapPin className="w-4 h-4" />
                                            Route Details
                                        </div>
                                        <div className="mt-2 text-[#666666] space-y-1">
                                            <div>From: {selectedFromBuilding}-{selectedFromRoom}</div>
                                            <div>To: {selectedToBuilding}-{selectedToRoom}</div>
                                        </div>
                                    </div>
                                )}
                                {directions.map((direction, index) => (
                                    <div key={index} className="bg-[#f5f7fa] p-4 rounded-xl text-sm text-[#666666]">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-grow">{direction}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="bg-[#f5f7fa] p-4 rounded-xl text-sm text-[#666666] text-center">
                                {isCalculating ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-[#1a237e] border-t-transparent rounded-full animate-spin"></div>
                                        Calculating route...
                                    </div>
                                ) : (
                                    "Select your starting and destination rooms to get directions"
                                )}
                            </div>
                        )}
                    </div>

                    {/* Path Waypoints Box */}
                    {pathRooms.length > 0 && !isCalculating && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-[#1a237e] mb-2">Path Waypoints</h3>
                            <div className="bg-[#f5f7fa] p-4 rounded-xl">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {pathRooms.map((room, index) => (
                                        <React.Fragment key={index}>
                                            <span className="text-sm text-[#666666] bg-white px-2 py-1 rounded">
                                                Room {room.split('-')[1]}
                                            </span>
                                            {index < pathRooms.length - 1 && (
                                                <span className="text-[#666666]">→</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navigation 