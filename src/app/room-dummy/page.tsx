import type { Metadata } from "next"
//import RoomManagement from "@/components/rooms/room-dummy-manage"
export const metadata: Metadata = {
  title: "Room Management",
  description: "Create and manage rooms for your hotel properties",
}

export default function RoomManagementPage() {
  return <RoomManagement />
}

