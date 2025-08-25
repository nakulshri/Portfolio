interface Room {
    id: string
    name: string
    x: number
    y: number
    floor: number
    width: number
    height: number
    type?: string
    building?: string
}

// Sample room data based on the floor plan image
export const ROOMS: Room[] = [
  // Top row
  { id: "101", name: "Room 101", x: 50, y: 50, width: 80, height: 80, floor: 1 },
  { id: "102", name: "Room 102", x: 140, y: 50, width: 80, height: 80, floor: 1 },
  { id: "103", name: "Room 103", x: 230, y: 50, width: 80, height: 80, floor: 1 },
  { id: "104", name: "Room 104", x: 320, y: 50, width: 80, height: 80, floor: 1 },
  { id: "105", name: "Room 105", x: 410, y: 50, width: 80, height: 80, floor: 1 },
  { id: "106", name: "Room 106", x: 500, y: 50, width: 80, height: 80, floor: 1 },
  { id: "107", name: "Room 107", x: 590, y: 50, width: 80, height: 80, floor: 1 },
  
  // Left column
  { id: "108", name: "Room 108", x: 50, y: 140, width: 80, height: 80, floor: 1 },
  { id: "109", name: "Room 109", x: 50, y: 230, width: 80, height: 80, floor: 1 },
  { id: "110", name: "Room 110", x: 50, y: 320, width: 80, height: 80, floor: 1 },
  { id: "111", name: "Room 111", x: 50, y: 410, width: 80, height: 80, floor: 1 },
  { id: "112", name: "Room 112", x: 50, y: 500, width: 80, height: 80, floor: 1 },
  { id: "113", name: "Room 113", x: 50, y: 590, width: 80, height: 80, floor: 1 },
  
  // Right column
  { id: "114", name: "Room 114", x: 590, y: 140, width: 80, height: 80, floor: 1 },
  { id: "115", name: "Room 115", x: 590, y: 230, width: 80, height: 80, floor: 1 },
  { id: "116", name: "Room 116", x: 590, y: 320, width: 80, height: 80, floor: 1 },
  { id: "117", name: "Room 117", x: 590, y: 410, width: 80, height: 80, floor: 1 },
  { id: "118", name: "Room 118", x: 590, y: 500, width: 80, height: 80, floor: 1 },
  { id: "119", name: "Room 119", x: 590, y: 590, width: 80, height: 80, floor: 1 },
  
  // Center corridor
  { id: "corridor", name: "Corridor", x: 270, y: 200, width: 180, height: 400, floor: 1 },
];

interface Graph {
  [key: string]: string[]
}

interface NavigationNode {
  id: string
  name: string
  x: number
  y: number
  floor: number
  type: "room" | "corridor" | "junction" | "stairs" | "elevator"
  building: string
}

// Function to calculate distance between two points
const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// Function to check if two nodes are connected (within reasonable distance)
const areRoomsConnected = (node1: Room | NavigationNode, node2: Room | NavigationNode, maxDistance = 100): boolean => {
  // If nodes are in different buildings, they're not connected
  if (node1.building !== node2.building) {
    return false
  }

  // If nodes are on different floors, they're only connected through stairs/elevator nodes
  if (node1.floor !== node2.floor) {
    return false
  }

  // If both nodes are on the same floor, check their distance
  const distance = calculateDistance(node1.x, node1.y, node2.x, node2.y)

  // For corridors, increase the connection distance
  if (node1.type === "corridor" || node2.type === "corridor") {
    return distance <= maxDistance * 1.5
  }

  // For junctions, increase the connection distance even more
  if (node1.type === "junction" || node2.type === "junction") {
    return distance <= maxDistance * 2
  }

  // For regular rooms, use standard distance
  return distance <= maxDistance
}

