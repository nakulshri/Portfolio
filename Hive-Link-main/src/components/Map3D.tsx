import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Mesh } from 'three';
import { Location } from '../types';

interface MarkerProps {
  position: [number, number, number];
  onClick: () => void;
  isHovered: boolean;
}

function Marker({ position, onClick, isHovered }: MarkerProps) {
  return (
    <mesh position={position} onClick={onClick} scale={isHovered ? 1.2 : 1}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={isHovered ? '#2563eb' : '#3b82f6'} />
    </mesh>
  );
}

function Terrain() {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 50, 50]} />
      <meshStandardMaterial
        color="#e5e7eb"
        wireframe
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

interface Map3DProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
}

export function Map3D({ locations, onMarkerClick }: Map3DProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <Canvas shadows className="w-full h-full">
      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={20}
      />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Terrain />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.coordinates}
          onClick={() => onMarkerClick(location)}
          isHovered={hoveredMarker === location.id}
        />
      ))}
    </Canvas>
  );
}