"use client"

import type React from "react"
import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import { generateNavigationNodes, findShortestPath, generateDirections } from "../utils/graph-utils"

interface Room {
  id: string
  name: string
  building: "AB1" | "AB2" | "OLD_MESS"
  floor: 0 | 1 | 2 | 3
  position: [number, number, number]
  size: [number, number, number]
  type: "room" | "corridor" | "junction" | "stairs" | "elevator" | "lobby"
  x: number
  y: number
}

// Generate room data for both buildings
const generateRooms = (): Room[] => {
  const rooms: Room[] = []
  const buildings: ("AB1" | "AB2")[] = ["AB1", "AB2"]
  const floors = [0, 1, 2, 3]
  const roomsPerRow = 7 // 7 rooms on each side of U
  const roomWidth = 4
  const roomDepth = 4
  const roomHeight = 3
  const corridorWidth = 3
  const buildingSpacing = 40 // Horizontal spacing between buildings
  const buildingDepthOffset = 0 // Removed depth offset to make buildings parallel

  buildings.forEach((building, buildingIndex) => {
    const buildingOffset = buildingIndex * buildingSpacing
    const buildingDepth = 0 // Removed depth offset

    floors.forEach((floor) => {
      let roomCounter = 1

      // Left wing
      for (let i = 0; i < roomsPerRow; i++) {
        const roomNumber = `${floor}${roomCounter.toString().padStart(2, "0")}`
        rooms.push({
          id: `${building}-${roomNumber}`,
          name: roomNumber,
          building,
          floor: floor as 0 | 1 | 2 | 3,
          position: [buildingOffset, floor * roomHeight, i * roomDepth + buildingDepth],
          size: [roomWidth, roomHeight, roomDepth],
          type: "room",
          x: buildingOffset,
          y: i * roomDepth + buildingDepth,
        })
        roomCounter++
      }

      // Right wing
      for (let i = 0; i < roomsPerRow; i++) {
        const roomNumber = `${floor}${roomCounter.toString().padStart(2, "0")}`
        rooms.push({
          id: `${building}-${roomNumber}`,
          name: roomNumber,
          building,
          floor: floor as 0 | 1 | 2 | 3,
          position: [buildingOffset + roomWidth + corridorWidth * 2, floor * roomHeight, i * roomDepth + buildingDepth],
          size: [roomWidth, roomHeight, roomDepth],
          type: "room",
          x: buildingOffset + roomWidth + corridorWidth * 2,
          y: i * roomDepth + buildingDepth,
        })
        roomCounter++
      }

      // Top wing (connecting left and right)
      for (let i = 0; i < 5; i++) {
        const roomNumber = `${floor}${roomCounter.toString().padStart(2, "0")}`
        rooms.push({
          id: `${building}-${roomNumber}`,
          name: roomNumber,
          building,
          floor: floor as 0 | 1 | 2 | 3,
          position: [
            buildingOffset + roomWidth + i * roomWidth,
            floor * roomHeight,
            roomsPerRow * roomDepth + buildingDepth,
          ],
          size: [roomWidth, roomHeight, roomDepth],
          type: "room",
          x: buildingOffset + roomWidth + i * roomWidth,
          y: roomsPerRow * roomDepth + buildingDepth,
        })
        roomCounter++
      }

      // Add corridors
      rooms.push({
        id: `${building}-${floor}-corridor-h`,
        name: "Corridor",
        building,
        floor: floor as 0 | 1 | 2 | 3,
        position: [buildingOffset + roomWidth, floor * roomHeight, roomDepth * 3.5 + buildingDepth],
        size: [roomWidth * 6, roomHeight, corridorWidth],
        type: "corridor",
        x: buildingOffset + roomWidth,
        y: roomDepth * 3.5 + buildingDepth,
      })

      rooms.push({
        id: `${building}-${floor}-corridor-v`,
        name: "Corridor",
        building,
        floor: floor as 0 | 1 | 2 | 3,
        position: [buildingOffset + roomWidth * 3.5, floor * roomHeight, buildingDepth],
        size: [corridorWidth, roomHeight, roomDepth * 8],
        type: "corridor",
        x: buildingOffset + roomWidth * 3.5,
        y: buildingDepth,
      })

      // Add junctions (corridor intersections)
      rooms.push({
        id: `${building}-${floor}-junction-center`,
        name: "Junction",
        building,
        floor: floor as 0 | 1 | 2 | 3,
        position: [buildingOffset + roomWidth * 3.5, floor * roomHeight, roomDepth * 3.5 + buildingDepth],
        size: [corridorWidth, roomHeight, corridorWidth],
        type: "junction",
        x: buildingOffset + roomWidth * 3.5,
        y: roomDepth * 3.5 + buildingDepth,
      })

      // Add stairs and elevators based on building
      if (building === "AB2") {
        // Four stairs at corners
        if (floor <= 3) {
          // Front-left stairs
          rooms.push({
            id: `${building}-${floor}-stairs-fl`,
            name: "Stairs",
            building,
            floor: floor as 0 | 1 | 2 | 3,
            position: [buildingOffset, floor * roomHeight, buildingDepth],
            size: [roomWidth, roomHeight, roomDepth],
            type: "stairs",
            x: buildingOffset,
            y: buildingDepth,
          })
          // Front-right stairs
          rooms.push({
            id: `${building}-${floor}-stairs-fr`,
            name: "Stairs",
            building,
            floor: floor as 0 | 1 | 2 | 3,
            position: [buildingOffset + roomWidth * 6, floor * roomHeight, buildingDepth],
            size: [roomWidth, roomHeight, roomDepth],
            type: "stairs",
            x: buildingOffset + roomWidth * 6,
            y: buildingDepth,
          })
          // Back-left stairs
          rooms.push({
            id: `${building}-${floor}-stairs-bl`,
            name: "Stairs",
            building,
            floor: floor as 0 | 1 | 2 | 3,
            position: [buildingOffset, floor * roomHeight, roomDepth * 6 + buildingDepth],
            size: [roomWidth, roomHeight, roomDepth],
            type: "stairs",
            x: buildingOffset,
            y: roomDepth * 6 + buildingDepth,
          })
          // Back-right stairs
          rooms.push({
            id: `${building}-${floor}-stairs-br`,
            name: "Stairs",
            building,
            floor: floor as 0 | 1 | 2 | 3,
            position: [buildingOffset + roomWidth * 6, floor * roomHeight, roomDepth * 6 + buildingDepth],
            size: [roomWidth, roomHeight, roomDepth],
            type: "stairs",
            x: buildingOffset + roomWidth * 6,
            y: roomDepth * 6 + buildingDepth,
          })
        }

        // Two elevators at entrance
        rooms.push({
          id: `${building}-${floor}-elevator-1`,
          name: "Elevator",
          building,
          floor: floor as 0 | 1 | 2 | 3,
          position: [buildingOffset + roomWidth * 3, floor * roomHeight, buildingDepth],
          size: [roomWidth / 2, roomHeight, roomDepth],
          type: "elevator",
          x: buildingOffset + roomWidth * 3,
          y: buildingDepth,
        })
        rooms.push({
          id: `${building}-${floor}-elevator-2`,
          name: "Elevator",
          building,
          floor: floor as 0 | 1 | 2 | 3,
          position: [buildingOffset + roomWidth * 4, floor * roomHeight, buildingDepth],
          size: [roomWidth / 2, roomHeight, roomDepth],
          type: "elevator",
          x: buildingOffset + roomWidth * 4,
          y: buildingDepth,
        })
      } else {
        // Single staircase for AB1
        if (floor <= 3) {
          rooms.push({
            id: `${building}-${floor}-stairs`,
            name: "Stairs",
            building,
            floor: floor as 0 | 1 | 2 | 3,
            position: [buildingOffset + roomWidth, floor * roomHeight, roomDepth * 6 + buildingDepth],
            size: [roomWidth, roomHeight, roomDepth],
            type: "stairs",
            x: buildingOffset + roomWidth,
            y: roomDepth * 6 + buildingDepth,
          })
        }
      }
    })
  })

  // Add x and y coordinates for path finding
  return rooms.map((room) => ({
    ...room,
    x: room.position[0],
    y: room.position[2],
  })) as Room[]
}

