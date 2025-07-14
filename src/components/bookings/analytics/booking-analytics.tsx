// "use client"

// import { useState, useEffect } from "react"
// import { RefreshCw, HelpCircle, Calendar, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/components/ui/use-toast"
// import BookingCalendarGrid from "./booking-calendar-grid"
// import BookingTimeline from "./booking-timeline"
// import { useHotelContext } from "@/providers/hotel-provider"
// import { useSession } from "next-auth/react"
// import { BookingDetails } from "@/components/dashbaord/booking-details"

// export interface Guest {
//   firstName: string
//   lastName: string
//   email: string
//   phone?: string
// }

// export interface Payment {
//   amount: number
//   status: string
//   __typename: string
//   transactionId: string
//   transactionDate: string
// }

// export interface RoomCharge {
//   amount: number
//   chargeDate: string
//   chargeType: string
//   description: string
// }

// export interface RoomTypeBooking {
//   roomType: string
//   numberOfRooms: number
//   roomIds: string[]
// }

// export interface Booking {
//   id: string
//   bookingNumber: string
//   guest: Guest
//   checkInDate: string
//   checkOutDate: string
//   roomType: string
//   bookingStatus: string
//   paymentStatus: string
//   totalAmount: number
//   ratePlan?: string
//   payments?: Payment[]
//   taxAmount?: number
//   createdAt?: string
//   updatedAt?: string
//   createdBy?: string
//   updatedBy?: string
//   baseAmount?: number
//   roomCharges?: RoomCharge[]
//   specialRequests?: string
//   cancellationDate?: string
//   cancellationReason?: string
//   roomIds?: string[]
//   numberOfGuests: number
//   numberOfRooms?: number
//   roomNumber: string
//   floor: number
//   externalReference?: string
//   children?: number
//   pendingAmount?: number
//   notes?: string
//   roomTypeBookings?: RoomTypeBooking[]
// }

// export interface Room {
//   id: string
//   hotelId: string
//   roomNumber: string
//   roomType: string
//   bedType?: string
//   pricePerNight: number
//   status: string
//   amenities?: string[]
//   isActive: boolean
//   description?: string
//   createdAt?: string
//   updatedAt?: string
//   __typename?: string
//   lastCleaned?: string
//   maxOccupancy?: number
//   baseOccupancy?: number
//   extraBedPrice?: number
//   lastMaintained?: string
//   extraBedAllowed?: boolean
//   maintenanceNotes?: string
//   floor: number
//   roomSize?: number
//   isPinned?: boolean
//   images?: string[]
// }

// export default function BookingAnalytics() {
//   const [currentDate, setCurrentDate] = useState<Date>(new Date())
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [rooms, setRooms] = useState<Room[]>([])
//   const [roomDetails, setRoomDetails] = useState<Record<string, Room>>({})
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [showBookingDetails, setShowBookingDetails] = useState<boolean>(false)
//   const [viewMode, setViewMode] = useState<"timeline" | "occupancy">("timeline")

//   // Filter states
//   const [selectedFloor, setSelectedFloor] = useState<string>("all")
//   const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
//   const [selectedStatus, setSelectedStatus] = useState<string>("all")

//   // Access hotel context and session
//   const { selectedHotel } = useHotelContext()
//   const { data: session } = useSession()
//   const { toast } = useToast()

//   useEffect(() => {
//     if (selectedHotel?.id) {
//       fetchBookings()
//       fetchRooms()
//     }
//   }, [currentDate, selectedHotel])

//   // Fetch bookings using the correct GraphQL schema
//   const fetchBookings = async () => {
//     setIsLoading(true)

//     try {
//       console.log("Fetching bookings with hotel ID:", selectedHotel?.id)

//       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: `
//     query bookings($hotelId:String){
//         bookings(hotelId:$hotelId){
//           id
//           hotelId
//           bookingNumber
//           guest{
//             firstName
//             lastName
//             email
//           }
//           roomTypeBookings{
//             roomType
//             numberOfRooms
//             roomIds
//           }
//           checkInDate 
//           checkOutDate
//           bookingStatus
//           paymentStatus
//           totalAmount
//           numberOfGuests
//           createdAt
//         }
//     }
//   `,
//           variables: {
//             hotelId: `${selectedHotel?.id}`,
//             limit: 100,
//           },
//         }),
//       })

//       const result = await response.json()
//       console.log("API Response:", result)

//       if (result.errors) {
//         throw new Error(result.errors[0].message)
//       }

