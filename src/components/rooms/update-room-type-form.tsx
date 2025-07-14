"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useHotelContext } from "@/providers/hotel-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const roomTypesList = [
  { value: "STANDARD", label: "Standard" },
  { value: "DELUXE", label: "Deluxe" },
  { value: "SUITE", label: "Suite" },
  { value: "EXECUTIVE", label: "Executive" },
  { value: "PRESIDENTIAL", label: "Presidential" }
];



const bedTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "TWIN", label: "Twin" },
  { value: "DOUBLE", label: "Double" },
  { value: "QUEEN", label: "Queen" },
  { value: "KING", label: "King" },
  { value: "CALIFORNIA_KING", label: "California King" },
]

const formSchema = z.object({
  pricePerNight: z.coerce.number().nonnegative(),
  pricePerNightMax: z.coerce.number().nonnegative(),
  pricePerNightMin: z.coerce.number().nonnegative(),
  baseOccupancy: z.coerce.number().int().nonnegative(),
  maxOccupancy: z.coerce.number().int().nonnegative(),
  extraBedAllowed: z.boolean(),
  extraBedPrice: z.coerce.number().nonnegative().optional(),
  roomSize: z.coerce.number().nonnegative(),
  bedType: z.string(),
  bedCount: z.coerce.number().int().nonnegative(),
  description: z.string().optional(),
  isSmoking: z.boolean()
});


type FormValues = z.infer<typeof formSchema>;

type Props = {
  onSuccess: () => void;
};

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8000/graphql"

export default function UpdateRoomTypeForm({ onSuccess }: Props) {
  const { selectedHotel } = useHotelContext();
  const hotelId = selectedHotel?.id!;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pricePerNight: 0,
      pricePerNightMax: 0,
      pricePerNightMin: 0,
      baseOccupancy: 1,
      maxOccupancy: 1,
      extraBedAllowed: false,
      extraBedPrice: undefined,
      roomSize: 0,
      bedType: "",
      bedCount: 1,
      description: "",
      isSmoking: false
    }
  });

  const [roomType, setRoomType] = useState<string>("STANDARD");
  const [loading, setLoading] = useState(false);
  const [fetchedRoomTypes,setFetchedRoomTypes] = useState<{value:string;label:string}[]>([])   


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

  // Fetch and prefill form when roomType changes
  useEffect(() => {
    async function load() {
      setLoading(true);
      const resp = await fetch(endpoint, {
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
          variables: { hotelId, roomType }
        })
      });
      const { data } = await resp.json();
      if (data?.getRoomType) {
        form.reset(data.getRoomType);
      } else {
        form.reset(form.getValues()); // keep defaults
      }
      setLoading(false);
    }
    if (hotelId && roomType) load();
  }, [hotelId, roomType, form]);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const resp = await fetch(endpoint, {
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
              }
            }
          `,
          variables: {
            hotelId,
            roomType,
            updateData: values
          }
        })
      });
      const { errors } = await resp.json();
      if (errors?.length) throw new Error(errors[0].message);
      onSuccess();
    } catch (e) {
      console.error("Update error:", e);
      alert("Failed to update room type");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel>Hotel</FormLabel>
            <Input value={hotelId} readOnly />
          </div>
          <div>
            <FormLabel>Room Type</FormLabel>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fetchedRoomTypes.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <FormField
          name="pricePerNight"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Night</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="pricePerNightMax"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Night Max</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="pricePerNightMin"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Night Min</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  
        
        <FormField
          name="baseOccupancy"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Occupancy</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="maxOccupancy"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Occupancy</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
  name="bedType"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Bed Type</FormLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a bed type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {bedTypes.map((bed) => (
            <SelectItem key={bed.value} value={bed.value}>
              {bed.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

        
        <FormField
          name="extraBedPrice"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Bed Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="roomSize"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Size</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        <FormField
          name="bedCount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed Count</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
      </div>
    </FormItem>
  )}
/>

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
        
        {/* Repeat similar <FormField> for all other schema fields */}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Room Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
