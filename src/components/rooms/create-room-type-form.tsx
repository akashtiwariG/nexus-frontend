// "use client"

// import { useState, useEffect } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Card, CardContent } from "@/components/ui/card"
// import { AlertCircle, Loader2, Variable } from "lucide-react"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useHotelContext } from "@/providers/hotel-provider"


// const roomTypes = [
//   { value: "STANDARD", label: "Standard" },
//   { value: "DELUXE", label: "Deluxe" },
//   { value: "SUITE", label: "Suite" },
//   { value: "EXECUTIVE", label: "Executive" },
//   { value: "PRESIDENTIAL", label: "Presidential" },
// ]

// const bedTypes = [
//   { value: "SINGLE", label: "Single" },
//   { value: "TWIN", label: "Twin" },
//   { value: "DOUBLE", label: "Double" },
//   { value: "QUEEN", label: "Queen" },
//   { value: "KING", label: "King" },
//   { value: "CALIFORNIA_KING", label: "California King" },
// ]

// const amenitiesOptions = [
//   { id: "WIFI", label: "WiFi" },
//   { id: "TV", label: "TV" },
//   { id: "AIR_CONDITIONING", label: "Air Conditioning" },
//   { id: "MINIBAR", label: "Minibar" },
//   { id: "SAFE", label: "Safe" },
//   { id: "OCEAN_VIEW", label: "Ocean View" },
//   { id: "CITY_VIEW", label: "City View" },
//   { id: "BALCONY", label: "Balcony" },
//   { id: "BATHTUB", label: "Bathtub" },
//   { id: "SHOWER", label: "Shower" },
//   { id: "COFFEE_MAKER", label: "Coffee Maker" },
//   { id: "DESK", label: "Desk" },
// ]

// const formSchema = z.object({
//     hotelId: z.string().min(1, { message: "Hotel ID is required" }),
//     roomType: z.string().min(1, { message: "Room type is required" }),
//     pricePerNight: z.coerce.number().positive({ message: "Price must be a positive number" }),
//     pricePerNightMax: z.coerce.number().positive({ message: "Price Max must be a positive number" }),
//     pricePerNightMin: z.coerce.number().positive({ message: "Price Min must be a positive number" }),
//     baseOccupancy: z.coerce.number().int().min(1, { message: "Base occupancy must be at least 1" }),
//     maxOccupancy: z.coerce.number().int().min(1, { message: "Max occupancy must be at least 1" }),
//     extraBedAllowed: z.boolean().default(false),
//     extraBedPrice: z.coerce.number().nonnegative({ message: "Extra bed price must be a non-negative number" }),
//     roomSize: z.coerce.number().positive({ message: "Room size must be a positive number" }),
//     bedType: z.string().min(1, { message: "Bed type is required" }),
//     bedCount: z.coerce.number().int().min(1, { message: "Bed count must be at least 1" }),
//     amenities: z.array(z.string()).min(1, { message: "Select at least one amenity" }),
//     description: z.string().min(10, { message: "Description must be at least 10 characters" }),
//     isSmoking: z.boolean().default(false),
// })

// type FormValues = z.infer<typeof formSchema>

// type CreateRoomTypeFormProps = {
//   onSuccess: () => void
// }

// export default function CreateRoomTypeForm({ onSuccess }: CreateRoomTypeFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const { selectedHotel } = useHotelContext();

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       hotelId: selectedHotel?.id || "", 
//       roomType: "DELUXE",
//       pricePerNight: 200,
//       pricePerNightMax: 400,
//       pricePerNightMin: 100,
//       baseOccupancy: 2,
//       maxOccupancy: 2,
//       extraBedAllowed: false,
//       extraBedPrice: 0,
//       roomSize: 30,
//       bedType: "KING",
//       bedCount: 1,
//       amenities: ["WIFI"],
//       description: "",
//       isSmoking: false,
//     },
//   })

//   // Update hotelId when selectedHotel changes
//   useEffect(() => {
//     if (selectedHotel?.id) {
//       form.setValue("hotelId", selectedHotel.id);
//       console.log("Hotel ID updated to:", selectedHotel.id);
//     }
//   }, [selectedHotel, form]);

//   async function onSubmit(values: FormValues) {
//     setIsSubmitting(true)
//     setError(null)
  
//     try {
//       // Ensure we're using the latest hotel ID
//       const submissionValues = {
//         ...values,
//         hotelId: selectedHotel?.id || values.hotelId
//       };
      
//       console.log("Submitting form with hotel ID:", submissionValues.hotelId);
      