//       const allBookings = result.data?.bookings || []
//       console.log("Fetched bookings:", allBookings)

//       if (allBookings.length > 0) {
//         // Process bookings to include room information
//         const processedBookings = allBookings.map((booking: any) => {
//           // Extract room type from roomTypeBookings if available
//           let roomType = "Standard"
//           let roomIds: string[] = []

//           if (booking.roomTypeBookings && booking.roomTypeBookings.length > 0) {
//             roomType = booking.roomTypeBookings[0].roomType
//             roomIds = booking.roomTypeBookings.flatMap((rtb: any) => rtb.roomIds || [])
//           }

//           return {
//             ...booking,
//             roomNumber: "TBD", // We'll update this when rooms are fetched
//             floor: 1, // Default floor
//             paymentStatus: booking.paymentStatus || "PENDING",
//             totalAmount: booking.totalAmount || 0,
//             numberOfGuests: booking.numberOfGuests || 1,
//             roomType: roomType,
//             roomIds: roomIds,
//           } as Booking
//         })

//         console.log("Processed bookings:", processedBookings)
//         setBookings(processedBookings)

//         // Update room assignments after rooms are fetched
//         if (rooms.length > 0) {
//           updateBookingRoomAssignments(processedBookings)
//         }
//       } else {
//         console.log("No bookings found for hotel ID:", selectedHotel?.id)
//         setBookings([])
//       }
//     } catch (error: any) {
//       console.error("Error fetching bookings:", error)

//       toast({
//         title: "Error",
//         description: "Failed to fetch bookings from server.",
//         variant: "destructive",
//       })

//       setBookings([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchRooms = async () => {
//     try {
//       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: `
//   query {
//     rooms(
//       hotelId: "${selectedHotel?.id}"
      
//       
//     ) {
//       id
//       hotelId
//       roomNumber
//       roomType
//       bedType
//       pricePerNight
//       status
//       amenities
//       isActive
//       floor
//     }
//   }
// `,
//         }),
//       })

//       const result = await response.json()
//       console.log("Rooms API Response:", result)

//       if (result.data && result.data.rooms) {
//         const processedRooms = result.data.rooms.map((room: any) => ({
//           ...room,
//           floor: room.floor || 1,
//           maxOccupancy: room.maxOccupancy || 2,
//         }))

//         console.log("Fetched rooms:", processedRooms)
//         setRooms(processedRooms)

//         // Update booking room assignments
//         if (bookings.length > 0) {
//           updateBookingRoomAssignments(bookings, processedRooms)
//         }
//       } else {
//         console.error("Error fetching rooms: No data in response", result)
//         setRooms([])
//       }
//     } catch (error) {
//       console.error("Error fetching rooms:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch room information",
//         variant: "destructive",
//       })
//       setRooms([])
//     }
//   }

//   // Update booking room assignments based on fetched rooms
//   const updateBookingRoomAssignments = (bookingsList: Booking[], roomsList: Room[] = rooms) => {
//     const updatedBookings = bookingsList.map((booking) => {
//       if (booking.roomIds && booking.roomIds.length > 0) {
//         const matchedRooms = booking.roomIds
//           .map((id: string) => roomsList.find((r: any) => r.id === id))
//           .filter(Boolean)

//         if (matchedRooms.length > 0) {
//           return {
//             ...booking,
//             roomNumber: matchedRooms[0].roomNumber,
//             floor: matchedRooms[0].floor,
//           }
//         }
//       }
//       return booking
//     })

//     setBookings(updatedBookings)
//   }

//   const handleBookingClick = (booking: Booking) => {
//     console.log("Booking clicked:", booking)
//     setSelectedBooking(booking)
//     setShowBookingDetails(true)
//   }

//   const handleCloseDetails = () => {
//     setShowBookingDetails(false)
//     setSelectedBooking(null)
//   }

//   const handleRefresh = () => {
//     fetchBookings()
//     fetchRooms()
//   }

//   // Filter the bookings based on selected filters
//   const filteredBookings = bookings.filter((booking) => {
//     // Apply floor filter
//     if (selectedFloor !== "all") {
//       if (booking.floor?.toString() !== selectedFloor) return false
//     }

//     // Apply room type filter
//     if (selectedRoomType !== "all" && booking.roomType !== selectedRoomType) {
//       return false
//     }

//     // Apply status filter
//     if (selectedStatus !== "all" && booking.bookingStatus !== selectedStatus) {
//       return false
//     }

//     return true
//   })

