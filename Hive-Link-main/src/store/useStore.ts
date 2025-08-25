import { create } from 'zustand';
import { Location, User } from '../types';

interface State {
  user: User | null;
  savedLocations: Location[];
  setUser: (user: User | null) => void;
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
}

export const useStore = create<State>((set) => ({
  user: null,
  savedLocations: [],
  setUser: (user) => set({ user }),
  addLocation: (location) =>
    set((state) => ({
      savedLocations: [...state.savedLocations, location],
    })),
  removeLocation: (locationId) =>
    set((state) => ({
      savedLocations: state.savedLocations.filter((loc) => loc.id !== locationId),
    })),
}));