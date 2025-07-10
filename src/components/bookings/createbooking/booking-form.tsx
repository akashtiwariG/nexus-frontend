
// "use client"

// import { useMutation } from "@apollo/client"
// import { CREATE_BOOKING } from "@/graphql/booking/mutations"
// import { useForm, useFieldArray, useWatch } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent } from "@/components/ui/card"
// import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
// import { format, addDays } from "date-fns"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/components/ui/use-toast"
// import { useState, useEffect } from "react"
// import { useHotelContext } from "@/providers/hotel-provider"
// import { RefreshCw } from "lucide-react"

// // Room types from backend enum
// const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"] as const

// const bookingSourceOptions = [
//   { value: "WEBSITE", label: "Website" },
//   { value: "WALK_IN", label: "Walk-in" },
//   { value: "PHONE", label: "Phone" },
//   { value: "DIRECT", label: "Direct" },
//   { value: "OTA", label: "Online Travel Agency" },
//   { value: "CORPORATE", label: "Corporate" },
// ]

// const bookingSchema = z.object({
//   checkInDate: z.date({ required_error: "Check-in date is required" }),
//   checkOutDate: z.date({ required_error: "Check-out date is required" }),
//   numberOfGuests: z.coerce.number().int().min(1, { message: "At least 1 guest is required" }),
//   bookingSource: z.enum(["DIRECT", "WEBSITE", "OTA", "PHONE", "WALK_IN", "CORPORATE"], {
//     required_error: "Booking source is required",
//   }),
//   specialRequests: z.string().optional(),
//   guest: z.object({
//     firstName: z.string().min(1, { message: "First name is required" }),
//     lastName: z.string().min(1, { message: "Last name is required" }),
//     email: z.string().email({ message: "Invalid email address" }),
//     phone: z.string().min(5, { message: "Phone number is required" }),
//   }),
//   roomTypeBookings: z
//     .array(
//       z.object({
//         roomType: z.enum(ROOM_TYPES, { required_error: "Room type is required" }),
//         numberOfRooms: z.coerce.number().int().min(1, { message: "At least 1 room is required" }),
//       }),
//     )
//     .min(1, { message: "At least one room type must be selected" }),
// })

// type BookingFormValues = z.infer<typeof bookingSchema>

// interface BookingFormProps {
//   onSuccess?: () => void
// }

// export default function BookingForm({ onSuccess }: BookingFormProps) {
//   const [createBooking, { loading }] = useMutation(CREATE_BOOKING)
//   const { toast } = useToast()
//   const today = new Date()

//   // Pricing data state
//   const [pricingData, setPricingData] = useState<
//     Record<string, { basePrice: number; minPrice: number; maxPrice: number; availableRooms: number }>
//   >({})
//   const [loadingPricing, setLoadingPricing] = useState(false)

//   // Access hotel context
//   const { selectedHotel } = useHotelContext()

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
//     console.log("🔄 Loading all room types data for booking form...")

//     try {
//       const pricingMap: Record<
//         string,
//         { basePrice: number; minPrice: number; maxPrice: number; availableRooms: number }
//       > = {}

//       for (const roomType of ROOM_TYPES) {
//         const data = await fetchRoomTypeData(roomType)

//         if (data) {
//           console.log(`✅ Loaded ${roomType} for booking:`, {
//             pricePerNight: data.pricePerNight,
//             pricePerNightMin: data.pricePerNightMin,
//             pricePerNightMax: data.pricePerNightMax,
//           })

//           pricingMap[roomType] = {
//             basePrice: data.pricePerNight || 0,
//             minPrice: data.pricePerNightMin || 0,
//             maxPrice: data.pricePerNightMax || 0,
//             availableRooms: 0, // We can get this from rooms query if needed
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

//       console.log("✅ All room types loaded for booking:", pricingMap)
//       setPricingData(pricingMap)

//       toast({
//         title: "Room Data Loaded ✅",
//         description: `Found ${Object.keys(pricingMap).length} room types with latest pricing from backend database`,
//       })
//     } catch (error) {
//       console.error("❌ Error loading room types for booking:", error)
//       setDefaultPricing()
//       toast({
//         title: "Warning",
//         description: "Could not load room data from backend. Using default prices.",
//         variant: "destructive",
//       })
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