// Generate navigation nodes for the building
export const generateNavigationNodes = (rooms: Room[]): NavigationNode[] => {
  const nodes: NavigationNode[] = []

  // Convert rooms to navigation nodes
  rooms.forEach((room) => {
    nodes.push({
      id: room.id,
      name: room.name,
      x: room.x,
      y: room.y,
      floor: room.floor,
      type: (room.type as "room" | "corridor" | "junction" | "stairs" | "elevator") || "room",
      building: room.building || "unknown",
    })
  })

  // Add corridor junctions for each floor and building
  const buildings = ["AB1", "AB2"]
  const floors = [0, 1, 2, 3]

  buildings.forEach((building) => {
    floors.forEach((floor) => {
      // Add corridor junctions at key points
      // Main corridor junction (center)
      nodes.push({
        id: `${building}-${floor}-junction-center`,
        name: "Junction",
        x: building === "AB1" ? 4 : 44, // Adjust based on building
        y: 16,
        floor,
        type: "junction",
        building,
      })

      // Left wing junctions
      nodes.push({
        id: `${building}-${floor}-junction-left-1`,
        name: "Junction",
        x: building === "AB1" ? 4 : 44,
        y: 4,
        floor,
        type: "junction",
        building,
      })

      nodes.push({
        id: `${building}-${floor}-junction-left-2`,
        name: "Junction",
        x: building === "AB1" ? 4 : 44,
        y: 12,
        floor,
        type: "junction",
        building,
      })

      // Right wing junctions
      nodes.push({
        id: `${building}-${floor}-junction-right-1`,
        name: "Junction",
        x: building === "AB1" ? 12 : 52,
        y: 4,
        floor,
        type: "junction",
        building,
      })

      nodes.push({
        id: `${building}-${floor}-junction-right-2`,
        name: "Junction",
        x: building === "AB1" ? 12 : 52,
        y: 12,
        floor,
        type: "junction",
        building,
      })

      // Top wing junctions
      nodes.push({
        id: `${building}-${floor}-junction-top-1`,
        name: "Junction",
        x: building === "AB1" ? 6 : 46,
        y: 28,
        floor,
        type: "junction",
        building,
      })

      nodes.push({
        id: `${building}-${floor}-junction-top-2`,
        name: "Junction",
        x: building === "AB1" ? 10 : 50,
        y: 28,
        floor,
        type: "junction",
        building,
      })
    })
  })

  return nodes
}

// Function to get graph for a specific floor
export const getGraphForFloor = (nodes: NavigationNode[], floor: number): Graph => {
  const graph: Graph = {}
  const floorNodes = nodes.filter((node) => node.floor === floor)

  // Create connections between nodes on the same floor
  floorNodes.forEach((node1) => {
    graph[node1.id] = []

    floorNodes.forEach((node2) => {
      if (node1.id !== node2.id) {
        // Connect rooms to nearby junctions and corridors
        if (
          (node1.type === "room" && (node2.type === "junction" || node2.type === "corridor")) ||
          (node2.type === "room" && (node1.type === "junction" || node1.type === "corridor")) ||
          (node1.type === "junction" && node2.type === "junction") ||
          (node1.type === "corridor" && node2.type === "corridor") ||
          (node1.type === "junction" && node2.type === "corridor") ||
          (node1.type === "corridor" && node2.type === "junction")
        ) {
          if (areRoomsConnected(node1, node2)) {
            graph[node1.id].push(node2.id)
          }
        }

        // Connect stairs and elevators to all junctions on the same floor
        if (
          (node1.type === "stairs" || node1.type === "elevator") &&
          (node2.type === "junction" || node2.type === "corridor")
        ) {
          graph[node1.id].push(node2.id)
        }

        if (
          (node2.type === "stairs" || node2.type === "elevator") &&
          (node1.type === "junction" || node1.type === "corridor")
        ) {
          graph[node1.id].push(node2.id)
        }
      }
    })
  })

  return graph
}

// Add new type for navigation preferences
export type NavigationPreference = 'stairs' | 'elevator' | 'auto';