const ROOMS = generateRooms()
const NAVIGATION_NODES = generateNavigationNodes(ROOMS)

interface RoomProps {
  position: [number, number, number]
  size: [number, number, number]
  name: string
  isSelected?: boolean
  isDestination?: boolean
  isCorridor?: boolean
  isJunction?: boolean
  isStairs?: boolean
  isElevator?: boolean
  isPathNode?: boolean
  onClick?: () => void
}

const Room: React.FC<RoomProps> = ({
  position,
  size,
  name,
  isSelected,
  isDestination,
  isCorridor,
  isJunction,
  isStairs,
  isElevator,
  isPathNode,
  onClick,
}) => {
  const isMobile = window.innerWidth < 768
  const [isHovered, setIsHovered] = useState(false)

  // Adjust room size for mobile
  const adjustedSize: [number, number, number] = isMobile ? [size[0] * 0.8, size[1] * 0.8, size[2] * 0.8] : size

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={adjustedSize} />
      <meshStandardMaterial
        color={
          isSelected
            ? "#1a237e"
            : isDestination
              ? "#ff4081"
              : isPathNode
                ? "#4caf50"
                : isHovered
                  ? "#64b5f6"
                  : isCorridor
                    ? "#e0e0e0"
                    : isJunction
                      ? "#9e9e9e"
                      : isStairs
                        ? "#ffd700"
                        : isElevator
                          ? "#ff9800"
                          : "#90caf9"
        }
        transparent
        opacity={isCorridor || isJunction ? 0.5 : 1}
      />
      {/* Room Label */}
      <Text
        position={[0, adjustedSize[1] / 2 + 0.1, 0]}
        fontSize={isMobile ? 0.3 : 0.5}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </mesh>
  )
}