//   // Set default pricing when room data is not available
//   const setDefaultPricing = () => {
//     const defaultPricing = {
//       STANDARD: { basePrice: 500, minPrice: 350, maxPrice: 750, availableRooms: 0 },
//       DELUXE: { basePrice: 800, minPrice: 560, maxPrice: 1200, availableRooms: 0 },
//       SUITE: { basePrice: 2000, minPrice: 1400, maxPrice: 3000, availableRooms: 0 },
//       EXECUTIVE: { basePrice: 1500, minPrice: 1050, maxPrice: 2250, availableRooms: 0 },
//       PRESIDENTIAL: { basePrice: 5000, minPrice: 3500, maxPrice: 7500, availableRooms: 0 },
//     }
//     setPricingData(defaultPricing)
//   }

//   const form = useForm<BookingFormValues>({
//     resolver: zodResolver(bookingSchema),
//     defaultValues: {
//       checkInDate: today,
//       checkOutDate: addDays(today, 1),
//       numberOfGuests: 2,
//       bookingSource: "WALK_IN",
//       guest: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//       },
//       roomTypeBookings: [{ roomType: "STANDARD", numberOfRooms: 1 }],
//     },
//   })

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = form

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "roomTypeBookings",
//   })

//   const watchRoomTypeBookings = useWatch({
//     control,
//     name: "roomTypeBookings",
//   })

//   const onSubmit = async (data: BookingFormValues) => {
//     if (!selectedHotel?.id) {
//       toast({
//         title: "Error",
//         description: "No hotel selected",
//         variant: "destructive",
//       })
//       return
//     }

//     const bookingData = {
//       ...data,
//       hotelId: selectedHotel.id,
//       // Convert dates to ISO string format for GraphQL
//       checkInDate: data.checkInDate.toISOString().split("T")[0], // YYYY-MM-DD format
//       checkOutDate: data.checkOutDate.toISOString().split("T")[0], // YYYY-MM-DD format
//       ratePlan: null,
//     }

//     console.log("Creating booking with data:", bookingData)

//     try {
//       const result = await createBooking({
//         variables: {
//           bookingData,
//         },
//       })

//       console.log("Booking creation result:", result)

//       // Check for GraphQL errors first
//       if (result.errors && result.errors.length > 0) {
//         const errorMessage = result.errors[0].message || "Unknown GraphQL error occurred"
//         toast({
//           title: "GraphQL Error",
//           description: errorMessage,
//           variant: "destructive",
//         })
//         return
//       }

//       // Check if we have data
//       if (!result.data || !result.data.createBooking) {
//         toast({
//           title: "Error",
//           description: "Booking creation failed. Please try again.",
//           variant: "destructive",
//         })
//         return
//       }

//       // Success
//       const booking = result.data.createBooking

//       if (booking.bookingNumber) {
//         toast({
//           title: "Booking Created Successfully! 🎉",
//           description: `Booking Number: ${booking.bookingNumber}`,
//         })
//       } else if (booking.id) {
//         toast({
//           title: "Booking Created Successfully! 🎉",
//           description: `Booking ID: ${booking.id}`,
//         })
//       } else {
//         toast({
//           title: "Booking Created",
//           description: "Booking was created successfully.",
//         })
//       }

//       // Reset form and call success callback
//       reset()
//       if (onSuccess) {
//         onSuccess()
//       }
//     } catch (error: any) {
//       console.error("Booking creation error:", error)

//       // Enhanced error handling
//       let errorMessage = "An unexpected error occurred while creating the booking."
//       let errorTitle = "Booking Creation Failed"

//       if (error.graphQLErrors && error.graphQLErrors.length > 0) {
//         const graphQLError = error.graphQLErrors[0].message