// Function to find shortest path between two rooms
export const findShortestPath = (
  nodes: NavigationNode[], 
  startId: string, 
  endId: string,
  preference: NavigationPreference = 'auto'
): string[] | null => {
  const startNode = nodes.find((node) => node.id === startId)
  const endNode = nodes.find((node) => node.id === endId)

  if (!startNode || !endNode) {
    console.error("Node not found:", { startId, endId })
    return null
  }

  // If nodes are on different floors, create a path through stairs/elevator
  if (startNode.floor !== endNode.floor) {
    const path = [startId]

    // Find the nearest junction to the start node
    const startJunctions = nodes.filter(
      (node) => node.type === "junction" && node.floor === startNode.floor && node.building === startNode.building,
    )

    let nearestStartJunction = startJunctions[0]
    let minDistance = Number.POSITIVE_INFINITY

    startJunctions.forEach((junction) => {
      const distance = calculateDistance(startNode.x, startNode.y, junction.x, junction.y)
      if (distance < minDistance) {
        minDistance = distance
        nearestStartJunction = junction
      }
    })

    if (nearestStartJunction) {
      path.push(nearestStartJunction.id)
    }

    // Find the nearest stairs/elevator based on preference
    let verticalTransport: NavigationNode | undefined;
    
    if (preference === 'stairs') {
      // First try to find stairs
      verticalTransport = nodes.find(
        (node) => node.type === "stairs" && 
        node.floor === startNode.floor && 
        node.building === startNode.building
      );
      
      // If stairs not found, try elevator
      if (!verticalTransport) {
        verticalTransport = nodes.find(
          (node) => node.type === "elevator" && 
          node.floor === startNode.floor && 
          node.building === startNode.building
        );
      }
    } else if (preference === 'elevator') {
      // First try to find elevator
      verticalTransport = nodes.find(
        (node) => node.type === "elevator" && 
        node.floor === startNode.floor && 
        node.building === startNode.building
      );
      
      // If elevator not found, try stairs
      if (!verticalTransport) {
        verticalTransport = nodes.find(
          (node) => node.type === "stairs" && 
          node.floor === startNode.floor && 
          node.building === startNode.building
        );
      }
    } else {
      // Auto: prefer stairs for 1 floor difference, elevator for more
      const floorDiff = Math.abs(endNode.floor - startNode.floor);
      const preferredType = floorDiff === 1 ? 'stairs' : 'elevator';
      
      // Try preferred type first
      verticalTransport = nodes.find(
        (node) => node.type === preferredType && 
        node.floor === startNode.floor && 
        node.building === startNode.building
      );
      
      // If preferred type not found, try the other type
      if (!verticalTransport) {
        verticalTransport = nodes.find(
          (node) => node.type === (preferredType === 'stairs' ? 'elevator' : 'stairs') && 
          node.floor === startNode.floor && 
          node.building === startNode.building
        );
      }
    }

    if (verticalTransport) {
      path.push(verticalTransport.id)

      // Find stairs/elevator on destination floor
      const destVerticalTransport = nodes.find(
        (node) =>
          node.type === verticalTransport!.type &&
          node.floor === endNode.floor &&
          node.building === endNode.building &&
          node.x === verticalTransport!.x &&
          node.y === verticalTransport!.y,
      )

      if (destVerticalTransport) {
        path.push(destVerticalTransport.id)
      }
    }

    // Find the nearest junction to the destination node
    const endJunctions = nodes.filter(
      (node) => node.type === "junction" && node.floor === endNode.floor && node.building === endNode.building,
    )

    let nearestEndJunction = endJunctions[0]
    minDistance = Number.POSITIVE_INFINITY

    endJunctions.forEach((junction) => {
      const distance = calculateDistance(endNode.x, endNode.y, junction.x, junction.y)
      if (distance < minDistance) {
        minDistance = distance
        nearestEndJunction = junction
      }
    })

    if (nearestEndJunction) {
      path.push(nearestEndJunction.id)
    }

    path.push(endId)
    return path
  }

  // If nodes are on the same floor, use BFS to find the shortest path
  const graph = getGraphForFloor(nodes, startNode.floor)
  const queue: string[][] = [[startId]]
  const visited = new Set<string>([startId])

  while (queue.length > 0) {
    const path = queue.shift()!
    const current = path[path.length - 1]

    if (current === endId) {
      return path
    }

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([...path, neighbor])
      }
    }
  }

  // If no path found through the graph, try to find a path through junctions
  const startJunctions = nodes.filter(
    (node) => node.type === "junction" && node.floor === startNode.floor && node.building === startNode.building,
  )

  const endJunctions = nodes.filter(
    (node) => node.type === "junction" && node.floor === endNode.floor && node.building === endNode.building,
  )

  let nearestStartJunction = startJunctions[0]
  let nearestEndJunction = endJunctions[0]
  let minStartDistance = Number.POSITIVE_INFINITY
  let minEndDistance = Number.POSITIVE_INFINITY

  startJunctions.forEach((junction) => {
    const distance = calculateDistance(startNode.x, startNode.y, junction.x, junction.y)
    if (distance < minStartDistance) {
      minStartDistance = distance
      nearestStartJunction = junction
    }
  })

  endJunctions.forEach((junction) => {
    const distance = calculateDistance(endNode.x, endNode.y, junction.x, junction.y)
    if (distance < minEndDistance) {
      minEndDistance = distance
      nearestEndJunction = junction
    }
  })

  return [startId, nearestStartJunction.id, nearestEndJunction.id, endId]
}

