// // // // "use client"

// // // // import { useState, useEffect } from "react"
// // // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Badge } from "@/components/ui/badge"
// // // // import { CalendarDays, Users, Bed, CreditCard } from "lucide-react"
// // // // import BookingForm from "@/components/bookings/createbooking/booking-form"
// // // // import { useHotelContext } from "@/providers/hotel-provider"

// // // // export default function CreateBookingPage() {
// // // //   const { selectedHotel } = useHotelContext()
// // // //   const [pricingSummary, setPricingSummary] = useState<
// // // //     Record<string, { basePrice: number; minPrice: number; maxPrice: number }>
// // // //   >({})

// // // //   useEffect(() => {
// // // //     if (selectedHotel?.id) {
// // // //       fetchPricingSummary()
// // // //     }
// // // //   }, [selectedHotel])

// // // //   const fetchPricingSummary = async () => {
// // // //     try {
// // // //       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

// // // //       const response = await fetch(endpoint, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //         body: JSON.stringify({
// // // //           query: `
// // // //   query {
// // // //     rooms(
// // // //       hotelId: "${selectedHotel?.id}"
// // // //       limit: 100
// // // //       offset: 0
// // // //     ) {
// // // //       id
// // // //       roomType
// // // //       pricePerNight
// // // //     }
// // // //   }
// // // // `,
// // // //         }),
// // // //       })

// // // //       const result = await response.json()

// // // //       if (result.data && result.data.rooms) {
// // // //         // Group rooms by type and calculate pricing
// // // //         const roomTypeGroups = result.data.rooms.reduce((acc: any, room: any) => {
// // // //           const roomType = room.roomType
// // // //           if (!acc[roomType]) {
// // // //             acc[roomType] = {
// // // //               prices: [],
// // // //               totalRooms: 0,
// // // //             }
// // // //           }
// // // //           acc[roomType].prices.push(room.pricePerNight || 1000)
// // // //           acc[roomType].totalRooms += 1
// // // //           return acc
// // // //         }, {})

// // // //         // Calculate pricing data for each room type
// // // //         const pricingMap: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {}

// // // //         Object.entries(roomTypeGroups).forEach(([typeName, data]: [string, any]) => {
// // // //           const avgPrice = data.prices.reduce((sum: number, price: number) => sum + price, 0) / data.totalRooms

// // // //           pricingMap[typeName] = {
// // // //             basePrice: Math.round(avgPrice),
// // // //             minPrice: Math.round(avgPrice * 0.5),
// // // //             maxPrice: Math.round(avgPrice * 2),
// // // //           }
// // // //         })

// // // //         setPricingSummary(pricingMap)
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error fetching pricing summary:", error)
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className="container mx-auto py-6 max-w-7xl">
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <div>
// // // //           <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
// // // //           <p className="text-muted-foreground">Add a new reservation to the system</p>
// // // //         </div>
// // // //       </div>

// // // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // // //         {/* Main Booking Form */}
// // // //         <div className="lg:col-span-2">
// // // //           <BookingForm
// // // //             onSuccess={() => {
// // // //               // Handle successful booking creation
// // // //               console.log("Booking created successfully")
// // // //             }}
// // // //           />
// // // //         </div>

// // // //         {/* Pricing Summary Sidebar */}
// // // //         <div className="space-y-6">
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <CreditCard className="h-5 w-5" />
// // // //                 Current Room Rates
// // // //               </CardTitle>
// // // //               <CardDescription>Base pricing for available room categories</CardDescription>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               {Object.entries(pricingSummary).map(([roomType, pricing]) => (
// // // //                 <div key={roomType} className="border rounded-lg p-3">
// // // //                   <div className="flex justify-between items-start mb-2">
// // // //                     <div>
// // // //                       <h4 className="font-medium">{roomType}</h4>
// // // //                       <Badge variant="outline" className="text-xs">
// // // //                         <Bed className="h-3 w-3 mr-1" />
// // // //                         Available
// // // //                       </Badge>
// // // //                     </div>
// // // //                     <div className="text-right">
// // // //                       <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
// // // //                       <div className="text-xs text-gray-500">per night</div>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="text-xs text-gray-500">
// // // //                     Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
// // // //                   </div>
// // // //                 </div>
// // // //               ))}

// // // //               {Object.keys(pricingSummary).length === 0 && (
// // // //                 <div className="text-center py-4 text-gray-500">
// // // //                   <p className="text-sm">Loading pricing information...</p>
// // // //                 </div>
// // // //               )}
// // // //             </CardContent>
// // // //           </Card>

// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <CalendarDays className="h-5 w-5" />
// // // //                 Booking Guidelines
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-3 text-sm">
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
// // // //                 <p>Prices shown are base rates and may vary based on demand and season</p>
// // // //               </div>
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
// // // //                 <p>Weekend rates may apply for Friday, Saturday, and Sunday</p>
// // // //               </div>
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
// // // //                 <p>Final price will be calculated based on selected dates and occupancy</p>
// // // //               </div>
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
// // // //                 <p>Special offers and discounts may be available during booking</p>
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>

// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Users className="h-5 w-5" />
// // // //                 Quick Stats
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent>
// // // //               <div className="space-y-2 text-sm">
// // // //                 <div className="flex justify-between">
// // // //                   <span className="text-gray-600">Available Room Types:</span>
// // // //                   <span className="font-medium">{Object.keys(pricingSummary).length}</span>
// // // //                 </div>
// // // //                 <div className="flex justify-between">
// // // //                   <span className="text-gray-600">Starting From:</span>
// // // //                   <span className="font-medium text-green-600">
// // // //                     ฿{Math.min(...Object.values(pricingSummary).map((p) => p.basePrice)) || 0}
// // // //                   </span>
// // // //                 </div>
// // // //                 <div className="flex justify-between">
// // // //                   <span className="text-gray-600">Premium Rates:</span>
// // // //                   <span className="font-medium text-blue-600">
// // // //                     ฿{Math.max(...Object.values(pricingSummary).map((p) => p.basePrice)) || 0}
// // // //                   </span>
// // // //                 </div>
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }
// // // // "use client"

// // // // import { useState, useEffect } from "react"
// // // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // // // import { Badge } from "@/components/ui/badge"
// // // // import { CalendarDays, Users, Bed, CreditCard } from "lucide-react"
// // // // import BookingForm from "@/components/bookings/createbooking/booking-form"
// // // // import { useHotelContext } from "@/providers/hotel-provider"

