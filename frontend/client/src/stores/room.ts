import { create } from 'zustand'
interface RoomState { demoRoom: boolean; toggleDemoRoom: () => void }
export const useRoomStore = create<RoomState>((set) => ({
  demoRoom: false,
  toggleDemoRoom: () => set((s) => ({ demoRoom: !s.demoRoom })),
}))