//       const response = await fetch("http://localhost:8000/graphql", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: `
//             mutation CreateRoomType($roomTypeData: RoomTypeInput!) {
//               createRoomType(roomTypeData: $roomTypeData) {
//                 id
//                 roomType
//                 hotelId
//               }
//             }
//           `,
//           variables: {
//             roomTypeData: submissionValues,  // Changed from 'input' to 'roomData'
//           }
//         })
//       });
  
//       const result = await response.json();
//       console.log("GraphQL response:", result);
      
//       if (result.errors) {
//         throw new Error(result.errors[0].message || "Failed to create room");
//       }
  
//     } catch (err) {
//       setError("Failed to create room. Please try again.")
//       console.error(err)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <Card>
//           <CardContent className="pt-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <FormField
//                 control={form.control}
//                 name="hotelId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Hotel ID</FormLabel>
//                     <FormControl>
//                       <Input {...field} readOnly />
//                     </FormControl>
//                     <FormDescription>
//                       This is automatically set based on the selected hotel
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

              
//             </div>

//             {/* The rest of your form fields remain the same */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <FormField
//                 control={form.control}
//                 name="roomType"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Room Type</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select room type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {roomTypes.map((type) => (
//                           <SelectItem key={type.value} value={type.value}>
//                             {type.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="pricePerNight"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price Per Night ($)</FormLabel>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.01" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="pricePerNightMax"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price Per Night Max($)</FormLabel>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.01" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="pricePerNightMin"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price Per Night Min($)</FormLabel>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.01" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="roomSize"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Room Size (m²)</FormLabel>
//                     <FormControl>
//                       <Input type="number" min="0" step="0.1" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                           <FormField
//                             control={form.control}
//                             name="baseOccupancy"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Base Occupancy</FormLabel>
//                                 <FormControl>
//                                   <Input type="number" min="1" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
            
//                           <FormField
//                             control={form.control}
//                             name="maxOccupancy"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Max Occupancy</FormLabel>
//                                 <FormControl>
//                                   <Input type="number" min="1" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
            
//                           <div className="space-y-4">
//                             <FormField
//                               control={form.control}
//                               name="extraBedAllowed"
//                               render={({ field }) => (
//                                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                                   <FormControl>
//                                     <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                                   </FormControl>
//                                   <div className="space-y-1 leading-none">
//                                     <FormLabel>Extra Bed Allowed</FormLabel>
//                                     <FormDescription>Allow an extra bed in this room</FormDescription>
//                                   </div>
//                                 </FormItem>
//                               )}
//                             />
            
//                             {form.watch("extraBedAllowed") && (
//                               <FormField
//                                 control={form.control}
//                                 name="extraBedPrice"
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel>Extra Bed Price ($)</FormLabel>
//                                     <FormControl>
//                                       <Input type="number" min="0" step="0.01" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             )}
//                           </div>
//                         </div>
            
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <FormField
//                             control={form.control}
//                             name="bedType"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Bed Type</FormLabel>
//                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                   <FormControl>
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select bed type" />
//                                     </SelectTrigger>
//                                   </FormControl>
//                                   <SelectContent>
//                                     {bedTypes.map((type) => (
//                                       <SelectItem key={type.value} value={type.value}>
//                                         {type.label}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
            
//                           <FormField
//                             control={form.control}
//                             name="bedCount"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Bed Count</FormLabel>
//                                 <FormControl>
//                                   <Input type="number" min="1" {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>
            
//                         <FormField
//                           control={form.control}
//                           name="description"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Description</FormLabel>
//                               <FormControl>
//                                 <Textarea placeholder="Luxury room with ocean view..." className="min-h-[100px]" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
            
//                         <FormField
//                           control={form.control}
//                           name="isSmoking"
//                           render={({ field }) => (
//                             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                               <FormControl>
//                                 <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                               </FormControl>
//                               <div className="space-y-1 leading-none">
//                                 <FormLabel>Smoking Allowed</FormLabel>
//                                 <FormDescription>Allow smoking in this room</FormDescription>
//                               </div>
//                             </FormItem>
//                           )}
//                         />
            
