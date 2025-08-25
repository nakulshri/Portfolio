import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, useLoadScript, Circle, Marker } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
  position: "absolute" as const
};

// Define libraries array outside component to prevent recreation
const libraries: Libraries = ["places"];

// Geolocation options for maximum accuracy
const geoOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

// Default center (Manipal)
const defaultCenter = {
  lat: 13.3529,
  lng: 74.7932
};

// Custom marker SVG with a larger, more prominent design
const createLocationMarkerSVG = () => {
  const svg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="12" fill="#1E88E5" stroke="white" stroke-width="6"/>
      <circle cx="24" cy="24" r="20" fill="#1E88E5" fill-opacity="0.4"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const LiveMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(() => {
    try {
      const saved = localStorage.getItem('lastKnownLocation');
      return saved ? JSON.parse(saved) : defaultCenter;
    } catch {
      return defaultCenter;
    }
  });
  const [accuracy, setAccuracy] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<string>("Waiting for precise location...");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAVKsPfKEuCPYNay1A2bOW9Gcr4Yhkgk90",
    libraries
  });

  // Function to update location
  const updateLocation = (position: GeolocationPosition) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    console.log("Updating location:", newLocation);
    
    // Save to state
    setCurrentLocation(newLocation);
    setAccuracy(position.coords.accuracy);
    setLocationSource(`GPS Accuracy: ${Math.round(position.coords.accuracy)} meters`);
    setError(null);

    // Save to localStorage
    try {
      localStorage.setItem('lastKnownLocation', JSON.stringify(newLocation));
    } catch (err) {
      console.error('Failed to save location to localStorage:', err);
    }

    // Update map if available
    if (mapRef.current) {
      mapRef.current.panTo(newLocation);
    }
  };

  // Start location tracking
  useEffect(() => {
    let watchId: number | null = null;

    const startLocationTracking = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      // Get immediate position
      navigator.geolocation.getCurrentPosition(
        updateLocation,
        (error) => {
          console.error("Error getting initial position:", error);
          setError("Unable to get your location. Please enable location services.");
        },
        geoOptions
      );

      // Start watching position
      watchId = navigator.geolocation.watchPosition(
        updateLocation,
        (error) => {
          console.error("Location watch error:", error);
          setError("Unable to track location. Please check GPS settings.");
        },
        geoOptions
      );
    };

    startLocationTracking();

    // Cleanup on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page is visible again, get fresh position
        navigator.geolocation.getCurrentPosition(
          updateLocation,
          (error) => console.error("Error getting position on visibility change:", error),
          geoOptions
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={18}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeId: "roadmap",
          styles: [
            {
              featureType: "all",
              elementType: "labels",
              stylers: [{ visibility: "on" }]
            }
          ]
        }}
        onLoad={(map) => {
          console.log("Map loaded");
          mapRef.current = map;
          map.panTo(currentLocation);
        }}
      >
        {/* Main location marker */}
        <Marker
          position={currentLocation}
          icon={{
            url: createLocationMarkerSVG(),
            scaledSize: new google.maps.Size(48, 48),
            anchor: new google.maps.Point(24, 24)
          }}
          options={{
            clickable: false
          }}
          zIndex={1000}
        />

        {/* Accuracy circle */}
        <Circle
          center={currentLocation}
          radius={accuracy}
          options={{
            strokeColor: "#1E88E5",
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: "#1E88E5",
            fillOpacity: 0.1
          }}
        />
      </GoogleMap>

      {/* Location accuracy indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm">
        {locationSource}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Location button */}
      <button
        onClick={() => {
          if (mapRef.current) {
            mapRef.current.panTo(currentLocation);
            mapRef.current.setZoom(18);
          }
        }}
        className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Center on current location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default LiveMap;
