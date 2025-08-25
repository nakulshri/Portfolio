"use client"

import React, { useEffect, useRef, useState } from "react"

interface Room {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  floor: number
}

interface PathPoint {
  x: number
  y: number
}

interface FloorPlan2DProps {
  selectedFrom: string | null | undefined
  selectedTo: string | null | undefined
  onRoomClick?: (roomId: string) => void
}

// Sample room data based on the floor plan image
const ROOMS: Room[] = [
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

const FloorPlan2D: React.FC<FloorPlan2DProps> = ({ selectedFrom, selectedTo, onRoomClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const container = canvas.parentElement;
    if (!container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw rooms
    ROOMS.forEach(room => {
      const isSelected = room.id === selectedFrom;
      const isDestination = room.id === selectedTo;

      // Room color based on state
      ctx.fillStyle = isSelected
        ? '#1a237e'
        : isDestination
        ? '#ff4081'
        : '#90caf9';

      // Draw room
      ctx.fillRect(room.x, room.y, room.width, room.height);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Room label
      ctx.fillStyle = '#000';
      ctx.font = `${isMobile ? 12 : 16}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        room.name,
        room.x + room.width / 2,
        room.y + room.height / 2
      );
    });

    // Draw path if both rooms are selected
    if (selectedFrom && selectedTo) {
      const startRoom = ROOMS.find(r => r.id === selectedFrom);
      const endRoom = ROOMS.find(r => r.id === selectedTo);

      if (startRoom && endRoom) {
        ctx.beginPath();
        ctx.moveTo(
          startRoom.x + startRoom.width / 2,
          startRoom.y + startRoom.height / 2
        );
        ctx.lineTo(
          endRoom.x + endRoom.width / 2,
          endRoom.y + endRoom.height / 2
        );
        ctx.strokeStyle = '#ff4081';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }

    ctx.restore();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [selectedFrom, selectedTo, scale, offset, isMobile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 2));
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={(e) => {
          const canvas = canvasRef.current;
          if (!canvas || !onRoomClick) return;

          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left - offset.x) / scale;
          const y = (e.clientY - rect.top - offset.y) / scale;

          const clickedRoom = ROOMS.find(room =>
            x >= room.x &&
            x <= room.x + room.width &&
            y >= room.y &&
            y <= room.y + room.height
          );

          if (clickedRoom) {
            onRoomClick(clickedRoom.id);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default FloorPlan2D

