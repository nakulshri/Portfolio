import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Room data with 3D positions
const rooms = [
    { id: '101', name: 'Room 101', position: [-2, 0, -2], size: [1, 0.2, 1] },
    { id: '102', name: 'Room 102', position: [0, 0, -2], size: [1, 0.2, 1] },
    { id: '103', name: 'Room 103', position: [2, 0, -2], size: [1, 0.2, 1] },
    { id: '104', name: 'Room 104', position: [-2, 0, 0], size: [1, 0.2, 1] },
    { id: '105', name: 'Room 105', position: [0, 0, 0], size: [1, 0.2, 1] },
    { id: '106', name: 'Room 106', position: [2, 0, 0], size: [1, 0.2, 1] },
    { id: '107', name: 'Room 107', position: [-2, 0, 2], size: [1, 0.2, 1] },
    { id: '108', name: 'Room 108', position: [0, 0, 2], size: [1, 0.2, 1] },
];

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

interface FloorPlan3DProps {
    selectedFrom?: string;
    selectedTo?: string;
}

const FloorPlan3D: React.FC<FloorPlan3DProps> = ({ selectedFrom, selectedTo }) => {
    return (
        <div className="w-full h-full">
            <Canvas shadows>
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
                        position={room.position as [number, number, number]}
                        size={room.size as [number, number, number]}
                        name={room.name}
                        isSelected={room.id === selectedFrom}
                        isDestination={room.id === selectedTo}
                    />
                ))}
            </Canvas>
        </div>
    );
};

export default FloorPlan3D; 