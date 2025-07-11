// // // // // "use client"

// // // // // import { Skeleton } from "@/components/ui/skeleton"
// // // // // import {
// // // // //   LineChart,
// // // // //   Line,
// // // // //   BarChart,
// // // // //   Bar,
// // // // //   PieChart,
// // // // //   Pie,
// // // // //   Cell,
// // // // //   XAxis,
// // // // //   YAxis,
// // // // //   CartesianGrid,
// // // // //   Tooltip,
// // // // //   Legend,
// // // // //   ResponsiveContainer,
// // // // // } from "recharts"

// // // // // interface ChartDataItem {
// // // // //   name: string
// // // // //   value: number
// // // // // }

// // // // // interface TrendDataItem {
// // // // //   date: string
// // // // //   revenue: number
// // // // // }

// // // // // type ChartData = ChartDataItem[] | TrendDataItem[] | any[]

// // // // // interface FinancialAnalyticsProps {
// // // // //   data: ChartData
// // // // //   isLoading: boolean
// // // // //   chartType?: "line" | "bar" | "pie"
// // // // // }

// // // // // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

// // // // // export default function FinancialAnalytics({ data, isLoading, chartType = "line" }: FinancialAnalyticsProps) {
// // // // //   if (isLoading) {
// // // // //     return <Skeleton className="w-full h-full" />
// // // // //   }

// // // // //   // Check for empty data
// // // // //   if (!data || data.length === 0) {
// // // // //     return (
// // // // //       <div className="flex items-center justify-center h-full w-full">
// // // // //         <p className="text-muted-foreground">No financial data available for the selected period</p>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   // In your room-analytics.tsx or financial-analytics.tsx file where pie charts are rendered

// // // // // if (chartType === "pie") {
// // // // //   return (
// // // // //     <ResponsiveContainer width="100%" height="100%">
// // // // //       <PieChart>
// // // // //         <Pie
// // // // //           data={data as ChartDataItem[]}
// // // // //           cx="50%"
// // // // //           cy="50%"
// // // // //           labelLine={false} // Remove the label lines
// // // // //           outerRadius={80}
// // // // //           fill="#8884d8"
// // // // //           dataKey="value"
// // // // //           // Custom label positioning to prevent overlap
// // // // //           label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
// // // // //             // Only show label if percent is greater than 5%
// // // // //             if (percent < 0.05) return null;
            
// // // // //             const RADIAN = Math.PI / 180;
// // // // //             // Positioning the label further from the pie
// // // // //             const radius = outerRadius * 1.2;
// // // // //             const x = cx + radius * Math.cos(-midAngle * RADIAN);
// // // // //             const y = cy + radius * Math.sin(-midAngle * RADIAN);
            
// // // // //             return (
// // // // //               <text 
// // // // //                 x={x} 
// // // // //                 y={y} 
// // // // //                 fill={COLORS[index % COLORS.length]}
// // // // //                 textAnchor={x > cx ? 'start' : 'end'} 
// // // // //                 dominantBaseline="central"
// // // // //                 fontSize="12"
// // // // //                 fontWeight="500"
// // // // //               >
// // // // //                 {`${name}: ${(percent * 100).toFixed(0)}%`}
// // // // //               </text>
// // // // //             );
// // // // //           }}
// // // // //         >
// // // // //           {(data as ChartDataItem[]).map((entry, index) => (
// // // // //             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // // // //           ))}
// // // // //         </Pie>
// // // // //         <Tooltip formatter={(value) => [`${value}`, "Count"]} />
// // // // //         <Legend 
// // // // //           layout="horizontal" 
// // // // //           verticalAlign="bottom" 
// // // // //           align="center"
// // // // //           wrapperStyle={{ paddingTop: "20px" }}
// // // // //         />
// // // // //       </PieChart>
// // // // //     </ResponsiveContainer>
// // // // //   )
// // // // // }

// // // // //   if (chartType === "bar") {
// // // // //     return (
// // // // //       <ResponsiveContainer width="100%" height="100%">
// // // // //         <BarChart
// // // // //           data={data as ChartDataItem[]}
// // // // //           margin={{
// // // // //             top: 5,
// // // // //             right: 30,
// // // // //             left: 20,
// // // // //             bottom: 5,
// // // // //           }}
// // // // //         >
// // // // //           <CartesianGrid strokeDasharray="3 3" />
// // // // //           <XAxis dataKey="name" />
// // // // //           <YAxis />
// // // // //           <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
// // // // //           <Legend />
// // // // //           <Bar dataKey="value" fill="#82ca9d" name="Revenue" />
// // // // //         </BarChart>
// // // // //       </ResponsiveContainer>
// // // // //     )
// // // // //   }

// // // // //   // Default is line chart for revenue trends
// // // // //   return (
// // // // //     <ResponsiveContainer width="100%" height="100%">
// // // // //       <LineChart
// // // // //         data={data as TrendDataItem[]}
// // // // //         margin={{
// // // // //           top: 5,
// // // // //           right: 30,
// // // // //           left: 20,
// // // // //           bottom: 5,
// // // // //         }}
// // // // //       >
// // // // //         <CartesianGrid strokeDasharray="3 3" />
// // // // //         <XAxis dataKey="date" />
// // // // //         <YAxis />
// // // // //         <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
// // // // //         <Legend />
// // // // //         <Line 
// // // // //           type="monotone" 
// // // // //           dataKey="revenue" 
// // // // //           stroke="#82ca9d" 
// // // // //           activeDot={{ r: 8 }} 
// // // // //           name="Revenue" 
// // // // //         />
// // // // //       </LineChart>
// // // // //     </ResponsiveContainer>
// // // // //   )
// // // // // }