//         // Handle specific business logic errors
//         if (graphQLError.includes("Inventory not configured")) {
//           errorTitle = "Room Not Available"
//           errorMessage =
//             "The selected room type is not available for the chosen dates. Please try a different room type or date."
//         } else if (graphQLError.includes("insufficient inventory")) {
//           errorTitle = "Not Enough Rooms Available"
//           errorMessage =
//             "There aren't enough rooms of the selected type available. Please reduce the number of rooms or choose different dates."
//         } else if (graphQLError.includes("invalid date")) {
//           errorTitle = "Invalid Date Selection"
//           errorMessage = "The selected dates are not valid for booking. Please choose different dates."
//         } else {
//           errorMessage = `Error: ${graphQLError}`
//         }
//       } else if (error.networkError) {
//         if (error.networkError.statusCode === 400) {
//           errorTitle = "Invalid Booking Details"
//           errorMessage = "Please check your booking details and try again."
//         } else if (error.networkError.statusCode === 401) {
//           errorTitle = "Authentication Required"
//           errorMessage = "Please log in and try again."
//         } else if (error.networkError.statusCode === 500) {
//           errorTitle = "Server Error"
//           errorMessage = "Our servers are experiencing issues. Please try again later."
//         } else {
//           errorMessage = `Network Error: ${error.networkError.message}`
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       toast({
//         title: errorTitle,
//         description: errorMessage,
//         variant: "destructive",
//       })
//     }
//   }

//   const refetch = async () => {
//     console.log("🔄 Manually refreshing room pricing data...")
//     await loadAllRoomTypes()
//     toast({
//       title: "Data Refreshed",
//       description: "Room pricing data has been reloaded from the backend.",
//     })
//   }

//   const isLoading = loadingPricing
//   const hasError = Object.keys(pricingData).length === 0 && !isLoading

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="flex items-center space-x-2">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           <span>Loading latest pricing information from backend...</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         {/* Data Status Indicator */}
//         <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-blue-900">
//                 {hasError ? "⚠️ Using Default Pricing" : "✅ Latest Pricing Data"}
//               </p>
//               <p className="text-xs text-blue-700">
//                 {hasError
//                   ? "Could not connect to backend. Using fallback prices."
//                   : `Loaded latest pricing for ${Object.keys(pricingData).length} room types using getRoomType query`}
//               </p>
//             </div>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
//               <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
//               Refresh
//             </Button>
//           </div>
//         </div>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="mb-4 pb-4 border-b">
//               <h3 className="text-lg font-medium">Guest Information</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="guest.firstName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>First Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="John" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="guest.lastName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Last Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Doe" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="guest.email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="john.doe@example.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="guest.phone"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone</FormLabel>
//                     <FormControl>
//                       <Input placeholder="+1 (555) 123-4567" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="mb-4 pb-4 border-b">
//               <h3 className="text-lg font-medium">Stay Details</h3>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="checkInDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Check-in Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                           >
//                             {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           disabled={(date) => date < today}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="checkOutDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Check-out Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                           >
//                             {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           disabled={(date) => {
//                             const checkInDate = form.getValues("checkInDate")
//                             return date <= checkInDate
//                           }}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="numberOfGuests"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Number of Guests</FormLabel>
//                     <FormControl>
//                       <Input type="number" min="1" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="bookingSource"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Booking Source</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select booking source" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {bookingSourceOptions.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="mb-4 pb-4 border-b flex justify-between items-center">
//               <h3 className="text-lg font-medium">Room Selection</h3>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
//               >
//                 <Plus className="h-4 w-4 mr-2" /> Add Room Type
//               </Button>
//             </div>

//             {fields.map((field, index) => {
//               return (
//                 <div key={field.id} className="mb-4 p-4 border rounded-md">
//                   <div className="flex justify-between items-center mb-4">
//                     <h4 className="font-medium">Room Type {index + 1}</h4>
//                     {fields.length > 1 && (
//                       <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`roomTypeBookings.${index}.roomType`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Room Type</FormLabel>
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select room type" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {ROOM_TYPES.map((type) => {
//                                 const typePricing = pricingData[type]
//                                 return (
//                                   <SelectItem key={type} value={type}>
//                                     <div className="flex flex-col">
//                                       <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
//                                       {typePricing && typePricing.basePrice > 0 && (
//                                         <div className="text-xs text-gray-500">
//                                           ฿{typePricing.basePrice} (฿{typePricing.minPrice} - ฿{typePricing.maxPrice})
//                                           {typePricing.availableRooms > 0 &&
//                                             ` • ${typePricing.availableRooms} available`}
//                                         </div>
//                                       )}
//                                     </div>
//                                   </SelectItem>
//                                 )
//                               })}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`roomTypeBookings.${index}.numberOfRooms`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Number of Rooms</FormLabel>
//                           <FormControl>
//                             <Input type="number" min="1" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   {/* Pricing Display */}
//                   {(() => {
//                     const currentRoomType = watchRoomTypeBookings?.[index]?.roomType ?? ""
//                     const pricing = pricingData[currentRoomType]
//                     const numberOfRooms = watchRoomTypeBookings?.[index]?.numberOfRooms || 1

//                     if (!pricing || pricing.basePrice === 0) return null

//                     return (
//                       <div className="mt-4 p-3 bg-gray-50 rounded-md">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <div className="text-lg font-semibold text-green-600">
//                               ฿{pricing.basePrice}
//                               <span className="text-sm font-normal text-gray-500 ml-1">per night</span>
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
//                             </div>
//                             {pricing.availableRooms > 0 && (
//                               <div className="text-xs text-blue-600 mt-1">{pricing.availableRooms} rooms available</div>
//                             )}
//                             <div className="text-xs text-green-600 mt-1">✅ Latest backend pricing (getRoomType)</div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-sm text-gray-600">{numberOfRooms} room(s)</div>
//                             <div className="text-lg font-semibold">฿{pricing.basePrice * numberOfRooms}</div>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })()}
//                 </div>
//               )
//             })}

//             {fields.length === 0 && (
//               <div className="text-center py-4">
//                 <p className="text-muted-foreground">No room types added</p>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   className="mt-2 bg-transparent"
//                   onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Add Room Type
//                 </Button>
//               </div>
//             )}
//             {/* Booking Total Summary */}
//             {(() => {
//               const totalAmount =
//                 watchRoomTypeBookings?.reduce((total, booking) => {
//                   const pricing = pricingData[booking.roomType]
//                   if (!pricing) return total
//                   return total + pricing.basePrice * (booking.numberOfRooms || 1)
//                 }, 0) || 0

//               const totalRooms =
//                 watchRoomTypeBookings?.reduce((total, booking) => {
//                   return total + (booking.numberOfRooms || 1)
//                 }, 0) || 0

//               if (totalAmount === 0) return null

//               return (
//                 <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h4 className="font-medium text-gray-900">Booking Summary</h4>
//                       <p className="text-sm text-gray-600">Total for {totalRooms} room(s) per night</p>
//                       <p className="text-xs text-blue-600 mt-1">
//                         {hasError ? "⚠️ Using default pricing" : "✅ Latest backend pricing (getRoomType)"}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-blue-600">฿{totalAmount}</div>
//                       <div className="text-xs text-gray-500">per night</div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })()}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-6">
//             <div className="mb-4 pb-4 border-b">
//               <h3 className="text-lg font-medium">Special Requests</h3>
//             </div>

//             <FormField
//               control={form.control}
//               name="specialRequests"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Any special requests or requirements..."
//                       className="min-h-[100px]"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>Optional: Add any special requests for the stay</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         <div className="mt-6 pt-6 flex justify-end">
//           <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating Booking...
//               </>
//             ) : (
//               "Create Booking"
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }


"use client"

import { useMutation } from "@apollo/client"
import { CREATE_BOOKING } from "@/graphql/booking/mutations"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { format, addDays } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useHotelContext } from "@/providers/hotel-provider"