//   // Generate floors list based on available rooms
//   const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)

//   // Generate room types list based on available rooms
//   const roomTypes = [...new Set(rooms.map((room) => room.roomType))]

//   console.log("Bookings:", bookings)
//   console.log("Filtered Bookings:", filteredBookings)
//   console.log("Rooms:", rooms)

//   return (
//     <div className="container mx-auto py-6 max-w-7xl">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
//           <div className="flex items-center border rounded-md p-1 ml-4">
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Calendar className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Filter className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//           </Button>
//           <Button variant="outline" size="icon">
//             <HelpCircle className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Show data status */}
//       <div className="mb-4 text-sm text-gray-600">
//         {isLoading && <p>Loading bookings and rooms...</p>}
//         {!isLoading && (
//           <p>
//             Found {bookings.length} bookings and {rooms.length} rooms
//             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
//           </p>
//         )}
//       </div>

//       <Card className="mb-8">
//         <CardContent className="p-0">
//           <div className="flex justify-between items-center p-4 border-b">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Floors</span>
//                 <Select value={selectedFloor} onValueChange={setSelectedFloor}>
//                   <SelectTrigger className="w-[120px]">
//                     <SelectValue placeholder="All Floors" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Floors</SelectItem>
//                     {floors.map((floor) => (
//                       <SelectItem key={floor} value={floor.toString()}>
//                         Floor {floor}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Room Type</span>
//                 <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Room Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Room Types</SelectItem>
//                     {roomTypes.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Booking Status</span>
//                 <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Statuses" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                     <SelectItem value="CHECKED_IN">Checked In</SelectItem>
//                     <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
//                     <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                     <SelectItem value="PENDING">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant={viewMode === "timeline" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("timeline")}
//               >
//                 Timeline
//               </Button>
//               <Button
//                 variant={viewMode === "occupancy" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("occupancy")}
//               >
//                 Occupancy
//               </Button>
//             </div>
//           </div>

