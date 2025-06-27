"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import BatchRoomCreator from "./batch-room-creator";

import { BedDouble } from "lucide-react";

export default function RoomManagement() {
  const [activeTab, setActiveTab] = useState("batch");
  const { toast } = useToast();

  const handleSuccess = (count: number) => {
    toast({
      title: "Success",
      description: `Created ${count} room(s) successfully.`,
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Room Management</h1>
        <p className="text-muted-foreground mt-1">Create multiple rooms at once</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="batch" className="flex items-center gap-1">
                <BedDouble className="h-4 w-4" />
                <span className="hidden sm:inline">Batch Create Rooms</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="batch">
              <BatchRoomCreator onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
