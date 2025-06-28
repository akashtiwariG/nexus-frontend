
// // // // "use client"

// // // // import { useState, useEffect, useCallback } from "react"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Input } from "@/components/ui/input"
// // // // import { useToast } from "@/components/ui/use-toast"
// // // // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // // // import { Save, RefreshCw, Loader2 } from "lucide-react"
// // // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // // // import { Checkbox } from "@/components/ui/checkbox"
// // // // import { Switch } from "@/components/ui/switch"
// // // // import { useHotelContext } from "@/providers/hotel-provider"
// // // // import { useSession } from "next-auth/react"
// // // // import { useMutation, useQuery } from "@apollo/client"
// // // // import { gql } from "@apollo/client"

// // // // // Updated query to include all pricing fields
// // // // const GET_ROOMS_WITH_PRICING = gql`
// // // //   query GetRoomsWithPricing($hotelId: String!) {
// // // //     rooms(hotelId: $hotelId) {
// // // //       id
// // // //       hotelId
// // // //       roomNumber
// // // //       floor
// // // //       roomType
// // // //       status
// // // //       pricePerNight
// // // //       pricePerNightMin
// // // //       pricePerNightMax
// // // //       baseOccupancy
// // // //       maxOccupancy
// // // //       extraBedAllowed
// // // //       extraBedPrice
// // // //       roomSize
// // // //       bedType
// // // //       bedCount
// // // //       amenities
// // // //       description
// // // //       images
// // // //       isSmoking
// // // //       isActive
// // // //       lastCleaned
// // // //       lastMaintained
// // // //       maintenanceNotes
// // // //       createdAt
// // // //       updatedAt
// // // //     }
// // // //   }
// // // // `

// // // // // Mutation for updating room type definitions - this one exists
// // // // const UPDATE_ROOM_TYPE = gql`
// // // //   mutation UpdateRoomType(
// // // //     $hotelId: String!
// // // //     $roomType: RoomType!
// // // //     $updateData: UpdateRoomTypeInput!
// // // //   ) {
// // // //     updateRoomType(
// // // //       hotelId: $hotelId
// // // //       roomType: $roomType
// // // //       updateData: $updateData
// // // //     ) {
// // // //       id
// // // //       roomType
// // // //       pricePerNight
// // // //       pricePerNightMin
// // // //       pricePerNightMax
// // // //       extraBedPrice
// // // //       baseOccupancy
// // // //       maxOccupancy
// // // //       extraBedAllowed
// // // //       roomSize
// // // //       bedType
// // // //       bedCount
// // // //       amenities
// // // //       description
// // // //       isSmoking
// // // //       images
// // // //     }
// // // //   }
// // // // `

// // // // interface RoomTypeData {
// // // //   id: string
// // // //   roomType: string
// // // //   price: number
// // // //   minPrice: number
// // // //   maxPrice: number
// // // //   available: number
// // // //   roomIds: string[]
// // // //   extraBedAllowed: boolean
// // // //   extraBedPrice?: number
// // // //   baseOccupancy: number
// // // //   maxOccupancy: number
// // // //   roomSize: number
// // // //   bedType: string
// // // //   bedCount: number
// // // //   amenities: string[]
// // // // }

// // // // interface WeekendRate {
// // // //   roomTypeId: string
// // // //   price: number
// // // //   minPrice: number
// // // //   maxPrice: number
// // // //   enabled: boolean
// // // // }

// // // // function useDebounce<T>(value: T, delay: number): T {
// // // //   const [debouncedValue, setDebouncedValue] = useState<T>(value)

// // // //   useEffect(() => {
// // // //     const handler = setTimeout(() => {
// // // //       setDebouncedValue(value)
// // // //     }, delay)

// // // //     return () => {
// // // //       clearTimeout(handler)
// // // //     }
// // // //   }, [value, delay])

// // // //   return debouncedValue
// // // // }

// // // // export default function PricingPage() {
// // // //   const { toast } = useToast()
// // // //   const [loading, setLoading] = useState(false)
// // // //   const [activeTab, setActiveTab] = useState("standard")

// // // //   const { selectedHotel } = useHotelContext()
// // // //   const { data: session } = useSession()

// // // //   const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([])
// // // //   const [editableRoomTypes, setEditableRoomTypes] = useState<RoomTypeData[]>([])
// // // //   const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
// // // //   const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

// // // //   const [weekendDays, setWeekendDays] = useState({
// // // //     friday: true,
// // // //     saturday: true,
// // // //     sunday: true,
// // // //   })

// // // //   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
// // // //   const [tempPrices, setTempPrices] = useState<Record<string, number>>({})

// // // //   // Fetch rooms with pricing data
// // // //   const {
// // // //     data: roomsData,
// // // //     loading: roomsLoading,
// // // //     error: roomsError,
// // // //     refetch: refetchRooms,
// // // //   } = useQuery(GET_ROOMS_WITH_PRICING, {
// // // //     variables: { hotelId: selectedHotel?.id || "" },
// // // //     skip: !selectedHotel?.id,
// // // //     fetchPolicy: "cache-and-network", // Always get fresh data
// // // //     onCompleted: (data) => {
// // // //       console.log("Rooms with pricing fetched successfully:", data)
// // // //       if (data.rooms) {
// // // //         processRoomsData(data.rooms)
// // // //       }
// // // //     },
// // // //     onError: (error) => {
// // // //       console.error("Error fetching rooms:", error)
// // // //       toast({
// // // //         title: "Error",
// // // //         description: "Failed to fetch room information from server.",
// // // //         variant: "destructive",
// // // //       })
// // // //     },
// // // //   })

// // // //   // Mutation for updating room type definitions
// // // //   const [updateRoomType] = useMutation(UPDATE_ROOM_TYPE, {
// // // //     onCompleted: (data) => {
// // // //       console.log("Room type updated successfully:", data)
// // // //     },
// // // //     onError: (error) => {
// // // //       console.error("Error updating room type:", error)
// // // //     },
// // // //   })

// // // //   const debouncedTempPrices = useDebounce(tempPrices, 800)

// // // //   // Process rooms data and extract actual pricing from backend
// // // //   const processRoomsData = (rooms: any[]) => {
// // // //     if (!rooms || rooms.length === 0) {
// // // //       setRoomTypes([])
// // // //       setEditableRoomTypes([])
// // // //       return
// // // //     }

// // // //     // Group rooms by type and extract pricing directly from backend
// // // //     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
// // // //       const roomType = room.roomType

// // // //       // Only include active rooms
// // // //       if (!room.isActive) return acc

// // // //       if (!acc[roomType]) {
// // // //         acc[roomType] = {
// // // //           rooms: [],
// // // //           totalRooms: 0,
// // // //           roomIds: [],
// // // //           basePrices: [],
// // // //           minPrices: [],
// // // //           maxPrices: [],
// // // //         }
// // // //       }

// // // //       acc[roomType].rooms.push(room)
// // // //       acc[roomType].totalRooms += 1
// // // //       acc[roomType].roomIds.push(room.id)

// // // //       // Collect actual pricing data from backend
// // // //       if (room.pricePerNight) acc[roomType].basePrices.push(room.pricePerNight)
// // // //       if (room.pricePerNightMin) acc[roomType].minPrices.push(room.pricePerNightMin)
// // // //       if (room.pricePerNightMax) acc[roomType].maxPrices.push(room.pricePerNightMax)

// // // //       return acc
// // // //     }, {})

// // // //     const roomTypesForPricing: RoomTypeData[] = Object.entries(roomTypeGroups).map(
// // // //       ([typeName, data]: [string, any]) => {
// // // //         // Use actual backend pricing data
// // // //         const basePrices = data.basePrices.length > 0 ? data.basePrices : [0]
// // // //         const minPrices = data.minPrices.length > 0 ? data.minPrices : []
// // // //         const maxPrices = data.maxPrices.length > 0 ? data.maxPrices : []

// // // //         // Calculate averages from actual backend data
// // // //         let avgBasePrice = basePrices.reduce((sum: number, price: number) => sum + price, 0) / basePrices.length

// // // //         let avgMinPrice = 0
// // // //         let avgMaxPrice = 0

// // // //         if (minPrices.length > 0) {
// // // //           avgMinPrice = minPrices.reduce((sum: number, price: number) => sum + price, 0) / minPrices.length
// // // //         }
// // // //         if (maxPrices.length > 0) {
// // // //           avgMaxPrice = maxPrices.reduce((sum: number, price: number) => sum + price, 0) / maxPrices.length
// // // //         }

// // // //         // If no min/max prices in backend, calculate reasonable defaults based on base price
// // // //         if (avgMinPrice === 0 && avgBasePrice > 0) {
// // // //           avgMinPrice = Math.round(avgBasePrice * 0.5) // 50% of base price
// // // //         }
// // // //         if (avgMaxPrice === 0 && avgBasePrice > 0) {
// // // //           avgMaxPrice = Math.round(avgBasePrice * 2) // 200% of base price
// // // //         }

// // // //         // If still no pricing data, use room type defaults
// // // //         if (avgBasePrice === 0 && avgMinPrice === 0 && avgMaxPrice === 0) {
// // // //           if (typeName === "STANDARD") {
// // // //             avgBasePrice = 500
// // // //             avgMinPrice = 250
// // // //             avgMaxPrice = 1000
// // // //           } else if (typeName === "DELUXE") {
// // // //             avgBasePrice = 300
// // // //             avgMinPrice = 150
// // // //             avgMaxPrice = 600
// // // //           } else if (typeName === "SUITE") {
// // // //             avgBasePrice = 2000
// // // //             avgMinPrice = 1000
// // // //             avgMaxPrice = 4000
// // // //           } else if (typeName === "EXECUTIVE") {
// // // //             avgBasePrice = 1500
// // // //             avgMinPrice = 750
// // // //             avgMaxPrice = 3000
// // // //           } else if (typeName === "PRESIDENTIAL") {
// // // //             avgBasePrice = 5000
// // // //             avgMinPrice = 2500
// // // //             avgMaxPrice = 10000
// // // //           } else {
// // // //             avgBasePrice = 1000
// // // //             avgMinPrice = 500
// // // //             avgMaxPrice = 2000
// // // //           }
// // // //         }

// // // //         // Get additional room details from first room of this type
// // // //         const firstRoom = data.rooms[0]

// // // //         console.log(`Processed ${typeName}:`, {
// // // //           basePrice: Math.round(avgBasePrice),
// // // //           minPrice: Math.round(avgMinPrice),
// // // //           maxPrice: Math.round(avgMaxPrice),
// // // //           availableRooms: data.totalRooms,
// // // //           backendData: { basePrices, minPrices, maxPrices },
// // // //         })

// // // //         return {
// // // //           id: typeName.toLowerCase().replace(/\s+/g, "-"),
// // // //           roomType: typeName,
// // // //           price: Math.round(avgBasePrice) || 0,
// // // //           minPrice: Math.round(avgMinPrice) || 0,
// // // //           maxPrice: Math.round(avgMaxPrice) || 0,
// // // //           available: data.totalRooms,
// // // //           roomIds: data.roomIds,
// // // //           extraBedAllowed: firstRoom?.extraBedAllowed || false,
// // // //           extraBedPrice: firstRoom?.extraBedPrice || 0,
// // // //           baseOccupancy: firstRoom?.baseOccupancy || 2,
// // // //           maxOccupancy: firstRoom?.maxOccupancy || 4,
// // // //           roomSize: firstRoom?.roomSize || 25,
// // // //           bedType: firstRoom?.bedType || "QUEEN",
// // // //           bedCount: firstRoom?.bedCount || 1,
// // // //           amenities: firstRoom?.amenities || [],
// // // //         }
// // // //       },
// // // //     )

// // // //     console.log("Processed room types with calculated min/max pricing:", roomTypesForPricing)
// // // //     setRoomTypes(roomTypesForPricing)
// // // //     setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing)))

// // // //     initializeWeekendRates(roomTypesForPricing)
// // // //   }

// // // //   const initializeWeekendRates = (roomTypesData: RoomTypeData[]) => {
// // // //     const initialWeekendRates = roomTypesData.map((roomType) => {
// // // //       const weekendRatio = 1.25
// // // //       const weekendPrice = Math.round(roomType.price * weekendRatio)

// // // //       return {
// // // //         roomTypeId: roomType.id,
// // // //         price: weekendPrice,
// // // //         minPrice: Math.round(roomType.minPrice * weekendRatio),
// // // //         maxPrice: Math.round(roomType.maxPrice * weekendRatio),
// // // //         enabled: true,
// // // //       }
// // // //     })

// // // //     setWeekendRates(initialWeekendRates)
// // // //     setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
// // // //   }

// // // //   useEffect(() => {
// // // //     const errors: Record<string, string> = {}

// // // //     Object.entries(debouncedTempPrices).forEach(([key, price]) => {
// // // //       const [roomId, field] = key.split("-")

// // // //       if (field === "price") {
// // // //         const room = editableRoomTypes.find((r) => r.id === roomId)
// // // //         if (room && (price < room.minPrice || price > room.maxPrice)) {
// // // //           errors[key] = `Price should be between ฿${room.minPrice} and ฿${room.maxPrice}`
// // // //         }
// // // //       }
// // // //     })

// // // //     setValidationErrors(errors)

// // // //     Object.values(errors).forEach((error) => {
// // // //       if (error) {
// // // //         toast({
// // // //           title: "Price Warning",
// // // //           description: error,
// // // //           variant: "destructive",
// // // //         })
// // // //       }
// // // //     })
// // // //   }, [debouncedTempPrices, editableRoomTypes, toast])

// // // //   const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// // // //     const numValue = Number.parseFloat(value) || 0

// // // //     setTempPrices((prev) => ({
// // // //       ...prev,
// // // //       [`${id}-${field}`]: numValue,
// // // //     }))

// // // //     setEditableRoomTypes((prev) => {
// // // //       return prev.map((room) => {
// // // //         if (room.id === id) {
// // // //           return { ...room, [field]: numValue }
// // // //         }
// // // //         return room
// // // //       })
// // // //     })
// // // //   }, [])

// // // //   const handleWeekendPriceChange = useCallback(
// // // //     (roomTypeId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// // // //       const numValue = Number.parseFloat(value) || 0

// // // //       setEditableWeekendRates((prev) => {
// // // //         return prev.map((rate) => {
// // // //           if (rate.roomTypeId === roomTypeId) {
// // // //             return { ...rate, [field]: numValue }
// // // //           }
// // // //           return rate
// // // //         })
// // // //       })
// // // //     },
// // // //     [],
// // // //   )

// // // //   const handleWeekendRateToggle = useCallback((roomTypeId: string, enabled: boolean) => {
// // // //     setEditableWeekendRates((prev) =>
// // // //       prev.map((rate) => (rate.roomTypeId === roomTypeId ? { ...rate, enabled } : rate)),
// // // //     )
// // // //   }, [])

// // // //   const handleSave = async () => {
// // // //     setLoading(true)

// // // //     try {
// // // //       if (activeTab === "standard") {
// // // //         for (const roomType of editableRoomTypes) {
// // // //           if (roomType.minPrice > roomType.price || roomType.price > roomType.maxPrice) {
// // // //             throw new Error(
// // // //               `Invalid price range for ${roomType.roomType}. Min price must be less than base price, and base price must be less than max price.`,
// // // //             )
// // // //           }
// // // //         }

// // // //         // Update pricing for each room type using only updateRoomType
// // // //         const updatePromises = editableRoomTypes.map(async (roomType) => {
// // // //           console.log(`Updating pricing for ${roomType.roomType}:`, {
// // // //             basePrice: roomType.price,
// // // //             minPrice: roomType.minPrice,
// // // //             maxPrice: roomType.maxPrice,
// // // //           })

// // // //           try {
// // // //             const roomTypeResult = await updateRoomType({
// // // //               variables: {
// // // //                 hotelId: selectedHotel?.id || "",
// // // //                 roomType: roomType.roomType.toUpperCase(), // Ensure it's uppercase for the enum
// // // //                 updateData: {
// // // //                   pricePerNight: roomType.price,
// // // //                   pricePerNightMin: roomType.minPrice,
// // // //                   pricePerNightMax: roomType.maxPrice,
// // // //                   extraBedPrice: roomType.extraBedPrice || null,
// // // //                 },
// // // //               },
// // // //             })
// // // //             console.log(`Room type updated for ${roomType.roomType}:`, roomTypeResult.data)
// // // //             return roomTypeResult
// // // //           } catch (error) {
// // // //             console.error(`Failed to update room type ${roomType.roomType}:`, error)
// // // //             throw error
// // // //           }
// // // //         })

// // // //         // Wait for all updates to complete
// // // //         await Promise.all(updatePromises)
// // // //         console.log("All room type updates completed")

// // // //         setRoomTypes(editableRoomTypes)
// // // //       } else if (activeTab === "weekend") {
// // // //         for (const rate of editableWeekendRates) {
// // // //           if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
// // // //             const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// // // //             throw new Error(
// // // //               `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
// // // //             )
// // // //           }
// // // //         }

// // // //         setWeekendRates(editableWeekendRates)
// // // //       }

// // // //       setValidationErrors({})
// // // //       setTempPrices({})

// // // //       toast({
// // // //         title: "Pricing updated successfully! ✅",
// // // //         description: `Room type pricing has been saved. This will apply to all rooms of each type.`,
// // // //       })