// // // // // Function to get pricing config from localStorage
// // // // function getPricingConfig(hotelId: string) {
// // // //   try {
// // // //     const configKey = `pricingConfig_${hotelId}`;
// // // //     return JSON.parse(localStorage.getItem(configKey) || '{}');
// // // //   } catch (error) {
// // // //     console.error("Error getting pricing config from localStorage:", error);
// // // //     return {};
// // // //   }
// // // // }

// // // // export default function CreateBookingPage() {
// // // //   const { selectedHotel } = useHotelContext()
// // // //   const [pricingSummary, setPricingSummary] = useState<
// // // //     Record<string, { basePrice: number; minPrice: number; maxPrice: number }>
// // // //   >({})

// // // //   useEffect(() => {
// // // //     if (selectedHotel?.id) {
// // // //       fetchPricingSummary()
// // // //     }
// // // //   }, [selectedHotel])

// // // //   const fetchPricingSummary = async () => {
// // // //     try {
// // // //       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

// // // //       const response = await fetch(endpoint, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //         body: JSON.stringify({
// // // //           query: `
// // // //   query {
// // // //     rooms(
// // // //       hotelId: "${selectedHotel?.id}"
// // // //       limit: 100
// // // //       offset: 0
// // // //     ) {
// // // //       id
// // // //       roomType
// // // //       pricePerNight
// // // //     }
// // // //   }
// // // // `,
// // // //         }),
// // // //       })

// // // //       const result = await response.json()

// // // //       if (result.data && result.data.rooms) {
// // // //         // Group rooms by type and calculate pricing
// // // //         const roomTypeGroups = result.data.rooms.reduce((acc: any, room: any) => {
// // // //           const roomType = room.roomType
// // // //           if (!acc[roomType]) {
// // // //             acc[roomType] = {
// // // //               prices: [],
// // // //               totalRooms: 0,
// // // //             }
// // // //           }
// // // //           acc[roomType].prices.push(room.pricePerNight || 1000)
// // // //           acc[roomType].totalRooms += 1
// // // //           return acc
// // // //         }, {})

// // // //         // Get pricing configuration from localStorage
// // // //         const pricingConfig = getPricingConfig(selectedHotel?.id || '');
        
// // // //         // Calculate pricing data for each room type
// // // //         const pricingMap: Record<string, { basePrice: number; minPrice: number; maxPrice: number }> = {}

// // // //         Object.entries(roomTypeGroups).forEach(([typeName, data]: [string, any]) => {
// // // //           const avgPrice = data.prices.reduce((sum: number, price: number) => sum + price, 0) / data.totalRooms

// // // //           // Check if we have pricing configuration for this room type
// // // //           const roomConfig = pricingConfig[typeName];

// // // //           if (roomConfig) {
// // // //             // Use the configured pricing
// // // //             pricingMap[typeName] = {
// // // //               basePrice: roomConfig.basePrice,
// // // //               minPrice: roomConfig.minPrice,
// // // //               maxPrice: roomConfig.maxPrice
// // // //             };
// // // //           } else {
// // // //             // For STANDARD room type
// // // //             if (typeName === "STANDARD") {
// // // //               pricingMap[typeName] = {
// // // //                 basePrice: 500,
// // // //                 minPrice: 250,
// // // //                 maxPrice: 1000,
// // // //               }
// // // //             }
// // // //             // For DELUXE room type
// // // //             else if (typeName === "DELUXE") {
// // // //               pricingMap[typeName] = {
// // // //                 basePrice: 300,
// // // //                 minPrice: 150,
// // // //                 maxPrice: 600,
// // // //               }
// // // //             }
// // // //             // For SUITE room type
// // // //             else if (typeName === "SUITE") {
// // // //               pricingMap[typeName] = {
// // // //                 basePrice: 2000,
// // // //                 minPrice: 1000,
// // // //                 maxPrice: 4000,
// // // //               }
// // // //             }
// // // //             // For other room types
// // // //             else {
// // // //               pricingMap[typeName] = {
// // // //                 basePrice: Math.round(avgPrice),
// // // //                 minPrice: Math.round(avgPrice * 0.5),
// // // //                 maxPrice: Math.round(avgPrice * 2),
// // // //               }
// // // //             }
// // // //           }
// // // //         })

// // // //         setPricingSummary(pricingMap)
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error fetching pricing summary:", error)
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className="container mx-auto py-6 max-w-7xl">
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <div>
// // // //           <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
// // // //           <p className="text-muted-foreground">Add a new reservation to the system</p>
// // // //         </div>
// // // //       </div>

// // // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // // //         {/* Main Booking Form */}
// // // //         <div className="lg:col-span-2">
// // // //           <BookingForm
// // // //             onSuccess={() => {
// // // //               // Handle successful booking creation
// // // //               console.log("Booking created successfully")
// // // //             }}
// // // //           />
// // // //         </div>

// // // //         {/* Pricing Summary Sidebar */}
// // // //         <div className="space-y-6">
// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <CreditCard className="h-5 w-5" />
// // // //                 Current Room Rates
// // // //               </CardTitle>
// // // //               <CardDescription>Base pricing for available room categories</CardDescription>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-4">
// // // //               {Object.entries(pricingSummary).map(([roomType, pricing]) => (
// // // //                 <div key={roomType} className="border rounded-lg p-3">
// // // //                   <div className="flex justify-between items-start mb-2">
// // // //                     <div>
// // // //                       <h4 className="font-medium">{roomType}</h4>
// // // //                       <Badge variant="outline" className="text-xs">
// // // //                         <Bed className="h-3 w-3 mr-1" />
// // // //                         Available
// // // //                       </Badge>
// // // //                     </div>
// // // //                     <div className="text-right">
// // // //                       <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
// // // //                       <div className="text-xs text-gray-500">per night</div>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="text-xs text-gray-500">
// // // //                     Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
// // // //                   </div>
// // // //                 </div>
// // // //               ))}

// // // //               {Object.keys(pricingSummary).length === 0 && (
// // // //                 <div className="text-center py-4 text-gray-500">
// // // //                   <p className="text-sm">Loading pricing information...</p>
// // // //                 </div>
// // // //               )}
// // // //             </CardContent>
// // // //           </Card>

// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <CalendarDays className="h-5 w-5" />
// // // //                 Booking Guidelines
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent className="space-y-3 text-sm">
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
// // // //                 <p>Prices shown are base rates and may vary based on demand and season</p>
// // // //               </div>
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
// // // //                 <p>Weekend rates may apply for Friday, Saturday, and Sunday</p>
// // // //               </div>
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
// // // //                 <p>Final price will be calculated based on selected dates and occupancy</p>
// // // //               </div>
// // // //               <div className="flex items-start gap-2">
// // // //                 <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
// // // //                 <p>Special offers and discounts may be available during booking</p>
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>

// // // //           <Card>
// // // //             <CardHeader>
// // // //               <CardTitle className="flex items-center gap-2">
// // // //                 <Users className="h-5 w-5" />
// // // //                 Quick Stats
// // // //               </CardTitle>
// // // //             </CardHeader>
// // // //             <CardContent>
// // // //               <div className="space-y-2 text-sm">
// // // //                 <div className="flex justify-between">
// // // //                   <span className="text-gray-600">Available Room Types:</span>
// // // //                   <span className="font-medium">{Object.keys(pricingSummary).length}</span>
// // // //                 </div>
// // // //                 <div className="flex justify-between">
// // // //                   <span className="text-gray-600">Starting From:</span>
// // // //                   <span className="font-medium text-green-600">
// // // //                     ฿{Math.min(...Object.values(pricingSummary).map((p) => p.basePrice)) || 0}
// // // //                   </span>
// // // //                 </div>
// // // //                 <div className="flex justify-between">
// // // //                   <span className="text-gray-600">Premium Rates:</span>
// // // //                   <span className="font-medium text-blue-600">
// // // //                     ฿{Math.max(...Object.values(pricingSummary).map((p) => p.basePrice)) || 0}
// // // //                   </span>
// // // //                 </div>
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // "use client"

// // // import type React from "react"
// // // import { useState } from "react"
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Badge } from "@/components/ui/badge"
// // // import { CalendarDays, Users, Bed, CreditCard, Loader2, RefreshCw } from "lucide-react"
// // // import BookingForm from "@/components/bookings/createbooking/booking-form"
// // // import { useHotelContext } from "@/providers/hotel-provider"
// // // import { useQuery } from "@apollo/client"
// // // import { gql } from "@apollo/client"
// // // import { Button } from "@/components/ui/button"

// // // // Query to get individual rooms with latest pricing
// // // const GET_ROOMS = gql`
// // //   query GetRooms($hotelId: String!) {
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
// // //       bedType
// // //       bedCount
// // //       amenities
// // //       roomSize
// // //       isActive
// // //     }
// // //   }
// // // `

// // // interface RoomPricing {
// // //   basePrice: number
// // //   minPrice: number
// // //   maxPrice: number
// // //   availableRooms: number
// // // }

// // // const CreateBookingPage: React.FC = () => {
// // //   const { selectedHotel } = useHotelContext()
// // //   const [pricingSummary, setPricingSummary] = useState<Record<string, RoomPricing>>({})

// // //   // Fetch the latest room data with pricing
// // //   const {
// // //     data: roomsData,
// // //     loading: roomsLoading,
// // //     error: roomsError,
// // //     refetch: refetchRooms,
// // //   } = useQuery(GET_ROOMS, {
// // //     variables: {
// // //       hotelId: selectedHotel?.id || "",
// // //     },
// // //     skip: !selectedHotel?.id,
// // //     // Force network-only to get latest data from backend
// // //     fetchPolicy: "cache-and-network",
// // //     onCompleted: (data) => {
// // //       console.log("Rooms with latest pricing fetched successfully:", data)
// // //       if (data.rooms) {
// // //         processRoomPricing(data.rooms)
// // //       }
// // //     },
// // //     onError: (error) => {
// // //       console.error("Error fetching rooms with pricing:", error)
// // //     },
// // //   })

// // //   // Process room data to extract pricing by room type
// // //   const processRoomPricing = (rooms: any[]) => {
// // //     if (!rooms || rooms.length === 0) {
// // //       setPricingSummary({})
// // //       return
// // //     }

// // //     // Group rooms by type and extract pricing directly from backend
// // //     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
// // //       const roomType = room.roomType

// // //       // Only include active rooms
// // //       if (!room.isActive) return acc

// // //       if (!acc[roomType]) {
// // //         acc[roomType] = {
// // //           rooms: [],
// // //           totalRooms: 0,
// // //           basePrices: [],
// // //           minPrices: [],
// // //           maxPrices: [],
// // //         }
// // //       }

// // //       acc[roomType].rooms.push(room)
// // //       acc[roomType].totalRooms += 1

// // //       // Collect pricing data directly from backend fields
// // //       console.log(`Room ${room.roomNumber} (${roomType}) pricing:`, {
// // //         pricePerNight: room.pricePerNight,
// // //         pricePerNightMin: room.pricePerNightMin,
// // //         pricePerNightMax: room.pricePerNightMax,
// // //       })

// // //       if (room.pricePerNight !== null && room.pricePerNight !== undefined && room.pricePerNight > 0) {
// // //         acc[roomType].basePrices.push(room.pricePerNight)
// // //       }
// // //       if (room.pricePerNightMin !== null && room.pricePerNightMin !== undefined && room.pricePerNightMin > 0) {
// // //         acc[roomType].minPrices.push(room.pricePerNightMin)
// // //       }
// // //       if (room.pricePerNightMax !== null && room.pricePerNightMax !== undefined && room.pricePerNightMax > 0) {
// // //         acc[roomType].maxPrices.push(room.pricePerNightMax)
// // //       }

// // //       return acc
// // //     }, {})

// // //     // Calculate pricing summary for each room type
// // //     const pricingMap: Record<string, RoomPricing> = {}

// // //     Object.entries(roomTypeGroups).forEach(([typeName, data]: [string, any]) => {
// // //       // Use backend pricing fields directly
// // //       const basePrices = data.basePrices
// // //       const minPrices = data.minPrices
// // //       const maxPrices = data.maxPrices

// // //       console.log(`Processing ${typeName}:`, {
// // //         basePrices,
// // //         minPrices,
// // //         maxPrices,
// // //         totalRooms: data.totalRooms,
// // //       })

// // //       // Calculate averages or use the most common pricing
// // //       let avgBasePrice = 0
// // //       let avgMinPrice = 0
// // //       let avgMaxPrice = 0

// // //       if (basePrices.length > 0) {
// // //         avgBasePrice = basePrices.reduce((sum: number, price: number) => sum + price, 0) / basePrices.length
// // //       }
// // //       if (minPrices.length > 0) {
// // //         avgMinPrice = minPrices.reduce((sum: number, price: number) => sum + price, 0) / minPrices.length
// // //       }
// // //       if (maxPrices.length > 0) {
// // //         avgMaxPrice = maxPrices.reduce((sum: number, price: number) => sum + price, 0) / maxPrices.length
// // //       }