const ROOM_TYPES = ["STANDARD", "DELUXE", "SUITE", "EXECUTIVE", "PRESIDENTIAL"] as const

const bookingSourceOptions = [
  { value: "WEBSITE", label: "Website" },
  { value: "WALK_IN", label: "Walk-in" },
  { value: "PHONE", label: "Phone" },
  { value: "DIRECT", label: "Direct" },
  { value: "OTA", label: "Online Travel Agency" },
  { value: "CORPORATE", label: "Corporate" },
]

const bookingSchema = z.object({
  checkInDate: z.date({ required_error: "Check-in date is required" }),
  checkOutDate: z.date({ required_error: "Check-out date is required" }),
  numberOfGuests: z.coerce.number().int().min(1, { message: "At least 1 guest is required" }),
  bookingSource: z.enum(["DIRECT", "WEBSITE", "OTA", "PHONE", "WALK_IN", "CORPORATE"], {
    required_error: "Booking source is required",
  }),
  specialRequests: z.string().optional(),
  guest: z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(5, { message: "Phone number is required" }),
  }),
  roomTypeBookings: z
    .array(
      z.object({
        roomType: z.string( { required_error: "Room type is required" }),
        numberOfRooms: z.coerce.number().int().min(1, { message: "At least 1 room is required" }),
      }),
    )
    .min(1, { message: "At least one room type must be selected" }),
})