// // // import React, { useState } from 'react';
// // // import {
// // //   LineChart,
// // //   Line,
// // //   BarChart,
// // //   Bar,
// // //   PieChart,
// // //   Pie,
// // //   Cell,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   Legend,
// // //   ResponsiveContainer,
// // // } from 'recharts';
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// // // interface ChartDataItem {
// // //   name: string;
// // //   value: number;
// // //   roomType?: string;
// // //   date?: string;
// // // }

// // // interface TrendDataItem {
// // //   date: string;
// // //   revenue: number;
// // //   cashFlow?: number;
// // //   actualRevenue?: number;
// // // }

// // // interface RoomRevenueItem {
// // //   roomNumber: string;
// // //   roomType: string;
// // //   cashFlowRevenue: number;
// // //   actualRevenue: number;
// // //   bookingDate: string;
// // //   stayDates: string[];
// // // }

// // // type ChartData = ChartDataItem[] | TrendDataItem[] | RoomRevenueItem[] | any[];

// // // interface FinancialAnalyticsProps {
// // //   data: ChartData;
// // //   isLoading: boolean;
// // //   chartType?: "line" | "bar" | "pie" | "cashflow" | "actual";
// // //   revenueType?: "total" | "cashflow" | "actual";
// // // }

// // // const COLORS = ["#3B82F6", "#14B8A6", "#F97316", "#EF4444", "#8B5CF6", "#10B981"];

// // // // Helper function to calculate cash flow revenue (total booking amount on booking date)
// // // const calculateCashFlowData = (bookings: any[]) => {
// // //   const cashFlowByDate: { [key: string]: number } = {};
  
// // //   bookings.forEach(booking => {
// // //     const bookingDate = booking.bookingDate || booking.date;
// // //     const totalAmount = booking.totalAmount || booking.cashFlowRevenue || 0;
    
// // //     if (!cashFlowByDate[bookingDate]) {
// // //       cashFlowByDate[bookingDate] = 0;
// // //     }
// // //     cashFlowByDate[bookingDate] += totalAmount;
// // //   });
  
// // //   return Object.entries(cashFlowByDate).map(([date, amount]) => ({
// // //     date,
// // //     revenue: amount,
// // //     cashFlow: amount
// // //   }));
// // // };

// // // // Helper function to calculate actual revenue (distributed across stay dates)
// // // const calculateActualRevenueData = (bookings: any[]) => {
// // //   const actualRevenueByDate: { [key: string]: number } = {};
  
// // //   bookings.forEach(booking => {
// // //     const stayDates = booking.stayDates || [];
// // //     const pricePerNight = booking.pricePerNight || booking.actualRevenue || 0;
    
// // //     stayDates.forEach((date: string) => {
// // //       if (!actualRevenueByDate[date]) {
// // //         actualRevenueByDate[date] = 0;
// // //       }
// // //       actualRevenueByDate[date] += pricePerNight;
// // //     });
// // //   });
  
// // //   return Object.entries(actualRevenueByDate).map(([date, amount]) => ({
// // //     date,
// // //     revenue: amount,
// // //     actualRevenue: amount
// // //   }));
// // // };

// // // export default function FinancialAnalytics({
// // //   data,
// // //   isLoading,
// // //   chartType = "line",
// // //   revenueType = "total"
// // // }: FinancialAnalyticsProps) {
// // //   const [activeRevenueView, setActiveRevenueView] = useState<"cashflow" | "actual">("cashflow");

// // //   if (isLoading) {
// // //     return (
// // //       <div className="w-full h-full flex items-center justify-center">
// // //         <div className="animate-pulse bg-gray-200 rounded h-64 w-full"></div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!data || data.length === 0) {
// // //     return (
// // //       <div className="flex items-center justify-center h-full w-full">
// // //         <p className="text-gray-500">No financial data available for the selected period</p>
// // //       </div>
// // //     );
// // //   }

// // //   // Handle Cash Flow vs Actual Revenue views
// // //   if (chartType === "cashflow") {
// // //     const cashFlowData = calculateCashFlowData(data as any[]);
// // //     const actualRevenueData = calculateActualRevenueData(data as any[]);
    
// // //     return (
// // //       <div className="w-full">
// // //         <Tabs value={activeRevenueView} onValueChange={(value) => setActiveRevenueView(value as "cashflow" | "actual")}>
// // //           <TabsList className="grid w-full grid-cols-2 mb-6">
// // //             <TabsTrigger value="cashflow">Cash Flow Revenue</TabsTrigger>
// // //             <TabsTrigger value="actual">Actual Revenue</TabsTrigger>
// // //           </TabsList>

// // //           <TabsContent value="cashflow" className="mt-6">
// // //             <Card>
// // //               <CardHeader>
// // //                 <CardTitle>Cash Flow Revenue</CardTitle>
// // //                 <CardDescription>Total booking amount received upfront on booking date</CardDescription>
// // //               </CardHeader>
// // //               <CardContent>
// // //                 <div className="h-96 w-full">
// // //                   <ResponsiveContainer width="100%" height="100%">
// // //                     <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// // //                       <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// // //                       <XAxis dataKey="date" fontSize={12} />
// // //                       <YAxis fontSize={12} />
// // //                       <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Cash Flow"]} />
// // //                       <Legend />
// // //                       <Bar dataKey="cashFlow" fill="#3B82F6" name="Cash Flow Revenue" radius={[4, 4, 0, 0]} />
// // //                     </BarChart>
// // //                   </ResponsiveContainer>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </TabsContent>