interface Building3DProps {
  selectedFrom: string | null
  selectedTo: string | null
  onRoomClick?: (roomId: string) => void
  onPathFound?: (result: { directions: string[], pathRooms: string[] }) => void
}

interface PathSegment {
  points: THREE.Vector3[]
  floor: number
  color: string
}

const Path: React.FC<{
  path: string[]
  allRooms: Room[]
}> = ({ path, allRooms }) => {
  const segments = useMemo(() => {
    const pathSegments: PathSegment[] = []

    for (let i = 0; i < path.length - 1; i++) {
      const currentId = path[i]
      const nextId = path[i + 1]

      const current = allRooms.find((room) => room.id === currentId)
      const next = allRooms.find((room) => room.id === nextId)

      if (current && next) {
        // Skip if on different floors (handled by stairs/elevator)
        if (current.floor !== next.floor) continue

        const startPos = new THREE.Vector3(...current.position)
        const endPos = new THREE.Vector3(...next.position)

        pathSegments.push({
          points: [startPos, endPos],
          floor: current.floor,
          color: getFloorColor(current.floor),
        })
      }
    }

    return pathSegments
  }, [path, allRooms])

  const [glowIntensity, setGlowIntensity] = useState(0.5)

  useFrame((state) => {
    // Create a pulsing glow effect
    setGlowIntensity(0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2)
  })

  return (
    <>
      {segments.map((segment, index) => (
        <group key={index}>
          {/* Main path line */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={segment.points.length}
                array={new Float32Array(segment.points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={segment.color} linewidth={3} transparent opacity={0.8} />
          </line>
          {/* Glowing effect */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={segment.points.length}
                array={new Float32Array(segment.points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <meshStandardMaterial
              color={segment.color}
              emissive={segment.color}
              emissiveIntensity={glowIntensity}
              transparent
              opacity={0.3}
            />
          </line>
          {/* Add arrows along the path */}
          {index === segments.length - 1 && (
            <Arrow
              position={segment.points[segment.points.length - 1]}
              direction={segment.points[segment.points.length - 1]
                .clone()
                .sub(segment.points[segment.points.length - 2])
                .normalize()}
              color={segment.color}
            />
          )}
        </group>
      ))}
    </>
  )
}

// Add Arrow component for path direction indicators
const Arrow: React.FC<{
  position: THREE.Vector3
  direction: THREE.Vector3
  color: string
}> = ({ position, direction, color }) => {
  const arrowLength = 2
  const arrowWidth = 0.5

  return (
    <group position={position}>
      <mesh rotation={[0, Math.atan2(direction.x, direction.z), 0]}>
        <coneGeometry args={[arrowWidth, arrowLength, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Update floor colors to be more vibrant
const getFloorColor = (floor: number): string => {
  switch (floor) {
    case 0:
      return "#00ff00" // Bright green for ground floor
    case 1:
      return "#0088ff" // Bright blue for first floor
    case 2:
      return "#ffcc00" // Bright yellow for second floor
    case 3:
      return "#ff0000" // Bright red for third floor
    default:
      return "#ffffff"
  }
}

const CameraController: React.FC<{
  path: string[]
  allRooms: Room[]
  isAnimating: boolean
  controlsRef: React.RefObject<any>
}> = ({ path, allRooms, isAnimating, controlsRef }) => {
  const { camera } = useThree()
  const isMobile = window.innerWidth < 768
  const prevPathRef = useRef<string[]>([])
  const animationRef = useRef<any>(null)

  useEffect(() => {
    // Only animate if path has changed and we're not already animating
    if (isAnimating && controlsRef.current && path.length >= 2 && 
        JSON.stringify(path) !== JSON.stringify(prevPathRef.current)) {
      const startRoom = allRooms.find((r) => r.id === path[0])
      const endRoom = allRooms.find((r) => r.id === path[path.length - 1])

      if (startRoom && endRoom) {
        // Calculate target position based on start and end rooms
        const targetX = (startRoom.position[0] + endRoom.position[0]) / 2
        const targetY = Math.max(startRoom.position[1], endRoom.position[1]) + 5
        const targetZ = (startRoom.position[2] + endRoom.position[2]) / 2

        // Adjust camera position based on device
        const cameraOffset = isMobile ? 30 : 20
        const cameraHeight = isMobile ? 25 : 15

        // Clear any existing animations
        if (animationRef.current) {
          animationRef.current.kill()
        }

        // Animate camera position with smoother easing
        animationRef.current = gsap.timeline()
          .to(camera.position, {
            x: targetX + cameraOffset,
            y: targetY + cameraHeight,
            z: targetZ + cameraOffset,
            duration: 2,
            ease: "power2.inOut"
          })
          .to(controlsRef.current.target, {
            x: targetX,
            y: targetY,
            z: targetZ,
            duration: 2,
            ease: "power2.inOut"
          }, 0)

        // Update previous path
        prevPathRef.current = [...path]
      }
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [path, allRooms, isAnimating]) // Remove camera and controlsRef from dependencies

  return null
}

const Building3D: React.FC<Building3DProps> = ({ selectedFrom, selectedTo, onRoomClick, onPathFound }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [path, setPath] = useState<string[]>([])
  const pathRef = useRef<string[]>([])
  const selectedFromRoom = ROOMS.find((r) => r.id === selectedFrom)
  const selectedToRoom = ROOMS.find((r) => r.id === selectedTo)
  const isMobile = window.innerWidth < 768
  const controlsRef = useRef<any>()

  // Adjust initial camera position based on device
  const initialCameraPosition: [number, number, number] = isMobile ? [30, 30, 30] : [50, 50, 50]
  const initialFOV = isMobile ? 75 : 60

  useEffect(() => {
    if (selectedFrom && selectedTo && !isAnimating) {
      // Find path between selected rooms
      const foundPath = findShortestPath(NAVIGATION_NODES, selectedFrom, selectedTo)

      if (foundPath && JSON.stringify(foundPath) !== JSON.stringify(pathRef.current)) {
        pathRef.current = foundPath
        setPath(foundPath)

        // Generate directions and pass to parent
        const result = generateDirections(NAVIGATION_NODES, foundPath)
        if (onPathFound) {
          onPathFound(result)
        }

        // Animate camera with longer duration
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [selectedFrom, selectedTo, onPathFound])

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: initialCameraPosition, fov: initialFOV }} style={{ background: "#f5f7fa" }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[20, 5, 25]}
          minDistance={isMobile ? 15 : 10}
          maxDistance={isMobile ? 60 : 80}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          panSpeed={0.5}
        />
        {path.length > 0 && (
          <CameraController path={path} allRooms={ROOMS} isAnimating={isAnimating} controlsRef={controlsRef} />
        )}
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, -0.5, 25]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#a5d6a7" />
        </mesh>
        {/* Building Labels */}
        <Text position={[0, 15, 0]} fontSize={isMobile ? 2 : 3} color="#1a237e" anchorX="center">
          AB1
        </Text>
        <Text position={[40, 15, 0]} fontSize={isMobile ? 2 : 3} color="#1a237e" anchorX="center">
          AB2
        </Text>
        {/* Old Mess Text on Ground */}
        <Text position={[20, 0.1, 15]} fontSize={isMobile ? 1.5 : 2} color="#1a237e" anchorX="center" anchorY="middle">
          Old Mess
        </Text>
        {/* Rooms */}
        {ROOMS.map((room) => (
          <Room
            key={room.id}
            position={room.position}
            size={room.size}
            name={room.name}
            isSelected={room.id === selectedFrom}
            isDestination={room.id === selectedTo}
            isCorridor={room.type === "corridor"}
            isJunction={room.type === "junction"}
            isStairs={room.type === "stairs"}
            isElevator={room.type === "elevator"}
            isPathNode={path.includes(room.id) && room.id !== selectedFrom && room.id !== selectedTo}
            onClick={() => onRoomClick?.(room.id)}
          />
        ))}
        {/* Path Visualization */}
        {path.length > 0 && <Path path={path} allRooms={ROOMS} />}
      </Canvas>
    </div>
  )
}

export default Building3D