//           {viewMode === "timeline" ? (
//             <BookingTimeline
//               bookings={filteredBookings}
//               rooms={rooms}
//               currentDate={currentDate}
//               isLoading={isLoading}
//               onBookingClick={handleBookingClick}
//               onDateChange={setCurrentDate}
//               onRefresh={handleRefresh}
//               daysToShow={7}
//             />
//           ) : (
//             <BookingCalendarGrid
//               bookings={filteredBookings}
//               currentDate={currentDate}
//               isLoading={isLoading}
//               onBookingClick={handleBookingClick}
//               onDateChange={setCurrentDate}
//               onRefresh={handleRefresh}
//               totalRooms={rooms.length || 20}
//               showOccupancyOnly={true}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {showBookingDetails && selectedBooking && (
//         <BookingDetails booking={selectedBooking.id} onBack={handleCloseDetails} />
//       )}
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { RefreshCw, HelpCircle, Calendar, Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import BookingTimeline from "./booking-timeline"
// import BookingCalendarGrid from "./booking-calendar-grid"
// import { BookingDetails } from "@/components/dashbaord/booking-details"
// // import BookingCalendarGrid from "./booking-calendar-grid"
// // import BookingTimeline from "./booking-timeline"
// // import { useHotelContext } from "@/providers/hotel-provider"
// // import { useSession } from "next-auth/react"
// // import { BookingDetails } from "@/components/dashbaord/booking-details"

// export interface Guest {
//   firstName: string
//   lastName: string
//   email: string
//   phone?: string
// }

// export interface Payment {
//   amount: number
//   status: string
//   __typename: string
//   transactionId: string
//   transactionDate: string
// }

// export interface RoomCharge {
//   amount: number
//   chargeDate: string
//   chargeType: string
//   description: string
// }

// export interface RoomTypeBooking {
//   roomType: string
//   numberOfRooms: number
//   roomIds: string[]
// }

// export interface Booking {
//   id: string
//   bookingNumber: string
//   guest: Guest
//   checkInDate: string
//   checkOutDate: string
//   roomType: string
//   bookingStatus: string
//   paymentStatus: string
//   totalAmount: number
//   ratePlan?: string
//   payments?: Payment[]
//   taxAmount?: number
//   createdAt?: string
//   updatedAt?: string
//   createdBy?: string
//   updatedBy?: string
//   baseAmount?: number
//   roomCharges?: RoomCharge[]
//   specialRequests?: string
//   cancellationDate?: string
//   cancellationReason?: string
//   roomIds?: string[]
//   numberOfGuests: number
//   numberOfRooms?: number
//   roomNumber: string
//   floor: number
//   externalReference?: string
//   children?: number
//   pendingAmount?: number
//   notes?: string
//   roomTypeBookings?: RoomTypeBooking[]
// }

// export interface Room {
//   id: string
//   hotelId: string
//   roomNumber: string
//   roomType: string
//   bedType?: string
//   pricePerNight: number
//   status: string
//   amenities?: string[]
//   isActive: boolean
//   description?: string
//   createdAt?: string
//   updatedAt?: string
//   __typename?: string
//   lastCleaned?: string
//   maxOccupancy?: number
//   baseOccupancy?: number
//   extraBedPrice?: number
//   lastMaintained?: string
//   extraBedAllowed?: boolean
//   maintenanceNotes?: string
//   floor: number
//   roomSize?: number
//   isPinned?: boolean
//   images?: string[]
// }

// export interface Hotel {
//   id: string
//   name: string
//   floorCount: number
// }

// export default function BookingAnalytics() {
//   const [currentDate, setCurrentDate] = useState<Date>(new Date())
//   const [bookings, setBookings] = useState<Booking[]>([])
//   const [rooms, setRooms] = useState<Room[]>([])
//   const [hotels, setHotels] = useState<Hotel[]>([])
//   const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [showBookingDetails, setShowBookingDetails] = useState<boolean>(false)
//   const [viewMode, setViewMode] = useState<"timeline" | "occupancy">("timeline")

//   // Filter states
//   const [selectedFloor, setSelectedFloor] = useState<string>("all")
//   const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
//   const [selectedStatus, setSelectedStatus] = useState<string>("all")

//   useEffect(() => {
//     // Load hotels first
//     fetchHotels()
//   }, [])

//   useEffect(() => {
//     if (selectedHotel?.id) {
//       fetchBookings()
//       fetchRooms()
//     }
//   }, [currentDate, selectedHotel])

//   // Fetch hotels from GraphQL
//   const fetchHotels = async () => {
//     try {
//       console.log("Fetching hotels...")

//       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: `
//             query GetHotels {
//               hotel {
//                 id
//                 name
//                 floorCount
//               }
//             }
//           `,
//         }),
//       })

//       const result = await response.json()
//       console.log("Hotels API Response:", result)

//       if (result.errors) {
//         console.error("GraphQL errors:", result.errors)
//         throw new Error(result.errors[0].message)
//       }

//       if (result.data?.hotel && result.data.hotel.length > 0) {
//         const hotelsList = result.data.hotel
//         setHotels(hotelsList)
//         // Auto-select first hotel
//         setSelectedHotel(hotelsList[0])
//         console.log("Fetched hotels:", hotelsList)
//       } else {
//         console.log("No hotels found, using mock data")
//         const mockHotel = {
//           id: "675a6b8b5c39c4b123456789",
//           name: "Demo Hotel",
//           floorCount: 3
//         }
//         setHotels([mockHotel])
//         setSelectedHotel(mockHotel)
//       }
//     } catch (error: any) {
//       console.error("Error fetching hotels:", error)
//       console.log("Falling back to mock hotel")
//       const mockHotel = {
//         id: "675a6b8b5c39c4b123456789",
//         name: "Demo Hotel",
//         floorCount: 3
//       }
//       setHotels([mockHotel])
//       setSelectedHotel(mockHotel)
//     }
//   }

//   // Fetch bookings using the correct GraphQL schema
//   const fetchBookings = async () => {
//     if (!selectedHotel?.id) return

//     setIsLoading(true)

//     try {
//       console.log("Fetching bookings with hotel ID:", selectedHotel.id)

//       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: `
//             query GetBookings($hotelId: String!) {
//               bookings(hotelId: $hotelId) {
//                 id
//                 hotelId
//                 bookingNumber
//                 guest {
//                   firstName
//                   lastName
//                   email
//                   phone
//                 }
//                 roomTypeBookings {
//                   roomType
//                   numberOfRooms
//                   roomIds
//                 }
//                 checkInDate 
//                 checkOutDate
//                 bookingStatus
//                 paymentStatus
//                 totalAmount
//                 numberOfGuests
//                 createdAt
//                 baseAmount
//                 taxAmount
//                 specialRequests
//               }
//             }
//           `,
//           variables: {
//             hotelId: selectedHotel.id,
//           },
//         }),
//       })

//       const result = await response.json()
//       console.log("Bookings API Response:", result)

//       if (result.errors) {
//         console.error("GraphQL errors:", result.errors)
//         throw new Error(result.errors[0].message)
//       }

//       if (result.data?.bookings) {
//         const allBookings = result.data.bookings
//         console.log("Fetched bookings:", allBookings)

//         // Process bookings to include room information
//         const processedBookings = allBookings.map((booking: any) => {
//           let roomType = "STANDARD"
//           let roomIds: string[] = []

//           if (booking.roomTypeBookings && booking.roomTypeBookings.length > 0) {
//             roomType = booking.roomTypeBookings[0].roomType
//             roomIds = booking.roomTypeBookings.flatMap((rtb: any) => rtb.roomIds || [])
//           }

//           return {
//             ...booking,
//             roomNumber: "TBD",
//             floor: 1,
//             paymentStatus: booking.paymentStatus || "PENDING",
//             totalAmount: booking.totalAmount || 0,
//             numberOfGuests: booking.numberOfGuests || 1,
//             roomType: roomType,
//             roomIds: roomIds,
//           } as Booking
//         })

//         setBookings(processedBookings)

//         // Update room assignments after rooms are fetched
//         if (rooms.length > 0) {
//           updateBookingRoomAssignments(processedBookings)
//         }
//       } else {
//         console.log("No bookings data in response")
//         setBookings([])
//       }
//     } catch (error: any) {
//       console.error("Error fetching bookings:", error)
//       setBookings([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchRooms = async () => {
//     if (!selectedHotel?.id) return

//     try {
//       const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: `
//             query GetRooms($hotelId: String!) {
//               rooms(hotelId: $hotelId) {
//                 id
//                 hotelId
//                 roomNumber
//                 roomType
//                 bedType
//                 pricePerNight
//                 status
//                 amenities
//                 isActive
//                 floor
//                 maxOccupancy
//                 baseOccupancy
//                 extraBedAllowed
//                 extraBedPrice
//                 roomSize
//                 description
//               }
//             }
//           `,
//           variables: {
//             hotelId: selectedHotel.id,
//           },
//         }),
//       })

//       const result = await response.json()
//       console.log("Rooms API Response:", result)

//       if (result.errors) {
//         console.error("GraphQL errors for rooms:", result.errors)
//         throw new Error(result.errors[0].message)
//       }

//       if (result.data?.rooms) {
//         const processedRooms = result.data.rooms.map((room: any) => ({
//           ...room,
//           floor: room.floor || 1,
//           maxOccupancy: room.maxOccupancy || 2,
//         }))

//         console.log("Fetched rooms:", processedRooms)
//         setRooms(processedRooms)

//         // Update booking room assignments
//         if (bookings.length > 0) {
//           updateBookingRoomAssignments(bookings, processedRooms)
//         }
//       } else {
//         console.log("No rooms data in response")
//         setRooms([])
//       }
//     } catch (error) {
//       console.error("Error fetching rooms:", error)
//       setRooms([])
//     }
//   }

//   // Update booking room assignments based on fetched rooms
//   const updateBookingRoomAssignments = (bookingsList: Booking[], roomsList: Room[] = rooms) => {
//     const updatedBookings = bookingsList.map((booking) => {
//       if (booking.roomIds && booking.roomIds.length > 0) {
//         const matchedRooms = booking.roomIds
//           .map((id: string) => roomsList.find((r: any) => r.id === id))
//           .filter(Boolean)

//         if (matchedRooms.length > 0) {
//           return {
//             ...booking,
//             roomNumber: matchedRooms[0].roomNumber,
//             floor: matchedRooms[0].floor,
//           }
//         }
//       }
//       return booking
//     })

//     setBookings(updatedBookings)
//   }

//   const handleBookingClick = (booking: Booking) => {
//     console.log("Booking clicked:", booking)
//     setSelectedBooking(booking)
//     setShowBookingDetails(true)
//   }

//   const handleCloseDetails = () => {
//     setShowBookingDetails(false)
//     setSelectedBooking(null)
//   }

//   const handleRefresh = () => {
//     fetchBookings()
//     fetchRooms()
//   }

//   const handleHotelChange = (hotelId: string) => {
//     const hotel = hotel.find(h => h.id === hotelId)
//     if (hotel) {
//       setSelectedHotel(hotel)
//     }
//   }

//   // Filter the bookings based on selected filters
//   const filteredBookings = bookings.filter((booking) => {
//     // Apply floor filter
//     if (selectedFloor !== "all") {
//       if (booking.floor?.toString() !== selectedFloor) return false
//     }

//     // Apply room type filter
//     if (selectedRoomType !== "all" && booking.roomType !== selectedRoomType) {
//       return false
//     }

//     // Apply status filter
//     if (selectedStatus !== "all" && booking.bookingStatus !== selectedStatus) {
//       return false
//     }

//     return true
//   })

//   // Generate floors list based on available rooms
//   const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)

//   // Generate room types list based on available rooms
//   const roomTypes = [...new Set(rooms.map((room) => room.roomType))]

//   console.log("Selected Hotel:", selectedHotel)
//   console.log("Bookings:", bookings)
//   console.log("Filtered Bookings:", filteredBookings)
//   console.log("Rooms:", rooms)

//   return (
//     <div className="container mx-auto py-6 max-w-7xl">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <h1 className="text-3xl font-bold tracking-tight">Bookings Analytics</h1>
//           <div className="flex items-center border rounded-md p-1 ml-4">
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Calendar className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="icon" className="h-8 w-8">
//               <Filter className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
//             <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//           </Button>
//           <Button variant="outline" size="icon">
//             <HelpCircle className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Hotel Selection */}
//       {hotels.length > 1 && (
//         <div className="mb-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium">Hotel:</span>
//             <Select value={selectedHotel?.id || ""} onValueChange={handleHotelChange}>
//               <SelectTrigger className="w-[200px]">
//                 <SelectValue placeholder="Select Hotel" />
//               </SelectTrigger>
//               <SelectContent>
//                 {hotel.map((hotel) => (
//                   <SelectItem key={hotel.id} value={hotel.id}>
//                     {hotel.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       )}

//       {/* Show data status */}
//       <div className="mb-4 text-sm text-gray-600">
//         {isLoading && <p>Loading bookings and rooms...</p>}
//         {!isLoading && (
//           <p>
//             Found {bookings.length} bookings and {rooms.length} rooms
//             {selectedHotel ? ` for ${selectedHotel.name}` : ""}
//           </p>
//         )}
//         {selectedHotel && (
//           <p className="text-xs text-gray-500">
//             Hotel ID: {selectedHotel.id} | Endpoint: {process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"}
//           </p>
//         )}
//       </div>

//       <Card className="mb-8">
//         <CardContent className="p-0">
//           <div className="flex justify-between items-center p-4 border-b">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Floors</span>
//                 <Select value={selectedFloor} onValueChange={setSelectedFloor}>
//                   <SelectTrigger className="w-[120px]">
//                     <SelectValue placeholder="All Floors" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Floors</SelectItem>
//                     {floors.map((floor) => (
//                       <SelectItem key={floor} value={floor.toString()}>
//                         Floor {floor}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Room Type</span>
//                 <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Room Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Room Types</SelectItem>
//                     {roomTypes.map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Booking Status</span>
//                 <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                   <SelectTrigger className="w-[150px]">
//                     <SelectValue placeholder="All Statuses" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Statuses</SelectItem>
//                     <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                     <SelectItem value="CHECKED_IN">Checked In</SelectItem>
//                     <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
//                     <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                     <SelectItem value="PENDING">Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant={viewMode === "timeline" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("timeline")}
//               >
//                 Timeline
//               </Button>
//               <Button
//                 variant={viewMode === "occupancy" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode("occupancy")}
//               >
//                 Occupancy
//               </Button>
//             </div>
//           </div>

//           {viewMode === "timeline" ? (
//             <BookingTimeline
//               bookings={filteredBookings}
//               rooms={rooms}
//               currentDate={currentDate}
//               isLoading={isLoading}
//               onBookingClick={handleBookingClick}
//               onDateChange={setCurrentDate}
//               onRefresh={handleRefresh}
//               daysToShow={7}
//             />
//           ) : (
//             <BookingCalendarGrid
//               bookings={filteredBookings}
//               currentDate={currentDate}
//               isLoading={isLoading}
//               onBookingClick={handleBookingClick}
//               onDateChange={setCurrentDate}
//               onRefresh={handleRefresh}
//               totalRooms={rooms.length || 20}
//               showOccupancyOnly={true}
//             />
//           )}
//         </CardContent>
//       </Card>

//       {showBookingDetails && selectedBooking && (
//         <BookingDetails booking={selectedBooking} onBack={handleCloseDetails} />
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { RefreshCw, HelpCircle, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import BookingCalendarGrid from "./booking-calendar-grid"
import BookingTimeline from "./booking-timeline"
import { useHotelContext } from "@/providers/hotel-provider"
import { useSession } from "next-auth/react"
import { BookingDetails } from "@/components/dashbaord/booking-details"

export interface Guest {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export interface Payment {
  amount: number
  status: string
  __typename: string
  transactionId: string
  transactionDate: string
}

export interface RoomCharge {
  amount: number
  chargeDate: string
  chargeType: string
  description: string
}

export interface RoomTypeBooking {
  roomType: string
  numberOfRooms: number
  roomIds: string[]
}

export interface Booking {
  id: string
  bookingNumber: string
  guest: Guest
  checkInDate: string
  checkOutDate: string
  roomType: string
  bookingStatus: string
  paymentStatus: string
  totalAmount: number
  ratePlan?: string
  payments?: Payment[]
  taxAmount?: number
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  baseAmount?: number
  roomCharges?: RoomCharge[]
  specialRequests?: string
  cancellationDate?: string
  cancellationReason?: string
  roomIds?: string[]
  numberOfGuests: number
  numberOfRooms?: number
  roomNumber: string
  floor: number
  externalReference?: string
  children?: number
  pendingAmount?: number
  notes?: string
  roomTypeBookings?: RoomTypeBooking[]
}

export interface Room {
  id: string
  hotelId: string
  roomNumber: string
  roomType: string
  bedType?: string
  pricePerNight: number
  status: string
  amenities?: string[]
  isActive: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
  __typename?: string
  lastCleaned?: string
  maxOccupancy?: number
  baseOccupancy?: number
  extraBedPrice?: number
  lastMaintained?: string
  extraBedAllowed?: boolean
  maintenanceNotes?: string
  floor: number
  roomSize?: number
  isPinned?: boolean
  images?: string[]
}
const backendBaseUrl = process.env.BACKEND_BASE_URL;

export default function BookingAnalytics() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomDetails, setRoomDetails] = useState<Record<string, Room>>({})
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showBookingDetails, setShowBookingDetails] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"timeline" | "occupancy">("timeline")

  // Filter states
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [selectedRoomType, setSelectedRoomType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Access hotel context and session
  const { selectedHotel } = useHotelContext()
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    if (selectedHotel?.id) {
      fetchBookings()
      fetchRooms()
    }
  }, [currentDate, selectedHotel])

  // Fetch bookings using the correct GraphQL schema
  const fetchBookings = async () => {
    setIsLoading(true)

    try {
      console.log("Fetching bookings with hotel ID:", selectedHotel?.id)

      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || `${backendBaseUrl}/graphql`

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
    query bookings($hotelId:String){
        bookings(hotelId:$hotelId){
          id
          hotelId
          bookingNumber
          guest{
            firstName
            lastName
            email
          }
          roomTypeBookings{
            roomType
            numberOfRooms
            roomIds
          }
          checkInDate 
          checkOutDate
          bookingStatus
          paymentStatus
          totalAmount
          numberOfGuests
          createdAt
        }
    }
  `,
          variables: {
            hotelId: `${selectedHotel?.id}`,
            limit: 100,
          },
        }),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      const allBookings = result.data?.bookings || []
      console.log("Fetched bookings:", allBookings)

      if (allBookings.length > 0) {
        // Process bookings to include room information
        const processedBookings = allBookings.map((booking: any) => {
          // Extract room type from roomTypeBookings if available
          let roomType = "Standard"
          let roomIds: string[] = []

          if (booking.roomTypeBookings && booking.roomTypeBookings.length > 0) {
            roomType = booking.roomTypeBookings[0].roomType
            roomIds = booking.roomTypeBookings.flatMap((rtb: any) => rtb.roomIds || [])
          }

          return {
            ...booking,
            roomNumber: "TBD", // We'll update this when rooms are fetched
            floor: 1, // Default floor
            paymentStatus: booking.paymentStatus || "PENDING",
            totalAmount: booking.totalAmount || 0,
            numberOfGuests: booking.numberOfGuests || 1,
            roomType: roomType,
            roomIds: roomIds,
          } as Booking
        })

        console.log("Processed bookings:", processedBookings)
        setBookings(processedBookings)

        // Update room assignments after rooms are fetched
        if (rooms.length > 0) {
          updateBookingRoomAssignments(processedBookings)
        }
      } else {
        console.log("No bookings found for hotel ID:", selectedHotel?.id)
        setBookings([])
      }
    } catch (error: any) {
      console.error("Error fetching bookings:", error)

      toast({
        title: "Error",
        description: "Failed to fetch bookings from server.",
        variant: "destructive",
      })

      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
  query {
    rooms(
      hotelId: "${selectedHotel?.id}"
    ) {
      id
      hotelId
      roomNumber
      roomType
      bedType
      pricePerNight
      status
      amenities
      isActive
      floor
    }
  }
`,
        }),
      })

      const result = await response.json()
      console.log("Rooms API Response:", result)

      if (result.data && result.data.rooms) {
        const processedRooms = result.data.rooms.map((room: any) => ({
          ...room,
          floor: room.floor || 1,
          maxOccupancy: room.maxOccupancy || 2,
        }))

        console.log("Fetched rooms:", processedRooms)
        setRooms(processedRooms)

        // Update booking room assignments
        if (bookings.length > 0) {
          updateBookingRoomAssignments(bookings, processedRooms)
        }
      } else {
        console.error("Error fetching rooms: No data in response", result)
        setRooms([])
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch room information",
        variant: "destructive",
      })
      setRooms([])
    }
  }

  // Update booking room assignments based on fetched rooms
  const updateBookingRoomAssignments = (bookingsList: Booking[], roomsList: Room[] = rooms) => {
    const updatedBookings = bookingsList.map((booking) => {
      if (booking.roomIds && booking.roomIds.length > 0) {
        const matchedRooms = booking.roomIds
          .map((id: string) => roomsList.find((r: any) => r.id === id))
          .filter(Boolean)

        if (matchedRooms.length > 0 && matchedRooms[0]) {
          return {
            ...booking,
            roomNumber: matchedRooms[0].roomNumber,
            floor: matchedRooms[0].floor,
          }
        }
      }
      return booking
    })

    setBookings(updatedBookings)
  }

  const handleBookingClick = (booking: Booking) => {
    console.log("Booking clicked:", booking)
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  const handleCloseDetails = () => {
    setShowBookingDetails(false)
    setSelectedBooking(null)
  }

  const handleRefresh = () => {
    fetchBookings()
    fetchRooms()
  }

  // Filter the bookings based on selected filters
  const filteredBookings = bookings.filter((booking) => {
    // Apply floor filter
    if (selectedFloor !== "all") {
      if (booking.floor?.toString() !== selectedFloor) return false
    }

    // Apply room type filter
    if (selectedRoomType !== "all" && booking.roomType !== selectedRoomType) {
      return false
    }

    // Apply status filter
    if (selectedStatus !== "all" && booking.bookingStatus !== selectedStatus) {
      return false
    }

    return true
  })

  // Generate floors list based on available rooms
  const floors = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)

  // Generate room types list based on available rooms
  const roomTypes = [...new Set(rooms.map((room) => room.roomType))]

  console.log("Bookings:", bookings)
  console.log("Filtered Bookings:", filteredBookings)
  console.log("Rooms:", rooms)

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <div className="flex items-center border rounded-md p-1 ml-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Show data status */}
      <div className="mb-4 text-sm text-gray-600">
        {isLoading && <p>Loading bookings and rooms...</p>}
        {!isLoading && (
          <p>
            Found {bookings.length} bookings and {rooms.length} rooms
            {selectedHotel ? ` for ${selectedHotel.name}` : ""}
          </p>
        )}
      </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Floors</span>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    {floors.map((floor) => (
                      <SelectItem key={floor} value={floor.toString()}>
                        Floor {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Room Type</span>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Room Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Room Types</SelectItem>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Booking Status</span>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                    <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "timeline" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "occupancy" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("occupancy")}
              >
                Occupancy
              </Button>
            </div>
          </div>

          {viewMode === "timeline" ? (
            <BookingTimeline
              bookings={filteredBookings}
              rooms={rooms}
              currentDate={currentDate}
              isLoading={isLoading}
              onBookingClick={handleBookingClick}
              onDateChange={setCurrentDate}
              onRefresh={handleRefresh}
              daysToShow={7}
            />
          ) : (
            <BookingCalendarGrid
              bookings={filteredBookings}
              currentDate={currentDate}
              isLoading={isLoading}
              onBookingClick={handleBookingClick}
              onDateChange={setCurrentDate}
              onRefresh={handleRefresh}
              totalRooms={rooms.length || 20}
              
            />
          )}
        </CardContent>
      </Card>

      {showBookingDetails && selectedBooking && (
        <BookingDetails booking={selectedBooking.id} onBack={handleCloseDetails} />
      )}
    </div>
  )
}