// // //       // If no min/max prices in backend, calculate reasonable defaults based on base price
// // //       if (avgMinPrice === 0 && avgBasePrice > 0) {
// // //         avgMinPrice = Math.round(avgBasePrice * 0.5) // 50% of base price
// // //         console.log(`Calculated default min price for ${typeName}: ${avgMinPrice}`)
// // //       }
// // //       if (avgMaxPrice === 0 && avgBasePrice > 0) {
// // //         avgMaxPrice = Math.round(avgBasePrice * 2) // 200% of base price
// // //         console.log(`Calculated default max price for ${typeName}: ${avgMaxPrice}`)
// // //       }

// // //       // If no pricing data from backend, show warning and use defaults
// // //       if (avgBasePrice === 0 && avgMinPrice === 0 && avgMaxPrice === 0) {
// // //         console.warn(`No pricing data found for ${typeName}, using defaults`)
// // //         // Set default pricing based on room type
// // //         if (typeName === "STANDARD") {
// // //           avgBasePrice = 500
// // //           avgMinPrice = 250
// // //           avgMaxPrice = 1000
// // //         } else if (typeName === "DELUXE") {
// // //           avgBasePrice = 300
// // //           avgMinPrice = 150
// // //           avgMaxPrice = 600
// // //         } else if (typeName === "SUITE") {
// // //           avgBasePrice = 2000
// // //           avgMinPrice = 1000
// // //           avgMaxPrice = 4000
// // //         } else {
// // //           avgBasePrice = 1000
// // //           avgMinPrice = 500
// // //           avgMaxPrice = 2000
// // //         }
// // //       }

// // //       pricingMap[typeName] = {
// // //         basePrice: Math.round(avgBasePrice),
// // //         minPrice: Math.round(avgMinPrice),
// // //         maxPrice: Math.round(avgMaxPrice),
// // //         availableRooms: data.totalRooms,
// // //       }

// // //       console.log(`Final pricing for ${typeName}:`, pricingMap[typeName])
// // //     })

// // //     console.log("Final pricing summary from latest backend data:", pricingMap)
// // //     setPricingSummary(pricingMap)
// // //   }

// // //   // Calculate quick stats
// // //   const roomTypes = Object.entries(pricingSummary)
// // //   const availableRoomTypes = roomTypes.length
// // //   const totalRooms = roomTypes.reduce((sum, [, pricing]) => sum + pricing.availableRooms, 0)
// // //   const startingPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0
// // //   const premiumPrice = roomTypes.length > 0 ? Math.max(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0

// // //   const refetch = async () => {
// // //     console.log("Manually refreshing room pricing data...")
// // //     await refetchRooms()
// // //   }

// // //   const isLoading = roomsLoading
// // //   const hasError = roomsError

// // //   return (
// // //     <div className="container mx-auto py-6 max-w-7xl">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div>
// // //           <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
// // //           <p className="text-muted-foreground">Add a new reservation to the system</p>
// // //           {selectedHotel && <p className="text-sm text-gray-500 mt-1">Hotel: {selectedHotel.name}</p>}
// // //         </div>
// // //         <div className="flex items-center gap-2">
// // //           {hasError && <div className="text-red-600 text-sm">Error loading room data</div>}
// // //           <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
// // //             <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
// // //             Refresh Data
// // //           </Button>
// // //         </div>
// // //       </div>

// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //         {/* Main Booking Form */}
// // //         <div className="lg:col-span-2">
// // //           <BookingForm
// // //             onSuccess={() => {
// // //               console.log("Booking created successfully")
// // //             }}
// // //           />
// // //         </div>

// // //         {/* Pricing Summary Sidebar */}
// // //         <div className="space-y-6">
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <CreditCard className="h-5 w-5" />
// // //                 Current Room Rates
// // //               </CardTitle>
// // //               <CardDescription>
// // //                 Latest pricing from backend database
// // //                 {roomsData && roomsData.rooms && (
// // //                   <span className="block text-xs text-green-600 mt-1">
// // //                     ✓ Latest data from {roomsData.rooms.length} individual rooms
// // //                   </span>
// // //                 )}
// // //                 {hasError && <span className="block text-xs text-red-600 mt-1">⚠️ Error loading data</span>}
// // //               </CardDescription>
// // //             </CardHeader>
// // //             <CardContent className="space-y-4">
// // //               {isLoading ? (
// // //                 <div className="flex items-center justify-center py-8">
// // //                   <div className="flex items-center space-x-2">
// // //                     <Loader2 className="h-5 w-5 animate-spin" />
// // //                     <span className="text-gray-500">Loading latest pricing information...</span>
// // //                   </div>
// // //                 </div>
// // //               ) : roomTypes.length === 0 ? (
// // //                 <div className="text-center py-8 text-gray-500">
// // //                   <p className="text-sm">No room pricing available</p>
// // //                   {hasError && <p className="text-xs text-red-500 mt-2">Error loading data from backend</p>}
// // //                 </div>
// // //               ) : (
// // //                 roomTypes.map(([roomType, pricing]) => (
// // //                   <div key={roomType} className="border rounded-lg p-3">
// // //                     <div className="flex justify-between items-start mb-2">
// // //                       <div>
// // //                         <h4 className="font-medium">{roomType.charAt(0) + roomType.slice(1).toLowerCase()}</h4>
// // //                         <Badge variant="outline" className="text-xs">
// // //                           <Bed className="h-3 w-3 mr-1" />
// // //                           {pricing.availableRooms > 0 ? `${pricing.availableRooms} available` : "Available"}
// // //                         </Badge>
// // //                       </div>
// // //                       <div className="text-right">
// // //                         <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
// // //                         <div className="text-xs text-gray-500">per night</div>
// // //                       </div>
// // //                     </div>
// // //                     <div className="text-xs text-gray-500">
// // //                       Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
// // //                     </div>
// // //                     {pricing.basePrice === 0 && (
// // //                       <div className="text-xs text-amber-600 mt-1">⚠ No pricing configured</div>
// // //                     )}
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </CardContent>
// // //           </Card>

// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <CalendarDays className="h-5 w-5" />
// // //                 Booking Guidelines
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent className="space-y-3 text-sm">
// // //               <div className="flex items-start gap-2">
// // //                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
// // //                 <p>Prices shown are latest rates from the backend database</p>
// // //               </div>
// // //               <div className="flex items-start gap-2">
// // //                 <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
// // //                 <p>Weekend rates and seasonal pricing may apply during booking</p>
// // //               </div>
// // //               <div className="flex items-start gap-2">
// // //                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
// // //                 <p>Final price will be calculated based on selected dates and occupancy</p>
// // //               </div>
// // //               <div className="flex items-start gap-2">
// // //                 <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
// // //                 <p>Special offers and discounts may be available during booking</p>
// // //               </div>
// // //             </CardContent>
// // //           </Card>

// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="flex items-center gap-2">
// // //                 <Users className="h-5 w-5" />
// // //                 Quick Stats
// // //               </CardTitle>
// // //             </CardHeader>
// // //             <CardContent>
// // //               <div className="space-y-2 text-sm">
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-600">Available Room Types:</span>
// // //                   <span className="font-medium">{isLoading ? "..." : availableRoomTypes}</span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-600">Total Rooms:</span>
// // //                   <span className="font-medium">{isLoading ? "..." : totalRooms}</span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-600">Starting From:</span>
// // //                   <span className="font-medium text-green-600">
// // //                     {isLoading ? "..." : startingPrice > 0 ? `฿${startingPrice}` : "N/A"}
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex justify-between">
// // //                   <span className="text-gray-600">Premium Rates:</span>
// // //                   <span className="font-medium text-blue-600">
// // //                     {isLoading ? "..." : premiumPrice > 0 ? `฿${premiumPrice}` : "N/A"}
// // //                   </span>
// // //                 </div>
// // //               </div>
// // //             </CardContent>
// // //           </Card>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default CreateBookingPage

// // "use client"

// // import type React from "react"
// // import { useState } from "react"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { CalendarDays, Users, Bed, CreditCard, Loader2, RefreshCw } from "lucide-react"
// // import BookingForm from "@/components/bookings/createbooking/booking-form"
// // import { useHotelContext } from "@/providers/hotel-provider"
// // import { useQuery } from "@apollo/client"
// // import { gql } from "@apollo/client"
// // import { Button } from "@/components/ui/button"

// // // Query to get individual rooms with latest pricing - EXACT same query as pricing page
// // const GET_ROOMS = gql`
// //   query GetRooms($hotelId: String!) {
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

// // interface RoomPricing {
// //   basePrice: number
// //   minPrice: number
// //   maxPrice: number
// //   availableRooms: number
// // }

// // const CreateBookingPage: React.FC = () => {
// //   const { selectedHotel } = useHotelContext()
// //   const [pricingSummary, setPricingSummary] = useState<Record<string, RoomPricing>>({})

// //   // Fetch the latest room data with pricing - CRITICAL: Use network-only
// //   const {
// //     data: roomsData,
// //     loading: roomsLoading,
// //     error: roomsError,
// //     refetch: refetchRooms,
// //   } = useQuery(GET_ROOMS, {
// //     variables: {
// //       hotelId: selectedHotel?.id || "",
// //     },
// //     skip: !selectedHotel?.id,
// //     // CRITICAL: Always fetch fresh data from backend
// //     fetchPolicy: "network-only",
// //     errorPolicy: "all",
// //     onCompleted: (data) => {
// //       console.log("✅ Rooms with latest pricing fetched successfully:", data)
// //       if (data.rooms) {
// //         processRoomPricing(data.rooms)
// //       }
// //     },
// //     onError: (error) => {
// //       console.error("❌ Error fetching rooms with pricing:", error)
// //     },
// //   })

// //   // CRITICAL: Process room data to extract EXACT backend pricing
// //   const processRoomPricing = (rooms: any[]) => {
// //     if (!rooms || rooms.length === 0) {
// //       setPricingSummary({})
// //       return
// //     }

// //     console.log("🔄 Processing room pricing from backend:", rooms)

// //     // Group rooms by type and get the LATEST pricing values
// //     const roomTypeGroups = rooms.reduce((acc: any, room: any) => {
// //       const roomType = room.roomType

// //       // Only include active rooms
// //       if (!room.isActive) return acc

// //       if (!acc[roomType]) {
// //         acc[roomType] = {
// //           rooms: [],
// //           totalRooms: 0,
// //           latestRoom: room, // Keep track of the most recently updated room
// //         }
// //       }

// //       acc[roomType].rooms.push(room)
// //       acc[roomType].totalRooms += 1

// //       // Keep the most recently updated room as the source of pricing
// //       if (new Date(room.updatedAt) > new Date(acc[roomType].latestRoom.updatedAt)) {
// //         acc[roomType].latestRoom = room
// //       }

// //       return acc
// //     }, {})

// //     // Calculate pricing summary for each room type using EXACT backend values
// //     const pricingMap: Record<string, RoomPricing> = {}

// //     Object.entries(roomTypeGroups).forEach(([typeName, data]: [string, any]) => {
// //       const latestRoom = data.latestRoom

// //       // CRITICAL: Use EXACT backend values - no calculations
// //       let basePrice = latestRoom.pricePerNight || 0
// //       let minPrice = latestRoom.pricePerNightMin || 0
// //       let maxPrice = latestRoom.pricePerNightMax || 0

// //       console.log(`📊 Room type ${typeName} - EXACT BACKEND VALUES:`, {
// //         basePrice,
// //         minPrice,
// //         maxPrice,
// //         totalRooms: data.totalRooms,
// //         latestRoomId: latestRoom.id,
// //         updatedAt: latestRoom.updatedAt,
// //         rawBackendValues: {
// //           pricePerNight: latestRoom.pricePerNight,
// //           pricePerNightMin: latestRoom.pricePerNightMin,
// //           pricePerNightMax: latestRoom.pricePerNightMax,
// //         },
// //       })

// //       // Only use defaults if ALL pricing values are 0 or null
// //       if (basePrice === 0 && minPrice === 0 && maxPrice === 0) {
// //         console.warn(`⚠️ No pricing data found in backend for ${typeName}, using defaults`)
// //         // Set default pricing based on room type
// //         if (typeName === "STANDARD") {
// //           basePrice = 500
// //           minPrice = 350
// //           maxPrice = 750
// //         } else if (typeName === "DELUXE") {
// //           basePrice = 800
// //           minPrice = 560
// //           maxPrice = 1200
// //         } else if (typeName === "SUITE") {
// //           basePrice = 2000
// //           minPrice = 1400
// //           maxPrice = 3000
// //         } else if (typeName === "EXECUTIVE") {
// //           basePrice = 1500
// //           minPrice = 1050
// //           maxPrice = 2250
// //         } else if (typeName === "PRESIDENTIAL") {
// //           basePrice = 5000
// //           minPrice = 3500
// //           maxPrice = 7500
// //         } else {
// //           basePrice = 1000
// //           minPrice = 700
// //           maxPrice = 1500
// //         }
// //       }