//                         <FormField
//                           control={form.control}
//                           name="amenities"
//                           render={() => (
//                             <FormItem>
//                               <div className="mb-4">
//                                 <FormLabel className="text-base">Room Amenities</FormLabel>
//                                 <FormDescription>Select all amenities available in this room</FormDescription>
//                               </div>
//                               <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//                                 {amenitiesOptions.map((amenity) => (
//                                   <FormField
//                                     key={amenity.id}
//                                     control={form.control}
//                                     name="amenities"
//                                     render={({ field }) => {
//                                       return (
//                                         <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
//                                           <FormControl>
//                                             <Checkbox
//                                               checked={field.value?.includes(amenity.id)}
//                                               onCheckedChange={(checked: boolean) => {
//                                                 return checked
//                                                   ? field.onChange([...field.value, amenity.id])
//                                                   : field.onChange(field.value?.filter((value: string) => value !== amenity.id))
//                                               }}
//                                             />
//                                           </FormControl>
//                                           <FormLabel className="font-normal">{amenity.label}</FormLabel>
//                                         </FormItem>
//                                       )
//                                     }}
//                                   />
//                                 ))}
//                               </div>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//             <div className="flex justify-end">
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Room...
//                   </>
//                 ) : (
//                   "Create Room Type"
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </Form>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2, Plus, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useHotelContext } from "@/providers/hotel-provider"

const defaultRoomTypes = [
  { value: "STANDARD", label: "Standard" },
  { value: "DELUXE", label: "Deluxe" },
  { value: "SUITE", label: "Suite" },
  { value: "EXECUTIVE", label: "Executive" },
  { value: "PRESIDENTIAL", label: "Presidential" },
]

const bedTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "TWIN", label: "Twin" },
  { value: "DOUBLE", label: "Double" },
  { value: "QUEEN", label: "Queen" },
  { value: "KING", label: "King" },
  { value: "CALIFORNIA_KING", label: "California King" },
]

const amenitiesOptions = [
  { id: "WIFI", label: "WiFi" },
  { id: "TV", label: "TV" },
  { id: "AIR_CONDITIONING", label: "Air Conditioning" },
  { id: "MINIBAR", label: "Minibar" },
  { id: "SAFE", label: "Safe" },
  { id: "OCEAN_VIEW", label: "Ocean View" },
  { id: "CITY_VIEW", label: "City View" },
  { id: "BALCONY", label: "Balcony" },
  { id: "BATHTUB", label: "Bathtub" },
  { id: "SHOWER", label: "Shower" },
  { id: "COFFEE_MAKER", label: "Coffee Maker" },
  { id: "DESK", label: "Desk" },
]