// Function to determine direction between two points from user's perspective
const getDirection = (fromX: number, fromY: number, toX: number, toY: number, isLeavingRoom: boolean = false): string => {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // When leaving a room, determine direction based on angle
  if (isLeavingRoom) {
    if (angle >= -45 && angle < 45) {
      return "right"
    } else if (angle >= 45 && angle < 135) {
      return "straight ahead"
    } else if (angle >= 135 || angle < -135) {
      return "left"
    } else {
      return "behind you"
    }
  } else {
    // For subsequent directions, use more specific angles
    if (angle >= -22.5 && angle < 22.5) {
      return "right"
    } else if (angle >= 22.5 && angle < 67.5) {
      return "diagonally right"
    } else if (angle >= 67.5 && angle < 112.5) {
      return "straight ahead"
    } else if (angle >= 112.5 && angle < 157.5) {
      return "diagonally left"
    } else if (angle >= 157.5 || angle < -157.5) {
      return "left"
    } else if (angle >= -157.5 && angle < -112.5) {
      return "behind you and to the left"
    } else if (angle >= -112.5 && angle < -67.5) {
      return "behind you"
    } else {
      return "behind you and to the right"
    }
  }
}

// Function to determine turn direction
const getTurnDirection = (prevDirection: string, nextDirection: string): string | null => {
  if (prevDirection === nextDirection) return null // No turn

  if (
    (prevDirection === "forward" && nextDirection === "right") ||
    (prevDirection === "right" && nextDirection === "backward") ||
    (prevDirection === "backward" && nextDirection === "left") ||
    (prevDirection === "left" && nextDirection === "forward")
  ) {
    return "right"
  }

  return "left"
}

