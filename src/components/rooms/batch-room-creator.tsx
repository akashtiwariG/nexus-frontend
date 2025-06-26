"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useHotelContext } from "@/providers/hotel-provider";

const roomTypes = [
  { value: "STANDARD", label: "Standard" },
  { value: "DELUXE", label: "Deluxe" },
  { value: "SUITE", label: "Suite" },
  { value: "EXECUTIVE", label: "Executive" },
  { value: "PRESIDENTIAL", label: "Presidential" },
];

type Props = {
  onSuccess: (createdCount: number) => void;
};

export default function BatchRoomCreator({ onSuccess }: Props) {
  const { selectedHotel } = useHotelContext();
  const [roomType, setRoomType] = useState<string>(roomTypes[0].value);
  const [floor, setFloor] = useState<string>("1");
  const [roomNumbers, setRoomNumbers] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!selectedHotel?.id) return;

    const hotelId = selectedHotel.id;

    const nums = roomNumbers
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean);

    if (nums.length === 0) {
      alert("Enter at least one room number.");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Fetch existing rooms for hotel
      const existingResp = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query rooms($hotelId: String!) {
              rooms(hotelId: $hotelId) {
                roomNumber
              }
            }
          `,
          variables: { hotelId },
        }),
      });

      const existingJson = await existingResp.json();
      if (existingJson.errors) throw new Error(existingJson.errors[0].message);

      const existingRoomNumbers = new Set(
        existingJson.data.rooms.map((r: any) => r.roomNumber)
      );

      // ❌ Check for duplicates
      const duplicates = nums.filter((num) => existingRoomNumbers.has(num));
      if (duplicates.length > 0) {
        alert(`Room number(s) already exist: ${duplicates.join(", ")}`);
        setIsLoading(false);
        return;
      }

      // ✅ Prepare and send mutation
      const roomsData = nums.map((num) => ({
        hotelId,
        roomNumber: num,
        floor: Number(floor),
        roomType,
      }));

      const resp = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation createMultipleRooms($roomsData: [RoomInput!]!) {
              createRooms(roomsData: $roomsData) {
                id
              }
            }
          `,
          variables: { roomsData },
        }),
      });

      const json = await resp.json();
      if (json.errors) throw new Error(json.errors[0].message);

      const createdCount = json.data.createRooms.length;
      onSuccess(createdCount);
      setRoomNumbers("");
    } catch (err) {
      alert("Failed to create rooms: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block">Room Type</label>
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger>
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((rt) => (
                <SelectItem key={rt.value} value={rt.value}>
                  {rt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block">Floor</label>
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger>
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: selectedHotel?.floorCount || 0 },
                (_, i) => i + 1
              ).map((f) => (
                <SelectItem key={f} value={f.toString()}>
                  Floor {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block">Room Numbers</label>
        <Textarea
          rows={3}
          placeholder="Enter room numbers separated by commas or spaces"
          value={roomNumbers}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setRoomNumbers(e.target.value)
          }
        />
      </div>

      <Button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Rooms"}
      </Button>
    </div>
  );
}