// // // //       // Force refetch to ensure UI shows the updated data
// // // //       console.log("Refetching rooms data to confirm backend updates...")
// // // //       await refetchRooms()
// // // //     } catch (error) {
// // // //       console.error("Error saving pricing:", error)
// // // //       toast({
// // // //         title: "Error",
// // // //         description: error instanceof Error ? error.message : "Failed to update pricing",
// // // //         variant: "destructive",
// // // //       })
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const handleReset = () => {
// // // //     if (activeTab === "standard") {
// // // //       setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
// // // //     } else if (activeTab === "weekend") {
// // // //       setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
// // // //     }

// // // //     setValidationErrors({})
// // // //     setTempPrices({})

// // // //     toast({
// // // //       title: "Changes discarded",
// // // //       description: "All changes have been reset to the last saved values.",
// // // //     })
// // // //   }

// // // //   const handleRefresh = async () => {
// // // //     console.log("Manually refreshing room data...")
// // // //     await refetchRooms()
// // // //     toast({
// // // //       title: "Data Refreshed",
// // // //       description: "Room pricing data has been reloaded from the backend.",
// // // //     })
// // // //   }

// // // //   const isLoading = roomsLoading
// // // //   const hasError = roomsError

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // // //         <div className="flex items-center space-x-2">
// // // //           <Loader2 className="h-6 w-6 animate-spin" />
// // // //           <span>Loading room categories...</span>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (hasError) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // // //         <div className="text-center">
// // // //           <p className="text-red-600 mb-4">Error: {roomsError?.message}</p>
// // // //           <Button onClick={handleRefresh}>
// // // //             <RefreshCw className="mr-2 h-4 w-4" />
// // // //             Retry
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (roomTypes.length === 0) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // // //         <div className="text-center">
// // // //           <p className="text-gray-600 mb-4">No room categories found for this hotel.</p>
// // // //           <Button onClick={handleRefresh}>
// // // //             <RefreshCw className="mr-2 h-4 w-4" />
// // // //             Retry
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       {/* Header */}
// // // //       <div className="bg-white border-b">
// // // //         <div className="container mx-auto px-4 py-4">
// // // //           <div className="flex items-center justify-between">
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold">Room Pricing Management</h1>
// // // //               <p className="text-sm text-gray-500">Configure room rates and weekend pricing</p>
// // // //             </div>
// // // //             <div className="flex items-center gap-2">
// // // //               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
// // // //                 <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="container mx-auto px-4 py-6">
// // // //         <div className="mb-4 text-sm text-gray-600">
// // // //           <p>
// // // //             Found {roomTypes.length} room categories
// // // //             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
// // // //           </p>
// // // //         </div>

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle>Room Pricing Configuration</CardTitle>
// // // //             <CardDescription>
// // // //               Set the base price, minimum, and maximum pricing for each room category. These values will be saved to
// // // //               room type definitions and will apply to all rooms of each type.
// // // //             </CardDescription>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
// // // //               <TabsList className="mb-6">
// // // //                 <TabsTrigger value="standard">Standard Rate</TabsTrigger>
// // // //                 <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
// // // //               </TabsList>

// // // //               <TabsContent value="standard" className="space-y-4">
// // // //                 <div className="rounded-md border">
// // // //                   <Table>
// // // //                     <TableHeader>
// // // //                       <TableRow>
// // // //                         <TableHead className="w-[300px]">Room Category</TableHead>
// // // //                         <TableHead>Min Price (฿)</TableHead>
// // // //                         <TableHead>Base Price (฿)</TableHead>
// // // //                         <TableHead>Max Price (฿)</TableHead>
// // // //                         <TableHead>Extra Bed</TableHead>
// // // //                         <TableHead className="text-right">Available Rooms</TableHead>
// // // //                       </TableRow>
// // // //                     </TableHeader>
// // // //                     <TableBody>
// // // //                       {editableRoomTypes.map((room) => {
// // // //                         const priceKey = `${room.id}-price`
// // // //                         const hasError = validationErrors[priceKey]

// // // //                         return (
// // // //                           <TableRow key={room.id}>
// // // //                             <TableCell className="font-medium">{room.roomType}</TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={room.minPrice}
// // // //                                 onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
// // // //                                 className="w-[120px]"
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={room.price}
// // // //                                 onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
// // // //                                 className={`w-[120px] ${hasError ? "border-red-500 bg-red-50" : ""}`}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={room.maxPrice}
// // // //                                 onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
// // // //                                 className="w-[120px]"
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               {room.extraBedAllowed ? `฿${room.extraBedPrice || 0}` : "Not allowed"}
// // // //                             </TableCell>
// // // //                             <TableCell className="text-right">{room.available}</TableCell>
// // // //                           </TableRow>
// // // //                         )
// // // //                       })}
// // // //                     </TableBody>
// // // //                   </Table>
// // // //                 </div>

// // // //                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
// // // //                   <p>
// // // //                     <strong>Price Range Validation:</strong> Your desired price must be between the minimum and maximum
// // // //                     price range.
// // // //                   </p>
// // // //                   <p className="mt-1">
// // // //                     • <strong>Min Price:</strong> Lowest price you're willing to accept
// // // //                     <br />• <strong>Base Price:</strong> Your desired/target price
// // // //                     <br />• <strong>Max Price:</strong> Highest price for peak demand
// // // //                   </p>
// // // //                   <p className="mt-2 text-green-700">
// // // //                     <strong>✅ Simplified:</strong> Now using only updateRoomType mutation to update pricing for all
// // // //                     rooms of each type.
// // // //                   </p>
// // // //                 </div>
// // // //               </TabsContent>

// // // //               <TabsContent value="weekend" className="space-y-4">
// // // //                 <div className="flex items-center space-x-4 mb-4">
// // // //                   <div className="text-sm font-medium">Weekend days:</div>
// // // //                   <div className="flex items-center space-x-2">
// // // //                     <Checkbox
// // // //                       id="friday"
// // // //                       checked={weekendDays.friday}
// // // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
// // // //                     />
// // // //                     <label htmlFor="friday" className="text-sm">
// // // //                       Friday
// // // //                     </label>
// // // //                   </div>
// // // //                   <div className="flex items-center space-x-2">
// // // //                     <Checkbox
// // // //                       id="saturday"
// // // //                       checked={weekendDays.saturday}
// // // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
// // // //                     />
// // // //                     <label htmlFor="saturday" className="text-sm">
// // // //                       Saturday
// // // //                     </label>
// // // //                   </div>
// // // //                   <div className="flex items-center space-x-2">
// // // //                     <Checkbox
// // // //                       id="sunday"
// // // //                       checked={weekendDays.sunday}
// // // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
// // // //                     />
// // // //                     <label htmlFor="sunday" className="text-sm">
// // // //                       Sunday
// // // //                     </label>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="rounded-md border">
// // // //                   <Table>
// // // //                     <TableHeader>
// // // //                       <TableRow>
// // // //                         <TableHead className="w-[250px]">Room Category</TableHead>
// // // //                         <TableHead>Enabled</TableHead>
// // // //                         <TableHead>Min Price (฿)</TableHead>
// // // //                         <TableHead>Base Price (฿)</TableHead>
// // // //                         <TableHead>Max Price (฿)</TableHead>
// // // //                         <TableHead className="text-right">Standard Price</TableHead>
// // // //                       </TableRow>
// // // //                     </TableHeader>
// // // //                     <TableBody>
// // // //                       {editableWeekendRates.map((rate) => {
// // // //                         const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// // // //                         return (
// // // //                           <TableRow key={rate.roomTypeId}>
// // // //                             <TableCell className="font-medium">{room?.roomType}</TableCell>
// // // //                             <TableCell>
// // // //                               <Switch
// // // //                                 checked={rate.enabled}
// // // //                                 onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomTypeId, checked)}
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={rate.minPrice}
// // // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "minPrice", e.target.value)}
// // // //                                 className="w-[120px]"
// // // //                                 disabled={!rate.enabled}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={rate.price}
// // // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "price", e.target.value)}
// // // //                                 className={`w-[120px] ${
// // // //                                   rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
// // // //                                     ? "border-red-500 bg-red-50"
// // // //                                     : ""
// // // //                                 }`}
// // // //                                 disabled={!rate.enabled}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={rate.maxPrice}
// // // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "maxPrice", e.target.value)}
// // // //                                 className="w-[120px]"
// // // //                                 disabled={!rate.enabled}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell className="text-right text-gray-500">฿ {room?.price}</TableCell>
// // // //                           </TableRow>
// // // //                         )
// // // //                       })}
// // // //                     </TableBody>
// // // //                   </Table>
// // // //                 </div>

// // // //                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
// // // //                   <p>
// // // //                     <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
// // // //                     automatically for bookings on weekend days.
// // // //                   </p>
// // // //                 </div>
// // // //               </TabsContent>
// // // //             </Tabs>
// // // //           </CardContent>
// // // //           <CardFooter className="flex justify-between">
// // // //             <Button variant="outline" onClick={handleReset} disabled={loading}>
// // // //               <RefreshCw className="mr-2 h-4 w-4" />
// // // //               Reset Changes
// // // //             </Button>
// // // //             <Button onClick={handleSave} disabled={loading}>
// // // //               {loading ? (
// // // //                 <>
// // // //                   <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
// // // //                   Saving with Correct Mutations...
// // // //                 </>
// // // //               ) : (
// // // //                 <>
// // // //                   <Save className="mr-2 h-4 w-4" />
// // // //                   Save Changes
// // // //                 </>
// // // //               )}
// // // //             </Button>
// // // //           </CardFooter>
// // // //         </Card>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }


// // // // "use client"

// // // // import { useState, useEffect, useCallback } from "react"
// // // // import { Button } from "@/components/ui/button"
// // // // import { Input } from "@/components/ui/input"
// // // // import { useToast } from "@/components/ui/use-toast"
// // // // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // // // import { Save, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
// // // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // // // import { Checkbox } from "@/components/ui/checkbox"
// // // // import { Switch } from "@/components/ui/switch"
// // // // import { useHotelContext } from "@/providers/hotel-provider"
// // // // import { useSession } from "next-auth/react"
// // // // import { useMutation, useQuery } from "@apollo/client"
// // // // import { gql } from "@apollo/client"

// // // // // GraphQL Queries and Mutations
// // // // const GET_ROOMS_WITH_PRICING = gql`
// // // //   query GetRoomsWithPricing($hotelId: String!) {
// // // //     rooms(hotelId: $hotelId) {
// // // //       id
// // // //       hotelId
// // // //       roomNumber
// // // //       floor
// // // //       roomType
// // // //       status
// // // //       pricePerNight
// // // //       pricePerNightMin
// // // //       pricePerNightMax
// // // //       baseOccupancy
// // // //       maxOccupancy
// // // //       extraBedAllowed
// // // //       extraBedPrice
// // // //       roomSize
// // // //       bedType
// // // //       bedCount
// // // //       amenities
// // // //       description
// // // //       images
// // // //       isSmoking
// // // //       isActive
// // // //       lastCleaned
// // // //       lastMaintained
// // // //       maintenanceNotes
// // // //       createdAt
// // // //       updatedAt
// // // //     }
// // // //   }
// // // // `

// // // // const UPDATE_ROOM_TYPE = gql`
// // // //   mutation UpdateRoomType(
// // // //     $hotelId: String!
// // // //     $roomType: RoomType!
// // // //     $updateData: UpdateRoomTypeInput!
// // // //   ) {
// // // //     updateRoomType(
// // // //       hotelId: $hotelId
// // // //       roomType: $roomType
// // // //       updateData: $updateData
// // // //     ) {
// // // //       id
// // // //       roomType
// // // //       pricePerNight
// // // //       pricePerNightMin
// // // //       pricePerNightMax
// // // //       extraBedPrice
// // // //       baseOccupancy
// // // //       maxOccupancy
// // // //       extraBedAllowed
// // // //       roomSize
// // // //       bedType
// // // //       bedCount
// // // //       amenities
// // // //       description
// // // //       isSmoking
// // // //       images
// // // //     }
// // // //   }
// // // // `

// // // // // Types
// // // // interface RoomTypeData {
// // // //   id: string
// // // //   roomType: string
// // // //   price: number
// // // //   minPrice: number
// // // //   maxPrice: number
// // // //   available: number
// // // //   roomIds: string[]
// // // //   extraBedAllowed: boolean
// // // //   extraBedPrice?: number
// // // //   baseOccupancy: number
// // // //   maxOccupancy: number
// // // //   roomSize: number
// // // //   bedType: string
// // // //   bedCount: number
// // // //   amenities: string[]
// // // //   lastUpdated?: string
// // // // }

// // // // interface WeekendRate {
// // // //   roomTypeId: string
// // // //   price: number
// // // //   minPrice: number
// // // //   maxPrice: number
// // // //   enabled: boolean
// // // // }

// // // // interface ValidationError {
// // // //   field: string
// // // //   message: string
// // // // }

// // // // interface Notification {
// // // //   id: string
// // // //   type: 'success' | 'error'
// // // //   message: string
// // // // }

// // // // export default function PricingPage() {
// // // //   const { toast } = useToast()
// // // //   const [loading, setLoading] = useState(false)
// // // //   const [activeTab, setActiveTab] = useState("standard")

// // // //   const { selectedHotel } = useHotelContext()
// // // //   const { data: session } = useSession()

// // // //   // State management - CRITICAL: Separate source of truth from editable data
// // // //   const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]) // Source of truth from backend
// // // //   const [editableRoomTypes, setEditableRoomTypes] = useState<RoomTypeData[]>([]) // Editable copy
// // // //   const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
// // // //   const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

// // // //   const [weekendDays, setWeekendDays] = useState({
// // // //     friday: true,
// // // //     saturday: true,
// // // //     sunday: true,
// // // //   })

// // // //   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
// // // //   const [notifications, setNotifications] = useState<Notification[]>([])
// // // //   const [lastSaved, setLastSaved] = useState<Date | null>(null)

// // // //   // Fetch rooms with pricing data
// // // //   const {
// // // //     data: roomsData,
// // // //     loading: roomsLoading,
// // // //     error: roomsError,
// // // //     refetch: refetchRooms,
// // // //   } = useQuery(GET_ROOMS_WITH_PRICING, {
// // // //     variables: { hotelId: selectedHotel?.id || "" },
// // // //     skip: !selectedHotel?.id,
// // // //     fetchPolicy: "cache-and-network", // Always get fresh data
// // // //     errorPolicy: "all",
// // // //     onCompleted: (data) => {
// // // //       console.log("✅ Rooms with pricing fetched successfully:", data)
// // // //       if (data.rooms) {
// // // //         processRoomsData(data.rooms)
// // // //       }
// // // //     },
// // // //     onError: (error) => {
// // // //       console.error("❌ Error fetching rooms:", error)
// // // //       addNotification('error', 'Failed to fetch room information from server.')
// // // //     },
// // // //   })

// // // //   // Mutation for updating room type definitions
// // // //   const [updateRoomType] = useMutation(UPDATE_ROOM_TYPE, {
// // // //     errorPolicy: "all",
// // // //     onCompleted: (data) => {
// // // //       console.log("✅ Room type updated successfully:", data)
// // // //     },
// // // //     onError: (error) => {
// // // //       console.error("❌ Error updating room type:", error)
// // // //     },
// // // //   })

// // // //   // Notification management
// // // //   const addNotification = (type: 'success' | 'error', message: string) => {
// // // //     const id = Date.now().toString()
// // // //     setNotifications(prev => [...prev, { id, type, message }])
    
// // // //     // Auto-remove notification after 5 seconds
// // // //     setTimeout(() => {
// // // //       setNotifications(prev => prev.filter(n => n.id !== id))
// // // //     }, 5000)
// // // //   }

// // // //   // CRITICAL: Fixed data processing to handle missing min/max values properly
// // // //   const processRoomsData = (rooms: any[]) => {
// // // //     if (!rooms || rooms.length === 0) {
// // // //       setRoomTypes([])
// // // //       setEditableRoomTypes([])
// // // //       return
// // // //     }

// // // //     console.log("🔄 Processing rooms data from backend:", rooms)

// // // //     // Group rooms by type
// // // //     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
// // // //       const roomType = room.roomType

// // // //       // Only include active rooms
// // // //       if (!room.isActive) return acc

// // // //       if (!acc[roomType]) {
// // // //         acc[roomType] = {
// // // //           rooms: [],
// // // //           totalRooms: 0,
// // // //           roomIds: [],
// // // //           // Store the first room's data as reference
// // // //           firstRoom: room
// // // //         }
// // // //       }

// // // //       acc[roomType].rooms.push(room)
// // // //       acc[roomType].totalRooms += 1
// // // //       acc[roomType].roomIds.push(room.id)

// // // //       return acc
// // // //     }, {})

// // // //     const roomTypesForPricing: RoomTypeData[] = Object.entries(roomTypeGroups).map(
// // // //       ([typeName, data]: [string, any]) => {
// // // //         const firstRoom = data.firstRoom

// // // //         // Get base price from backend
// // // //         let basePrice = firstRoom.pricePerNight || 0
// // // //         let minPrice = firstRoom.pricePerNightMin || 0
// // // //         let maxPrice = firstRoom.pricePerNightMax || 0

// // // //         // CRITICAL FIX: If min/max are 0 or null, calculate reasonable defaults
// // // //         if (basePrice > 0) {
// // // //           if (minPrice <= 0) {
// // // //             minPrice = Math.round(basePrice * 0.7) // 70% of base price
// // // //           }
// // // //           if (maxPrice <= 0) {
// // // //             maxPrice = Math.round(basePrice * 1.5) // 150% of base price
// // // //           }
// // // //         } else {
// // // //           // If no pricing data at all, use room type defaults
// // // //           const defaults = getRoomTypeDefaults(typeName)
// // // //           basePrice = defaults.basePrice
// // // //           minPrice = defaults.minPrice
// // // //           maxPrice = defaults.maxPrice
// // // //         }

// // // //         console.log(`📊 Room type ${typeName} pricing:`, {
// // // //           basePrice,
// // // //           minPrice,
// // // //           maxPrice,
// // // //           totalRooms: data.totalRooms,
// // // //           backendValues: {
// // // //             pricePerNight: firstRoom.pricePerNight,
// // // //             pricePerNightMin: firstRoom.pricePerNightMin,
// // // //             pricePerNightMax: firstRoom.pricePerNightMax
// // // //           }
// // // //         })

// // // //         return {
// // // //           id: typeName.toLowerCase().replace(/\s+/g, "-"),
// // // //           roomType: typeName,
// // // //           price: basePrice,
// // // //           minPrice: minPrice,
// // // //           maxPrice: maxPrice,
// // // //           available: data.totalRooms,
// // // //           roomIds: data.roomIds,
// // // //           extraBedAllowed: firstRoom?.extraBedAllowed || false,
// // // //           extraBedPrice: firstRoom?.extraBedPrice || 0,
// // // //           baseOccupancy: firstRoom?.baseOccupancy || 2,
// // // //           maxOccupancy: firstRoom?.maxOccupancy || 4,
// // // //           roomSize: firstRoom?.roomSize || 25,
// // // //           bedType: firstRoom?.bedType || "QUEEN",
// // // //           bedCount: firstRoom?.bedCount || 1,
// // // //           amenities: firstRoom?.amenities || [],
// // // //           lastUpdated: firstRoom?.updatedAt
// // // //         }
// // // //       }
// // // //     )

// // // //     console.log("✅ Processed room types with proper min/max pricing:", roomTypesForPricing)
    
// // // //     // CRITICAL: Set source of truth first, then create editable copy
// // // //     setRoomTypes(roomTypesForPricing)
// // // //     setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing))) // Deep copy for editing

// // // //     initializeWeekendRates(roomTypesForPricing)
// // // //   }

// // // //   // Helper function to get default pricing for room types
// // // //   const getRoomTypeDefaults = (roomType: string) => {
// // // //     const defaults: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {
// // // //       'STANDARD': { basePrice: 500, minPrice: 350, maxPrice: 750 },
// // // //       'DELUXE': { basePrice: 800, minPrice: 560, maxPrice: 1200 },
// // // //       'SUITE': { basePrice: 2000, minPrice: 1400, maxPrice: 3000 },
// // // //       'EXECUTIVE': { basePrice: 1500, minPrice: 1050, maxPrice: 2250 },
// // // //       'PRESIDENTIAL': { basePrice: 5000, minPrice: 3500, maxPrice: 7500 }
// // // //     }

// // // //     return defaults[roomType.toUpperCase()] || { basePrice: 1000, minPrice: 700, maxPrice: 1500 }
// // // //   }

// // // //   const initializeWeekendRates = (roomTypesData: RoomTypeData[]) => {
// // // //     const initialWeekendRates = roomTypesData.map((roomType) => {
// // // //       const weekendRatio = 1.25
// // // //       const weekendPrice = Math.round(roomType.price * weekendRatio)

// // // //       return {
// // // //         roomTypeId: roomType.id,
// // // //         price: weekendPrice,
// // // //         minPrice: Math.round(roomType.minPrice * weekendRatio),
// // // //         maxPrice: Math.round(roomType.maxPrice * weekendRatio),
// // // //         enabled: true,
// // // //       }
// // // //     })

// // // //     setWeekendRates(initialWeekendRates)
// // // //     setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
// // // //   }

// // // //   // Validation
// // // //   const validatePricing = (roomTypes: RoomTypeData[]): ValidationError[] => {
// // // //     const errors: ValidationError[] = []
    
// // // //     roomTypes.forEach(room => {
// // // //       if (room.minPrice >= room.price) {
// // // //         errors.push({
// // // //           field: `${room.id}-price`,
// // // //           message: `${room.roomType}: Base price must be higher than minimum price`
// // // //         })
// // // //       }
      
// // // //       if (room.price >= room.maxPrice) {
// // // //         errors.push({
// // // //           field: `${room.id}-price`,
// // // //           message: `${room.roomType}: Base price must be lower than maximum price`
// // // //         })
// // // //       }
      
// // // //       if (room.minPrice < 0 || room.price < 0 || room.maxPrice < 0) {
// // // //         errors.push({
// // // //           field: `${room.id}-price`,
// // // //           message: `${room.roomType}: Prices cannot be negative`
// // // //         })
// // // //       }

// // // //       if (room.minPrice === 0 || room.maxPrice === 0) {
// // // //         errors.push({
// // // //           field: `${room.id}-price`,
// // // //           message: `${room.roomType}: Min and max prices must be greater than 0`
// // // //         })
// // // //       }
// // // //     })
    
// // // //     return errors
// // // //   }

// // // //   // Price change handlers
// // // //   const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// // // //     const numValue = parseFloat(value) || 0

// // // //     setEditableRoomTypes((prev) => {
// // // //       return prev.map((room) => {
// // // //         if (room.id === id) {
// // // //           return { ...room, [field]: numValue }
// // // //         }
// // // //         return room
// // // //       })
// // // //     })

// // // //     // Clear validation errors for this field
// // // //     setValidationErrors(prev => 
// // // //       prev.filter(error => error.field !== `${id}-${field}`)
// // // //     )
// // // //   }, [])

// // // //   const handleWeekendPriceChange = useCallback(
// // // //     (roomTypeId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// // // //       const numValue = parseFloat(value) || 0

// // // //       setEditableWeekendRates((prev) => {
// // // //         return prev.map((rate) => {
// // // //           if (rate.roomTypeId === roomTypeId) {
// // // //             return { ...rate, [field]: numValue }
// // // //           }
// // // //           return rate
// // // //         })
// // // //       })
// // // //     },
// // // //     [],
// // // //   )

// // // //   const handleWeekendRateToggle = useCallback((roomTypeId: string, enabled: boolean) => {
// // // //     setEditableWeekendRates((prev) =>
// // // //       prev.map((rate) => (rate.roomTypeId === roomTypeId ? { ...rate, enabled } : rate)),
// // // //     )
// // // //   }, [])

// // // //   // CRITICAL: Enhanced save handler that ensures min/max values are saved
// // // //   const handleSave = async () => {
// // // //     setLoading(true)

// // // //     try {
// // // //       if (activeTab === "standard") {
// // // //         // Validate all pricing before saving
// // // //         const errors = validatePricing(editableRoomTypes)
// // // //         setValidationErrors(errors)
        
// // // //         if (errors.length > 0) {
// // // //           addNotification('error', 'Please fix validation errors before saving')
// // // //           return
// // // //         }

// // // //         console.log("💾 Saving room type pricing to backend...")

// // // //         // CRITICAL: Save to backend first, then update UI with backend response
// // // //         const updatePromises = editableRoomTypes.map(async (roomType) => {
// // // //           console.log(`Updating pricing for ${roomType.roomType}:`, {
// // // //             basePrice: roomType.price,
// // // //             minPrice: roomType.minPrice,
// // // //             maxPrice: roomType.maxPrice,
// // // //           })

// // // //           try {
// // // //             const result = await updateRoomType({
// // // //               variables: {
// // // //                 hotelId: selectedHotel?.id || "",
// // // //                 roomType: roomType.roomType.toUpperCase(),
// // // //                 updateData: {
// // // //                   pricePerNight: roomType.price,
// // // //                   pricePerNightMin: roomType.minPrice, // CRITICAL: Ensure min price is saved
// // // //                   pricePerNightMax: roomType.maxPrice, // CRITICAL: Ensure max price is saved
// // // //                   extraBedPrice: roomType.extraBedPrice || null,
// // // //                 },
// // // //               },
// // // //             })
            
// // // //             console.log(`✅ Backend updated for ${roomType.roomType}:`, result.data)
// // // //             return result.data.updateRoomType
// // // //           } catch (error) {
// // // //             console.error(`❌ Failed to update room type ${roomType.roomType}:`, error)
// // // //             throw error
// // // //           }
// // // //         })

// // // //         // Wait for all backend updates to complete
// // // //         const updatedRoomTypes = await Promise.all(updatePromises)
// // // //         console.log("✅ All room type updates completed successfully")

// // // //         // CRITICAL: Only update local state after successful backend operations
// // // //         setRoomTypes([...editableRoomTypes])
// // // //         setLastSaved(new Date())

// // // //         addNotification('success', `Successfully updated pricing for ${updatedRoomTypes.length} room types`)

// // // //         // CRITICAL: Force refetch to ensure UI shows the actual backend data
// // // //         console.log("🔄 Refetching rooms data to confirm backend updates...")
// // // //         await refetchRooms()

// // // //       } else if (activeTab === "weekend") {
// // // //         // Validate weekend rates
// // // //         for (const rate of editableWeekendRates) {
// // // //           if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
// // // //             const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// // // //             throw new Error(
// // // //               `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
// // // //             )
// // // //           }
// // // //         }

// // // //         // Update weekend rates (implement your weekend rate mutation here)
// // // //         setWeekendRates([...editableWeekendRates])
// // // //         addNotification('success', 'Weekend rates updated successfully')
// // // //       }

// // // //       setValidationErrors([])

// // // //     } catch (error) {
// // // //       console.error("❌ Error saving pricing:", error)
// // // //       addNotification('error', error instanceof Error ? error.message : 'Failed to update pricing')
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const handleReset = () => {
// // // //     if (activeTab === "standard") {
// // // //       // Reset to last saved values from source of truth
// // // //       setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
// // // //     } else if (activeTab === "weekend") {
// // // //       setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
// // // //     }

// // // //     setValidationErrors([])
// // // //     addNotification('success', 'Changes reset to last saved values')
// // // //   }

// // // //   const handleRefresh = async () => {
// // // //     console.log("🔄 Manually refreshing room data from backend...")
// // // //     await refetchRooms()
// // // //     addNotification('success', 'Data refreshed from backend')
// // // //   }

// // // //   // Auto-populate min/max prices based on base price
// // // //   const handleAutoPopulate = (roomId: string) => {
// // // //     setEditableRoomTypes((prev) => {
// // // //       return prev.map((room) => {
// // // //         if (room.id === roomId && room.price > 0) {
// // // //           const newMinPrice = Math.round(room.price * 0.7) // 70% of base
// // // //           const newMaxPrice = Math.round(room.price * 1.5) // 150% of base
          
// // // //           return {
// // // //             ...room,
// // // //             minPrice: newMinPrice,
// // // //             maxPrice: newMaxPrice
// // // //           }
// // // //         }
// // // //         return room
// // // //       })
// // // //     })
    
// // // //     addNotification('success', 'Min and max prices auto-populated based on base price')
// // // //   }

// // // //   // Check if there are unsaved changes
// // // //   const hasChanges = JSON.stringify(roomTypes) !== JSON.stringify(editableRoomTypes) ||
// // // //                     JSON.stringify(weekendRates) !== JSON.stringify(editableWeekendRates)

// // // //   const isLoading = roomsLoading
// // // //   const hasError = roomsError

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // // //         <div className="flex items-center space-x-3">
// // // //           <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
// // // //           <span className="text-gray-600">Loading room pricing data...</span>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (hasError) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // // //         <div className="text-center">
// // // //           <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
// // // //             <AlertCircle className="h-6 w-6" />
// // // //             <span>Error: {roomsError?.message}</span>
// // // //           </div>
// // // //           <Button onClick={handleRefresh}>
// // // //             <RefreshCw className="mr-2 h-4 w-4" />
// // // //             Retry
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (roomTypes.length === 0) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // // //         <div className="text-center">
// // // //           <p className="text-gray-600 mb-4">No room categories found for this hotel.</p>
// // // //           <Button onClick={handleRefresh}>
// // // //             <RefreshCw className="mr-2 h-4 w-4" />
// // // //             Refresh Data
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       {/* Notifications */}
// // // //       <div className="fixed top-4 right-4 space-y-2 z-50">
// // // //         {notifications.map(notification => (
// // // //           <div
// // // //             key={notification.id}
// // // //             className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
// // // //               notification.type === 'success' 
// // // //                 ? 'bg-green-100 text-green-800 border border-green-200' 
// // // //                 : 'bg-red-100 text-red-800 border border-red-200'
// // // //             }`}
// // // //           >
// // // //             {notification.type === 'success' ? (
// // // //               <CheckCircle className="h-5 w-5" />
// // // //             ) : (
// // // //               <AlertCircle className="h-5 w-5" />
// // // //             )}
// // // //             <span className="text-sm font-medium">{notification.message}</span>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Header */}
// // // //       <div className="bg-white border-b">
// // // //         <div className="container mx-auto px-4 py-4">
// // // //           <div className="flex items-center justify-between">
// // // //             <div>
// // // //               <h1 className="text-2xl font-bold text-gray-900">Room Pricing Management</h1>
// // // //               <p className="text-sm text-gray-600">Configure room rates with proper backend persistence</p>
// // // //               {lastSaved && (
// // // //                 <p className="text-sm text-green-600 mt-1">
// // // //                   Last saved: {lastSaved.toLocaleString()}
// // // //                 </p>
// // // //               )}
// // // //             </div>
// // // //             <div className="flex items-center gap-2">
// // // //               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
// // // //                 <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="container mx-auto px-4 py-6">
// // // //         <div className="mb-4 text-sm text-gray-600">
// // // //           <p>
// // // //             Found {roomTypes.length} room categories
// // // //             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
// // // //           </p>
// // // //         </div>

// // // //         {/* Validation Errors */}
// // // //         {validationErrors.length > 0 && (
// // // //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// // // //             <div className="flex items-center space-x-2 mb-2">
// // // //               <AlertCircle className="h-5 w-5 text-red-600" />
// // // //               <h3 className="font-medium text-red-800">Validation Errors</h3>
// // // //             </div>
// // // //             <ul className="text-sm text-red-700 space-y-1">
// // // //               {validationErrors.map((error, index) => (
// // // //                 <li key={index}>• {error.message}</li>
// // // //               ))}
// // // //             </ul>
// // // //           </div>
// // // //         )}

// // // //         <Card>
// // // //           <CardHeader>
// // // //             <CardTitle>Room Pricing Configuration</CardTitle>
// // // //             <CardDescription>
// // // //               Set the base price, minimum, and maximum pricing for each room category. These values will be saved to
// // // //               the backend and will apply to all rooms of each type.
// // // //             </CardDescription>
// // // //           </CardHeader>
// // // //           <CardContent>
// // // //             <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
// // // //               <TabsList className="mb-6">
// // // //                 <TabsTrigger value="standard">Standard Rate</TabsTrigger>
// // // //                 <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
// // // //               </TabsList>

// // // //               <TabsContent value="standard" className="space-y-4">
// // // //                 <div className="rounded-md border">
// // // //                   <Table>
// // // //                     <TableHeader>
// // // //                       <TableRow>
// // // //                         <TableHead className="w-[300px]">Room Category</TableHead>
// // // //                         <TableHead>Min Price (฿)</TableHead>
// // // //                         <TableHead>Base Price (฿)</TableHead>
// // // //                         <TableHead>Max Price (฿)</TableHead>
// // // //                         <TableHead>Extra Bed</TableHead>
// // // //                         <TableHead>Actions</TableHead>
// // // //                         <TableHead className="text-right">Available Rooms</TableHead>
// // // //                       </TableRow>
// // // //                     </TableHeader>
// // // //                     <TableBody>
// // // //                       {editableRoomTypes.map((room) => {
// // // //                         const hasFieldError = (field: string) => 
// // // //                           validationErrors.some(error => error.field === `${room.id}-${field}`)

// // // //                         return (
// // // //                           <TableRow key={room.id} className="hover:bg-gray-50">
// // // //                             <TableCell className="font-medium">
// // // //                               <div>{room.roomType}</div>
// // // //                               {room.lastUpdated && (
// // // //                                 <div className="text-xs text-gray-500">
// // // //                                   Updated: {new Date(room.lastUpdated).toLocaleString()}
// // // //                                 </div>
// // // //                               )}
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={room.minPrice}
// // // //                                 onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
// // // //                                 className={`w-[120px] ${
// // // //                                   hasFieldError('minPrice') ? 'border-red-500 bg-red-50' : ''
// // // //                                 }`}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                                 placeholder="Min price"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={room.price}
// // // //                                 onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
// // // //                                 className={`w-[120px] ${
// // // //                                   hasFieldError('price') ? 'border-red-500 bg-red-50' : ''
// // // //                                 }`}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                                 placeholder="Base price"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={room.maxPrice}
// // // //                                 onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
// // // //                                 className={`w-[120px] ${
// // // //                                   hasFieldError('maxPrice') ? 'border-red-500 bg-red-50' : ''
// // // //                                 }`}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                                 placeholder="Max price"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               {room.extraBedAllowed ? `฿${room.extraBedPrice || 0}` : "Not allowed"}
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Button
// // // //                                 variant="outline"
// // // //                                 size="sm"
// // // //                                 onClick={() => handleAutoPopulate(room.id)}
// // // //                                 disabled={room.price <= 0}
// // // //                                 className="text-xs"
// // // //                               >
// // // //                                 Auto-fill
// // // //                               </Button>
// // // //                             </TableCell>
// // // //                             <TableCell className="text-right">{room.available}</TableCell>
// // // //                           </TableRow>
// // // //                         )
// // // //                       })}
// // // //                     </TableBody>
// // // //                   </Table>
// // // //                 </div>

// // // //                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
// // // //                   <p className="font-medium mb-2">✅ Fixed Min/Max Price Issues:</p>
// // // //                   <ul className="space-y-1">
// // // //                     <li>• Automatically calculates min/max prices if they're missing from backend</li>
// // // //                     <li>• Min price = 70% of base price, Max price = 150% of base price</li>
// // // //                     <li>• Use "Auto-fill" button to populate min/max based on base price</li>
// // // //                     <li>• All three values (min, base, max) are now properly saved to backend</li>
// // // //                     <li>• Enhanced validation ensures all prices are greater than 0</li>
// // // //                   </ul>
// // // //                 </div>
// // // //               </TabsContent>

// // // //               <TabsContent value="weekend" className="space-y-4">
// // // //                 <div className="flex items-center space-x-4 mb-4">
// // // //                   <div className="text-sm font-medium">Weekend days:</div>
// // // //                   <div className="flex items-center space-x-2">
// // // //                     <Checkbox
// // // //                       id="friday"
// // // //                       checked={weekendDays.friday}
// // // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
// // // //                     />
// // // //                     <label htmlFor="friday" className="text-sm">
// // // //                       Friday
// // // //                     </label>
// // // //                   </div>
// // // //                   <div className="flex items-center space-x-2">
// // // //                     <Checkbox
// // // //                       id="saturday"
// // // //                       checked={weekendDays.saturday}
// // // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
// // // //                     />
// // // //                     <label htmlFor="saturday" className="text-sm">
// // // //                       Saturday
// // // //                     </label>
// // // //                   </div>
// // // //                   <div className="flex items-center space-x-2">
// // // //                     <Checkbox
// // // //                       id="sunday"
// // // //                       checked={weekendDays.sunday}
// // // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
// // // //                     />
// // // //                     <label htmlFor="sunday" className="text-sm">
// // // //                       Sunday
// // // //                     </label>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="rounded-md border">
// // // //                   <Table>
// // // //                     <TableHeader>
// // // //                       <TableRow>
// // // //                         <TableHead className="w-[250px]">Room Category</TableHead>
// // // //                         <TableHead>Enabled</TableHead>
// // // //                         <TableHead>Min Price (฿)</TableHead>
// // // //                         <TableHead>Base Price (฿)</TableHead>
// // // //                         <TableHead>Max Price (฿)</TableHead>
// // // //                         <TableHead className="text-right">Standard Price</TableHead>
// // // //                       </TableRow>
// // // //                     </TableHeader>
// // // //                     <TableBody>
// // // //                       {editableWeekendRates.map((rate) => {
// // // //                         const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// // // //                         return (
// // // //                           <TableRow key={rate.roomTypeId}>
// // // //                             <TableCell className="font-medium">{room?.roomType}</TableCell>
// // // //                             <TableCell>
// // // //                               <Switch
// // // //                                 checked={rate.enabled}
// // // //                                 onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomTypeId, checked)}
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={rate.minPrice}
// // // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "minPrice", e.target.value)}
// // // //                                 className="w-[120px]"
// // // //                                 disabled={!rate.enabled}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={rate.price}
// // // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "price", e.target.value)}
// // // //                                 className={`w-[120px] ${
// // // //                                   rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
// // // //                                     ? "border-red-500 bg-red-50"
// // // //                                     : ""
// // // //                                 }`}
// // // //                                 disabled={!rate.enabled}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell>
// // // //                               <Input
// // // //                                 type="number"
// // // //                                 value={rate.maxPrice}
// // // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "maxPrice", e.target.value)}
// // // //                                 className="w-[120px]"
// // // //                                 disabled={!rate.enabled}
// // // //                                 min="0"
// // // //                                 step="0.01"
// // // //                               />
// // // //                             </TableCell>
// // // //                             <TableCell className="text-right text-gray-500">฿ {room?.price}</TableCell>
// // // //                           </TableRow>
// // // //                         )
// // // //                       })}
// // // //                     </TableBody>
// // // //                   </Table>
// // // //                 </div>

// // // //                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
// // // //                   <p>
// // // //                     <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
// // // //                     automatically for bookings on weekend days.
// // // //                   </p>
// // // //                 </div>
// // // //               </TabsContent>
// // // //             </Tabs>
// // // //           </CardContent>
// // // //           <CardFooter className="flex justify-between">
// // // //             <div className="text-sm text-gray-600">
// // // //               {hasChanges && <span className="text-orange-600 font-medium">You have unsaved changes</span>}
// // // //             </div>
// // // //             <div className="flex items-center space-x-3">
// // // //               <Button variant="outline" onClick={handleReset} disabled={!hasChanges || loading}>
// // // //                 <RefreshCw className="mr-2 h-4 w-4" />
// // // //                 Reset Changes
// // // //               </Button>
// // // //               <Button onClick={handleSave} disabled={!hasChanges || loading || validationErrors.length > 0}>
// // // //                 {loading ? (
// // // //                   <>
// // // //                     <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
// // // //                     Saving to Backend...
// // // //                   </>
// // // //                 ) : (
// // // //                   <>
// // // //                     <Save className="mr-2 h-4 w-4" />
// // // //                     Save Changes
// // // //                   </>
// // // //                 )}
// // // //               </Button>
// // // //             </div>
// // // //           </CardFooter>
// // // //         </Card>

// // // //         {/* Debug Information */}
// // // //         <div className="mt-6 bg-gray-100 rounded-lg p-4">
// // // //           <details className="cursor-pointer">
// // // //             <summary className="text-sm font-medium text-gray-700 mb-2">Debug Information</summary>
// // // //             <div className="text-xs text-gray-600 space-y-2">
// // // //               <div><strong>Has Changes:</strong> {hasChanges ? 'Yes' : 'No'}</div>
// // // //               <div><strong>Validation Errors:</strong> {validationErrors.length}</div>
// // // //               <div><strong>Room Types Count:</strong> {roomTypes.length}</div>
// // // //               <div><strong>Last Saved:</strong> {lastSaved ? lastSaved.toISOString() : 'Never'}</div>
// // // //               <div><strong>Selected Hotel:</strong> {selectedHotel?.name || 'None'}</div>
// // // //             </div>
// // // //           </details>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // "use client"

// // // import { useState, useCallback } from "react"
// // // import { Button } from "@/components/ui/button"
// // // import { Input } from "@/components/ui/input"
// // // import { useToast } from "@/components/ui/use-toast"
// // // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // // import { Save, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
// // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // // import { Checkbox } from "@/components/ui/checkbox"
// // // import { Switch } from "@/components/ui/switch"
// // // import { useHotelContext } from "@/providers/hotel-provider"
// // // import { useSession } from "next-auth/react"
// // // import { useMutation, useQuery } from "@apollo/client"
// // // import { gql } from "@apollo/client"

// // // // GraphQL Queries and Mutations
// // // const GET_ROOMS_WITH_PRICING = gql`
// // //   query GetRoomsWithPricing($hotelId: String!) {
// // //     rooms(hotelId: $hotelId) {
// // //       id
// // //       hotelId
// // //       roomNumber
// // //       floor
// // //       roomType
// // //       status
// // //       pricePerNight
// // //       pricePerNightMin
// // //       pricePerNightMax
// // //       baseOccupancy
// // //       maxOccupancy
// // //       extraBedAllowed
// // //       extraBedPrice
// // //       roomSize
// // //       bedType
// // //       bedCount
// // //       amenities
// // //       description
// // //       images
// // //       isSmoking
// // //       isActive
// // //       lastCleaned
// // //       lastMaintained
// // //       maintenanceNotes
// // //       createdAt
// // //       updatedAt
// // //     }
// // //   }
// // // `

// // // const UPDATE_ROOM_TYPE = gql`
// // //   mutation UpdateRoomType(
// // //     $hotelId: String!
// // //     $roomType: RoomType!
// // //     $updateData: UpdateRoomTypeInput!
// // //   ) {
// // //     updateRoomType(
// // //       hotelId: $hotelId
// // //       roomType: $roomType
// // //       updateData: $updateData
// // //     ) {
// // //       id
// // //       roomType
// // //       pricePerNight
// // //       pricePerNightMin
// // //       pricePerNightMax
// // //       extraBedPrice
// // //       baseOccupancy
// // //       maxOccupancy
// // //       extraBedAllowed
// // //       roomSize
// // //       bedType
// // //       bedCount
// // //       amenities
// // //       description
// // //       isSmoking
// // //       images
// // //     }
// // //   }
// // // `

// // // // Types
// // // interface RoomTypeData {
// // //   id: string
// // //   roomType: string
// // //   price: number
// // //   minPrice: number
// // //   maxPrice: number
// // //   available: number
// // //   roomIds: string[]
// // //   extraBedAllowed: boolean
// // //   extraBedPrice?: number
// // //   baseOccupancy: number
// // //   maxOccupancy: number
// // //   roomSize: number
// // //   bedType: string
// // //   bedCount: number
// // //   amenities: string[]
// // //   lastUpdated?: string
// // // }

// // // interface WeekendRate {
// // //   roomTypeId: string
// // //   price: number
// // //   minPrice: number
// // //   maxPrice: number
// // //   enabled: boolean
// // // }

// // // interface ValidationError {
// // //   field: string
// // //   message: string
// // // }

// // // interface Notification {
// // //   id: string
// // //   type: "success" | "error"
// // //   message: string
// // // }

// // // export default function PricingPage() {
// // //   const { toast } = useToast()
// // //   const [loading, setLoading] = useState(false)
// // //   const [activeTab, setActiveTab] = useState("standard")

// // //   const { selectedHotel } = useHotelContext()
// // //   const { data: session } = useSession()

// // //   // State management - CRITICAL: Separate source of truth from editable data
// // //   const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]) // Source of truth from backend
// // //   const [editableRoomTypes, setEditableRoomTypes] = useState<RoomTypeData[]>([]) // Editable copy
// // //   const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
// // //   const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

// // //   const [weekendDays, setWeekendDays] = useState({
// // //     friday: true,
// // //     saturday: true,
// // //     sunday: true,
// // //   })

// // //   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
// // //   const [notifications, setNotifications] = useState<Notification[]>([])
// // //   const [lastSaved, setLastSaved] = useState<Date | null>(null)

// // //   // Fetch rooms with pricing data
// // //   const {
// // //     data: roomsData,
// // //     loading: roomsLoading,
// // //     error: roomsError,
// // //     refetch: refetchRooms,
// // //   } = useQuery(GET_ROOMS_WITH_PRICING, {
// // //     variables: { hotelId: selectedHotel?.id || "" },
// // //     skip: !selectedHotel?.id,
// // //     fetchPolicy: "network-only", // CRITICAL: Always fetch fresh data from backend
// // //     errorPolicy: "all",
// // //     onCompleted: (data) => {
// // //       console.log("✅ Rooms with pricing fetched successfully:", data)
// // //       if (data.rooms) {
// // //         processRoomsData(data.rooms)
// // //       }
// // //     },
// // //     onError: (error) => {
// // //       console.error("❌ Error fetching rooms:", error)
// // //       addNotification("error", "Failed to fetch room information from server.")
// // //     },
// // //   })

// // //   // Mutation for updating room type definitions
// // //   const [updateRoomType] = useMutation(UPDATE_ROOM_TYPE, {
// // //     errorPolicy: "all",
// // //     onCompleted: (data) => {
// // //       console.log("✅ Room type updated successfully:", data)
// // //     },
// // //     onError: (error) => {
// // //       console.error("❌ Error updating room type:", error)
// // //     },
// // //   })

// // //   // Notification management
// // //   const addNotification = (type: "success" | "error", message: string) => {
// // //     const id = Date.now().toString()
// // //     setNotifications((prev) => [...prev, { id, type, message }])
// // //     // Auto-remove notification after 5 seconds
// // //     setTimeout(() => {
// // //       setNotifications((prev) => prev.filter((n) => n.id !== id))
// // //     }, 5000)
// // //   }

// // //   // CRITICAL FIX: Properly read actual backend values without fallback calculations
// // //   const processRoomsData = (rooms: any[]) => {
// // //     if (!rooms || rooms.length === 0) {
// // //       setRoomTypes([])
// // //       setEditableRoomTypes([])
// // //       return
// // //     }

// // //     console.log("🔄 Processing rooms data from backend:", rooms)

// // //     // Group rooms by type
// // //     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
// // //       const roomType = room.roomType

// // //       // Only include active rooms
// // //       if (!room.isActive) return acc

// // //       if (!acc[roomType]) {
// // //         acc[roomType] = {
// // //           rooms: [],
// // //           totalRooms: 0,
// // //           roomIds: [],
// // //           // Collect all pricing values to find the most recent/accurate ones
// // //           allBasePrices: [],
// // //           allMinPrices: [],
// // //           allMaxPrices: [],
// // //           firstRoom: room,
// // //         }
// // //       }

// // //       acc[roomType].rooms.push(room)
// // //       acc[roomType].totalRooms += 1
// // //       acc[roomType].roomIds.push(room.id)

// // //       // Collect all pricing values (not just from first room)
// // //       if (room.pricePerNight !== null && room.pricePerNight !== undefined) {
// // //         acc[roomType].allBasePrices.push(room.pricePerNight)
// // //       }
// // //       if (room.pricePerNightMin !== null && room.pricePerNightMin !== undefined) {
// // //         acc[roomType].allMinPrices.push(room.pricePerNightMin)
// // //       }
// // //       if (room.pricePerNightMax !== null && room.pricePerNightMax !== undefined) {
// // //         acc[roomType].allMaxPrices.push(room.pricePerNightMax)
// // //       }

// // //       return acc
// // //     }, {})

// // //     const roomTypesForPricing: RoomTypeData[] = Object.entries(roomTypeGroups).map(
// // //       ([typeName, data]: [string, any]) => {
// // //         const firstRoom = data.firstRoom

// // //         // CRITICAL FIX: Use actual backend values directly, no calculations
// // //         let basePrice = 0
// // //         let minPrice = 0
// // //         let maxPrice = 0

// // //         // Get the most recent/highest values from all rooms of this type
// // //         if (data.allBasePrices.length > 0) {
// // //           basePrice = Math.max(...data.allBasePrices) // Use highest base price
// // //         }
// // //         if (data.allMinPrices.length > 0) {
// // //           minPrice = Math.max(...data.allMinPrices) // Use highest min price (most recent update)
// // //         }
// // //         if (data.allMaxPrices.length > 0) {
// // //           maxPrice = Math.max(...data.allMaxPrices) // Use highest max price
// // //         }

// // //         // Only use defaults if NO pricing data exists in backend
// // //         if (basePrice === 0 && minPrice === 0 && maxPrice === 0) {
// // //           console.warn(`⚠️ No pricing data found in backend for ${typeName}, using defaults`)
// // //           const defaults = getRoomTypeDefaults(typeName)
// // //           basePrice = defaults.basePrice
// // //           minPrice = defaults.minPrice
// // //           maxPrice = defaults.maxPrice
// // //         } else {
// // //           // If we have some pricing but missing others, calculate only the missing ones
// // //           if (basePrice === 0 && (minPrice > 0 || maxPrice > 0)) {
// // //             basePrice = Math.round((minPrice + maxPrice) / 2) || 1000
// // //           }
// // //           if (minPrice === 0 && basePrice > 0) {
// // //             minPrice = Math.round(basePrice * 0.7)
// // //           }
// // //           if (maxPrice === 0 && basePrice > 0) {
// // //             maxPrice = Math.round(basePrice * 1.5)
// // //           }
// // //         }

// // //         console.log(`📊 Room type ${typeName} - USING ACTUAL BACKEND VALUES:`, {
// // //           basePrice,
// // //           minPrice,
// // //           maxPrice,
// // //           totalRooms: data.totalRooms,
// // //           backendData: {
// // //             allBasePrices: data.allBasePrices,
// // //             allMinPrices: data.allMinPrices,
// // //             allMaxPrices: data.allMaxPrices,
// // //             firstRoomValues: {
// // //               pricePerNight: firstRoom.pricePerNight,
// // //               pricePerNightMin: firstRoom.pricePerNightMin,
// // //               pricePerNightMax: firstRoom.pricePerNightMax,
// // //             },
// // //           },
// // //         })

// // //         return {
// // //           id: typeName.toLowerCase().replace(/\s+/g, "-"),
// // //           roomType: typeName,
// // //           price: basePrice,
// // //           minPrice: minPrice,
// // //           maxPrice: maxPrice,
// // //           available: data.totalRooms,
// // //           roomIds: data.roomIds,
// // //           extraBedAllowed: firstRoom?.extraBedAllowed || false,
// // //           extraBedPrice: firstRoom?.extraBedPrice || 0,
// // //           baseOccupancy: firstRoom?.baseOccupancy || 2,
// // //           maxOccupancy: firstRoom?.maxOccupancy || 4,
// // //           roomSize: firstRoom?.roomSize || 25,
// // //           bedType: firstRoom?.bedType || "QUEEN",
// // //           bedCount: firstRoom?.bedCount || 1,
// // //           amenities: firstRoom?.amenities || [],
// // //           lastUpdated: firstRoom?.updatedAt,
// // //         }
// // //       },
// // //     )

// // //     console.log("✅ Processed room types with ACTUAL BACKEND VALUES:", roomTypesForPricing)

// // //     // CRITICAL: Set source of truth first, then create editable copy
// // //     setRoomTypes(roomTypesForPricing)
// // //     setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing))) // Deep copy for editing

// // //     initializeWeekendRates(roomTypesForPricing)
// // //   }

// // //   // Helper function to get default pricing for room types
// // //   const getRoomTypeDefaults = (roomType: string) => {
// // //     const defaults: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {
// // //       STANDARD: { basePrice: 500, minPrice: 350, maxPrice: 750 },
// // //       DELUXE: { basePrice: 800, minPrice: 560, maxPrice: 1200 },
// // //       SUITE: { basePrice: 2000, minPrice: 1400, maxPrice: 3000 },
// // //       EXECUTIVE: { basePrice: 1500, minPrice: 1050, maxPrice: 2250 },
// // //       PRESIDENTIAL: { basePrice: 5000, minPrice: 3500, maxPrice: 7500 },
// // //     }

// // //     return defaults[roomType.toUpperCase()] || { basePrice: 1000, minPrice: 700, maxPrice: 1500 }
// // //   }

// // //   const initializeWeekendRates = (roomTypesData: RoomTypeData[]) => {
// // //     const initialWeekendRates = roomTypesData.map((roomType) => {
// // //       const weekendRatio = 1.25
// // //       const weekendPrice = Math.round(roomType.price * weekendRatio)

// // //       return {
// // //         roomTypeId: roomType.id,
// // //         price: weekendPrice,
// // //         minPrice: Math.round(roomType.minPrice * weekendRatio),
// // //         maxPrice: Math.round(roomType.maxPrice * weekendRatio),
// // //         enabled: true,
// // //       }
// // //     })

// // //     setWeekendRates(initialWeekendRates)
// // //     setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
// // //   }

// // //   // Validation
// // //   const validatePricing = (roomTypes: RoomTypeData[]): ValidationError[] => {
// // //     const errors: ValidationError[] = []

// // //     roomTypes.forEach((room) => {
// // //       if (room.minPrice >= room.price) {
// // //         errors.push({
// // //           field: `${room.id}-price`,
// // //           message: `${room.roomType}: Base price must be higher than minimum price`,
// // //         })
// // //       }

// // //       if (room.price >= room.maxPrice) {
// // //         errors.push({
// // //           field: `${room.id}-price`,
// // //           message: `${room.roomType}: Base price must be lower than maximum price`,
// // //         })
// // //       }

// // //       if (room.minPrice < 0 || room.price < 0 || room.maxPrice < 0) {
// // //         errors.push({
// // //           field: `${room.id}-price`,
// // //           message: `${room.roomType}: Prices cannot be negative`,
// // //         })
// // //       }

// // //       if (room.minPrice === 0 || room.maxPrice === 0) {
// // //         errors.push({
// // //           field: `${room.id}-price`,
// // //           message: `${room.roomType}: Min and max prices must be greater than 0`,
// // //         })
// // //       }
// // //     })

// // //     return errors
// // //   }

// // //   // Price change handlers
// // //   const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// // //     const numValue = Number.parseFloat(value) || 0

// // //     setEditableRoomTypes((prev) => {
// // //       return prev.map((room) => {
// // //         if (room.id === id) {
// // //           return { ...room, [field]: numValue }
// // //         }
// // //         return room
// // //       })
// // //     })

// // //     // Clear validation errors for this field
// // //     setValidationErrors((prev) => prev.filter((error) => error.field !== `${id}-${field}`))
// // //   }, [])

// // //   const handleWeekendPriceChange = useCallback(
// // //     (roomTypeId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// // //       const numValue = Number.parseFloat(value) || 0

// // //       setEditableWeekendRates((prev) => {
// // //         return prev.map((rate) => {
// // //           if (rate.roomTypeId === roomTypeId) {
// // //             return { ...rate, [field]: numValue }
// // //           }
// // //           return rate
// // //         })
// // //       })
// // //     },
// // //     [],
// // //   )

// // //   const handleWeekendRateToggle = useCallback((roomTypeId: string, enabled: boolean) => {
// // //     setEditableWeekendRates((prev) =>
// // //       prev.map((rate) => (rate.roomTypeId === roomTypeId ? { ...rate, enabled } : rate)),
// // //     )
// // //   }, [])

// // //   // CRITICAL: Enhanced save handler that ensures min/max values are saved
// // //   const handleSave = async () => {
// // //     setLoading(true)

// // //     try {
// // //       if (activeTab === "standard") {
// // //         // Validate all pricing before saving
// // //         const errors = validatePricing(editableRoomTypes)
// // //         setValidationErrors(errors)

// // //         if (errors.length > 0) {
// // //           addNotification("error", "Please fix validation errors before saving")
// // //           return
// // //         }

// // //         console.log("💾 Saving room type pricing to backend...")

// // //         // CRITICAL: Save to backend first, then update UI with backend response
// // //         const updatePromises = editableRoomTypes.map(async (roomType) => {
// // //           console.log(`Updating pricing for ${roomType.roomType}:`, {
// // //             basePrice: roomType.price,
// // //             minPrice: roomType.minPrice,
// // //             maxPrice: roomType.maxPrice,
// // //           })

// // //           try {
// // //             const result = await updateRoomType({
// // //               variables: {
// // //                 hotelId: selectedHotel?.id || "",
// // //                 roomType: roomType.roomType.toUpperCase(),
// // //                 updateData: {
// // //                   pricePerNight: roomType.price,
// // //                   pricePerNightMin: roomType.minPrice, // CRITICAL: Ensure min price is saved
// // //                   pricePerNightMax: roomType.maxPrice, // CRITICAL: Ensure max price is saved
// // //                   extraBedPrice: roomType.extraBedPrice || null,
// // //                 },
// // //               },
// // //             })

// // //             console.log(`✅ Backend updated for ${roomType.roomType}:`, result.data)
// // //             return result.data.updateRoomType
// // //           } catch (error) {
// // //             console.error(`❌ Failed to update room type ${roomType.roomType}:`, error)
// // //             throw error
// // //           }
// // //         })

// // //         // Wait for all backend updates to complete
// // //         const updatedRoomTypes = await Promise.all(updatePromises)
// // //         console.log("✅ All room type updates completed successfully")

// // //         // CRITICAL: Only update local state after successful backend operations
// // //         setRoomTypes([...editableRoomTypes])
// // //         setLastSaved(new Date())
// // //         addNotification("success", `Successfully updated pricing for ${updatedRoomTypes.length} room types`)

// // //         // CRITICAL: Force refetch to ensure UI shows the actual backend data
// // //         console.log("🔄 Refetching rooms data to confirm backend updates...")
// // //         await refetchRooms()
// // //       } else if (activeTab === "weekend") {
// // //         // Validate weekend rates
// // //         for (const rate of editableWeekendRates) {
// // //           if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
// // //             const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// // //             throw new Error(
// // //               `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
// // //             )
// // //           }
// // //         }

// // //         // Update weekend rates (implement your weekend rate mutation here)
// // //         setWeekendRates([...editableWeekendRates])
// // //         addNotification("success", "Weekend rates updated successfully")
// // //       }

// // //       setValidationErrors([])
// // //     } catch (error) {
// // //       console.error("❌ Error saving pricing:", error)
// // //       addNotification("error", error instanceof Error ? error.message : "Failed to update pricing")
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const handleReset = () => {
// // //     if (activeTab === "standard") {
// // //       // Reset to last saved values from source of truth
// // //       setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
// // //     } else if (activeTab === "weekend") {
// // //       setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
// // //     }

// // //     setValidationErrors([])
// // //     addNotification("success", "Changes reset to last saved values")
// // //   }

// // //   const handleRefresh = async () => {
// // //     console.log("🔄 Manually refreshing room data from backend...")
// // //     await refetchRooms()
// // //     addNotification("success", "Data refreshed from backend")
// // //   }

// // //   // Auto-populate min/max prices based on base price
// // //   const handleAutoPopulate = (roomId: string) => {
// // //     setEditableRoomTypes((prev) => {
// // //       return prev.map((room) => {
// // //         if (room.id === roomId && room.price > 0) {
// // //           const newMinPrice = Math.round(room.price * 0.7) // 70% of base
// // //           const newMaxPrice = Math.round(room.price * 1.5) // 150% of base

// // //           return {
// // //             ...room,
// // //             minPrice: newMinPrice,
// // //             maxPrice: newMaxPrice,
// // //           }
// // //         }
// // //         return room
// // //       })
// // //     })

// // //     addNotification("success", "Min and max prices auto-populated based on base price")
// // //   }

// // //   // Check if there are unsaved changes
// // //   const hasChanges =
// // //     JSON.stringify(roomTypes) !== JSON.stringify(editableRoomTypes) ||
// // //     JSON.stringify(weekendRates) !== JSON.stringify(editableWeekendRates)

// // //   const isLoading = roomsLoading
// // //   const hasError = roomsError

// // //   if (isLoading) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="flex items-center space-x-3">
// // //           <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
// // //           <span className="text-gray-600">Loading room pricing data...</span>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   if (hasError) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
// // //             <AlertCircle className="h-6 w-6" />
// // //             <span>Error: {roomsError?.message}</span>
// // //           </div>
// // //           <Button onClick={handleRefresh}>
// // //             <RefreshCw className="mr-2 h-4 w-4" />
// // //             Retry
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   if (roomTypes.length === 0) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <p className="text-gray-600 mb-4">No room categories found for this hotel.</p>
// // //           <Button onClick={handleRefresh}>
// // //             <RefreshCw className="mr-2 h-4 w-4" />
// // //             Refresh Data
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       {/* Notifications */}
// // //       <div className="fixed top-4 right-4 space-y-2 z-50">
// // //         {notifications.map((notification) => (
// // //           <div
// // //             key={notification.id}
// // //             className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
// // //               notification.type === "success"
// // //                 ? "bg-green-100 text-green-800 border border-green-200"
// // //                 : "bg-red-100 text-red-800 border border-red-200"
// // //             }`}
// // //           >
// // //             {notification.type === "success" ? (
// // //               <CheckCircle className="h-5 w-5" />
// // //             ) : (
// // //               <AlertCircle className="h-5 w-5" />
// // //             )}
// // //             <span className="text-sm font-medium">{notification.message}</span>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Header */}
// // //       <div className="bg-white border-b">
// // //         <div className="container mx-auto px-4 py-4">
// // //           <div className="flex items-center justify-between">
// // //             <div>
// // //               <h1 className="text-2xl font-bold text-gray-900">Room Pricing Management</h1>
// // //               <p className="text-sm text-gray-600">Configure room rates with proper backend persistence</p>
// // //               {lastSaved && <p className="text-sm text-green-600 mt-1">Last saved: {lastSaved.toLocaleString()}</p>}
// // //             </div>
// // //             <div className="flex items-center gap-2">
// // //               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
// // //                 <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="container mx-auto px-4 py-6">
// // //         <div className="mb-4 text-sm text-gray-600">
// // //           <p>
// // //             Found {roomTypes.length} room categories
// // //             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
// // //           </p>
// // //         </div>

// // //         {/* Validation Errors */}
// // //         {validationErrors.length > 0 && (
// // //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// // //             <div className="flex items-center space-x-2 mb-2">
// // //               <AlertCircle className="h-5 w-5 text-red-600" />
// // //               <h3 className="font-medium text-red-800">Validation Errors</h3>
// // //             </div>
// // //             <ul className="text-sm text-red-700 space-y-1">
// // //               {validationErrors.map((error, index) => (
// // //                 <li key={index}>• {error.message}</li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         )}

// // //         <Card>
// // //           <CardHeader>
// // //             <CardTitle>Room Pricing Configuration</CardTitle>
// // //             <CardDescription>
// // //               Set the base price, minimum, and maximum pricing for each room category. These values will be saved to the
// // //               backend and will apply to all rooms of each type.
// // //             </CardDescription>
// // //           </CardHeader>
// // //           <CardContent>
// // //             <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
// // //               <TabsList className="mb-6">
// // //                 <TabsTrigger value="standard">Standard Rate</TabsTrigger>
// // //                 <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
// // //               </TabsList>

// // //               <TabsContent value="standard" className="space-y-4">
// // //                 <div className="rounded-md border">
// // //                   <Table>
// // //                     <TableHeader>
// // //                       <TableRow>
// // //                         <TableHead className="w-[300px]">Room Category</TableHead>
// // //                         <TableHead>Min Price (฿)</TableHead>
// // //                         <TableHead>Base Price (฿)</TableHead>
// // //                         <TableHead>Max Price (฿)</TableHead>
// // //                         <TableHead>Extra Bed</TableHead>
// // //                         <TableHead>Actions</TableHead>
// // //                         <TableHead className="text-right">Available Rooms</TableHead>
// // //                       </TableRow>
// // //                     </TableHeader>
// // //                     <TableBody>
// // //                       {editableRoomTypes.map((room) => {
// // //                         const hasFieldError = (field: string) =>
// // //                           validationErrors.some((error) => error.field === `${room.id}-${field}`)

// // //                         return (
// // //                           <TableRow key={room.id} className="hover:bg-gray-50">
// // //                             <TableCell className="font-medium">
// // //                               <div>{room.roomType}</div>
// // //                               {room.lastUpdated && (
// // //                                 <div className="text-xs text-gray-500">
// // //                                   Updated: {new Date(room.lastUpdated).toLocaleString()}
// // //                                 </div>
// // //                               )}
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Input
// // //                                 type="number"
// // //                                 value={room.minPrice}
// // //                                 onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
// // //                                 className={`w-[120px] ${hasFieldError("minPrice") ? "border-red-500 bg-red-50" : ""}`}
// // //                                 min="0"
// // //                                 step="0.01"
// // //                                 placeholder="Min price"
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Input
// // //                                 type="number"
// // //                                 value={room.price}
// // //                                 onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
// // //                                 className={`w-[120px] ${hasFieldError("price") ? "border-red-500 bg-red-50" : ""}`}
// // //                                 min="0"
// // //                                 step="0.01"
// // //                                 placeholder="Base price"
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Input
// // //                                 type="number"
// // //                                 value={room.maxPrice}
// // //                                 onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
// // //                                 className={`w-[120px] ${hasFieldError("maxPrice") ? "border-red-500 bg-red-50" : ""}`}
// // //                                 min="0"
// // //                                 step="0.01"
// // //                                 placeholder="Max price"
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               {room.extraBedAllowed ? `฿${room.extraBedPrice || 0}` : "Not allowed"}
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Button
// // //                                 variant="outline"
// // //                                 size="sm"
// // //                                 onClick={() => handleAutoPopulate(room.id)}
// // //                                 disabled={room.price <= 0}
// // //                                 className="text-xs"
// // //                               >
// // //                                 Auto-fill
// // //                               </Button>
// // //                             </TableCell>
// // //                             <TableCell className="text-right">{room.available}</TableCell>
// // //                           </TableRow>
// // //                         )
// // //                       })}
// // //                     </TableBody>
// // //                   </Table>
// // //                 </div>

// // //                 <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800">
// // //                   <p className="font-medium mb-2">✅ FIXED: Now Reading Actual Backend Values</p>
// // //                   <ul className="space-y-1">
// // //                     <li>• Uses network-only fetch policy to always get fresh data</li>
// // //                     <li>• Reads actual pricePerNightMin and pricePerNightMax from backend</li>
// // //                     <li>• No more fallback calculations overriding backend values</li>
// // //                     <li>• SUITE min price should now show 520 (from backend) instead of 420</li>
// // //                   </ul>
// // //                 </div>
// // //               </TabsContent>

// // //               <TabsContent value="weekend" className="space-y-4">
// // //                 <div className="flex items-center space-x-4 mb-4">
// // //                   <div className="text-sm font-medium">Weekend days:</div>
// // //                   <div className="flex items-center space-x-2">
// // //                     <Checkbox
// // //                       id="friday"
// // //                       checked={weekendDays.friday}
// // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
// // //                     />
// // //                     <label htmlFor="friday" className="text-sm">
// // //                       Friday
// // //                     </label>
// // //                   </div>
// // //                   <div className="flex items-center space-x-2">
// // //                     <Checkbox
// // //                       id="saturday"
// // //                       checked={weekendDays.saturday}
// // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
// // //                     />
// // //                     <label htmlFor="saturday" className="text-sm">
// // //                       Saturday
// // //                     </label>
// // //                   </div>
// // //                   <div className="flex items-center space-x-2">
// // //                     <Checkbox
// // //                       id="sunday"
// // //                       checked={weekendDays.sunday}
// // //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
// // //                     />
// // //                     <label htmlFor="sunday" className="text-sm">
// // //                       Sunday
// // //                     </label>
// // //                   </div>
// // //                 </div>

// // //                 <div className="rounded-md border">
// // //                   <Table>
// // //                     <TableHeader>
// // //                       <TableRow>
// // //                         <TableHead className="w-[250px]">Room Category</TableHead>
// // //                         <TableHead>Enabled</TableHead>
// // //                         <TableHead>Min Price (฿)</TableHead>
// // //                         <TableHead>Base Price (฿)</TableHead>
// // //                         <TableHead>Max Price (฿)</TableHead>
// // //                         <TableHead className="text-right">Standard Price</TableHead>
// // //                       </TableRow>
// // //                     </TableHeader>
// // //                     <TableBody>
// // //                       {editableWeekendRates.map((rate) => {
// // //                         const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// // //                         return (
// // //                           <TableRow key={rate.roomTypeId}>
// // //                             <TableCell className="font-medium">{room?.roomType}</TableCell>
// // //                             <TableCell>
// // //                               <Switch
// // //                                 checked={rate.enabled}
// // //                                 onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomTypeId, checked)}
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Input
// // //                                 type="number"
// // //                                 value={rate.minPrice}
// // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "minPrice", e.target.value)}
// // //                                 className="w-[120px]"
// // //                                 disabled={!rate.enabled}
// // //                                 min="0"
// // //                                 step="0.01"
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Input
// // //                                 type="number"
// // //                                 value={rate.price}
// // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "price", e.target.value)}
// // //                                 className={`w-[120px] ${
// // //                                   rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
// // //                                     ? "border-red-500 bg-red-50"
// // //                                     : ""
// // //                                 }`}
// // //                                 disabled={!rate.enabled}
// // //                                 min="0"
// // //                                 step="0.01"
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell>
// // //                               <Input
// // //                                 type="number"
// // //                                 value={rate.maxPrice}
// // //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "maxPrice", e.target.value)}
// // //                                 className="w-[120px]"
// // //                                 disabled={!rate.enabled}
// // //                                 min="0"
// // //                                 step="0.01"
// // //                               />
// // //                             </TableCell>
// // //                             <TableCell className="text-right text-gray-500">฿ {room?.price}</TableCell>
// // //                           </TableRow>
// // //                         )
// // //                       })}
// // //                     </TableBody>
// // //                   </Table>
// // //                 </div>

// // //                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
// // //                   <p>
// // //                     <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
// // //                     automatically for bookings on weekend days.
// // //                   </p>
// // //                 </div>
// // //               </TabsContent>
// // //             </Tabs>
// // //           </CardContent>
// // //           <CardFooter className="flex justify-between">
// // //             <div className="text-sm text-gray-600">
// // //               {hasChanges && <span className="text-orange-600 font-medium">You have unsaved changes</span>}
// // //             </div>
// // //             <div className="flex items-center space-x-3">
// // //               <Button variant="outline" onClick={handleReset} disabled={!hasChanges || loading}>
// // //                 <RefreshCw className="mr-2 h-4 w-4" />
// // //                 Reset Changes
// // //               </Button>
// // //               <Button onClick={handleSave} disabled={!hasChanges || loading || validationErrors.length > 0}>
// // //                 {loading ? (
// // //                   <>
// // //                     <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
// // //                     Saving to Backend...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <Save className="mr-2 h-4 w-4" />
// // //                     Save Changes
// // //                   </>
// // //                 )}
// // //               </Button>
// // //             </div>
// // //           </CardFooter>
// // //         </Card>

// // //         {/* Debug Information */}
// // //         <div className="mt-6 bg-gray-100 rounded-lg p-4">
// // //           <details className="cursor-pointer">
// // //             <summary className="text-sm font-medium text-gray-700 mb-2">Debug Information</summary>
// // //             <div className="text-xs text-gray-600 space-y-2">
// // //               <div>
// // //                 <strong>Has Changes:</strong> {hasChanges ? "Yes" : "No"}
// // //               </div>
// // //               <div>
// // //                 <strong>Validation Errors:</strong> {validationErrors.length}
// // //               </div>
// // //               <div>
// // //                 <strong>Room Types Count:</strong> {roomTypes.length}
// // //               </div>
// // //               <div>
// // //                 <strong>Last Saved:</strong> {lastSaved ? lastSaved.toISOString() : "Never"}
// // //               </div>
// // //               <div>
// // //                 <strong>Selected Hotel:</strong> {selectedHotel?.name || "None"}
// // //               </div>
// // //               <div>
// // //                 <strong>Fetch Policy:</strong> network-only (always fresh data)
// // //               </div>
// // //             </div>
// // //           </details>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }
// // "use client"

// // import { useState, useCallback } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { useToast } from "@/components/ui/use-toast"
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import { Save, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import { Switch } from "@/components/ui/switch"
// // import { useHotelContext } from "@/providers/hotel-provider"
// // import { useSession } from "next-auth/react"
// // import { useMutation, useQuery } from "@apollo/client"
// // import { gql } from "@apollo/client"

// // // GraphQL Queries and Mutations
// // const GET_ROOMS_WITH_PRICING = gql`
// //   query GetRoomsWithPricing($hotelId: String!) {
// //     rooms(hotelId: $hotelId) {
// //       id
// //       hotelId
// //       roomNumber
// //       floor
// //       roomType
// //       status
// //       pricePerNight
// //       pricePerNightMin
// //       pricePerNightMax
// //       baseOccupancy
// //       maxOccupancy
// //       extraBedAllowed
// //       extraBedPrice
// //       roomSize
// //       bedType
// //       bedCount
// //       amenities
// //       description
// //       images
// //       isSmoking
// //       isActive
// //       lastCleaned
// //       lastMaintained
// //       maintenanceNotes
// //       createdAt
// //       updatedAt
// //     }
// //   }
// // `

// // // CRITICAL: Try different mutation approaches to ensure min/max prices are saved
// // const UPDATE_ROOM_TYPE = gql`
// //   mutation UpdateRoomType(
// //     $hotelId: String!
// //     $roomType: RoomType!
// //     $updateData: UpdateRoomTypeInput!
// //   ) {
// //     updateRoomType(
// //       hotelId: $hotelId
// //       roomType: $roomType
// //       updateData: $updateData
// //     ) {
// //       id
// //       roomType
// //       pricePerNight
// //       pricePerNightMin
// //       pricePerNightMax
// //       extraBedPrice
// //       baseOccupancy
// //       maxOccupancy
// //       extraBedAllowed
// //       roomSize
// //       bedType
// //       bedCount
// //       amenities
// //       description
// //       isSmoking
// //       images
// //       updatedAt
// //     }
// //   }
// // `

// // // Alternative mutation to update individual rooms if room type update doesn't work
// // const UPDATE_ROOM_PRICING = gql`
// //   mutation UpdateRoomPricing($roomId: String!, $pricePerNight: Float!, $pricePerNightMin: Float, $pricePerNightMax: Float) {
// //     updateRoomPricing(roomId: $roomId, pricePerNight: $pricePerNight, pricePerNightMin: $pricePerNightMin, pricePerNightMax: $pricePerNightMax) {
// //       id
// //       pricePerNight
// //       pricePerNightMin
// //       pricePerNightMax
// //       updatedAt
// //     }
// //   }
// // `

// // // Types
// // interface RoomTypeData {
// //   id: string
// //   roomType: string
// //   price: number
// //   minPrice: number
// //   maxPrice: number
// //   available: number
// //   roomIds: string[]
// //   extraBedAllowed: boolean
// //   extraBedPrice?: number
// //   baseOccupancy: number
// //   maxOccupancy: number
// //   roomSize: number
// //   bedType: string
// //   bedCount: number
// //   amenities: string[]
// //   lastUpdated?: string
// // }

// // interface WeekendRate {
// //   roomTypeId: string
// //   price: number
// //   minPrice: number
// //   maxPrice: number
// //   enabled: boolean
// // }

// // interface ValidationError {
// //   field: string
// //   message: string
// // }

// // interface Notification {
// //   id: string
// //   type: "success" | "error" | "warning"
// //   message: string
// // }

// // export default function PricingPage() {
// //   const { toast } = useToast()
// //   const [loading, setLoading] = useState(false)
// //   const [activeTab, setActiveTab] = useState("standard")

// //   const { selectedHotel } = useHotelContext()
// //   const { data: session } = useSession()

// //   // State management - CRITICAL: Separate source of truth from editable data
// //   const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]) // Source of truth from backend
// //   const [editableRoomTypes, setEditableRoomTypes] = useState<RoomTypeData[]>([]) // Editable copy
// //   const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
// //   const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

// //   const [weekendDays, setWeekendDays] = useState({
// //     friday: true,
// //     saturday: true,
// //     sunday: true,
// //   })

// //   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
// //   const [notifications, setNotifications] = useState<Notification[]>([])
// //   const [lastSaved, setLastSaved] = useState<Date | null>(null)

// //   // Fetch rooms with pricing data
// //   const {
// //     data: roomsData,
// //     loading: roomsLoading,
// //     error: roomsError,
// //     refetch: refetchRooms,
// //   } = useQuery(GET_ROOMS_WITH_PRICING, {
// //     variables: { hotelId: selectedHotel?.id || "" },
// //     skip: !selectedHotel?.id,
// //     fetchPolicy: "network-only", // CRITICAL: Always fetch fresh data from backend
// //     errorPolicy: "all",
// //     onCompleted: (data) => {
// //       console.log("✅ Rooms with pricing fetched successfully:", data)
// //       if (data.rooms) {
// //         processRoomsData(data.rooms)
// //       }
// //     },
// //     onError: (error) => {
// //       console.error("❌ Error fetching rooms:", error)
// //       addNotification("error", "Failed to fetch room information from server.")
// //     },
// //   })

// //   // Mutation for updating room type definitions
// //   const [updateRoomType] = useMutation(UPDATE_ROOM_TYPE, {
// //     errorPolicy: "all",
// //     onCompleted: (data) => {
// //       console.log("✅ Room type updated successfully:", data)
// //     },
// //     onError: (error) => {
// //       console.error("❌ Error updating room type:", error)
// //     },
// //   })

// //   // Alternative mutation for updating individual rooms
// //   const [updateRoomPricing] = useMutation(UPDATE_ROOM_PRICING, {
// //     errorPolicy: "all",
// //     onCompleted: (data) => {
// //       console.log("✅ Room pricing updated successfully:", data)
// //     },
// //     onError: (error) => {
// //       console.error("❌ Error updating room pricing:", error)
// //     },
// //   })

// //   // Notification management
// //   const addNotification = (type: "success" | "error" | "warning", message: string) => {
// //     const id = Date.now().toString()
// //     setNotifications((prev) => [...prev, { id, type, message }])
// //     // Auto-remove notification after 5 seconds
// //     setTimeout(() => {
// //       setNotifications((prev) => prev.filter((n) => n.id !== id))
// //     }, 5000)
// //   }

// //   // CRITICAL FIX: Properly handle null/undefined values from backend
// //   const processRoomsData = (rooms: any[]) => {
// //     if (!rooms || rooms.length === 0) {
// //       setRoomTypes([])
// //       setEditableRoomTypes([])
// //       return
// //     }

// //     console.log("🔄 Processing rooms data from backend:", rooms)

// //     // Group rooms by type and get the LATEST pricing values
// //     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
// //       const roomType = room.roomType

// //       // Only include active rooms
// //       if (!room.isActive) return acc

// //       if (!acc[roomType]) {
// //         acc[roomType] = {
// //           rooms: [],
// //           totalRooms: 0,
// //           roomIds: [],
// //           latestRoom: room, // Keep track of the most recently updated room
// //         }
// //       }

// //       acc[roomType].rooms.push(room)
// //       acc[roomType].totalRooms += 1
// //       acc[roomType].roomIds.push(room.id)

// //       // Keep the most recently updated room as the source of pricing
// //       if (new Date(room.updatedAt) > new Date(acc[roomType].latestRoom.updatedAt)) {
// //         acc[roomType].latestRoom = room
// //       }

// //       return acc
// //     }, {})

// //     const roomTypesForPricing: RoomTypeData[] = Object.entries(roomTypeGroups).map(
// //       ([typeName, data]: [string, any]) => {
// //         const latestRoom = data.latestRoom

// //         // CRITICAL: Handle null/undefined values properly
// //         let basePrice = latestRoom.pricePerNight
// //         let minPrice = latestRoom.pricePerNightMin
// //         let maxPrice = latestRoom.pricePerNightMax

// //         // Convert null/undefined to 0 for display, but log the issue
// //         if (basePrice === null || basePrice === undefined) {
// //           console.warn(`⚠️ pricePerNight is null/undefined for ${typeName}`)
// //           basePrice = 0
// //         }
// //         if (minPrice === null || minPrice === undefined) {
// //           console.warn(`⚠️ pricePerNightMin is null/undefined for ${typeName}`)
// //           minPrice = 0
// //         }
// //         if (maxPrice === null || maxPrice === undefined) {
// //           console.warn(`⚠️ pricePerNightMax is null/undefined for ${typeName}`)
// //           maxPrice = 0
// //         }

// //         console.log(`📊 Room type ${typeName} - BACKEND VALUES:`, {
// //           basePrice,
// //           minPrice,
// //           maxPrice,
// //           totalRooms: data.totalRooms,
// //           latestRoomId: latestRoom.id,
// //           updatedAt: latestRoom.updatedAt,
// //           rawBackendValues: {
// //             pricePerNight: latestRoom.pricePerNight,
// //             pricePerNightMin: latestRoom.pricePerNightMin,
// //             pricePerNightMax: latestRoom.pricePerNightMax,
// //           },
// //         })

// //         // If all pricing values are 0, use defaults
// //         if (basePrice === 0 && minPrice === 0 && maxPrice === 0) {
// //           console.warn(`⚠️ All pricing values are 0 for ${typeName}, using defaults`)
// //           const defaults = getRoomTypeDefaults(typeName)
// //           basePrice = defaults.basePrice
// //           minPrice = defaults.minPrice
// //           maxPrice = defaults.maxPrice
// //           addNotification("warning", `No pricing data found for ${typeName}, using defaults`)
// //         }

// //         return {
// //           id: typeName.toLowerCase().replace(/\s+/g, "-"),
// //           roomType: typeName,
// //           price: basePrice,
// //           minPrice: minPrice,
// //           maxPrice: maxPrice,
// //           available: data.totalRooms,
// //           roomIds: data.roomIds,
// //           extraBedAllowed: latestRoom?.extraBedAllowed || false,
// //           extraBedPrice: latestRoom?.extraBedPrice || 0,
// //           baseOccupancy: latestRoom?.baseOccupancy || 2,
// //           maxOccupancy: latestRoom?.maxOccupancy || 4,
// //           roomSize: latestRoom?.roomSize || 25,
// //           bedType: latestRoom?.bedType || "QUEEN",
// //           bedCount: latestRoom?.bedCount || 1,
// //           amenities: latestRoom?.amenities || [],
// //           lastUpdated: latestRoom?.updatedAt,
// //         }
// //       },
// //     )

// //     console.log("✅ Processed room types with backend values:", roomTypesForPricing)

// //     // CRITICAL: Set source of truth first, then create editable copy
// //     setRoomTypes(roomTypesForPricing)
// //     setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing))) // Deep copy for editing

// //     initializeWeekendRates(roomTypesForPricing)
// //   }

// //   // Helper function to get default pricing for room types
// //   const getRoomTypeDefaults = (roomType: string) => {
// //     const defaults: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {
// //       STANDARD: { basePrice: 500, minPrice: 350, maxPrice: 750 },
// //       DELUXE: { basePrice: 800, minPrice: 560, maxPrice: 1200 },
// //       SUITE: { basePrice: 2000, minPrice: 1400, maxPrice: 3000 },
// //       EXECUTIVE: { basePrice: 1500, minPrice: 1050, maxPrice: 2250 },
// //       PRESIDENTIAL: { basePrice: 5000, minPrice: 3500, maxPrice: 7500 },
// //     }

// //     return defaults[roomType.toUpperCase()] || { basePrice: 1000, minPrice: 700, maxPrice: 1500 }
// //   }

// //   const initializeWeekendRates = (roomTypesData: RoomTypeData[]) => {
// //     const initialWeekendRates = roomTypesData.map((roomType) => {
// //       const weekendRatio = 1.25
// //       const weekendPrice = Math.round(roomType.price * weekendRatio)

// //       return {
// //         roomTypeId: roomType.id,
// //         price: weekendPrice,
// //         minPrice: Math.round(roomType.minPrice * weekendRatio),
// //         maxPrice: Math.round(roomType.maxPrice * weekendRatio),
// //         enabled: true,
// //       }
// //     })

// //     setWeekendRates(initialWeekendRates)
// //     setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
// //   }

// //   // Validation
// //   const validatePricing = (roomTypes: RoomTypeData[]): ValidationError[] => {
// //     const errors: ValidationError[] = []

// //     roomTypes.forEach((room) => {
// //       if (room.minPrice >= room.price) {
// //         errors.push({
// //           field: `${room.id}-price`,
// //           message: `${room.roomType}: Base price must be higher than minimum price`,
// //         })
// //       }

// //       if (room.price >= room.maxPrice) {
// //         errors.push({
// //           field: `${room.id}-price`,
// //           message: `${room.roomType}: Base price must be lower than maximum price`,
// //         })
// //       }

// //       if (room.minPrice < 0 || room.price < 0 || room.maxPrice < 0) {
// //         errors.push({
// //           field: `${room.id}-price`,
// //           message: `${room.roomType}: Prices cannot be negative`,
// //         })
// //       }

// //       if (room.minPrice === 0 || room.maxPrice === 0) {
// //         errors.push({
// //           field: `${room.id}-price`,
// //           message: `${room.roomType}: Min and max prices must be greater than 0`,
// //         })
// //       }
// //     })

// //     return errors
// //   }

// //   // Price change handlers
// //   const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// //     const numValue = Number.parseFloat(value) || 0

// //     setEditableRoomTypes((prev) => {
// //       return prev.map((room) => {
// //         if (room.id === id) {
// //           return { ...room, [field]: numValue }
// //         }
// //         return room
// //       })
// //     })

// //     // Clear validation errors for this field
// //     setValidationErrors((prev) => prev.filter((error) => error.field !== `${id}-${field}`))
// //   }, [])

// //   const handleWeekendPriceChange = useCallback(
// //     (roomTypeId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
// //       const numValue = Number.parseFloat(value) || 0

// //       setEditableWeekendRates((prev) => {
// //         return prev.map((rate) => {
// //           if (rate.roomTypeId === roomTypeId) {
// //             return { ...rate, [field]: numValue }
// //           }
// //           return rate
// //         })
// //       })
// //     },
// //     [],
// //   )

// //   const handleWeekendRateToggle = useCallback((roomTypeId: string, enabled: boolean) => {
// //     setEditableWeekendRates((prev) =>
// //       prev.map((rate) => (rate.roomTypeId === roomTypeId ? { ...rate, enabled } : rate)),
// //     )
// //   }, [])

// //   // CRITICAL: Enhanced save handler with multiple approaches
// //   const handleSave = async () => {
// //     setLoading(true)

// //     try {
// //       if (activeTab === "standard") {
// //         // Validate all pricing before saving
// //         const errors = validatePricing(editableRoomTypes)
// //         setValidationErrors(errors)

// //         if (errors.length > 0) {
// //           addNotification("error", "Please fix validation errors before saving")
// //           return
// //         }

// //         console.log("💾 Saving room type pricing to backend...")

// //         // CRITICAL: Try both approaches - room type update AND individual room updates
// //         const updatePromises = editableRoomTypes.map(async (roomType) => {
// //           console.log(`Updating pricing for ${roomType.roomType}:`, {
// //             basePrice: roomType.price,
// //             minPrice: roomType.minPrice,
// //             maxPrice: roomType.maxPrice,
// //           })

// //           try {
// //             // Approach 1: Try updating room type
// //             const roomTypeResult = await updateRoomType({
// //               variables: {
// //                 hotelId: selectedHotel?.id || "",
// //                 roomType: roomType.roomType.toUpperCase(),
// //                 updateData: {
// //                   pricePerNight: roomType.price,
// //                   pricePerNightMin: roomType.minPrice, // CRITICAL: Ensure min price is saved
// //                   pricePerNightMax: roomType.maxPrice, // CRITICAL: Ensure max price is saved
// //                   extraBedPrice: roomType.extraBedPrice || null,
// //                 },
// //               },
// //             })

// //             console.log(`✅ Room type updated for ${roomType.roomType}:`, roomTypeResult.data)

// //             // Approach 2: Also update individual rooms to ensure persistence
// //             const individualRoomPromises = roomType.roomIds.map(async (roomId) => {
// //               try {
// //                 const roomResult = await updateRoomPricing({
// //                   variables: {
// //                     roomId: roomId,
// //                     pricePerNight: roomType.price,
// //                     pricePerNightMin: roomType.minPrice,
// //                     pricePerNightMax: roomType.maxPrice,
// //                   },
// //                 })
// //                 console.log(`✅ Individual room ${roomId} updated:`, roomResult.data)
// //                 return roomResult.data
// //               } catch (roomError) {
// //                 console.error(`❌ Failed to update individual room ${roomId}:`, roomError)
// //                 // Don't throw, just log the error
// //                 return null
// //               }
// //             })

// //             await Promise.all(individualRoomPromises)

// //             return roomTypeResult.data.updateRoomType
// //           } catch (error) {
// //             console.error(`❌ Failed to update room type ${roomType.roomType}:`, error)
// //             throw error
// //           }
// //         })

// //         // Wait for all backend updates to complete
// //         const updatedRoomTypes = await Promise.all(updatePromises)
// //         console.log("✅ All room type updates completed successfully")

// //         // CRITICAL: Only update local state after successful backend operations
// //         setRoomTypes([...editableRoomTypes])
// //         setLastSaved(new Date())
// //         addNotification("success", `Successfully updated pricing for ${updatedRoomTypes.length} room types`)

// //         // CRITICAL: Force refetch to ensure UI shows the actual backend data
// //         console.log("🔄 Refetching rooms data to confirm backend updates...")
// //         setTimeout(async () => {
// //           await refetchRooms()
// //         }, 1000) // Wait 1 second before refetching to allow backend to process
// //       } else if (activeTab === "weekend") {
// //         // Validate weekend rates
// //         for (const rate of editableWeekendRates) {
// //           if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
// //             const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// //             throw new Error(
// //               `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
// //             )
// //           }
// //         }

// //         // Update weekend rates (implement your weekend rate mutation here)
// //         setWeekendRates([...editableWeekendRates])
// //         addNotification("success", "Weekend rates updated successfully")
// //       }

// //       setValidationErrors([])
// //     } catch (error) {
// //       console.error("❌ Error saving pricing:", error)
// //       addNotification("error", error instanceof Error ? error.message : "Failed to update pricing")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleReset = () => {
// //     if (activeTab === "standard") {
// //       // Reset to last saved values from source of truth
// //       setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
// //     } else if (activeTab === "weekend") {
// //       setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
// //     }

// //     setValidationErrors([])
// //     addNotification("success", "Changes reset to last saved values")
// //   }

// //   const handleRefresh = async () => {
// //     console.log("🔄 Manually refreshing room data from backend...")
// //     await refetchRooms()
// //     addNotification("success", "Data refreshed from backend")
// //   }

// //   // Auto-populate min/max prices based on base price
// //   const handleAutoPopulate = (roomId: string) => {
// //     setEditableRoomTypes((prev) => {
// //       return prev.map((room) => {
// //         if (room.id === roomId && room.price > 0) {
// //           const newMinPrice = Math.round(room.price * 0.7) // 70% of base
// //           const newMaxPrice = Math.round(room.price * 1.5) // 150% of base

// //           return {
// //             ...room,
// //             minPrice: newMinPrice,
// //             maxPrice: newMaxPrice,
// //           }
// //         }
// //         return room
// //       })
// //     })

// //     addNotification("success", "Min and max prices auto-populated based on base price")
// //   }

// //   // Check if there are unsaved changes
// //   const hasChanges =
// //     JSON.stringify(roomTypes) !== JSON.stringify(editableRoomTypes) ||
// //     JSON.stringify(weekendRates) !== JSON.stringify(editableWeekendRates)

// //   const isLoading = roomsLoading
// //   const hasError = roomsError

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="flex items-center space-x-3">
// //           <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
// //           <span className="text-gray-600">Loading room pricing data...</span>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (hasError) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
// //             <AlertCircle className="h-6 w-6" />
// //             <span>Error: {roomsError?.message}</span>
// //           </div>
// //           <Button onClick={handleRefresh}>
// //             <RefreshCw className="mr-2 h-4 w-4" />
// //             Retry
// //           </Button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (roomTypes.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <p className="text-gray-600 mb-4">No room categories found for this hotel.</p>
// //           <Button onClick={handleRefresh}>
// //             <RefreshCw className="mr-2 h-4 w-4" />
// //             Refresh Data
// //           </Button>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Notifications */}
// //       <div className="fixed top-4 right-4 space-y-2 z-50">
// //         {notifications.map((notification) => (
// //           <div
// //             key={notification.id}
// //             className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
// //               notification.type === "success"
// //                 ? "bg-green-100 text-green-800 border border-green-200"
// //                 : notification.type === "warning"
// //                   ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
// //                   : "bg-red-100 text-red-800 border border-red-200"
// //             }`}
// //           >
// //             {notification.type === "success" ? (
// //               <CheckCircle className="h-5 w-5" />
// //             ) : (
// //               <AlertCircle className="h-5 w-5" />
// //             )}
// //             <span className="text-sm font-medium">{notification.message}</span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Header */}
// //       <div className="bg-white border-b">
// //         <div className="container mx-auto px-4 py-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">Room Pricing Management</h1>
// //               <p className="text-sm text-gray-600">Configure room rates with proper backend persistence</p>
// //               {lastSaved && <p className="text-sm text-green-600 mt-1">Last saved: {lastSaved.toLocaleString()}</p>}
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
// //                 <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="container mx-auto px-4 py-6">
// //         <div className="mb-4 text-sm text-gray-600">
// //           <p>
// //             Found {roomTypes.length} room categories
// //             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
// //           </p>
// //         </div>

// //         {/* Validation Errors */}
// //         {validationErrors.length > 0 && (
// //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// //             <div className="flex items-center space-x-2 mb-2">
// //               <AlertCircle className="h-5 w-5 text-red-600" />
// //               <h3 className="font-medium text-red-800">Validation Errors</h3>
// //             </div>
// //             <ul className="text-sm text-red-700 space-y-1">
// //               {validationErrors.map((error, index) => (
// //                 <li key={index}>• {error.message}</li>
// //               ))}
// //             </ul>
// //           </div>
// //         )}

// //         <Card>
// //           <CardHeader>
// //             <CardTitle>Room Pricing Configuration</CardTitle>
// //             <CardDescription>
// //               Set the base price, minimum, and maximum pricing for each room category. These values will be saved to the
// //               backend and will apply to all rooms of each type.
// //             </CardDescription>
// //           </CardHeader>
// //           <CardContent>
// //             <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
// //               <TabsList className="mb-6">
// //                 <TabsTrigger value="standard">Standard Rate</TabsTrigger>
// //                 <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="standard" className="space-y-4">
// //                 <div className="rounded-md border">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead className="w-[300px]">Room Category</TableHead>
// //                         <TableHead>Min Price (฿)</TableHead>
// //                         <TableHead>Base Price (฿)</TableHead>
// //                         <TableHead>Max Price (฿)</TableHead>
// //                         <TableHead>Extra Bed</TableHead>
// //                         <TableHead>Actions</TableHead>
// //                         <TableHead className="text-right">Available Rooms</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {editableRoomTypes.map((room) => {
// //                         const hasFieldError = (field: string) =>
// //                           validationErrors.some((error) => error.field === `${room.id}-${field}`)

// //                         return (
// //                           <TableRow key={room.id} className="hover:bg-gray-50">
// //                             <TableCell className="font-medium">
// //                               <div>{room.roomType}</div>
// //                               {room.lastUpdated && (
// //                                 <div className="text-xs text-gray-500">
// //                                   Updated: {new Date(room.lastUpdated).toLocaleString()}
// //                                 </div>
// //                               )}
// //                               {/* Show warning if min/max are 0 */}
// //                               {(room.minPrice === 0 || room.maxPrice === 0) && (
// //                                 <div className="text-xs text-red-600 mt-1">⚠️ Min/Max prices missing</div>
// //                               )}
// //                             </TableCell>
// //                             <TableCell>
// //                               <Input
// //                                 type="number"
// //                                 value={room.minPrice}
// //                                 onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
// //                                 className={`w-[120px] ${hasFieldError("minPrice") ? "border-red-500 bg-red-50" : ""} ${
// //                                   room.minPrice === 0 ? "border-yellow-500 bg-yellow-50" : ""
// //                                 }`}
// //                                 min="0"
// //                                 step="0.01"
// //                                 placeholder="Min price"
// //                               />
// //                             </TableCell>
// //                             <TableCell>
// //                               <Input
// //                                 type="number"
// //                                 value={room.price}
// //                                 onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
// //                                 className={`w-[120px] ${hasFieldError("price") ? "border-red-500 bg-red-50" : ""}`}
// //                                 min="0"
// //                                 step="0.01"
// //                                 placeholder="Base price"
// //                               />
// //                             </TableCell>
// //                             <TableCell>
// //                               <Input
// //                                 type="number"
// //                                 value={room.maxPrice}
// //                                 onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
// //                                 className={`w-[120px] ${hasFieldError("maxPrice") ? "border-red-500 bg-red-50" : ""} ${
// //                                   room.maxPrice === 0 ? "border-yellow-500 bg-yellow-50" : ""
// //                                 }`}
// //                                 min="0"
// //                                 step="0.01"
// //                                 placeholder="Max price"
// //                               />
// //                             </TableCell>
// //                             <TableCell>
// //                               {room.extraBedAllowed ? `฿${room.extraBedPrice || 0}` : "Not allowed"}
// //                             </TableCell>
// //                             <TableCell>
// //                               <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={() => handleAutoPopulate(room.id)}
// //                                 disabled={room.price <= 0}
// //                                 className="text-xs"
// //                               >
// //                                 Auto-fill
// //                               </Button>
// //                             </TableCell>
// //                             <TableCell className="text-right">{room.available}</TableCell>
// //                           </TableRow>
// //                         )
// //                       })}
// //                     </TableBody>
// //                   </Table>
// //                 </div>

// //                 <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
// //                   <p className="font-medium mb-2">🔧 DEBUGGING: Min/Max Price Persistence Issue</p>
// //                   <ul className="space-y-1">
// //                     <li>• Using dual approach: Room type update + Individual room updates</li>
// //                     <li>• Added better null/undefined handling for backend values</li>
// //                     <li>• Enhanced logging to track what's being saved vs retrieved</li>
// //                     <li>• Check browser console for detailed mutation/query logs</li>
// //                   </ul>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="weekend" className="space-y-4">
// //                 <div className="flex items-center space-x-4 mb-4">
// //                   <div className="text-sm font-medium">Weekend days:</div>
// //                   <div className="flex items-center space-x-2">
// //                     <Checkbox
// //                       id="friday"
// //                       checked={weekendDays.friday}
// //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
// //                     />
// //                     <label htmlFor="friday" className="text-sm">
// //                       Friday
// //                     </label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <Checkbox
// //                       id="saturday"
// //                       checked={weekendDays.saturday}
// //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
// //                     />
// //                     <label htmlFor="saturday" className="text-sm">
// //                       Saturday
// //                     </label>
// //                   </div>
// //                   <div className="flex items-center space-x-2">
// //                     <Checkbox
// //                       id="sunday"
// //                       checked={weekendDays.sunday}
// //                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
// //                     />
// //                     <label htmlFor="sunday" className="text-sm">
// //                       Sunday
// //                     </label>
// //                   </div>
// //                 </div>

// //                 <div className="rounded-md border">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead className="w-[250px]">Room Category</TableHead>
// //                         <TableHead>Enabled</TableHead>
// //                         <TableHead>Min Price (฿)</TableHead>
// //                         <TableHead>Base Price (฿)</TableHead>
// //                         <TableHead>Max Price (฿)</TableHead>
// //                         <TableHead className="text-right">Standard Price</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {editableWeekendRates.map((rate) => {
// //                         const room = roomTypes.find((r) => r.id === rate.roomTypeId)
// //                         return (
// //                           <TableRow key={rate.roomTypeId}>
// //                             <TableCell className="font-medium">{room?.roomType}</TableCell>
// //                             <TableCell>
// //                               <Switch
// //                                 checked={rate.enabled}
// //                                 onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomTypeId, checked)}
// //                               />
// //                             </TableCell>
// //                             <TableCell>
// //                               <Input
// //                                 type="number"
// //                                 value={rate.minPrice}
// //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "minPrice", e.target.value)}
// //                                 className="w-[120px]"
// //                                 disabled={!rate.enabled}
// //                                 min="0"
// //                                 step="0.01"
// //                               />
// //                             </TableCell>
// //                             <TableCell>
// //                               <Input
// //                                 type="number"
// //                                 value={rate.price}
// //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "price", e.target.value)}
// //                                 className={`w-[120px] ${
// //                                   rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
// //                                     ? "border-red-500 bg-red-50"
// //                                     : ""
// //                                 }`}
// //                                 disabled={!rate.enabled}
// //                                 min="0"
// //                                 step="0.01"
// //                               />
// //                             </TableCell>
// //                             <TableCell>
// //                               <Input
// //                                 type="number"
// //                                 value={rate.maxPrice}
// //                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "maxPrice", e.target.value)}
// //                                 className="w-[120px]"
// //                                 disabled={!rate.enabled}
// //                                 min="0"
// //                                 step="0.01"
// //                               />
// //                             </TableCell>
// //                             <TableCell className="text-right text-gray-500">฿ {room?.price}</TableCell>
// //                           </TableRow>
// //                         )
// //                       })}
// //                     </TableBody>
// //                   </Table>
// //                 </div>

// //                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
// //                   <p>
// //                     <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
// //                     automatically for bookings on weekend days.
// //                   </p>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </CardContent>
// //           <CardFooter className="flex justify-between">
// //             <div className="text-sm text-gray-600">
// //               {hasChanges && <span className="text-orange-600 font-medium">You have unsaved changes</span>}
// //             </div>
// //             <div className="flex items-center space-x-3">
// //               <Button variant="outline" onClick={handleReset} disabled={!hasChanges || loading}>
// //                 <RefreshCw className="mr-2 h-4 w-4" />
// //                 Reset Changes
// //               </Button>
// //               <Button onClick={handleSave} disabled={!hasChanges || loading || validationErrors.length > 0}>
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
// //                     Saving to Backend...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Save className="mr-2 h-4 w-4" />
// //                     Save Changes
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </CardFooter>
// //         </Card>

// //         {/* Debug Information */}
// //         <div className="mt-6 bg-gray-100 rounded-lg p-4">
// //           <details className="cursor-pointer">
// //             <summary className="text-sm font-medium text-gray-700 mb-2">Debug Information</summary>
// //             <div className="text-xs text-gray-600 space-y-2">
// //               <div>
// //                 <strong>Has Changes:</strong> {hasChanges ? "Yes" : "No"}
// //               </div>
// //               <div>
// //                 <strong>Validation Errors:</strong> {validationErrors.length}
// //               </div>
// //               <div>
// //                 <strong>Room Types Count:</strong> {roomTypes.length}
// //               </div>
// //               <div>
// //                 <strong>Last Saved:</strong> {lastSaved ? lastSaved.toISOString() : "Never"}
// //               </div>
// //               <div>
// //                 <strong>Selected Hotel:</strong> {selectedHotel?.name || "None"}
// //               </div>
// //               <div>
// //                 <strong>Fetch Policy:</strong> network-only (always fresh data)
// //               </div>
// //               <div>
// //                 <strong>Backend Values:</strong>
// //                 <pre className="mt-1 text-xs bg-gray-200 p-2 rounded">
// //                   {JSON.stringify(
// //                     roomTypes.map((r) => ({
// //                       type: r.roomType,
// //                       base: r.price,
// //                       min: r.minPrice,
// //                       max: r.maxPrice,
// //                     })),
// //                     null,
// //                     2,
// //                   )}
// //                 </pre>
// //               </div>
// //             </div>
// //           </details>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }


// "use client"

// import { useState, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useToast } from "@/components/ui/use-toast"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Save, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Switch } from "@/components/ui/switch"
// import { useHotelContext } from "@/providers/hotel-provider"
// import { useSession } from "next-auth/react"
// import { useMutation, useQuery } from "@apollo/client"
// import { gql } from "@apollo/client"

// // GraphQL Queries and Mutations
// const GET_ROOMS_WITH_PRICING = gql`
//   query GetRoomsWithPricing($hotelId: String!) {
//     rooms(hotelId: $hotelId) {
//       id
//       hotelId
//       roomNumber
//       floor
//       roomType
//       status
//       pricePerNight
//       pricePerNightMin
//       pricePerNightMax
//       baseOccupancy
//       maxOccupancy
//       extraBedAllowed
//       extraBedPrice
//       roomSize
//       bedType
//       bedCount
//       amenities
//       description
//       images
//       isSmoking
//       isActive
//       lastCleaned
//       lastMaintained
//       maintenanceNotes
//       createdAt
//       updatedAt
//     }
//   }
// `

// // CRITICAL: Try different mutation approaches to ensure min/max prices are saved
// const UPDATE_ROOM_TYPE = gql`
//   mutation UpdateRoomType(
//     $hotelId: String!
//     $roomType: RoomType!
//     $updateData: UpdateRoomTypeInput!
//   ) {
//     updateRoomType(
//       hotelId: $hotelId
//       roomType: $roomType
//       updateData: $updateData
//     ) {
//       id
//       roomType
//       pricePerNight
//       pricePerNightMin
//       pricePerNightMax
//       extraBedPrice
//       baseOccupancy
//       maxOccupancy
//       extraBedAllowed
//       roomSize
//       bedType
//       bedCount
//       amenities
//       description
//       isSmoking
//       images
//       updatedAt
//     }
//   }
// `

// // Types
// interface RoomTypeData {
//   id: string
//   roomType: string
//   price: number
//   minPrice: number
//   maxPrice: number
//   available: number
//   roomIds: string[]
//   extraBedAllowed: boolean
//   extraBedPrice?: number
//   baseOccupancy: number
//   maxOccupancy: number
//   roomSize: number
//   bedType: string
//   bedCount: number
//   amenities: string[]
//   lastUpdated?: string
// }

// interface WeekendRate {
//   roomTypeId: string
//   price: number
//   minPrice: number
//   maxPrice: number
//   enabled: boolean
// }

// interface ValidationError {
//   field: string
//   message: string
// }

// interface Notification {
//   id: string
//   type: "success" | "error" | "warning"
//   message: string
// }

// export default function PricingPage() {
//   const { toast } = useToast()
//   const [loading, setLoading] = useState(false)
//   const [activeTab, setActiveTab] = useState("standard")

//   const { selectedHotel } = useHotelContext()
//   const { data: session } = useSession()

//   // State management - CRITICAL: Separate source of truth from editable data
//   const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]) // Source of truth from backend
//   const [editableRoomTypes, setEditableRoomTypes] = useState<RoomTypeData[]>([]) // Editable copy
//   const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
//   const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

//   const [weekendDays, setWeekendDays] = useState({
//     friday: true,
//     saturday: true,
//     sunday: true,
//   })

//   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [lastSaved, setLastSaved] = useState<Date | null>(null)

//   // Fetch rooms with pricing data
//   const {
//     data: roomsData,
//     loading: roomsLoading,
//     error: roomsError,
//     refetch: refetchRooms,
//   } = useQuery(GET_ROOMS_WITH_PRICING, {
//     variables: { hotelId: selectedHotel?.id || "" },
//     skip: !selectedHotel?.id,
//     fetchPolicy: "network-only", // CRITICAL: Always fetch fresh data from backend
//     errorPolicy: "all",
//     onCompleted: (data) => {
//       console.log("✅ Rooms with pricing fetched successfully:", data)
//       if (data.rooms) {
//         processRoomsData(data.rooms)
//       }
//     },
//     onError: (error) => {
//       console.error("❌ Error fetching rooms:", error)
//       addNotification("error", "Failed to fetch room information from server.")
//     },
//   })

//   // Mutation for updating room type definitions
//   const [updateRoomType] = useMutation(UPDATE_ROOM_TYPE, {
//     errorPolicy: "all",
//     onCompleted: (data) => {
//       console.log("✅ Room type updated successfully:", data)
//     },
//     onError: (error) => {
//       console.error("❌ Error updating room type:", error)
//     },
//   })

//   // Notification management
//   const addNotification = (type: "success" | "error" | "warning", message: string) => {
//     const id = Date.now().toString()
//     setNotifications((prev) => [...prev, { id, type, message }])
//     // Auto-remove notification after 5 seconds
//     setTimeout(() => {
//       setNotifications((prev) => prev.filter((n) => n.id !== id))
//     }, 5000)
//   }

//   // CRITICAL FIX: Properly handle null/undefined values from backend
//   const processRoomsData = (rooms: any[]) => {
//     if (!rooms || rooms.length === 0) {
//       setRoomTypes([])
//       setEditableRoomTypes([])
//       return
//     }

//     console.log("🔄 Processing rooms data from backend:", rooms)

//     // Group rooms by type and get the LATEST pricing values
//     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
//       const roomType = room.roomType

//       // Only include active rooms
//       if (!room.isActive) return acc

//       if (!acc[roomType]) {
//         acc[roomType] = {
//           rooms: [],
//           totalRooms: 0,
//           roomIds: [],
//           latestRoom: room, // Keep track of the most recently updated room
//         }
//       }

//       acc[roomType].rooms.push(room)
//       acc[roomType].totalRooms += 1
//       acc[roomType].roomIds.push(room.id)

//       // Keep the most recently updated room as the source of pricing
//       if (new Date(room.updatedAt) > new Date(acc[roomType].latestRoom.updatedAt)) {
//         acc[roomType].latestRoom = room
//       }

//       return acc
//     }, {})

//     const roomTypesForPricing: RoomTypeData[] = Object.entries(roomTypeGroups).map(
//       ([typeName, data]: [string, any]) => {
//         const latestRoom = data.latestRoom

//         // CRITICAL: Handle null/undefined values properly
//         let basePrice = latestRoom.pricePerNight
//         let minPrice = latestRoom.pricePerNightMin
//         let maxPrice = latestRoom.pricePerNightMax

//         // Convert null/undefined to 0 for display, but log the issue
//         if (basePrice === null || basePrice === undefined) {
//           console.warn(`⚠️ pricePerNight is null/undefined for ${typeName}`)
//           basePrice = 0
//         }
//         if (minPrice === null || minPrice === undefined) {
//           console.warn(`⚠️ pricePerNightMin is null/undefined for ${typeName}`)
//           minPrice = 0
//         }
//         if (maxPrice === null || maxPrice === undefined) {
//           console.warn(`⚠️ pricePerNightMax is null/undefined for ${typeName}`)
//           maxPrice = 0
//         }

//         console.log(`📊 Room type ${typeName} - BACKEND VALUES:`, {
//           basePrice,
//           minPrice,
//           maxPrice,
//           totalRooms: data.totalRooms,
//           latestRoomId: latestRoom.id,
//           updatedAt: latestRoom.updatedAt,
//           rawBackendValues: {
//             pricePerNight: latestRoom.pricePerNight,
//             pricePerNightMin: latestRoom.pricePerNightMin,
//             pricePerNightMax: latestRoom.pricePerNightMax,
//           },
//         })

//         // If all pricing values are 0, use defaults
//         if (basePrice === 0 && minPrice === 0 && maxPrice === 0) {
//           console.warn(`⚠️ All pricing values are 0 for ${typeName}, using defaults`)
//           const defaults = getRoomTypeDefaults(typeName)
//           basePrice = defaults.basePrice
//           minPrice = defaults.minPrice
//           maxPrice = defaults.maxPrice
//           addNotification("warning", `No pricing data found for ${typeName}, using defaults`)
//         }

//         return {
//           id: typeName.toLowerCase().replace(/\s+/g, "-"),
//           roomType: typeName,
//           price: basePrice,
//           minPrice: minPrice,
//           maxPrice: maxPrice,
//           available: data.totalRooms,
//           roomIds: data.roomIds,
//           extraBedAllowed: latestRoom?.extraBedAllowed || false,
//           extraBedPrice: latestRoom?.extraBedPrice || 0,
//           baseOccupancy: latestRoom?.baseOccupancy || 2,
//           maxOccupancy: latestRoom?.maxOccupancy || 4,
//           roomSize: latestRoom?.roomSize || 25,
//           bedType: latestRoom?.bedType || "QUEEN",
//           bedCount: latestRoom?.bedCount || 1,
//           amenities: latestRoom?.amenities || [],
//           lastUpdated: latestRoom?.updatedAt,
//         }
//       },
//     )

//     console.log("✅ Processed room types with backend values:", roomTypesForPricing)

//     // CRITICAL: Set source of truth first, then create editable copy
//     setRoomTypes(roomTypesForPricing)
//     setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesForPricing))) // Deep copy for editing

//     initializeWeekendRates(roomTypesForPricing)
//   }

//   // Helper function to get default pricing for room types
//   const getRoomTypeDefaults = (roomType: string) => {
//     const defaults: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {
//       STANDARD: { basePrice: 500, minPrice: 350, maxPrice: 750 },
//       DELUXE: { basePrice: 800, minPrice: 560, maxPrice: 1200 },
//       SUITE: { basePrice: 2000, minPrice: 1400, maxPrice: 3000 },
//       EXECUTIVE: { basePrice: 1500, minPrice: 1050, maxPrice: 2250 },
//       PRESIDENTIAL: { basePrice: 5000, minPrice: 3500, maxPrice: 7500 },
//     }

//     return defaults[roomType.toUpperCase()] || { basePrice: 1000, minPrice: 700, maxPrice: 1500 }
//   }

//   const initializeWeekendRates = (roomTypesData: RoomTypeData[]) => {
//     const initialWeekendRates = roomTypesData.map((roomType) => {
//       const weekendRatio = 1.25
//       const weekendPrice = Math.round(roomType.price * weekendRatio)

//       return {
//         roomTypeId: roomType.id,
//         price: weekendPrice,
//         minPrice: Math.round(roomType.minPrice * weekendRatio),
//         maxPrice: Math.round(roomType.maxPrice * weekendRatio),
//         enabled: true,
//       }
//     })

//     setWeekendRates(initialWeekendRates)
//     setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
//   }

//   // Validation
//   const validatePricing = (roomTypes: RoomTypeData[]): ValidationError[] => {
//     const errors: ValidationError[] = []

//     roomTypes.forEach((room) => {
//       if (room.minPrice >= room.price) {
//         errors.push({
//           field: `${room.id}-price`,
//           message: `${room.roomType}: Base price must be higher than minimum price`,
//         })
//       }

//       if (room.price >= room.maxPrice) {
//         errors.push({
//           field: `${room.id}-price`,
//           message: `${room.roomType}: Base price must be lower than maximum price`,
//         })
//       }

//       if (room.minPrice < 0 || room.price < 0 || room.maxPrice < 0) {
//         errors.push({
//           field: `${room.id}-price`,
//           message: `${room.roomType}: Prices cannot be negative`,
//         })
//       }

//       if (room.minPrice === 0 || room.maxPrice === 0) {
//         errors.push({
//           field: `${room.id}-price`,
//           message: `${room.roomType}: Min and max prices must be greater than 0`,
//         })
//       }
//     })

//     return errors
//   }

//   // Price change handlers
//   const handlePriceChange = useCallback((id: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
//     const numValue = Number.parseFloat(value) || 0

//     setEditableRoomTypes((prev) => {
//       return prev.map((room) => {
//         if (room.id === id) {
//           return { ...room, [field]: numValue }
//         }
//         return room
//       })
//     })

//     // Clear validation errors for this field
//     setValidationErrors((prev) => prev.filter((error) => error.field !== `${id}-${field}`))
//   }, [])

//   const handleWeekendPriceChange = useCallback(
//     (roomTypeId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
//       const numValue = Number.parseFloat(value) || 0

//       setEditableWeekendRates((prev) => {
//         return prev.map((rate) => {
//           if (rate.roomTypeId === roomTypeId) {
//             return { ...rate, [field]: numValue }
//           }
//           return rate
//         })
//       })
//     },
//     [],
//   )

//   const handleWeekendRateToggle = useCallback((roomTypeId: string, enabled: boolean) => {
//     setEditableWeekendRates((prev) =>
//       prev.map((rate) => (rate.roomTypeId === roomTypeId ? { ...rate, enabled } : rate)),
//     )
//   }, [])

//   // CRITICAL: Enhanced save handler with multiple approaches
//   const handleSave = async () => {
//     setLoading(true)

//     try {
//       if (activeTab === "standard") {
//         // Validate all pricing before saving
//         const errors = validatePricing(editableRoomTypes)
//         setValidationErrors(errors)

//         if (errors.length > 0) {
//           addNotification("error", "Please fix validation errors before saving")
//           return
//         }

//         console.log("💾 Saving room type pricing to backend...")

//         // CRITICAL: Use only updateRoomType since updateRoomPricing doesn't exist
//         const updatePromises = editableRoomTypes.map(async (roomType) => {
//           console.log(`Updating pricing for ${roomType.roomType}:`, {
//             basePrice: roomType.price,
//             minPrice: roomType.minPrice,
//             maxPrice: roomType.maxPrice,
//           })

//           try {
//             // Use only updateRoomType mutation
//             const roomTypeResult = await updateRoomType({
//               variables: {
//                 hotelId: selectedHotel?.id || "",
//                 roomType: roomType.roomType.toUpperCase(),
//                 updateData: {
//                   pricePerNight: roomType.price,
//                   pricePerNightMin: roomType.minPrice, // CRITICAL: Ensure min price is saved
//                   pricePerNightMax: roomType.maxPrice, // CRITICAL: Ensure max price is saved
//                   extraBedPrice: roomType.extraBedPrice || null,
//                   // Include all other required fields to avoid overwriting them
//                   baseOccupancy: roomType.baseOccupancy,
//                   maxOccupancy: roomType.maxOccupancy,
//                   extraBedAllowed: roomType.extraBedAllowed,
//                   roomSize: roomType.roomSize,
//                   bedType: roomType.bedType,
//                   bedCount: roomType.bedCount,
//                   amenities: roomType.amenities,
//                   description: null,
//                   isSmoking: false,
//                   images: null,
//                 },
//               },
//             })

//             console.log(`✅ Room type updated for ${roomType.roomType}:`, roomTypeResult.data)

//             // Log the returned values to see if min/max are being saved
//             const returnedData = roomTypeResult.data.updateRoomType
//             console.log(`📊 Backend returned for ${roomType.roomType}:`, {
//               pricePerNight: returnedData.pricePerNight,
//               pricePerNightMin: returnedData.pricePerNightMin,
//               pricePerNightMax: returnedData.pricePerNightMax,
//             })

//             return returnedData
//           } catch (error) {
//             console.error(`❌ Failed to update room type ${roomType.roomType}:`, error)
//             throw error
//           }
//         })

//         // Wait for all backend updates to complete
//         const updatedRoomTypes = await Promise.all(updatePromises)
//         console.log("✅ All room type updates completed successfully")

//         // CRITICAL: Only update local state after successful backend operations
//         setRoomTypes([...editableRoomTypes])
//         setLastSaved(new Date())
//         addNotification("success", `Successfully updated pricing for ${updatedRoomTypes.length} room types`)

//         // CRITICAL: Force refetch to ensure UI shows the actual backend data
//         console.log("🔄 Refetching rooms data to confirm backend updates...")
//         setTimeout(async () => {
//           await refetchRooms()
//         }, 1000) // Wait 1 second before refetching to allow backend to process
//       } else if (activeTab === "weekend") {
//         // Validate weekend rates
//         for (const rate of editableWeekendRates) {
//           if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
//             const room = roomTypes.find((r) => r.id === rate.roomTypeId)
//             throw new Error(
//               `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
//             )
//           }
//         }

//         // Update weekend rates (implement your weekend rate mutation here)
//         setWeekendRates([...editableWeekendRates])
//         addNotification("success", "Weekend rates updated successfully")
//       }

//       setValidationErrors([])
//     } catch (error) {
//       console.error("❌ Error saving pricing:", error)
//       addNotification("error", error instanceof Error ? error.message : "Failed to update pricing")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleReset = () => {
//     if (activeTab === "standard") {
//       // Reset to last saved values from source of truth
//       setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
//     } else if (activeTab === "weekend") {
//       setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
//     }

//     setValidationErrors([])
//     addNotification("success", "Changes reset to last saved values")
//   }

//   const handleRefresh = async () => {
//     console.log("🔄 Manually refreshing room data from backend...")
//     await refetchRooms()
//     addNotification("success", "Data refreshed from backend")
//   }

//   // Auto-populate min/max prices based on base price
//   const handleAutoPopulate = (roomId: string) => {
//     setEditableRoomTypes((prev) => {
//       return prev.map((room) => {
//         if (room.id === roomId && room.price > 0) {
//           const newMinPrice = Math.round(room.price * 0.7) // 70% of base
//           const newMaxPrice = Math.round(room.price * 1.5) // 150% of base

//           return {
//             ...room,
//             minPrice: newMinPrice,
//             maxPrice: newMaxPrice,
//           }
//         }
//         return room
//       })
//     })

//     addNotification("success", "Min and max prices auto-populated based on base price")
//   }

//   // Check if there are unsaved changes
//   const hasChanges =
//     JSON.stringify(roomTypes) !== JSON.stringify(editableRoomTypes) ||
//     JSON.stringify(weekendRates) !== JSON.stringify(editableWeekendRates)

//   const isLoading = roomsLoading
//   const hasError = roomsError

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-3">
//           <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//           <span className="text-gray-600">Loading room pricing data...</span>
//         </div>
//       </div>
//     )
//   }

//   if (hasError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
//             <AlertCircle className="h-6 w-6" />
//             <span>Error: {roomsError?.message}</span>
//           </div>
//           <Button onClick={handleRefresh}>
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Retry
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (roomTypes.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">No room categories found for this hotel.</p>
//           <Button onClick={handleRefresh}>
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Refresh Data
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Notifications */}
//       <div className="fixed top-4 right-4 space-y-2 z-50">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
//               notification.type === "success"
//                 ? "bg-green-100 text-green-800 border border-green-200"
//                 : notification.type === "warning"
//                   ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
//                   : "bg-red-100 text-red-800 border border-red-200"
//             }`}
//           >
//             {notification.type === "success" ? (
//               <CheckCircle className="h-5 w-5" />
//             ) : (
//               <AlertCircle className="h-5 w-5" />
//             )}
//             <span className="text-sm font-medium">{notification.message}</span>
//           </div>
//         ))}
//       </div>

//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Room Pricing Management</h1>
//               <p className="text-sm text-gray-600">Configure room rates with proper backend persistence</p>
//               {lastSaved && <p className="text-sm text-green-600 mt-1">Last saved: {lastSaved.toLocaleString()}</p>}
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
//                 <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         <div className="mb-4 text-sm text-gray-600">
//           <p>
//             Found {roomTypes.length} room categories
//             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
//           </p>
//         </div>

//         {/* Validation Errors */}
//         {validationErrors.length > 0 && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <div className="flex items-center space-x-2 mb-2">
//               <AlertCircle className="h-5 w-5 text-red-600" />
//               <h3 className="font-medium text-red-800">Validation Errors</h3>
//             </div>
//             <ul className="text-sm text-red-700 space-y-1">
//               {validationErrors.map((error, index) => (
//                 <li key={index}>• {error.message}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <Card>
//           <CardHeader>
//             <CardTitle>Room Pricing Configuration</CardTitle>
//             <CardDescription>
//               Set the base price, minimum, and maximum pricing for each room category. These values will be saved to the
//               backend and will apply to all rooms of each type.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="mb-6">
//                 <TabsTrigger value="standard">Standard Rate</TabsTrigger>
//                 <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
//               </TabsList>

//               <TabsContent value="standard" className="space-y-4">
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="w-[300px]">Room Category</TableHead>
//                         <TableHead>Min Price (฿)</TableHead>
//                         <TableHead>Base Price (฿)</TableHead>
//                         <TableHead>Max Price (฿)</TableHead>
//                         <TableHead>Extra Bed</TableHead>
//                         <TableHead>Actions</TableHead>
//                         <TableHead className="text-right">Available Rooms</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {editableRoomTypes.map((room) => {
//                         const hasFieldError = (field: string) =>
//                           validationErrors.some((error) => error.field === `${room.id}-${field}`)

//                         return (
//                           <TableRow key={room.id} className="hover:bg-gray-50">
//                             <TableCell className="font-medium">
//                               <div>{room.roomType}</div>
//                               {room.lastUpdated && (
//                                 <div className="text-xs text-gray-500">
//                                   Updated: {new Date(room.lastUpdated).toLocaleString()}
//                                 </div>
//                               )}
//                               {/* Show warning if min/max are 0 */}
//                               {(room.minPrice === 0 || room.maxPrice === 0) && (
//                                 <div className="text-xs text-red-600 mt-1">⚠️ Min/Max prices missing</div>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 type="number"
//                                 value={room.minPrice}
//                                 onChange={(e) => handlePriceChange(room.id, "minPrice", e.target.value)}
//                                 className={`w-[120px] ${hasFieldError("minPrice") ? "border-red-500 bg-red-50" : ""} ${
//                                   room.minPrice === 0 ? "border-yellow-500 bg-yellow-50" : ""
//                                 }`}
//                                 min="0"
//                                 step="0.01"
//                                 placeholder="Min price"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 type="number"
//                                 value={room.price}
//                                 onChange={(e) => handlePriceChange(room.id, "price", e.target.value)}
//                                 className={`w-[120px] ${hasFieldError("price") ? "border-red-500 bg-red-50" : ""}`}
//                                 min="0"
//                                 step="0.01"
//                                 placeholder="Base price"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 type="number"
//                                 value={room.maxPrice}
//                                 onChange={(e) => handlePriceChange(room.id, "maxPrice", e.target.value)}
//                                 className={`w-[120px] ${hasFieldError("maxPrice") ? "border-red-500 bg-red-50" : ""} ${
//                                   room.maxPrice === 0 ? "border-yellow-500 bg-yellow-50" : ""
//                                 }`}
//                                 min="0"
//                                 step="0.01"
//                                 placeholder="Max price"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               {room.extraBedAllowed ? `฿${room.extraBedPrice || 0}` : "Not allowed"}
//                             </TableCell>
//                             <TableCell>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleAutoPopulate(room.id)}
//                                 disabled={room.price <= 0}
//                                 className="text-xs"
//                               >
//                                 Auto-fill
//                               </Button>
//                             </TableCell>
//                             <TableCell className="text-right">{room.available}</TableCell>
//                           </TableRow>
//                         )
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
//                   <p className="font-medium mb-2">🔧 DEBUGGING: Min/Max Price Persistence Issue</p>
//                   <ul className="space-y-1">
//                     <li>• Using dual approach: Room type update + Individual room updates</li>
//                     <li>• Added better null/undefined handling for backend values</li>
//                     <li>• Enhanced logging to track what's being saved vs retrieved</li>
//                     <li>• Check browser console for detailed mutation/query logs</li>
//                   </ul>
//                 </div>
//               </TabsContent>

//               <TabsContent value="weekend" className="space-y-4">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="text-sm font-medium">Weekend days:</div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="friday"
//                       checked={weekendDays.friday}
//                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
//                     />
//                     <label htmlFor="friday" className="text-sm">
//                       Friday
//                     </label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="saturday"
//                       checked={weekendDays.saturday}
//                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
//                     />
//                     <label htmlFor="saturday" className="text-sm">
//                       Saturday
//                     </label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="sunday"
//                       checked={weekendDays.sunday}
//                       onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
//                     />
//                     <label htmlFor="sunday" className="text-sm">
//                       Sunday
//                     </label>
//                   </div>
//                 </div>

//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="w-[250px]">Room Category</TableHead>
//                         <TableHead>Enabled</TableHead>
//                         <TableHead>Min Price (฿)</TableHead>
//                         <TableHead>Base Price (฿)</TableHead>
//                         <TableHead>Max Price (฿)</TableHead>
//                         <TableHead className="text-right">Standard Price</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {editableWeekendRates.map((rate) => {
//                         const room = roomTypes.find((r) => r.id === rate.roomTypeId)
//                         return (
//                           <TableRow key={rate.roomTypeId}>
//                             <TableCell className="font-medium">{room?.roomType}</TableCell>
//                             <TableCell>
//                               <Switch
//                                 checked={rate.enabled}
//                                 onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomTypeId, checked)}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 type="number"
//                                 value={rate.minPrice}
//                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "minPrice", e.target.value)}
//                                 className="w-[120px]"
//                                 disabled={!rate.enabled}
//                                 min="0"
//                                 step="0.01"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 type="number"
//                                 value={rate.price}
//                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "price", e.target.value)}
//                                 className={`w-[120px] ${
//                                   rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
//                                     ? "border-red-500 bg-red-50"
//                                     : ""
//                                 }`}
//                                 disabled={!rate.enabled}
//                                 min="0"
//                                 step="0.01"
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 type="number"
//                                 value={rate.maxPrice}
//                                 onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "maxPrice", e.target.value)}
//                                 className="w-[120px]"
//                                 disabled={!rate.enabled}
//                                 min="0"
//                                 step="0.01"
//                               />
//                             </TableCell>
//                             <TableCell className="text-right text-gray-500">฿ {room?.price}</TableCell>
//                           </TableRow>
//                         )
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
//                   <p>
//                     <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
//                     automatically for bookings on weekend days.
//                   </p>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <div className="text-sm text-gray-600">
//               {hasChanges && <span className="text-orange-600 font-medium">You have unsaved changes</span>}
//             </div>
//             <div className="flex items-center space-x-3">
//               <Button variant="outline" onClick={handleReset} disabled={!hasChanges || loading}>
//                 <RefreshCw className="mr-2 h-4 w-4" />
//                 Reset Changes
//               </Button>
//               <Button onClick={handleSave} disabled={!hasChanges || loading || validationErrors.length > 0}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
//                     Saving to Backend...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="mr-2 h-4 w-4" />
//                     Save Changes
//                   </>
//                 )}
//               </Button>
//             </div>
//           </CardFooter>
//         </Card>

//         {/* Debug Information */}
//         <div className="mt-6 bg-gray-100 rounded-lg p-4">
//           <details className="cursor-pointer">
//             <summary className="text-sm font-medium text-gray-700 mb-2">Debug Information</summary>
//             <div className="text-xs text-gray-600 space-y-2">
//               <div>
//                 <strong>Has Changes:</strong> {hasChanges ? "Yes" : "No"}
//               </div>
//               <div>
//                 <strong>Validation Errors:</strong> {validationErrors.length}
//               </div>
//               <div>
//                 <strong>Room Types Count:</strong> {roomTypes.length}
//               </div>
//               <div>
//                 <strong>Last Saved:</strong> {lastSaved ? lastSaved.toISOString() : "Never"}
//               </div>
//               <div>
//                 <strong>Selected Hotel:</strong> {selectedHotel?.name || "None"}
//               </div>
//               <div>
//                 <strong>Fetch Policy:</strong> network-only (always fresh data)
//               </div>
//               <div>
//                 <strong>Backend Values:</strong>
//                 <pre className="mt-1 text-xs bg-gray-200 p-2 rounded">
//                   {JSON.stringify(
//                     roomTypes.map((r) => ({
//                       type: r.roomType,
//                       base: r.price,
//                       min: r.minPrice,
//                       max: r.maxPrice,
//                     })),
//                     null,
//                     2,
//                   )}
//                 </pre>
//               </div>
//             </div>
//           </details>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useHotelContext } from "@/providers/hotel-provider"

// Types
interface RoomTypeData {
  id: string
  roomType: string
  pricePerNight: number
  pricePerNightMin: number
  pricePerNightMax: number
  available: number
  roomIds: string[]
  extraBedAllowed: boolean
  extraBedPrice?: number
  baseOccupancy: number
  maxOccupancy: number
  roomSize: number
  bedType: string
  bedCount: number
  description?: string
  isSmoking: boolean
  lastUpdated?: string
}

interface WeekendRate {
  roomTypeId: string
  price: number
  minPrice: number
  maxPrice: number
  enabled: boolean
}

interface ValidationError {
  field: string
  message: string
}

interface Notification {
  id: string
  type: "success" | "error" | "warning"
  message: string
}

const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"]

export default function PricingPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("standard")

  const { selectedHotel } = useHotelContext()

  // State management - CRITICAL: Separate source of truth from editable data
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]) // Source of truth from backend
  const [editableRoomTypes, setEditableRoomTypes] = useState<RoomTypeData[]>([]) // Editable copy
  const [weekendRates, setWeekendRates] = useState<WeekendRate[]>([])
  const [editableWeekendRates, setEditableWeekendRates] = useState<WeekendRate[]>([])

  const [weekendDays, setWeekendDays] = useState({
    friday: true,
    saturday: true,
    sunday: true,
  })

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Notification management
  const addNotification = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, message }])
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  // CRITICAL: Use the exact same fetch logic as your working UpdateRoomTypeForm
  const fetchRoomTypeData = async (roomType: string) => {
    try {
      const resp = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query getRoomType($hotelId: String!, $roomType: RoomType!) {
              getRoomType(hotelId: $hotelId, roomType: $roomType) {
                pricePerNight
                pricePerNightMax
                pricePerNightMin
                baseOccupancy
                maxOccupancy
                extraBedAllowed
                extraBedPrice
                roomSize
                bedType
                bedCount
                description
                isSmoking
              }
            }
          `,
          variables: { hotelId: selectedHotel?.id, roomType },
        }),
      })

      const { data } = await resp.json()
      return data?.getRoomType || null
    } catch (error) {
      console.error(`Error fetching ${roomType}:`, error)
      return null
    }
  }

  // Load all room types data
  const loadAllRoomTypes = async () => {
    if (!selectedHotel?.id) return

    setLoading(true)
    console.log("🔄 Loading all room types data...")

    try {
      const roomTypesData: RoomTypeData[] = []

      for (const roomType of ROOM_TYPES) {
        const data = await fetchRoomTypeData(roomType)

        if (data) {
          console.log(`✅ Loaded ${roomType}:`, {
            pricePerNight: data.pricePerNight,
            pricePerNightMin: data.pricePerNightMin,
            pricePerNightMax: data.pricePerNightMax,
          })

          roomTypesData.push({
            id: roomType.toLowerCase().replace(/\s+/g, "-"),
            roomType: roomType,
            pricePerNight: data.pricePerNight || 0,
            pricePerNightMin: data.pricePerNightMin || 0,
            pricePerNightMax: data.pricePerNightMax || 0,
            available: 0, // We'll get this from rooms query if needed
            roomIds: [],
            extraBedAllowed: data.extraBedAllowed || false,
            extraBedPrice: data.extraBedPrice || 0,
            baseOccupancy: data.baseOccupancy || 2,
            maxOccupancy: data.maxOccupancy || 4,
            roomSize: data.roomSize || 25,
            bedType: data.bedType || "QUEEN",
            bedCount: data.bedCount || 1,
            description: data.description || "",
            isSmoking: data.isSmoking || false,
          })
        } else {
          // Room type doesn't exist, use defaults
          const defaults = getRoomTypeDefaults(roomType)
          roomTypesData.push({
            id: roomType.toLowerCase().replace(/\s+/g, "-"),
            roomType: roomType,
            pricePerNight: defaults.basePrice,
            pricePerNightMin: defaults.minPrice,
            pricePerNightMax: defaults.maxPrice,
            available: 0,
            roomIds: [],
            extraBedAllowed: false,
            extraBedPrice: 0,
            baseOccupancy: 2,
            maxOccupancy: 4,
            roomSize: 25,
            bedType: "QUEEN",
            bedCount: 1,
            description: "",
            isSmoking: false,
          })
        }
      }

      console.log("✅ All room types loaded:", roomTypesData)
      setRoomTypes(roomTypesData)
      setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypesData))) // Deep copy for editing
      initializeWeekendRates(roomTypesData)

      addNotification("success", `Loaded ${roomTypesData.length} room types`)
    } catch (error) {
      console.error("❌ Error loading room types:", error)
      addNotification("error", "Failed to load room types")
    } finally {
      setLoading(false)
    }
  }

  // Load data when hotel changes
  useEffect(() => {
    if (selectedHotel?.id) {
      loadAllRoomTypes()
    }
  }, [selectedHotel?.id])

  // Helper function to get default pricing for room types
  const getRoomTypeDefaults = (roomType: string) => {
    const defaults: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {
      STANDARD: { basePrice: 500, minPrice: 350, maxPrice: 750 },
      DELUXE: { basePrice: 800, minPrice: 560, maxPrice: 1200 },
      SUITE: { basePrice: 2000, minPrice: 1400, maxPrice: 3000 },
      EXECUTIVE: { basePrice: 1500, minPrice: 1050, maxPrice: 2250 },
      PRESIDENTIAL: { basePrice: 5000, minPrice: 3500, maxPrice: 7500 },
    }

    return defaults[roomType.toUpperCase()] || { basePrice: 1000, minPrice: 700, maxPrice: 1500 }
  }

  const initializeWeekendRates = (roomTypesData: RoomTypeData[]) => {
    const initialWeekendRates = roomTypesData.map((roomType) => {
      const weekendRatio = 1.25
      const weekendPrice = Math.round(roomType.pricePerNight * weekendRatio)

      return {
        roomTypeId: roomType.id,
        price: weekendPrice,
        minPrice: Math.round(roomType.pricePerNightMin * weekendRatio),
        maxPrice: Math.round(roomType.pricePerNightMax * weekendRatio),
        enabled: true,
      }
    })

    setWeekendRates(initialWeekendRates)
    setEditableWeekendRates(JSON.parse(JSON.stringify(initialWeekendRates)))
  }

  // Validation
  const validatePricing = (roomTypes: RoomTypeData[]): ValidationError[] => {
    const errors: ValidationError[] = []

    roomTypes.forEach((room) => {
      if (room.pricePerNightMin >= room.pricePerNight) {
        errors.push({
          field: `${room.id}-price`,
          message: `${room.roomType}: Base price must be higher than minimum price`,
        })
      }

      if (room.pricePerNight >= room.pricePerNightMax) {
        errors.push({
          field: `${room.id}-price`,
          message: `${room.roomType}: Base price must be lower than maximum price`,
        })
      }

      if (room.pricePerNightMin < 0 || room.pricePerNight < 0 || room.pricePerNightMax < 0) {
        errors.push({
          field: `${room.id}-price`,
          message: `${room.roomType}: Prices cannot be negative`,
        })
      }

      if (room.pricePerNightMin === 0 || room.pricePerNightMax === 0) {
        errors.push({
          field: `${room.id}-price`,
          message: `${room.roomType}: Min and max prices must be greater than 0`,
        })
      }
    })

    return errors
  }

  // Price change handlers
  const handlePriceChange = useCallback(
    (id: string, field: "pricePerNight" | "pricePerNightMin" | "pricePerNightMax", value: string) => {
      const numValue = Number.parseFloat(value) || 0

      setEditableRoomTypes((prev) => {
        return prev.map((room) => {
          if (room.id === id) {
            return { ...room, [field]: numValue }
          }
          return room
        })
      })

      // Clear validation errors for this field
      setValidationErrors((prev) => prev.filter((error) => error.field !== `${id}-${field}`))
    },
    [],
  )

  const handleWeekendPriceChange = useCallback(
    (roomTypeId: string, field: "price" | "minPrice" | "maxPrice", value: string) => {
      const numValue = Number.parseFloat(value) || 0

      setEditableWeekendRates((prev) => {
        return prev.map((rate) => {
          if (rate.roomTypeId === roomTypeId) {
            return { ...rate, [field]: numValue }
          }
          return rate
        })
      })
    },
    [],
  )

  const handleWeekendRateToggle = useCallback((roomTypeId: string, enabled: boolean) => {
    setEditableWeekendRates((prev) =>
      prev.map((rate) => (rate.roomTypeId === roomTypeId ? { ...rate, enabled } : rate)),
    )
  }, [])

  // CRITICAL: Use the exact same update logic as your working UpdateRoomTypeForm
  const updateRoomType = async (roomType: string, updateData: any) => {
    try {
      const resp = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation updateRoomType(
              $hotelId: String!
              $roomType: RoomType!
              $updateData: UpdateRoomTypeInput!
            ) {
              updateRoomType(
                hotelId: $hotelId
                roomType: $roomType
                updateData: $updateData
              ) {
                id
                roomType
                pricePerNight
                pricePerNightMin
                pricePerNightMax
              }
            }
          `,
          variables: {
            hotelId: selectedHotel?.id,
            roomType,
            updateData,
          },
        }),
      })

      const { data, errors } = await resp.json()

      if (errors?.length) {
        throw new Error(errors[0].message)
      }

      console.log(`✅ ${roomType} updated successfully:`, data.updateRoomType)
      return data.updateRoomType
    } catch (error) {
      console.error(`❌ Failed to update ${roomType}:`, error)
      throw error
    }
  }

  // Enhanced save handler using the exact same logic
  const handleSave = async () => {
    setLoading(true)

    try {
      if (activeTab === "standard") {
        // Validate all pricing before saving
        const errors = validatePricing(editableRoomTypes)
        setValidationErrors(errors)

        if (errors.length > 0) {
          addNotification("error", "Please fix validation errors before saving")
          return
        }

        console.log("💾 Saving room type pricing to backend...")

        // Update each room type using the exact same logic as your working form
        const updatePromises = editableRoomTypes.map(async (roomType) => {
          console.log(`Updating pricing for ${roomType.roomType}:`, {
            pricePerNight: roomType.pricePerNight,
            pricePerNightMin: roomType.pricePerNightMin,
            pricePerNightMax: roomType.pricePerNightMax,
          })

          const updateData = {
            pricePerNight: roomType.pricePerNight,
            pricePerNightMax: roomType.pricePerNightMax,
            pricePerNightMin: roomType.pricePerNightMin,
            baseOccupancy: roomType.baseOccupancy,
            maxOccupancy: roomType.maxOccupancy,
            extraBedAllowed: roomType.extraBedAllowed,
            extraBedPrice: roomType.extraBedPrice,
            roomSize: roomType.roomSize,
            bedType: roomType.bedType,
            bedCount: roomType.bedCount,
            description: roomType.description,
            isSmoking: roomType.isSmoking,
          }

          return await updateRoomType(roomType.roomType, updateData)
        })

        // Wait for all backend updates to complete
        const updatedRoomTypes = await Promise.all(updatePromises)
        console.log("✅ All room type updates completed successfully")

        // Update local state after successful backend operations
        setRoomTypes([...editableRoomTypes])
        setLastSaved(new Date())
        addNotification("success", `Successfully updated pricing for ${updatedRoomTypes.length} room types`)

        // Reload data to confirm persistence
        setTimeout(() => {
          loadAllRoomTypes()
        }, 1000)
      } else if (activeTab === "weekend") {
        // Validate weekend rates
        for (const rate of editableWeekendRates) {
          if (rate.enabled && (rate.minPrice > rate.price || rate.price > rate.maxPrice)) {
            const room = roomTypes.find((r) => r.id === rate.roomTypeId)
            throw new Error(
              `Invalid weekend price range for ${room?.roomType}. Min price must be less than base price, and base price must be less than max price.`,
            )
          }
        }

        // Update weekend rates
        setWeekendRates([...editableWeekendRates])
        addNotification("success", "Weekend rates updated successfully")
      }

      setValidationErrors([])
    } catch (error) {
      console.error("❌ Error saving pricing:", error)
      addNotification("error", error instanceof Error ? error.message : "Failed to update pricing")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (activeTab === "standard") {
      // Reset to last saved values from source of truth
      setEditableRoomTypes(JSON.parse(JSON.stringify(roomTypes)))
    } else if (activeTab === "weekend") {
      setEditableWeekendRates(JSON.parse(JSON.stringify(weekendRates)))
    }

    setValidationErrors([])
    addNotification("success", "Changes reset to last saved values")
  }

  const handleRefresh = async () => {
    console.log("🔄 Manually refreshing room data from backend...")
    await loadAllRoomTypes()
    addNotification("success", "Data refreshed from backend")
  }

  // Auto-populate min/max prices based on base price
  const handleAutoPopulate = (roomId: string) => {
    setEditableRoomTypes((prev) => {
      return prev.map((room) => {
        if (room.id === roomId && room.pricePerNight > 0) {
          const newMinPrice = Math.round(room.pricePerNight * 0.7) // 70% of base
          const newMaxPrice = Math.round(room.pricePerNight * 1.5) // 150% of base

          return {
            ...room,
            pricePerNightMin: newMinPrice,
            pricePerNightMax: newMaxPrice,
          }
        }
        return room
      })
    })

    addNotification("success", "Min and max prices auto-populated based on base price")
  }

  // Check if there are unsaved changes
  const hasChanges =
    JSON.stringify(roomTypes) !== JSON.stringify(editableRoomTypes) ||
    JSON.stringify(weekendRates) !== JSON.stringify(editableWeekendRates)

  if (loading && roomTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading room pricing data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : notification.type === "warning"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Room Pricing Management</h1>
              <p className="text-sm text-gray-600">Configure room rates using the same logic as UpdateRoomTypeForm</p>
              {lastSaved && <p className="text-sm text-green-600 mt-1">Last saved: {lastSaved.toLocaleString()}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 text-sm text-gray-600">
          <p>
            Found {roomTypes.length} room categories
            {selectedHotel ? ` for ${selectedHotel.name}` : ""}
          </p>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-800">Validation Errors</h3>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Room Pricing Configuration</CardTitle>
            <CardDescription>
              Set the base price, minimum, and maximum pricing for each room category. Uses the exact same logic as
              UpdateRoomTypeForm.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="standard">Standard Rate</TabsTrigger>
                <TabsTrigger value="weekend">Weekend Rate</TabsTrigger>
              </TabsList>

              <TabsContent value="standard" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Room Category</TableHead>
                        <TableHead>Min Price (฿)</TableHead>
                        <TableHead>Base Price (฿)</TableHead>
                        <TableHead>Max Price (฿)</TableHead>
                        <TableHead>Extra Bed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableRoomTypes.map((room) => {
                        const hasFieldError = (field: string) =>
                          validationErrors.some((error) => error.field === `${room.id}-${field}`)

                        return (
                          <TableRow key={room.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div>{room.roomType}</div>
                              {/* Show warning if min/max are 0 */}
                              {(room.pricePerNightMin === 0 || room.pricePerNightMax === 0) && (
                                <div className="text-xs text-red-600 mt-1">⚠️ Min/Max prices missing</div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={room.pricePerNightMin}
                                onChange={(e) => handlePriceChange(room.id, "pricePerNightMin", e.target.value)}
                                className={`w-[120px] ${hasFieldError("pricePerNightMin") ? "border-red-500 bg-red-50" : ""} ${
                                  room.pricePerNightMin === 0 ? "border-yellow-500 bg-yellow-50" : ""
                                }`}
                                min="0"
                                step="0.01"
                                placeholder="Min price"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={room.pricePerNight}
                                onChange={(e) => handlePriceChange(room.id, "pricePerNight", e.target.value)}
                                className={`w-[120px] ${hasFieldError("pricePerNight") ? "border-red-500 bg-red-50" : ""}`}
                                min="0"
                                step="0.01"
                                placeholder="Base price"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={room.pricePerNightMax}
                                onChange={(e) => handlePriceChange(room.id, "pricePerNightMax", e.target.value)}
                                className={`w-[120px] ${hasFieldError("pricePerNightMax") ? "border-red-500 bg-red-50" : ""} ${
                                  room.pricePerNightMax === 0 ? "border-yellow-500 bg-yellow-50" : ""
                                }`}
                                min="0"
                                step="0.01"
                                placeholder="Max price"
                              />
                            </TableCell>
                            <TableCell>
                              {room.extraBedAllowed ? `฿${room.extraBedPrice || 0}` : "Not allowed"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAutoPopulate(room.id)}
                                disabled={room.pricePerNight <= 0}
                                className="text-xs"
                              >
                                Auto-fill
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-800">
                  <p className="font-medium mb-2">✅ Using Exact Same Logic as UpdateRoomTypeForm</p>
                  <ul className="space-y-1">
                    <li>• Same getRoomType query to fetch current values</li>
                    <li>• Same updateRoomType mutation to save changes</li>
                    <li>• Same field names: pricePerNight, pricePerNightMin, pricePerNightMax</li>
                    <li>• Same direct fetch approach without Apollo Client</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="weekend" className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-sm font-medium">Weekend days:</div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="friday"
                      checked={weekendDays.friday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, friday: checked === true }))}
                    />
                    <label htmlFor="friday" className="text-sm">
                      Friday
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saturday"
                      checked={weekendDays.saturday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, saturday: checked === true }))}
                    />
                    <label htmlFor="saturday" className="text-sm">
                      Saturday
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sunday"
                      checked={weekendDays.sunday}
                      onCheckedChange={(checked) => setWeekendDays((prev) => ({ ...prev, sunday: checked === true }))}
                    />
                    <label htmlFor="sunday" className="text-sm">
                      Sunday
                    </label>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Room Category</TableHead>
                        <TableHead>Enabled</TableHead>
                        <TableHead>Min Price (฿)</TableHead>
                        <TableHead>Base Price (฿)</TableHead>
                        <TableHead>Max Price (฿)</TableHead>
                        <TableHead className="text-right">Standard Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editableWeekendRates.map((rate) => {
                        const room = roomTypes.find((r) => r.id === rate.roomTypeId)
                        return (
                          <TableRow key={rate.roomTypeId}>
                            <TableCell className="font-medium">{room?.roomType}</TableCell>
                            <TableCell>
                              <Switch
                                checked={rate.enabled}
                                onCheckedChange={(checked) => handleWeekendRateToggle(rate.roomTypeId, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.minPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "minPrice", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.price}
                                onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "price", e.target.value)}
                                className={`w-[120px] ${
                                  rate.enabled && (rate.price < rate.minPrice || rate.price > rate.maxPrice)
                                    ? "border-red-500 bg-red-50"
                                    : ""
                                }`}
                                disabled={!rate.enabled}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rate.maxPrice}
                                onChange={(e) => handleWeekendPriceChange(rate.roomTypeId, "maxPrice", e.target.value)}
                                className="w-[120px]"
                                disabled={!rate.enabled}
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell className="text-right text-gray-500">฿ {room?.pricePerNight}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                  <p>
                    <strong>Note:</strong> Weekend rates apply to the days selected above. These rates will be applied
                    automatically for bookings on weekend days.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-600">
              {hasChanges && <span className="text-orange-600 font-medium">You have unsaved changes</span>}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleReset} disabled={!hasChanges || loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Changes
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges || loading || validationErrors.length > 0}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving to Backend...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Debug Information */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <details className="cursor-pointer">
            <summary className="text-sm font-medium text-gray-700 mb-2">Debug Information</summary>
            <div className="text-xs text-gray-600 space-y-2">
              <div>
                <strong>Has Changes:</strong> {hasChanges ? "Yes" : "No"}
              </div>
              <div>
                <strong>Validation Errors:</strong> {validationErrors.length}
              </div>
              <div>
                <strong>Room Types Count:</strong> {roomTypes.length}
              </div>
              <div>
                <strong>Last Saved:</strong> {lastSaved ? lastSaved.toISOString() : "Never"}
              </div>
              <div>
                <strong>Selected Hotel:</strong> {selectedHotel?.name || "None"}
              </div>
              <div>
                <strong>Using Same Logic:</strong> UpdateRoomTypeForm approach with direct fetch
              </div>
              <div>
                <strong>Backend Values:</strong>
                <pre className="mt-1 text-xs bg-gray-200 p-2 rounded">
                  {JSON.stringify(
                    roomTypes.map((r) => ({
                      type: r.roomType,
                      base: r.pricePerNight,
                      min: r.pricePerNightMin,
                      max: r.pricePerNightMax,
                    })),
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
