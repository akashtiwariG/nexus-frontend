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
import { AlertCircle, Loader2, Variable } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useHotelContext } from "@/providers/hotel-provider"


const roomTypes = [
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
  roomNumber: z.string().min(1, { message: "Room number is required" }),
  floor: z.coerce.number().int().min(0, { message: "Floor must be a positive number" }),
  roomType: z.string().min(1, { message: "Room type is required" }),
  
})

type FormValues = z.infer<typeof formSchema>

type CreateRoomFormProps = {
  onSuccess: () => void
}

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

export default function CreateRoomForm({ onSuccess }: CreateRoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedHotel } = useHotelContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hotelId: selectedHotel?.id || "", 
      roomNumber: "",
      floor: 1,
      roomType: "DELUXE",
    },
  })

  // Update hotelId when selectedHotel changes
  useEffect(() => {
    if (selectedHotel?.id) {
      form.setValue("hotelId", selectedHotel.id);
      console.log("Hotel ID updated to:", selectedHotel.id);
    }
  }, [selectedHotel, form]);

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
            mutation CreateRoom($roomData: RoomInput!) {
              createRoom(roomData: $roomData) {
                id
                roomNumber
                status
              }
            }
          `,
          variables: {
            roomData: submissionValues,  // Changed from 'input' to 'roomData'
          }
        })
      });
  
      const result = await response.json();
      console.log("GraphQL response:", result);
      
      if (result.errors) {
        throw new Error(result.errors[0].message || "Failed to create room");
      }
  
      onSuccess()
      form.reset({
        ...form.getValues(),
        hotelId: selectedHotel?.id || "",
        roomNumber: "",
      })
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

              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="301" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* The rest of your form fields remain the same */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypes.map((type) => (
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
            </div>

            

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}