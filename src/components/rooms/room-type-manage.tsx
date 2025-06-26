"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import CreateRoomTypeForm from "./create-room-type-form"
import { BedDouble, WashingMachineIcon as CleaningService, Wrench, Users, DollarSign } from "lucide-react"
import UpdateRoomTypeForm from "./update-room-type-form"


export default function RoomManagement() {
  const [activeTab, setActiveTab] = useState("create")
  const { toast } = useToast()

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Room Type Management</h1>
        <p className="text-muted-foreground mt-1">Create and manage  your Room Types</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="create" className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span className="hidden sm:inline">Create Room Type</span>
              </TabsTrigger>
              <TabsTrigger value="status" className="flex items-center gap-1">
                <CleaningService className="h-4 w-4" />
                <span className="hidden sm:inline">Update RoomType</span>
              </TabsTrigger>
             
            </TabsList>

            <TabsContent value="create">
              <CreateRoomTypeForm onSuccess={() => handleSuccess("Room Type created successfully")} />
            </TabsContent>

            <TabsContent value="status">
              <UpdateRoomTypeForm onSuccess={() => handleSuccess("Room Type updated successfully")} />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

