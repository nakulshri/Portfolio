import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface RoomData {
    id: string;
    name: string;
    position: [number, number, number];
    size: [number, number, number];
}

// Room data with 3D positions
const roomsByFloor: Record<number, RoomData[]> = {
    1: [
        { id: '101', name: 'Room 101', position: [-2, 0, -2], size: [1, 0.2, 1] },
        { id: '102', name: 'Room 102', position: [0, 0, -2], size: [1, 0.2, 1] },
        { id: '103', name: 'Room 103', position: [2, 0, -2], size: [1, 0.2, 1] },
        { id: '104', name: 'Room 104', position: [-2, 0, 0], size: [1, 0.2, 1] },
        { id: '105', name: 'Room 105', position: [0, 0, 0], size: [1, 0.2, 1] },
        { id: '106', name: 'Room 106', position: [2, 0, 0], size: [1, 0.2, 1] },
        { id: '107', name: 'Room 107', position: [-2, 0, 2], size: [1, 0.2, 1] },
        { id: '108', name: 'Room 108', position: [0, 0, 2], size: [1, 0.2, 1] },
    ],
    2: [
        { id: '201', name: 'Room 201', position: [-2, 0, -2], size: [1, 0.2, 1] },
        { id: '202', name: 'Room 202', position: [0, 0, -2], size: [1, 0.2, 1] },
        { id: '203', name: 'Room 203', position: [2, 0, -2], size: [1, 0.2, 1] },
        { id: '204', name: 'Room 204', position: [-2, 0, 0], size: [1, 0.2, 1] },
    ],
    3: [
        { id: '301', name: 'Room 301', position: [-2, 0, -2], size: [1, 0.2, 1] },
        { id: '302', name: 'Room 302', position: [0, 0, -2], size: [1, 0.2, 1] },
        { id: '303', name: 'Room 303', position: [2, 0, -2], size: [1, 0.2, 1] },
        { id: '304', name: 'Room 304', position: [-2, 0, 0], size: [1, 0.2, 1] },
        { id: '305', name: 'Room 305', position: [0, 0, 0], size: [1, 0.2, 1] },
        { id: '306', name: 'Room 306', position: [2, 0, 0], size: [1, 0.2, 1] },
        { id: '307', name: 'Room 307', position: [-2, 0, 2], size: [1, 0.2, 1] },
        { id: '308', name: 'Room 308', position: [0, 0, 2], size: [1, 0.2, 1] },
    ]
};

interface RoomProps {
    position: [number, number, number];
    size: [number, number, number];
    name: string;
    isSelected?: boolean;
    isDestination?: boolean;
}

const Room: React.FC<RoomProps> = ({ position, size, name, isSelected, isDestination }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                castShadow
                receiveShadow
            >
                <boxGeometry args={size} />
                <meshStandardMaterial
                    color={isSelected ? '#1a237e' : isDestination ? '#f50057' : hovered ? '#2196f3' : '#e8eaf6'}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>
            <Text
                position={[0, 0.2, 0]}
                fontSize={0.1}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
            >
                {name}
            </Text>
        </group>
    );
};

interface FloorPlanCanvasProps {
    selectedFrom?: string;
    selectedTo?: string;
    currentFloor: number;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ selectedFrom, selectedTo, currentFloor }) => {
    const rooms = roomsByFloor[currentFloor] || [];

    return (
        <div className="w-full h-full">
            <Canvas
                shadows
                camera={{ position: [5, 5, 5], fov: 75 }}
                style={{ background: '#f5f7fa' }}
            >
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[5, 5, 5]}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={10}
                    target={[0, 0, 0]}
                />
                {/* Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#f5f5f5" />
                </mesh>
                {/* Rooms */}
                {rooms.map((room) => (
                    <Room
                        key={room.id}
                        position={room.position}
                        size={room.size}
                        name={room.name}
                        isSelected={room.id === selectedFrom}
                        isDestination={room.id === selectedTo}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default FloorPlanCanvas; 