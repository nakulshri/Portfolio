"use client"
import React, { useEffect, useRef, useState } from "react"
import { ROOMS } from "../utils/graph-utils"

interface ARViewProps {
  source: { x: number; y: number; floor: number } | undefined
  destination: { x: number; y: number; floor: number } | undefined
  currentRoom?: string
  targetRoom?: string
}

// Building orientation constants (adjust these based on actual building layout)
const BUILDING_ORIENTATION = {
  AB2: 45, // Assuming AB2 is oriented 45 degrees clockwise from true north
}

const FLOOR_REFERENCE = {
  AB2: {
    origin: { x: 0, y: 0 }, // Bottom-left corner of the building
    scale: { x: 1, y: 1 }, // Scale factors for x and y coordinates
  }
}

const VideoStream = ({ onError }: { onError: (msg: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const setupCamera = async () => {
      try {
        if (!streamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment",
            },
            audio: false,
          })
          streamRef.current = stream
        }

        if (mounted && videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current
          
          // Wait for metadata to be loaded before playing
          videoRef.current.onloadedmetadata = async () => {
            try {
              if (mounted && videoRef.current) {
                await videoRef.current.play()
                setIsLoading(false)
              }
            } catch (error) {
              console.error("Play error:", error)
              onError("Failed to start video playback")
            }
          }
        }
      } catch (error) {
        console.error("Camera setup error:", error)
        if (mounted) {
          onError(`Camera error: ${error}`)
          setIsLoading(false)
        }
      }
    }

    setupCamera()

    return () => {
      mounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [onError])

  return (
    <div className="absolute inset-0 bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="mb-2">Starting camera...</div>
            <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out"
        }}
      />
    </div>
  )
}

const ARView: React.FC<ARViewProps> = ({
  source,
  destination,
  currentRoom,
  targetRoom,
}) => {
  const [heading, setHeading] = useState(0)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState<string>("")
  const [calibratedHeading, setCalibratedHeading] = useState(0)

  // Get room coordinates
  const currentRoomData = ROOMS.find(room => room.id === currentRoom)
  const targetRoomData = ROOMS.find(room => room.id === targetRoom)

  // Calculate target angle with building orientation and floor mapping
  const calculateTargetAngle = () => {
    if (!source || !destination || !currentRoomData || !targetRoomData) return 0;

    // Only calculate if on the same floor
    if (source.floor !== destination.floor) {
      // If on different floors, point to stairs/elevator
      const stairsOrElevator = ROOMS.find(
        room => (room.type === 'stairs' || room.type === 'elevator') && 
        room.floor === source.floor && 
        room.building === currentRoomData.building
      );

      if (stairsOrElevator) {
        const dx = stairsOrElevator.x - source.x;
        const dy = stairsOrElevator.y - source.y;
        return (Math.atan2(dy, dx) * 180) / Math.PI;
      }
    }

    // Calculate relative coordinates
    const dx = destination.x - source.x;
    const dy = destination.y - source.y;

    // Apply building orientation correction
    const buildingAngle = BUILDING_ORIENTATION[currentRoomData.building as keyof typeof BUILDING_ORIENTATION] || 0;
    
    // Calculate raw angle and adjust for building orientation
    const rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return (rawAngle + buildingAngle + 360) % 360;
  }

  const targetAngle = calculateTargetAngle();
  const target = (targetAngle + 360) % 360;

  useEffect(() => {
    if (started) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          // Raw device heading
          const rawHeading = event.alpha;
          
          // Apply calibration and normalization
          const normalizedHeading = (360 - rawHeading + 360) % 360;
          setHeading(normalizedHeading);

          // Calculate the difference between true north and magnetic north
          // This can be updated based on the device's location
          const magneticDeclination = 0; // Update this based on location
          
          // Apply magnetic declination correction
          const correctedHeading = (normalizedHeading + magneticDeclination + 360) % 360;
          setCalibratedHeading(correctedHeading);
        }
      }

      window.addEventListener("deviceorientation", handleOrientation)
      return () => window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [started])

  // Calculate the angle difference with calibration
  const angleDiff = (target - calibratedHeading + 360) % 360;

  // Convert angle difference to a more user-friendly format
  const getDirectionText = (angle: number) => {
    if (angle > 337.5 || angle <= 22.5) return "North";
    if (angle > 22.5 && angle <= 67.5) return "Northeast";
    if (angle > 67.5 && angle <= 112.5) return "East";
    if (angle > 112.5 && angle <= 157.5) return "Southeast";
    if (angle > 157.5 && angle <= 202.5) return "South";
    if (angle > 202.5 && angle <= 247.5) return "Southwest";
    if (angle > 247.5 && angle <= 292.5) return "West";
    return "Northwest";
  }

  const handleStart = () => {
    setStarted(true)
    setError("") // Clear any previous errors
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {!started ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-2xl font-semibold mb-4">Start AR Navigation</h2>
          <p className="mb-6 text-sm text-gray-300">
            To begin, we need access to your camera and orientation sensors.
          </p>
          <button
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg"
          >
            Start AR View
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <VideoStream onError={setError} />
          
          {error && (
            <div className="absolute top-4 left-0 w-full text-center text-red-500 bg-black bg-opacity-50 py-2 px-4 z-20">
              {error}
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center pointer-events-none z-10">
            <div className="mb-4 text-lg shadow-lg">
              {targetRoomData ? `Navigate to ${targetRoomData.name}` : "No destination selected"}
            </div>
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-blue-500 bg-opacity-80 transition-transform duration-300 ease-out shadow-lg"
              style={{ transform: `rotate(${angleDiff}deg)` }}
            >
              ↑
            </div>
            <div className="mt-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
              {getDirectionText(target)} | {Math.round(angleDiff)}°
            </div>
            {currentRoomData && targetRoomData && (
              <div className="mt-2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                From: {currentRoomData.name} → To: {targetRoomData.name}
              </div>
            )}
            {source?.floor !== destination?.floor && (
              <div className="mt-2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                ⚠️ Different floors - Follow signs to stairs/elevator
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ARView