type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingFormProps {
  onSuccess?: () => void
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [createBooking, { loading }] = useMutation(CREATE_BOOKING)
  const { toast } = useToast()
  const today = new Date()

  const [pricingData, setPricingData] = useState<
    Record<string, { basePrice: number; minPrice: number; maxPrice: number; availableRooms: number }>
  >({})
  
  

  const [loadingPricing, setLoadingPricing] = useState(false)

  const { selectedHotel } = useHotelContext()
  const [fetchedRoomTypes,setFetchedRoomTypes] = useState<{value:string;label:string}[]>([])  
  const [roomType, setRoomType] = useState<string>();
  const [roomTypeMap, setRoomTypeMap] = useState<Record<string, any>>({})


  useEffect(() =>{
  
      const fetchRoomTypes = async () =>{
        if(!selectedHotel) return
  
        try{
          const resp = await fetch("http://localhost:8000/graphql",{
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

    try {
      const pricingMap: Record<
        string,
        { basePrice: number; minPrice: number; maxPrice: number; availableRooms: number }
      > = {}
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

      setPricingData(pricingMap)
      console.log(pricingMap)
      console.log(pricingData)
    } catch (error) {
      setDefaultPricing()
      toast({
        title: "Warning",
        description: "Could not load room data. Using default prices.",
        variant: "destructive",
      })
    } finally {
      setLoadingPricing(false)
    }
  }

  useEffect(() => {
    if (selectedHotel) {
      loadAllRoomTypes()
    }
  }, [selectedHotel,roomTypeMap])

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

  const setDefaultPricing = () => {
    const defaultPricing = {
      STANDARD: { basePrice: 500, minPrice: 350, maxPrice: 750, availableRooms: 0 },
      DELUXE: { basePrice: 800, minPrice: 560, maxPrice: 1200, availableRooms: 0 },
      SUITE: { basePrice: 2000, minPrice: 1400, maxPrice: 3000, availableRooms: 0 },
      EXECUTIVE: { basePrice: 1500, minPrice: 1050, maxPrice: 2250, availableRooms: 0 },
      PRESIDENTIAL: { basePrice: 5000, minPrice: 3500, maxPrice: 7500, availableRooms: 0 },
    }
    setPricingData(defaultPricing)
  }

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkInDate: today,
      checkOutDate: addDays(today, 1),
      numberOfGuests: 2,
      bookingSource: "WALK_IN",
      guest: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      roomTypeBookings: [{ roomType: "STANDARD", numberOfRooms: 1 }],
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roomTypeBookings",
  })

  const watchRoomTypeBookings = useWatch({
    control,
    name: "roomTypeBookings",
  })

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedHotel?.id) {
      toast({
        title: "Error",
        description: "No hotel selected",
        variant: "destructive",
      })
      return
    }

    const bookingData = {
      ...data,
      hotelId: selectedHotel.id,
      checkInDate: data.checkInDate.toISOString().split("T")[0],
      checkOutDate: data.checkOutDate.toISOString().split("T")[0],
      ratePlan: null,
    }

    try {
      const result = await createBooking({
        variables: {
          bookingData,
        },
      })

      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors[0].message || "Unknown error occurred"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      if (!result.data || !result.data.createBooking) {
        toast({
          title: "Error",
          description: "Booking creation failed. Please try again.",
          variant: "destructive",
        })
        return
      }

      const booking = result.data.createBooking

      if (booking.bookingNumber) {
        toast({
          title: "Booking Created Successfully! 🎉",
          description: `Booking Number: ${booking.bookingNumber}`,
        })
      } else if (booking.id) {
        toast({
          title: "Booking Created Successfully! 🎉",
          description: `Booking ID: ${booking.id}`,
        })
      } else {
        toast({
          title: "Booking Created",
          description: "Booking was created successfully.",
        })
      }

      reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred while creating the booking."
      let errorTitle = "Booking Creation Failed"

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0].message

        if (graphQLError.includes("Inventory not configured")) {
          errorTitle = "Room Not Available"
          errorMessage =
            "The selected room type is not available for the chosen dates. Please try a different room type or date."
        } else if (graphQLError.includes("insufficient inventory")) {
          errorTitle = "Not Enough Rooms Available"
          errorMessage =
            "There aren't enough rooms of the selected type available. Please reduce the number of rooms or choose different dates."
        } else if (graphQLError.includes("invalid date")) {
          errorTitle = "Invalid Date Selection"
          errorMessage = "The selected dates are not valid for booking. Please choose different dates."
        } else {
          errorMessage = `Error: ${graphQLError}`
        }
      } else if (error.networkError) {
        if (error.networkError.statusCode === 400) {
          errorTitle = "Invalid Booking Details"
          errorMessage = "Please check your booking details and try again."
        } else if (error.networkError.statusCode === 401) {
          errorTitle = "Authentication Required"
          errorMessage = "Please log in and try again."
        } else if (error.networkError.statusCode === 500) {
          errorTitle = "Server Error"
          errorMessage = "Our servers are experiencing issues. Please try again later."
        } else {
          errorMessage = `Network Error: ${error.networkError.message}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const isLoading = loadingPricing

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading room information...</span>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Guest Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="guest.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Stay Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < today}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const checkInDate = form.getValues("checkInDate")
                            return date <= checkInDate
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select booking source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookingSourceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Room Selection</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Room Type
              </Button>
            </div>

            {fields.map((field, index) => {
              return (
                <div key={field.id} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Room Type {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`roomTypeBookings.${index}.roomType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fetchedRoomTypes.map((type) => {
                                const typePricing = pricingData[type.value]
                                return (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex flex-col">
                                      <span>{type.value.charAt(0) + type.value.slice(1).toLowerCase()}</span>
                                      {typePricing && typePricing.basePrice > 0 && (
                                        <div className="text-xs text-gray-500">
                                          ฿{typePricing.basePrice} (฿{typePricing.minPrice} - ฿{typePricing.maxPrice})
                                        </div>
                                      )}
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`roomTypeBookings.${index}.numberOfRooms`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Rooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {(() => {
                    const currentRoomType = watchRoomTypeBookings?.[index]?.roomType ?? ""
                    const pricing = pricingData[currentRoomType]
                    const numberOfRooms = watchRoomTypeBookings?.[index]?.numberOfRooms || 1

                    if (!pricing || pricing.basePrice === 0) return null

                    return (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-lg font-semibold text-green-600">
                              ฿{pricing.basePrice}
                              <span className="text-sm font-normal text-gray-500 ml-1">per night</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Range: ฿{pricing.minPrice} - ฿{pricing.maxPrice}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">{numberOfRooms} room(s)</div>
                            <div className="text-lg font-semibold">฿{pricing.basePrice * numberOfRooms}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )
            })}

            {fields.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No room types added</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={() => append({ roomType: "STANDARD", numberOfRooms: 1 })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Room Type
                </Button>
              </div>
            )}

            {(() => {
              const totalAmount =
                watchRoomTypeBookings?.reduce((total, booking) => {
                  const pricing = pricingData[booking.roomType]
                  if (!pricing) return total
                  return total + pricing.basePrice * (booking.numberOfRooms || 1)
                }, 0) || 0

              const totalRooms =
                watchRoomTypeBookings?.reduce((total, booking) => {
                  return total + (booking.numberOfRooms || 1)
                }, 0) || 0

              if (totalAmount === 0) return null

              return (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Booking Summary</h4>
                      <p className="text-sm text-gray-600">Total for {totalRooms} room(s) per night</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">฿{totalAmount}</div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">Special Requests</h3>
            </div>

            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or requirements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional: Add any special requests for the stay</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="mt-6 pt-6 flex justify-end">
          <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              "Create Booking"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}