// //       pricingMap[typeName] = {
// //         basePrice: basePrice,
// //         minPrice: minPrice,
// //         maxPrice: maxPrice,
// //         availableRooms: data.totalRooms,
// //       }

// //       console.log(`✅ Final pricing for ${typeName}:`, pricingMap[typeName])
// //     })

// //     console.log("✅ Final pricing summary from EXACT backend data:", pricingMap)
// //     setPricingSummary(pricingMap)
// //   }

// //   // Calculate quick stats
// //   const roomTypes = Object.entries(pricingSummary)
// //   const availableRoomTypes = roomTypes.length
// //   const totalRooms = roomTypes.reduce((sum, [, pricing]) => sum + pricing.availableRooms, 0)
// //   const startingPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0
// //   const premiumPrice = roomTypes.length > 0 ? Math.max(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0

// //   const refetch = async () => {
// //     console.log("🔄 Manually refreshing room pricing data...")
// //     await refetchRooms()
// //   }

// //   const isLoading = roomsLoading
// //   const hasError = roomsError

// //   return (
// //     <div className="container mx-auto py-6 max-w-7xl">
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
// //           <p className="text-muted-foreground">Add a new reservation to the system</p>
// //           {selectedHotel && <p className="text-sm text-gray-500 mt-1">Hotel: {selectedHotel.name}</p>}
// //         </div>
// //         <div className="flex items-center gap-2">
// //           {hasError && <div className="text-red-600 text-sm">Error loading room data</div>}
// //           <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
// //             <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
// //             Refresh Data
// //           </Button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         {/* Main Booking Form */}
// //         <div className="lg:col-span-2">
// //           <BookingForm
// //             onSuccess={() => {
// //               console.log("Booking created successfully")
// //             }}
// //           />
// //         </div>

// //         {/* Pricing Summary Sidebar */}
// //         <div className="space-y-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center gap-2">
// //                 <CreditCard className="h-5 w-5" />
// //                 Current Room Rates
// //               </CardTitle>
// //               <CardDescription>
// //                 Latest pricing from backend database
// //                 {roomsData && roomsData.rooms && (
// //                   <span className="block text-xs text-green-600 mt-1">
// //                     ✅ Latest data from {roomsData.rooms.length} individual rooms
// //                   </span>
// //                 )}
// //                 {hasError && <span className="block text-xs text-red-600 mt-1">⚠️ Error loading data</span>}
// //               </CardDescription>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               {isLoading ? (
// //                 <div className="flex items-center justify-center py-8">
// //                   <div className="flex items-center space-x-2">
// //                     <Loader2 className="h-5 w-5 animate-spin" />
// //                     <span className="text-gray-500">Loading latest pricing information...</span>
// //                   </div>
// //                 </div>
// //               ) : roomTypes.length === 0 ? (
// //                 <div className="text-center py-8 text-gray-500">
// //                   <p className="text-sm">No room pricing available</p>
// //                   {hasError && <p className="text-xs text-red-500 mt-2">Error loading data from backend</p>}
// //                 </div>
// //               ) : (
// //                 roomTypes.map(([roomType, pricing]) => (
// //                   <div key={roomType} className="border rounded-lg p-3">
// //                     <div className="flex justify-between items-start mb-2">
// //                       <div>
// //                         <h4 className="font-medium">{roomType.charAt(0) + roomType.slice(1).toLowerCase()}</h4>
// //                         <Badge variant="outline" className="text-xs">
// //                           <Bed className="h-3 w-3 mr-1" />
// //                           {pricing.availableRooms > 0 ? `${pricing.availableRooms} available` : "Available"}
// //                         </Badge>
// //                       </div>
// //                       <div className="text-right">
// //                         <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
// //                         <div className="text-xs text-gray-500">per night</div>
// //                       </div>
// //                     </div>
// //                     <div className="text-xs text-gray-500">
// //                       Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
// //                     </div>
// //                     {pricing.basePrice === 0 && (
// //                       <div className="text-xs text-amber-600 mt-1">⚠ No pricing configured</div>
// //                     )}
// //                     <div className="text-xs text-green-600 mt-1">✅ Latest backend pricing</div>
// //                   </div>
// //                 ))
// //               )}
// //             </CardContent>
// //           </Card>

// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center gap-2">
// //                 <CalendarDays className="h-5 w-5" />
// //                 Booking Guidelines
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-3 text-sm">
// //               <div className="flex items-start gap-2">
// //                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
// //                 <p>Prices shown are latest rates from the backend database</p>
// //               </div>
// //               <div className="flex items-start gap-2">
// //                 <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
// //                 <p>Weekend rates and seasonal pricing may apply during booking</p>
// //               </div>
// //               <div className="flex items-start gap-2">
// //                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
// //                 <p>Final price will be calculated based on selected dates and occupancy</p>
// //               </div>
// //               <div className="flex items-start gap-2">
// //                 <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
// //                 <p>Special offers and discounts may be available during booking</p>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center gap-2">
// //                 <Users className="h-5 w-5" />
// //                 Quick Stats
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-2 text-sm">
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Available Room Types:</span>
// //                   <span className="font-medium">{isLoading ? "..." : availableRoomTypes}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Total Rooms:</span>
// //                   <span className="font-medium">{isLoading ? "..." : totalRooms}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Starting From:</span>
// //                   <span className="font-medium text-green-600">
// //                     {isLoading ? "..." : startingPrice > 0 ? `฿${startingPrice}` : "N/A"}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Premium Rates:</span>
// //                   <span className="font-medium text-blue-600">
// //                     {isLoading ? "..." : premiumPrice > 0 ? `฿${premiumPrice}` : "N/A"}
// //                   </span>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default CreateBookingPage


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CalendarDays, Users, Bed, CreditCard, Loader2, RefreshCw } from "lucide-react"
// import BookingForm from "@/components/bookings/createbooking/booking-form"
// import { useHotelContext } from "@/providers/hotel-provider"
// import { Button } from "@/components/ui/button"