const formSchema = z.object({
    hotelId: z.string().min(1, { message: "Hotel ID is required" }),
    roomType: z.string().min(1, { message: "Room type is required" }),
    pricePerNight: z.coerce.number().positive({ message: "Price must be a positive number" }),
    pricePerNightMax: z.coerce.number().positive({ message: "Price Max must be a positive number" }),
    pricePerNightMin: z.coerce.number().positive({ message: "Price Min must be a positive number" }),
    baseOccupancy: z.coerce.number().int().min(1, { message: "Base occupancy must be at least 1" }),
    maxOccupancy: z.coerce.number().int().min(1, { message: "Max occupancy must be at least 1" }),
    extraBedAllowed: z.boolean().default(false),
    extraBedPrice: z.coerce.number().nonnegative({ message: "Extra bed price must be a non-negative number" }),
    roomSize: z.coerce.number().positive({ message: "Room size must be a positive number" }),
    bedType: z.string().min(1, { message: "Bed type is required" }),
    bedCount: z.coerce.number().int().min(1, { message: "Bed count must be at least 1" }),
    amenities: z.array(z.string()).min(1, { message: "Select at least one amenity" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    isSmoking: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

type CreateRoomTypeFormProps = {
  onSuccess: () => void
}
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

export default function CreateRoomTypeForm({ onSuccess }: CreateRoomTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customRoomTypes, setCustomRoomTypes] = useState<Array<{ value: string; label: string }>>([])
  const [showCustomRoomTypeInput, setShowCustomRoomTypeInput] = useState(false)
  const [customRoomTypeName, setCustomRoomTypeName] = useState("")
  const { selectedHotel } = useHotelContext();
  const [fetchedRoomTypes,setFetchedRoomTypes] = useState<{value:string;label:string}[]>([])  
  const [roomType, setRoomType] = useState<string>(defaultRoomTypes[0].value);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelId: selectedHotel?.id || "", 
      roomType: "DELUXE",
      pricePerNight: 200,
      pricePerNightMax: 400,
      pricePerNightMin: 100,
      baseOccupancy: 2,
      maxOccupancy: 2,
      extraBedAllowed: false,
      extraBedPrice: 0,
      roomSize: 30,
      bedType: "KING",
      bedCount: 1,
      amenities: ["WIFI"],
      description: "",
      isSmoking: false,
    },
  })

  // Update hotelId when selectedHotel changes
  useEffect(() => {
    if (selectedHotel?.id) {
      form.setValue("hotelId", selectedHotel.id);
      console.log("Hotel ID updated to:", selectedHotel.id);
    }
  }, [selectedHotel, form]);

  useEffect(() =>{

    const fetchRoomTypes = async () =>{
      if(!selectedHotel) return

      try{
        const resp = await fetch(endpoint,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            query: `
              query getAllRoomTypes($hotelId: String!) {
                getRoomTypes(hotelId: $hotelId) {
                  roomType
                }
              }
            `,
            variables:{hotelId:selectedHotel.id}    
          })
        })

        const json  = await resp.json();
        if(json.errors) throw new Error(json.errors[0].message);

        const types = json.data.getRoomTypes.map((rt:any) =>({
          value:rt.roomType,
          label:rt.roomType.charAt(0).toUpperCase() + rt.roomType.slice(1).toLowerCase(),
        }))

        setFetchedRoomTypes(types);
        if(types.length>0) setRoomType(types[0].value);
      }
      catch(err){
        console.error("Failed to fetch room Types:",err);
      }
    };

    fetchRoomTypes();

  },[selectedHotel])

  // Get all room types (default + custom)
  const allRoomTypes = [...fetchedRoomTypes, ...customRoomTypes,]

  const handleAddCustomRoomType = () => {
    if (customRoomTypeName.trim()) {
      const customValue = customRoomTypeName.trim().toUpperCase().replace(/\s+/g, '_')
      const newCustomType = {
        value: customValue,
        label: customRoomTypeName.trim()
      }
      
      // Check if this custom type already exists
      if (!allRoomTypes.some(type => type.value === customValue)) {
        setCustomRoomTypes(prev => [...prev, newCustomType])
        form.setValue("roomType", customValue)
        setCustomRoomTypeName("")
        setShowCustomRoomTypeInput(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCustomRoomType()
    }
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)
  
    try {
      // Ensure we're using the latest hotel ID
      const submissionValues = {
        ...values,
        hotelId: selectedHotel?.id || values.hotelId
      };
      
      console.log("Submitting form with hotel ID:", submissionValues.hotelId);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateRoomType($roomTypeData: RoomTypeInput!) {
              createRoomType(roomTypeData: $roomTypeData) {
                id
                roomType
                hotelId
              }
            }
          `,
          variables: {
            roomTypeData: submissionValues,
          }
        })
      });
  
      const result = await response.json();
      console.log("GraphQL response:", result);
      
      if (result.errors) {
        throw new Error(result.errors[0].message || "Failed to create room");
      }
  
      onSuccess();
    } catch (err) {
      setError("Failed to create room. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="hotelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormDescription>
                      This is automatically set based on the selected hotel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="roomType"
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
                          <div className="p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-8 px-2 text-sm"
                              onClick={() => setShowCustomRoomTypeInput(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Custom Room Type
                            </Button>
                          </div>
                          {allRoomTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                          <div className="p-2 border-t">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-8 px-2 text-sm"
                              onClick={() => setShowCustomRoomTypeInput(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Custom Room Type
                              <Check className="h-4 w-4 ml-auto" />
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {showCustomRoomTypeInput && (
                <div className="md:col-span-2">
                  <FormItem>
                    <FormLabel>Custom Room Type Name</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Penthouse, Villa, Studio..."
                        value={customRoomTypeName}
                        onChange={(e) => setCustomRoomTypeName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddCustomRoomType}
                        disabled={!customRoomTypeName.trim()}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCustomRoomTypeInput(false)
                          setCustomRoomTypeName("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <FormDescription>
                      Enter a unique name for your custom room type
                    </FormDescription>
                  </FormItem>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Night ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerNightMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Night Max($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerNightMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Night Min($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="roomSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Size (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="baseOccupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Occupancy</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxOccupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Occupancy</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="extraBedAllowed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Extra Bed Allowed</FormLabel>
                        <FormDescription>Allow an extra bed in this room</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("extraBedAllowed") && (
                  <FormField
                    control={form.control}
                    name="extraBedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Bed Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bed type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bedTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Luxury room with ocean view..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSmoking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Smoking Allowed</FormLabel>
                    <FormDescription>Allow smoking in this room</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Room Amenities</FormLabel>
                    <FormDescription>Select all amenities available in this room</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {amenitiesOptions.map((amenity) => (
                      <FormField
                        key={amenity.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          return (
                            <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(amenity.id)}
                                  onCheckedChange={(checked: boolean) => {
                                    return checked
                                      ? field.onChange([...field.value, amenity.id])
                                      : field.onChange(field.value?.filter((value: string) => value !== amenity.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{amenity.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room Type"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}