// // //           <TabsContent value="actual" className="mt-6">
// // //             <div className="space-y-8">
// // //               <Card>
// // //                 <CardHeader>
// // //                   <CardTitle>Actual Revenue</CardTitle>
// // //                   <CardDescription>Revenue distributed across stay duration (per night basis)</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="h-80 w-full">
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <LineChart data={actualRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// // //                         <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// // //                         <XAxis dataKey="date" fontSize={12} />
// // //                         <YAxis fontSize={12} />
// // //                         <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Actual Revenue"]} />
// // //                         <Legend />
// // //                         <Line
// // //                           type="monotone"
// // //                           dataKey="actualRevenue"
// // //                           stroke="#14B8A6"
// // //                           strokeWidth={3}
// // //                           activeDot={{ r: 6, fill: '#14B8A6' }}
// // //                           name="Actual Revenue"
// // //                         />
// // //                       </LineChart>
// // //                     </ResponsiveContainer>
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>

// // //               <Card>
// // //                 <CardHeader>
// // //                   <CardTitle>Daily Revenue Distribution</CardTitle>
// // //                   <CardDescription>Revenue spread across stay dates</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="h-80 w-full">
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <BarChart data={actualRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// // //                         <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// // //                         <XAxis dataKey="date" fontSize={12} />
// // //                         <YAxis fontSize={12} />
// // //                         <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Daily Revenue"]} />
// // //                         <Bar dataKey="actualRevenue" fill="#14B8A6" name="Daily Revenue" radius={[4, 4, 0, 0]} />
// // //                       </BarChart>
// // //                     </ResponsiveContainer>
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //             </div>
// // //           </TabsContent>
// // //         </Tabs>
// // //       </div>
// // //     );
// // //   }

// // //   // Handle revenue type for other chart types
// // //   let processedData = data;
  
// // //   if (revenueType === "cashflow") {
// // //     processedData = calculateCashFlowData(data as any[]);
// // //   } else if (revenueType === "actual") {
// // //     processedData = calculateActualRevenueData(data as any[]);
// // //   }

// // //   // Simple Pie chart
// // //   if (chartType === "pie") {
// // //     return (
// // //       <div className="h-full w-full">
// // //         <ResponsiveContainer width="100%" height="100%">
// // //           <PieChart>
// // //             <Pie
// // //               data={processedData as ChartDataItem[]}
// // //               cx="50%"
// // //               cy="50%"
// // //               labelLine={false}
// // //               outerRadius={100}
// // //               fill="#8884d8"
// // //               dataKey="value"
// // //               label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
// // //             >
// // //               {(processedData as ChartDataItem[]).map((entry, index) => (
// // //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //               ))}
// // //             </Pie>
// // //             <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// // //             <Legend />
// // //           </PieChart>
// // //         </ResponsiveContainer>
// // //       </div>
// // //     );
// // //   }

// // //   // Simple Bar chart
// // //   if (chartType === "bar") {
// // //     return (
// // //       <div className="h-full w-full">
// // //         <ResponsiveContainer width="100%" height="100%">
// // //           <BarChart data={processedData as ChartDataItem[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// // //             <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// // //             <XAxis dataKey="name" fontSize={12} />
// // //             <YAxis fontSize={12} />
// // //             <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// // //             <Legend />
// // //             <Bar dataKey="value" fill="#14B8A6" name="Revenue" radius={[4, 4, 0, 0]} />
// // //           </BarChart>
// // //         </ResponsiveContainer>
// // //       </div>
// // //     );
// // //   }

// // //   // Default Line chart
// // //   return (
// // //     <div className="h-full w-full">
// // //       <ResponsiveContainer width="100%" height="100%">
// // //         <LineChart data={processedData as TrendDataItem[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// // //           <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// // //           <XAxis dataKey="date" fontSize={12} />
// // //           <YAxis fontSize={12} />
// // //           <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// // //           <Legend />
// // //           <Line 
// // //             type="monotone" 
// // //             dataKey="revenue" 
// // //             stroke="#3B82F6" 
// // //             strokeWidth={3}
// // //             activeDot={{ r: 6, fill: '#3B82F6' }} 
// // //             name="Revenue" 
// // //           />
// // //         </LineChart>
// // //       </ResponsiveContainer>
// // //     </div>
// // //   );
// // // }

// // import React, { useState } from 'react';
// // import {
// //   LineChart,
// //   Line,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from 'recharts';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// // interface ChartDataItem {
// //   name: string;
// //   value: number;
// //   roomType?: string;
// //   date?: string;
// // }

// // interface TrendDataItem {
// //   date: string;
// //   revenue: number;
// //   cashFlow?: number;
// //   actualRevenue?: number;
// // }

// // interface RoomRevenueItem {
// //   roomNumber: string;
// //   roomType: string;
// //   cashFlowRevenue: number;
// //   actualRevenue: number;
// //   bookingDate: string;
// //   stayDates: string[];
// // }

// // type ChartData = ChartDataItem[] | TrendDataItem[] | RoomRevenueItem[] | any[];

// // interface FinancialAnalyticsProps {
// //   data: ChartData;
// //   isLoading: boolean;
// //   chartType?: "line" | "bar" | "pie" | "cashflow" | "actual";
// //   revenueType?: "total" | "cashflow" | "actual";
// // }

// // const COLORS = ["#3B82F6", "#14B8A6", "#F97316", "#EF4444", "#8B5CF6", "#10B981"];

// // // Helper function to calculate cash flow revenue (total booking amount on booking date)
// // const calculateCashFlowData = (bookings: any[]) => {
// //   const cashFlowByDate: { [key: string]: number } = {};
  
// //   bookings.forEach(booking => {
// //     const bookingDate = booking.bookingDate || booking.date;
// //     const totalAmount = booking.totalAmount || booking.cashFlowRevenue || 0;
    
// //     if (!cashFlowByDate[bookingDate]) {
// //       cashFlowByDate[bookingDate] = 0;
// //     }
// //     cashFlowByDate[bookingDate] += totalAmount;
// //   });
  
// //   return Object.entries(cashFlowByDate).map(([date, amount]) => ({
// //     date,
// //     revenue: amount,
// //     cashFlow: amount
// //   }));
// // };

// // // Helper function to calculate actual revenue (distributed across stay dates)
// // const calculateActualRevenueData = (bookings: any[]) => {
// //   const actualRevenueByDate: { [key: string]: number } = {};
  
// //   bookings.forEach(booking => {
// //     const stayDates = booking.stayDates || [];
// //     const pricePerNight = booking.pricePerNight || booking.actualRevenue || 0;
    
// //     stayDates.forEach((date: string) => {
// //       if (!actualRevenueByDate[date]) {
// //         actualRevenueByDate[date] = 0;
// //       }
// //       actualRevenueByDate[date] += pricePerNight;
// //     });
// //   });
  
// //   return Object.entries(actualRevenueByDate).map(([date, amount]) => ({
// //     date,
// //     revenue: amount,
// //     actualRevenue: amount
// //   }));
// // };

// // // Helper function to process room-wise data
// // const processRoomWiseData = (rooms: any[], type: "cashflow" | "actual") => {
// //   return rooms.map(room => ({
// //     name: room.roomNumber || room.name,
// //     value: type === "cashflow" ? room.cashFlowRevenue : room.actualRevenue,
// //     roomType: room.roomType
// //   }));
// // };

// // export default function FinancialAnalytics({
// //   data,
// //   isLoading,
// //   chartType = "line",
// //   revenueType = "total"
// // }: FinancialAnalyticsProps) {
// //   const [activeRevenueView, setActiveRevenueView] = useState<"cashflow" | "actual">("cashflow");

// //   if (isLoading) {
// //     return (
// //       <div className="w-full h-full flex items-center justify-center">
// //         <div className="animate-pulse bg-gray-200 rounded h-64 w-full"></div>
// //       </div>
// //     );
// //   }

// //   if (!data || data.length === 0) {
// //     return (
// //       <div className="flex items-center justify-center h-full w-full">
// //         <p className="text-gray-500">No financial data available for the selected period</p>
// //       </div>
// //     );
// //   }

// //   // Handle Cash Flow vs Actual Revenue views
// //   if (chartType === "cashflow") {
// //     const cashFlowData = calculateCashFlowData(data as any[]);
// //     const actualRevenueData = calculateActualRevenueData(data as any[]);
    
// //     return (
// //       <div className="w-full">
// //         <Tabs value={activeRevenueView} onValueChange={(value) => setActiveRevenueView(value as "cashflow" | "actual")}>
// //           <TabsList className="grid w-full grid-cols-2 mb-6">
// //             <TabsTrigger value="cashflow">Cash Flow Revenue</TabsTrigger>
// //             <TabsTrigger value="actual">Actual Revenue</TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="cashflow" className="mt-6">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Cash Flow Revenue</CardTitle>
// //                 <CardDescription>Total booking amount received upfront on booking date</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="h-96 w-full">
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //                       <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //                       <XAxis dataKey="date" fontSize={12} />
// //                       <YAxis fontSize={12} />
// //                       <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Cash Flow"]} />
// //                       <Legend />
// //                       <Bar dataKey="cashFlow" fill="#3B82F6" name="Cash Flow Revenue" radius={[4, 4, 0, 0]} />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>

// //           <TabsContent value="actual" className="mt-6">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Actual Revenue</CardTitle>
// //                 <CardDescription>Revenue distributed across stay duration (per night basis)</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="h-96 w-full">
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <LineChart data={actualRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //                       <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //                       <XAxis dataKey="date" fontSize={12} />
// //                       <YAxis fontSize={12} />
// //                       <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Actual Revenue"]} />
// //                       <Legend />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="actualRevenue"
// //                         stroke="#14B8A6"
// //                         strokeWidth={3}
// //                         activeDot={{ r: 6, fill: '#14B8A6' }}
// //                         name="Actual Revenue"
// //                       />
// //                     </LineChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     );
// //   }

// //   // Handle revenue type for other chart types
// //   let processedData = data;
  
// //   if (revenueType === "cashflow") {
// //     if (Array.isArray(data) && data.length > 0 && 'roomNumber' in data[0]) {
// //       processedData = processRoomWiseData(data as any[], "cashflow");
// //     } else {
// //       processedData = calculateCashFlowData(data as any[]);
// //     }
// //   } else if (revenueType === "actual") {
// //     if (Array.isArray(data) && data.length > 0 && 'roomNumber' in data[0]) {
// //       processedData = processRoomWiseData(data as any[], "actual");
// //     } else {
// //       processedData = calculateActualRevenueData(data as any[]);
// //     }
// //   }

// //   // Simple Pie chart
// //   if (chartType === "pie") {
// //     return (
// //       <div className="h-full w-full">
// //         <ResponsiveContainer width="100%" height="100%">
// //           <PieChart>
// //             <Pie
// //               data={processedData as ChartDataItem[]}
// //               cx="50%"
// //               cy="50%"
// //               labelLine={false}
// //               outerRadius={100}
// //               fill="#8884d8"
// //               dataKey="value"
// //               label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
// //             >
// //               {(processedData as ChartDataItem[]).map((entry, index) => (
// //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //               ))}
// //             </Pie>
// //             <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// //             <Legend />
// //           </PieChart>
// //         </ResponsiveContainer>
// //       </div>
// //     );
// //   }

// //   // Simple Bar chart
// //   if (chartType === "bar") {
// //     return (
// //       <div className="h-full w-full">
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart data={processedData as ChartDataItem[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //             <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //             <XAxis dataKey="name" fontSize={12} />
// //             <YAxis fontSize={12} />
// //             <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// //             <Legend />
// //             <Bar dataKey="value" fill="#14B8A6" name="Revenue" radius={[4, 4, 0, 0]} />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>
// //     );
// //   }

// //   // Default Line chart
// //   return (
// //     <div className="h-full w-full">
// //       <ResponsiveContainer width="100%" height="100%">
// //         <LineChart data={processedData as TrendDataItem[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //           <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //           <XAxis dataKey="date" fontSize={12} />
// //           <YAxis fontSize={12} />
// //           <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// //           <Legend />
// //           <Line 
// //             type="monotone" 
// //             dataKey="revenue" 
// //             stroke="#3B82F6" 
// //             strokeWidth={3}
// //             activeDot={{ r: 6, fill: '#3B82F6' }} 
// //             name="Revenue" 
// //           />
// //         </LineChart>
// //       </ResponsiveContainer>
// //     </div>
// //   );
// // }
// // import React, { useState } from 'react';
// // import {
// //   LineChart,
// //   Line,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   Cell,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from 'recharts';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// // interface ChartDataItem {
// //   name: string;
// //   value: number;
// //   roomType?: string;
// //   date?: string;
// // }

// // interface TrendDataItem {
// //   date: string;
// //   revenue: number;
// //   cashFlow?: number;
// //   actualRevenue?: number;
// // }

// // interface RoomRevenueItem {
// //   roomNumber: string;
// //   roomType: string;
// //   cashFlowRevenue: number;
// //   actualRevenue: number;
// //   bookingDate: string;
// //   stayDates: string[];
// // }

// // type ChartData = ChartDataItem[] | TrendDataItem[] | RoomRevenueItem[] | any[];

// // interface FinancialAnalyticsProps {
// //   data: ChartData;
// //   isLoading: boolean;
// //   chartType?: "line" | "bar" | "pie" | "cashflow" | "actual";
// //   revenueType?: "total" | "cashflow" | "actual";
// // }

// // const COLORS = ["#3B82F6", "#14B8A6", "#F97316", "#EF4444", "#8B5CF6", "#10B981"];

// // // Helper function to calculate cash flow revenue (total booking amount on booking date)
// // const calculateCashFlowData = (bookings: any[]) => {
// //   const cashFlowByDate: { [key: string]: number } = {};
  
// //   bookings.forEach(booking => {
// //     const bookingDate = booking.bookingDate || booking.date;
// //     const totalAmount = booking.totalAmount || booking.cashFlowRevenue || 0;
    
// //     if (!cashFlowByDate[bookingDate]) {
// //       cashFlowByDate[bookingDate] = 0;
// //     }
// //     cashFlowByDate[bookingDate] += totalAmount;
// //   });
  
// //   return Object.entries(cashFlowByDate).map(([date, amount]) => ({
// //     date,
// //     revenue: amount,
// //     cashFlow: amount
// //   }));
// // };

// // // Helper function to calculate actual revenue (distributed across stay dates)
// // const calculateActualRevenueData = (bookings: any[]) => {
// //   const actualRevenueByDate: { [key: string]: number } = {};
  
// //   bookings.forEach(booking => {
// //     const stayDates = booking.stayDates || [];
// //     const pricePerNight = booking.pricePerNight || booking.actualRevenue || 0;
    
// //     stayDates.forEach((date: string) => {
// //       if (!actualRevenueByDate[date]) {
// //         actualRevenueByDate[date] = 0;
// //       }
// //       actualRevenueByDate[date] += pricePerNight;
// //     });
// //   });
  
// //   return Object.entries(actualRevenueByDate).map(([date, amount]) => ({
// //     date,
// //     revenue: amount,
// //     actualRevenue: amount
// //   }));
// // };

// // // Helper function to process room-wise data
// // const processRoomWiseData = (rooms: any[], type: "cashflow" | "actual") => {
// //   return rooms.map(room => ({
// //     name: room.roomNumber || room.name,
// //     value: type === "cashflow" ? room.cashFlowRevenue : room.actualRevenue,
// //     roomType: room.roomType
// //   }));
// // };

// // // Helper function to calculate room type revenue from booking data
// // const calculateRoomTypeRevenue = (bookings: any[]) => {
// //   const roomTypeRevenue: { [key: string]: number } = {};
// //   const roomTypeBookings: { [key: string]: number } = {};
  
// //   bookings.forEach(booking => {
// //     // Handle room_type_bookings array structure from your database
// //     if (booking.room_type_bookings && Array.isArray(booking.room_type_bookings)) {
// //       booking.room_type_bookings.forEach((rtb: any) => {
// //         const roomType = rtb.room_type;
// //         const numberOfRooms = rtb.number_of_rooms || 1;
        
// //         // Calculate revenue for this room type booking
// //         const totalBookingAmount = booking.total_amount || booking.totalAmount || 0;
// //         const revenueForThisRoomType = totalBookingAmount; // Full booking amount for this room type
        
// //         if (!roomTypeRevenue[roomType]) {
// //           roomTypeRevenue[roomType] = 0;
// //           roomTypeBookings[roomType] = 0;
// //         }
// //         roomTypeRevenue[roomType] += revenueForThisRoomType;
// //         roomTypeBookings[roomType] += 1; // Count this booking
// //       });
// //     } else if (booking.roomType) {
// //       // Fallback for mock data structure
// //       const roomType = booking.roomType;
// //       const totalAmount = booking.totalAmount || booking.cashFlowRevenue || 0;
      
// //       if (!roomTypeRevenue[roomType]) {
// //         roomTypeRevenue[roomType] = 0;
// //         roomTypeBookings[roomType] = 0;
// //       }
// //       roomTypeRevenue[roomType] += totalAmount;
// //       roomTypeBookings[roomType] += 1;
// //     }
// //   });
  
// //   return Object.entries(roomTypeRevenue).map(([roomType, amount]) => ({
// //     name: roomType,
// //     value: amount,
// //     revenue: amount,
// //     bookings: roomTypeBookings[roomType] || 0
// //   }));
// // };

// // export default function FinancialAnalytics({
// //   data,
// //   isLoading,
// //   chartType = "line",
// //   revenueType = "total"
// // }: FinancialAnalyticsProps) {
// //   const [activeRevenueView, setActiveRevenueView] = useState<"cashflow" | "actual">("cashflow");

// //   if (isLoading) {
// //     return (
// //       <div className="w-full h-full flex items-center justify-center">
// //         <div className="animate-pulse bg-gray-200 rounded h-64 w-full"></div>
// //       </div>
// //     );
// //   }

// //   if (!data || data.length === 0) {
// //     return (
// //       <div className="flex items-center justify-center h-full w-full">
// //         <p className="text-gray-500">No financial data available for the selected period</p>
// //       </div>
// //     );
// //   }

// //   // Handle Cash Flow vs Actual Revenue views
// //   if (chartType === "cashflow") {
// //     const cashFlowData = calculateCashFlowData(data as any[]);
// //     const actualRevenueData = calculateActualRevenueData(data as any[]);
    
// //     return (
// //       <div className="w-full">
// //         <Tabs value={activeRevenueView} onValueChange={(value) => setActiveRevenueView(value as "cashflow" | "actual")}>
// //           <TabsList className="grid w-full grid-cols-2 mb-6">
// //             <TabsTrigger value="cashflow">Cash Flow Revenue</TabsTrigger>
// //             <TabsTrigger value="actual">Actual Revenue</TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="cashflow" className="mt-6">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Cash Flow Revenue</CardTitle>
// //                 <CardDescription>Total booking amount received upfront on booking date</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="h-96 w-full">
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //                       <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //                       <XAxis dataKey="date" fontSize={12} />
// //                       <YAxis fontSize={12} />
// //                       <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Cash Flow"]} />
// //                       <Legend />
// //                       <Bar dataKey="cashFlow" fill="#3B82F6" name="Cash Flow Revenue" radius={[4, 4, 0, 0]} />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>

// //           <TabsContent value="actual" className="mt-6">
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Actual Revenue</CardTitle>
// //                 <CardDescription>Revenue distributed across stay duration (per night basis)</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="h-96 w-full">
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <LineChart data={actualRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //                       <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //                       <XAxis dataKey="date" fontSize={12} />
// //                       <YAxis fontSize={12} />
// //                       <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Actual Revenue"]} />
// //                       <Legend />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="actualRevenue"
// //                         stroke="#14B8A6"
// //                         strokeWidth={3}
// //                         activeDot={{ r: 6, fill: '#14B8A6' }}
// //                         name="Actual Revenue"
// //                       />
// //                     </LineChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     );
// //   }

// //   // Handle revenue type for other chart types
// //   let processedData = data;
  
// //   // Special handling for room type data when using booking data
// //   if (chartType === "pie" && Array.isArray(data) && data.length > 0 && 
// //       (('roomType' in data[0] && 'totalAmount' in data[0]) || 
// //        ('room_type_bookings' in data[0] && 'total_amount' in data[0]))) {
// //     processedData = calculateRoomTypeRevenue(data as any[]);
// //   }
  
// //   if (revenueType === "cashflow") {
// //     if (Array.isArray(data) && data.length > 0 && 'roomNumber' in data[0]) {
// //       processedData = processRoomWiseData(data as any[], "cashflow");
// //     } else {
// //       processedData = calculateCashFlowData(data as any[]);
// //     }
// //   } else if (revenueType === "actual") {
// //     if (Array.isArray(data) && data.length > 0 && 'roomNumber' in data[0]) {
// //       processedData = processRoomWiseData(data as any[], "actual");
// //     } else {
// //       processedData = calculateActualRevenueData(data as any[]);
// //     }
// //   }

// //   // Simple Pie chart
// //   if (chartType === "pie") {
// //     return (
// //       <div className="h-full w-full">
// //         <ResponsiveContainer width="100%" height="100%">
// //           <PieChart>
// //             <Pie
// //              data={processedData as any[]}
// //               cx="50%"
// //               cy="50%"
// //               labelLine={false}
// //               outerRadius={100}
// //               fill="#8884d8"
// //              dataKey="revenue"
// //              label={({ name, percent, bookings }) => 
// //                percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}% (${bookings} bookings)` : ''
// //              }
// //             >
// //              {(processedData as any[]).map((entry, index) => (
// //                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //               ))}
// //             </Pie>
// //            <Tooltip 
// //              formatter={(value, name, props) => [
// //                `₹${Number(value).toLocaleString()}`, 
// //                `Revenue (${props.payload.bookings} bookings)`
// //              ]} 
// //            />
// //             <Legend />
// //           </PieChart>
// //         </ResponsiveContainer>
// //       </div>
// //     );
// //   }

// //   // Simple Bar chart
// //   if (chartType === "bar") {
// //     return (
// //       <div className="h-full w-full">
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart data={processedData as any[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //             <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //             <XAxis dataKey="name" fontSize={12} />
// //             <YAxis yAxisId="left" fontSize={12} />
// //             <YAxis yAxisId="right" orientation="right" fontSize={12} />
// //             <Tooltip 
// //               formatter={(value, name) => {
// //                 if (name === "Revenue") {
// //                   return [`₹${Number(value).toLocaleString()}`, "Revenue"];
// //                 }
// //                 return [value, name];
// //               }} 
// //             />
// //             <Legend />
// //             <Bar yAxisId="left" dataKey="revenue" fill="#14B8A6" name="Revenue" radius={[4, 4, 0, 0]} />
// //             <Bar yAxisId="right" dataKey="bookings" fill="#3B82F6" name="Number of Bookings" radius={[4, 4, 0, 0]} />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>
// //     );
// //   }

// //   // Default Line chart
// //   return (
// //     <div className="h-full w-full">
// //       <ResponsiveContainer width="100%" height="100%">
// //         <LineChart data={processedData as TrendDataItem[]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
// //           <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
// //           <XAxis dataKey="date" fontSize={12} />
// //           <YAxis fontSize={12} />
// //           <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]} />
// //           <Legend />
// //           <Line 
// //             type="monotone" 
// //             dataKey="revenue" 
// //             stroke="#3B82F6" 
// //             strokeWidth={3}
// //             activeDot={{ r: 6, fill: '#3B82F6' }} 
// //             name="Revenue" 
// //           />
// //         </LineChart>
// //       </ResponsiveContainer>
// //     </div>
// //   );
// // }

// "use client"

// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"

// interface FinancialChartDataItem {
//   name: string
//   actualRevenue?: number
//   paymentsCollected?: number
//   value?: number // Keep value for other charts if needed
// }

// interface TrendDataItem {
//   date: string
//   revenue?: number // Made optional as paymentsCollected might be the primary dataKey
//   paymentsCollected?: number // Added for cash flow
//   value?: number // For generic daily trends (cash flow or actual revenue)
// }

// interface ChartDataItem {
//   name: string
//   value: number
// }

// type ChartData = ChartDataItem[] | TrendDataItem[] | FinancialChartDataItem[] | any[]

// interface FinancialAnalyticsProps {
//   data: ChartData
//   isLoading: boolean
//   chartType?: "line" | "bar" | "pie"
//   dataKey?: string // New prop for line/bar chart to specify which key to plot
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

// export default function FinancialAnalytics({ data, isLoading, chartType = "line", dataKey }: FinancialAnalyticsProps) {
//   if (isLoading) {
//     return <Skeleton className="w-full h-full" />
//   }

//   // Check for empty data
//   if (!data || data.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full w-full">
//         <p className="text-muted-foreground">No financial data available for the selected period</p>
//       </div>
//     )
//   }

//   if (chartType === "pie") {
//     return (
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={data as ChartDataItem[]}
//             cx="50%"
//             cy="50%"
//             labelLine={false} // Remove the label lines
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             // Custom label positioning to prevent overlap
//             label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
//               // Only show label if percent is greater than 5%
//               if (percent < 0.05) return null

//               const RADIAN = Math.PI / 180
//               // Positioning the label further from the pie
//               const radius = outerRadius * 1.2
//               const x = cx + radius * Math.cos(-midAngle * RADIAN)
//               const y = cy + radius * Math.sin(-midAngle * RADIAN)

//               return (
//                 <text
//                   x={x}
//                   y={y}
//                   fill={COLORS[index % COLORS.length]}
//                   textAnchor={x > cx ? "start" : "end"}
//                   dominantBaseline="central"
//                   fontSize="12"
//                   fontWeight="500"
//                 >
//                   {`${name}: ${(percent * 100).toFixed(0)}%`}
//                 </text>
//               )
//             }}
//           >
//             {(data as ChartDataItem[]).map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => [`${value}`, "Count"]} />
//           <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
//         </PieChart>
//       </ResponsiveContainer>
//     )
//   }

//   if (chartType === "bar") {
//     // Check if data contains actualRevenue and paymentsCollected for the comparison bar chart
//     const isRevenueComparisonChart = data.some((item) => "actualRevenue" in item && "paymentsCollected" in item)

//     if (isRevenueComparisonChart) {
//       return (
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data as FinancialChartDataItem[]}
//             margin={{
//               top: 5,
//               right: 30,
//               left: 20,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip
//               formatter={(value, name) => {
//                 if (name === "actualRevenue") return [`$${Number(value).toLocaleString()}`, "Actual Revenue"]
//                 if (name === "paymentsCollected") return [`$${Number(value).toLocaleString()}`, "Payments Collected"]
//                 return [`$${Number(value).toLocaleString()}`, name]
//               }}
//             />
//             <Legend />
//             <Bar dataKey="actualRevenue" fill="#82ca9d" name="Actual Revenue" />
//             <Bar dataKey="paymentsCollected" fill="#8884d8" name="Payments Collected" />
//           </BarChart>
//         </ResponsiveContainer>
//       )
//     } else {
//       // Bar chart for single value data (e.g., Payment Methods, or new Cash Flow/Actual Revenue daily bars)
//       return (
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data as TrendDataItem[]} // Cast to TrendDataItem for daily trends with 'date' and 'value'
//             margin={{
//               top: 5,
//               right: 30,
//               left: 20,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" /> {/* Use 'date' for daily trends */}
//             <YAxis />
//             <Tooltip
//               formatter={(value) => [`$${Number(value).toLocaleString()}`, dataKey === "value" ? "Amount" : dataKey]}
//             />
//             <Legend />
//             <Bar dataKey={dataKey || "value"} fill="#82ca9d" name={dataKey === "value" ? "Amount" : dataKey} />
//           </BarChart>
//         </ResponsiveContainer>
//       )
//     }
//   }

//   // Default is line chart for revenue trends or specific dataKey trends
//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <LineChart
//         data={data as TrendDataItem[]}
//         margin={{
//           top: 5,
//           right: 30,
//           left: 20,
//           bottom: 5,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip
//           formatter={(value) => [
//             `$${Number(value).toLocaleString()}`,
//             dataKey === "paymentsCollected" ? "Payments Collected" : "Revenue",
//           ]}
//         />
//         <Legend />
//         <Line
//           type="monotone"
//           dataKey={dataKey || "revenue"} // Use dataKey if provided, otherwise default to "revenue"
//           stroke={dataKey === "paymentsCollected" ? "#8884d8" : "#82ca9d"} // Different color for cash flow
//           activeDot={{ r: 8 }}
//           name={dataKey === "paymentsCollected" ? "Payments Collected" : "Revenue"}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   )
// }
"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface FinancialChartDataItem {
  name: string
  actualRevenue?: number
  paymentsCollected?: number
  value?: number // Keep value for other charts if needed
}

interface TrendDataItem {
  date: string
  revenue?: number // Made optional as paymentsCollected might be the primary dataKey
  paymentsCollected?: number // Added for cash flow
  value?: number // For generic daily trends (cash flow or actual revenue)
}

interface ChartDataItem {
  name: string
  value: number
}

type ChartData = ChartDataItem[] | TrendDataItem[] | FinancialChartDataItem[] | any[]

interface FinancialAnalyticsProps {
  data: ChartData
  isLoading: boolean
  chartType?: "line" | "bar" | "pie"
  dataKey?: string // For line charts (e.g., 'revenue', 'paymentsCollected')
  xAxisKey?: string // New: for XAxis dataKey (e.g., 'date', 'name')
  barDataKey?: string // New: for Bar dataKey (e.g., 'value')
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function FinancialAnalytics({
  data,
  isLoading,
  chartType = "line",
  dataKey,
  xAxisKey,
  barDataKey,
}: FinancialAnalyticsProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />
  }

  // Check for empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-muted-foreground">No financial data available for the selected period</p>
      </div>
    )
  }

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as ChartDataItem[]}
            cx="50%"
            cy="50%"
            labelLine={false} // Remove the label lines
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            // Custom label positioning to prevent overlap
            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
              // Only show label if percent is greater than 5%
              if (percent < 0.05) return null

              const RADIAN = Math.PI / 180
              // Positioning the label further from the pie
              const radius = outerRadius * 1.2
              const x = cx + radius * Math.cos(-midAngle * RADIAN)
              const y = cy + radius * Math.sin(-midAngle * RADIAN)

              return (
                <text
                  x={x}
                  y={y}
                  fill={COLORS[index % COLORS.length]}
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight="500"
                >
                  {`${name}: ${(percent * 100).toFixed(0)}%`}
                </text>
              )
            }}
          >
            {(data as ChartDataItem[]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Count"]} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === "bar") {
    // Check if data contains actualRevenue and paymentsCollected for the comparison bar chart
    const isRevenueComparisonChart = data.some((item) => "actualRevenue" in item && "paymentsCollected" in item)

    if (isRevenueComparisonChart) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data as FinancialChartDataItem[]}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "actualRevenue") return [`$${Number(value).toLocaleString()}`, "Actual Revenue"]
                if (name === "paymentsCollected") return [`$${Number(value).toLocaleString()}`, "Payments Collected"]
                return [`$${Number(value).toLocaleString()}`, name]
              }}
            />
            <Legend />
            <Bar dataKey="actualRevenue" fill="#82ca9d" name="Actual Revenue" />
            <Bar dataKey="paymentsCollected" fill="#8884d8" name="Payments Collected" />
          </BarChart>
        </ResponsiveContainer>
      )
    } else {
      // Generic Bar chart for single value data (e.g., Payment Methods, or new Cash Flow/Actual Revenue daily bars)
      const currentXAxisKey = xAxisKey || "name" // Default to 'name' for categories
      const currentBarDataKey = barDataKey || "value" // Default to 'value' for bar height

      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={currentXAxisKey} />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                // Use props.payload.name for the category name (e.g., "Cash", "Online")
                return [`$${Number(value).toLocaleString()}`, props.payload.name || name]
              }}
            />
            {/* Removed Legend as XAxis labels are sufficient for "Cash" and "Online" */}
            <Bar dataKey={currentBarDataKey} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }

  // Default is line chart for revenue trends or specific dataKey trends
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data as TrendDataItem[]}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value) => [
            `$${Number(value).toLocaleString()}`,
            dataKey === "paymentsCollected" ? "Payments Collected" : "Revenue",
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey || "revenue"} // Use dataKey if provided, otherwise default to "revenue"
          stroke={dataKey === "paymentsCollected" ? "#8884d8" : "#82ca9d"} // Different color for cash flow
          activeDot={{ r: 8 }}
          name={dataKey === "paymentsCollected" ? "Payments Collected" : "Revenue"}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