// const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"]

// interface RoomPricing {
//   basePrice: number
//   minPrice: number
//   maxPrice: number
//   availableRooms: number
// }

// const CreateBookingPage: React.FC = () => {
//   const { selectedHotel } = useHotelContext()
//   const [pricingSummary, setPricingSummary] = useState<Record<string, RoomPricing>>({})
//   const [loadingPricing, setLoadingPricing] = useState(false)
//   const [hasError, setHasError] = useState(false)

//   // CRITICAL: Use the exact same fetch logic as UpdateRoomTypeForm
//   const fetchRoomTypeData = async (roomType: string) => {
//     try {
//       const resp = await fetch("http://localhost:8000/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           query: `
//             query getRoomType($hotelId: String!, $roomType: RoomType!) {
//               getRoomType(hotelId: $hotelId, roomType: $roomType) {
//                 pricePerNight
//                 pricePerNightMax
//                 pricePerNightMin
//                 baseOccupancy
//                 maxOccupancy
//                 extraBedAllowed
//                 extraBedPrice
//                 roomSize
//                 bedType
//                 bedCount
//                 description
//                 isSmoking
//               }
//             }
//           `,
//           variables: { hotelId: selectedHotel?.id, roomType },
//         }),
//       })

//       const { data } = await resp.json()
//       return data?.getRoomType || null
//     } catch (error) {
//       console.error(`Error fetching ${roomType}:`, error)
//       return null
//     }
//   }

//   // Load all room types data using the exact same logic
//   const loadAllRoomTypes = async () => {
//     if (!selectedHotel?.id) return

//     setLoadingPricing(true)
//     setHasError(false)
//     console.log("🔄 Loading all room types data for booking page...")

//     try {
//       const pricingMap: Record<string, RoomPricing> = {}

//       for (const roomType of ROOM_TYPES) {
//         const data = await fetchRoomTypeData(roomType)

//         if (data) {
//           console.log(`✅ Loaded ${roomType} for booking page:`, {
//             pricePerNight: data.pricePerNight,
//             pricePerNightMin: data.pricePerNightMin,
//             pricePerNightMax: data.pricePerNightMax,
//           })

//           pricingMap[roomType] = {
//             basePrice: data.pricePerNight || 0,
//             minPrice: data.pricePerNightMin || 0,
//             maxPrice: data.pricePerNightMax || 0,
//             availableRooms: 0,
//           }
//         } else {
//           // Room type doesn't exist, use defaults
//           const defaults = getRoomTypeDefaults(roomType)
//           pricingMap[roomType] = {
//             basePrice: defaults.basePrice,
//             minPrice: defaults.minPrice,
//             maxPrice: defaults.maxPrice,
//             availableRooms: 0,
//           }
//         }
//       }

//       console.log("✅ All room types loaded for booking page:", pricingMap)
//       setPricingSummary(pricingMap)
//     } catch (error) {
//       console.error("❌ Error loading room types for booking page:", error)
//       setHasError(true)
//     } finally {
//       setLoadingPricing(false)
//     }
//   }

//   // Load data when hotel changes
//   useEffect(() => {
//     if (selectedHotel?.id) {
//       loadAllRoomTypes()
//     }
//   }, [selectedHotel?.id])

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

//   const refetch = async () => {
//     console.log("🔄 Manually refreshing room pricing data...")
//     await loadAllRoomTypes()
//   }

//   // Calculate quick stats
//   const roomTypes = Object.entries(pricingSummary)
//   const availableRoomTypes = roomTypes.length
//   const totalRooms = roomTypes.reduce((sum, [, pricing]) => sum + pricing.availableRooms, 0)
//   const startingPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0
//   const premiumPrice = roomTypes.length > 0 ? Math.max(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0

//   return (
//     <div className="container mx-auto py-6 max-w-7xl">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
//           <p className="text-muted-foreground">Add a new reservation to the system</p>
//           {selectedHotel && <p className="text-sm text-gray-500 mt-1">Hotel: {selectedHotel.name}</p>}
//         </div>
//         <div className="flex items-center gap-2">
//           {hasError && <div className="text-red-600 text-sm">Error loading room data</div>}
//           <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loadingPricing}>
//             <RefreshCw className={`h-4 w-4 mr-2 ${loadingPricing ? "animate-spin" : ""}`} />
//             Refresh Data
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Booking Form */}
//         <div className="lg:col-span-2">
//           <BookingForm
//             onSuccess={() => {
//               console.log("Booking created successfully")
//             }}
//           />
//         </div>

//         {/* Pricing Summary Sidebar */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Current Room Rates
//               </CardTitle>
//               <CardDescription>
//                 Latest pricing using getRoomType query
//                 {roomTypes.length > 0 && (
//                   <span className="block text-xs text-green-600 mt-1">
//                     ✅ Latest data from {roomTypes.length} room types
//                   </span>
//                 )}
//                 {hasError && <span className="block text-xs text-red-600 mt-1">⚠️ Error loading data</span>}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {loadingPricing ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="flex items-center space-x-2">
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     <span className="text-gray-500">Loading latest pricing information...</span>
//                   </div>
//                 </div>
//               ) : roomTypes.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <p className="text-sm">No room pricing available</p>
//                   {hasError && <p className="text-xs text-red-500 mt-2">Error loading data from backend</p>}
//                 </div>
//               ) : (
//                 roomTypes.map(([roomType, pricing]) => (
//                   <div key={roomType} className="border rounded-lg p-3">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h4 className="font-medium">{roomType.charAt(0) + roomType.slice(1).toLowerCase()}</h4>
//                         <Badge variant="outline" className="text-xs">
//                           <Bed className="h-3 w-3 mr-1" />
//                           {pricing.availableRooms > 0 ? `${pricing.availableRooms} available` : "Available"}
//                         </Badge>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
//                         <div className="text-xs text-gray-500">per night</div>
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
//                     </div>
//                     {pricing.basePrice === 0 && (
//                       <div className="text-xs text-amber-600 mt-1">⚠ No pricing configured</div>
//                     )}
//                     <div className="text-xs text-green-600 mt-1">✅ getRoomType query</div>
//                   </div>
//                 ))
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CalendarDays className="h-5 w-5" />
//                 Booking Guidelines
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-start gap-2">
//                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
//                 <p>Prices shown are latest rates using getRoomType query (same as UpdateRoomTypeForm)</p>
//               </div>
//               <div className="flex items-start gap-2">
//                 <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
//                 <p>Weekend rates and seasonal pricing may apply during booking</p>
//               </div>
//               <div className="flex items-start gap-2">
//                 <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
//                 <p>Final price will be calculated based on selected dates and occupancy</p>
//               </div>
//               <div className="flex items-start gap-2">
//                 <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
//                 <p>Special offers and discounts may be available during booking</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="h-5 w-5" />
//                 Quick Stats
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Available Room Types:</span>
//                   <span className="font-medium">{loadingPricing ? "..." : availableRoomTypes}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Rooms:</span>
//                   <span className="font-medium">{loadingPricing ? "..." : totalRooms}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Starting From:</span>
//                   <span className="font-medium text-green-600">
//                     {loadingPricing ? "..." : startingPrice > 0 ? `฿${startingPrice}` : "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Premium Rates:</span>
//                   <span className="font-medium text-blue-600">
//                     {loadingPricing ? "..." : premiumPrice > 0 ? `฿${premiumPrice}` : "N/A"}
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CreateBookingPage


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Bed, CreditCard, Loader2, RefreshCw } from "lucide-react"
import BookingForm from "@/components/bookings/createbooking/booking-form"
import { useHotelContext } from "@/providers/hotel-provider"
import { Button } from "@/components/ui/button"