// Function to generate human-readable directions
export function generateDirections(
  nodes: NavigationNode[], 
  path: string[],
  preference: NavigationPreference = 'auto'
): { directions: string[], pathRooms: string[] } {
  if (path.length < 2) {
      return { directions: [], pathRooms: [] };
  }

  const directions: string[] = [];
  const pathRooms: string[] = [];
  
  for (let i = 0; i < path.length - 1; i++) {
      const current = nodes.find(n => n.id === path[i]);
      const next = nodes.find(n => n.id === path[i + 1]);
      
      if (!current || !next) continue;

      // Add room to pathRooms if it's a room (not corridor/junction/stairs/elevator)
      if (current.type === 'room') {
          pathRooms.push(current.id);
      }
      if (i === path.length - 2 && next.type === 'room') {
          pathRooms.push(next.id);
      }

      // Generate direction based on node types and movement
      if (i === 0) {
          const direction = getDirectionFromCoords(current, next);
          if (direction === 'backward') {
              directions.push(`When you leave the room, turn around and walk forward`);
          } else {
              directions.push(`When you leave the room, walk ${direction}`);
          }
          continue;
      }

      const prev = nodes.find(n => n.id === path[i - 1]);
      if (!prev) continue;

      // Find the actual room we're coming from and going to for floor numbers
      const startRoom = nodes.find(n => n.id === path[0]);
      const endRoom = nodes.find(n => n.id === path[path.length - 1]);
      
      if (!startRoom || !endRoom) continue;

      if (next.type === 'stairs' && current.type !== 'stairs') {
          if (startRoom.floor > endRoom.floor) {
              directions.push(`Walk to the stairs and go down from floor ${startRoom.floor} to floor ${endRoom.floor}`);
          } else if (startRoom.floor < endRoom.floor) {
              directions.push(`Walk to the stairs and go up from floor ${startRoom.floor} to floor ${endRoom.floor}`);
          }
      } else if (next.type === 'elevator' && current.type !== 'elevator') {
          if (startRoom.floor > endRoom.floor) {
              directions.push(`Walk to the elevator and go down from floor ${startRoom.floor} to floor ${endRoom.floor}`);
          } else if (startRoom.floor < endRoom.floor) {
              directions.push(`Walk to the elevator and go up from floor ${startRoom.floor} to floor ${endRoom.floor}`);
          }
      } else if (next.type === 'room' && i === path.length - 2) {
          const turn = getNodeTurnDirection(prev, current, next);
          if (turn) {
              directions.push(`Turn ${turn} and walk straight to reach Room ${next.id.split('-')[1]}`);
          } else {
              directions.push(`Walk straight ahead to reach Room ${next.id.split('-')[1]}`);
          }
      } else if (current.type === 'corridor' || current.type === 'junction') {
          const turn = getNodeTurnDirection(prev, current, next);
          if (turn) {
              if (current.type === 'corridor') {
                  directions.push(`At the corridor, turn ${turn}`);
              } else {
                  directions.push(`At the intersection, turn ${turn}`);
              }
          }
      }
  }

  return { directions, pathRooms };
}

function getDirectionFromCoords(from: NavigationNode, to: NavigationNode): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  // Use a larger threshold for diagonal detection
  const isDiagonal = Math.abs(Math.abs(dx) - Math.abs(dy)) < 0.5;
  
  if (isDiagonal) {
      if (dx > 0 && dy > 0) return 'diagonally right';
      if (dx < 0 && dy > 0) return 'diagonally left';
      if (dx > 0 && dy < 0) return 'diagonally right';
      if (dx < 0 && dy < 0) return 'diagonally left';
  }
  
  if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
  } else {
      return dy > 0 ? 'forward' : 'backward';
  }
}

function getNodeTurnDirection(prev: NavigationNode, current: NavigationNode, next: NavigationNode): string | null {
  const prevAngle = Math.atan2(current.y - prev.y, current.x - prev.x);
  const nextAngle = Math.atan2(next.y - current.y, next.x - current.x);
  
  let angleDiff = nextAngle - prevAngle;
  // Normalize angle to [-π, π]
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  
  // Only return turn direction if the angle is significant
  if (Math.abs(angleDiff) < Math.PI / 6) return null; // Less than 30 degrees
  
  if (angleDiff > 0) {
      return angleDiff > 2 * Math.PI / 3 ? 'right' : 'slightly right';
  } else {
      return angleDiff < -2 * Math.PI / 3 ? 'left' : 'slightly left';
  }
}
  
  