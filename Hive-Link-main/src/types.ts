export interface Location {
  id: string;
  name: string;
  coordinates: [number, number, number];
  description: string;
  thumbnail?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  savedLocations: string[];
}