const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"]

interface RoomPricing {
  basePrice: number
  minPrice: number
  maxPrice: number
  availableRooms: number
}

const CreateBookingPage: React.FC = () => {
  const { selectedHotel } = useHotelContext()
  const [pricingSummary, setPricingSummary] = useState<Record<string, RoomPricing>>({})
  const [loadingPricing, setLoadingPricing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [fetchedRoomTypes,setFetchedRoomTypes] = useState<{value:string;label:string}[]>([])  
  const [roomType, setRoomType] = useState<string>();
  const [roomTypeMap, setRoomTypeMap] = useState<Record<string, any>>({})
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

  useEffect(() =>{
  
      const fetchRoomTypes = async () =>{
        if(!selectedHotel) return
  
        try{
          const resp = await fetch(endpoint,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
              query: `
                query getRoomTypes($hotelId: String!) {
                  getRoomTypes(hotelId: $hotelId) {
                    roomType
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
              variables:{hotelId:selectedHotel.id}    
            })
          })
  
          const json  = await resp.json();
          if(json.errors) throw new Error(json.errors[0].message);

          const details = json.data.getRoomTypes;
  
          const types = details.map((rt:any) =>({
            value:rt.roomType,
            label:rt.roomType.charAt(0).toUpperCase() + rt.roomType.slice(1).toLowerCase(),
          }))

          const map: Record<string, any> = {};
          for (const item of details) {
              map[item.roomType] = item;
           }
  
          setFetchedRoomTypes(types);
          setRoomTypeMap(map);

          if(types.length>0) setRoomType(types[0].value);
        }
        catch(err){
          console.error("Failed to fetch room Types:",err);
        }
      };
  
      fetchRoomTypes();
  
    },[selectedHotel])

  

  const loadAllRoomTypes = async () => {
    if (!selectedHotel?.id) return

    setLoadingPricing(true)
    setHasError(false)

    try {
      const pricingMap: Record<string, RoomPricing> = {}

      for (const roomType of Object.keys(roomTypeMap)) {
        const data = roomTypeMap[roomType];

        if (data) {
          pricingMap[roomType] = {
            basePrice: data.pricePerNight || 0,
            minPrice: data.pricePerNightMin || 0,
            maxPrice: data.pricePerNightMax || 0,
            availableRooms: 0,
          }
        } else {
          const defaults = getRoomTypeDefaults(roomType)
          pricingMap[roomType] = {
            basePrice: defaults.basePrice,
            minPrice: defaults.minPrice,
            maxPrice: defaults.maxPrice,
            availableRooms: 0,
          }
        }
      }

      setPricingSummary(pricingMap)
    } catch (error) {
      setHasError(true)
    } finally {
      setLoadingPricing(false)
    }
  }

  useEffect(() => {
    if (selectedHotel?.id) {
      loadAllRoomTypes()
    }
  }, [selectedHotel?.id])

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

  const refetch = async () => {
    await loadAllRoomTypes()
  }

  const roomTypes = Object.entries(pricingSummary)
  const availableRoomTypes = roomTypes.length
  const totalRooms = roomTypes.reduce((sum, [, pricing]) => sum + pricing.availableRooms, 0)
  const startingPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0
  const premiumPrice = roomTypes.length > 0 ? Math.max(...roomTypes.map(([, pricing]) => pricing.basePrice)) : 0

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Booking</h1>
          <p className="text-muted-foreground">Add a new reservation to the system</p>
          {selectedHotel && <p className="text-sm text-gray-500 mt-1">Hotel: {selectedHotel.name}</p>}
        </div>
        <div className="flex items-center gap-2">
          {hasError && <div className="text-red-600 text-sm">Error loading room data</div>}
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loadingPricing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingPricing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingForm
            onSuccess={() => {
              // Booking created successfully
            }}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Room Rates
              </CardTitle>
              <CardDescription>
                Latest pricing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingPricing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-gray-500">Loading pricing information...</span>
                  </div>
                </div>
              ) : roomTypes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No room pricing available</p>
                  {hasError && <p className="text-xs text-red-500 mt-2">Error loading data</p>}
                </div>
              ) : (
                roomTypes.map(([roomType, pricing]) => (
                  <div key={roomType} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{roomType.charAt(0) + roomType.slice(1).toLowerCase()}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Bed className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">฿{pricing.basePrice}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
                    </div>
                    {pricing.basePrice === 0 && (
                      <div className="text-xs text-amber-600 mt-1">No pricing configured</div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Booking Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <p>Prices shown are current rates for immediate booking</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <p>Weekend rates and seasonal pricing may apply during booking</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <p>Final price will be calculated based on selected dates and occupancy</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p>Special offers and discounts may be available during booking</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Room Types:</span>
                  <span className="font-medium">{loadingPricing ? "..." : availableRoomTypes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rooms:</span>
                  <span className="font-medium">{loadingPricing ? "..." : totalRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starting From:</span>
                  <span className="font-medium text-green-600">
                    {loadingPricing ? "..." : startingPrice > 0 ? `฿${startingPrice}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium Rates:</span>
                  <span className="font-medium text-blue-600">
                    {loadingPricing ? "..." : premiumPrice > 0 ? `฿${premiumPrice}` : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreateBookingPage