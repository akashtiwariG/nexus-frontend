// // "use client"

// // import type React from "react"

// // import Link from "next/link"
// // import { useState, useEffect } from "react"
// // import { motion, AnimatePresence } from "framer-motion"
// // import { usePathname } from "next/navigation"
// // import {
// //   Users,
// //   BedDouble,
// //   MessageSquare,
// //   TrendingUp,
// //   Calendar,
// //   ClipboardList,
// //   Settings,
// //   LucideLayoutDashboard,
// //   Tag,
// // } from "lucide-react"
// // import { useLayout } from "@/providers/layout-providers"

// // interface MenuItem {
// //   name: string
// //   icon: React.ComponentType<{ className?: string }>
// //   href: string
// // }

// // const menuItems: MenuItem[] = [
// //   { name: "Dashboard", icon: LucideLayoutDashboard, href: "/dashboard" },
// //   { name: "Analytics", icon: Users, href: "/booking/analytics" },
// //   { name: "Check-Booking", icon: BedDouble, href: "/booking/checkbooking" },
// //   { name: "Create-Booking", icon: MessageSquare, href: "/booking/createbooking" },
// //   { name: "Hotel-Setup", icon: TrendingUp, href: "/hotels/settings" },
// //   { name: "Calendar", icon: Calendar, href: "/calendar" },
// //   { name: "Room-Setup", icon: ClipboardList, href: "/room/manage" },
// //   { name: "Pricing", icon: Tag, href: "/pricing" },
// //   { name: "Settings", icon: Settings, href: "/settings" },
// // ]

// // export function DashboardSidebar() {
// //   const { isSidebarOpen, setIsSidebarOpen } = useLayout()
// //   const [isHovering, setIsHovering] = useState(false)
// //   const pathname = usePathname()

// //   useEffect(() => {
// //     let timeout: NodeJS.Timeout
// //     if (!isHovering) {
// //       timeout = setTimeout(() => {
// //         setIsSidebarOpen(false)
// //       }, 300)
// //     } else {
// //       setIsSidebarOpen(true)
// //     }
// //     return () => clearTimeout(timeout)
// //   }, [isHovering, setIsSidebarOpen])

// //   const isActive = (href: string) => {
// //     return pathname === href || pathname.startsWith(`${href}/`)
// //   }

// //   return (
// //     <motion.div
// //       className="fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl"
// //       initial={false}
// //       animate={{
// //         width: isSidebarOpen ? 240 : 70,
// //       }}
// //       transition={{ duration: 0.3, ease: "easeInOut" }}
// //       onMouseEnter={() => setIsHovering(true)}
// //       onMouseLeave={() => setIsHovering(false)}
// //     >
// //       <div className="flex h-16 items-center justify-center">
// //         <motion.div
// //           animate={{ opacity: isSidebarOpen ? 1 : 0.8 }}
// //           transition={{ duration: 0.2 }}
// //           className="text-xl font-bold text-white"
// //         >
// //           {isSidebarOpen ? "Hotel OS" : "HO"}
// //         </motion.div>
// //       </div>
// //       <div className="px-3 py-4 my-3">
// //         {menuItems.map((item) => {
// //           const active = isActive(item.href)
// //           return (
// //             <Link key={item.name} href={item.href} className="block">
// //               <motion.div
// //                 whileHover={{ scale: 1.02 }}
// //                 className={`group mb-2 flex cursor-pointer items-center rounded-lg p-2 transition-colors ${
// //                   active ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"
// //                 }`}
// //               >
// //                 <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
// //                 <AnimatePresence>
// //                   {isSidebarOpen && (
// //                     <motion.span
// //                       initial={{ opacity: 0, x: -10 }}
// //                       animate={{ opacity: 1, x: 0 }}
// //                       exit={{ opacity: 0, x: -10 }}
// //                       className="ml-3"
// //                     >
// //                       {item.name}
// //                     </motion.span>
// //                   )}
// //                 </AnimatePresence>
// //               </motion.div>
// //             </Link>
// //           )
// //         })}
// //       </div>
// //     </motion.div>
// //   )
// // }
// "use client"

// import type React from "react"

// import Link from "next/link"
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { usePathname } from "next/navigation"
// import {
//   Users,
//   BedDouble,
//   MessageSquare,
//   TrendingUp,
//   Calendar,
//   ClipboardList,
//   Settings,
//   LucideLayoutDashboard,
//   Tag,
//   Pin,
//   PinOff,
// } from "lucide-react"
// import { useLayout } from "@/providers/layout-providers"

// interface MenuItem {
//   name: string
//   icon: React.ComponentType<{ className?: string }>
//   href: string
// }

// const menuItems: MenuItem[] = [
//   { name: "Dashboard", icon: LucideLayoutDashboard, href: "/dashboard" },
//   { name: "Analytics", icon: Users, href: "/booking/analytics" },
//   { name: "Check-Booking", icon: BedDouble, href: "/booking/checkbooking" },
//   { name: "Create-Booking", icon: MessageSquare, href: "/booking/createbooking" },
//   { name: "Hotel-Setup", icon: TrendingUp, href: "/hotels/settings" },
//   { name: "Calendar", icon: Calendar, href: "/calendar" },
//   { name: "Room-Setup", icon: ClipboardList, href: "/room/manage" },
//   { name: "Pricing", icon: Tag, href: "/pricing" },
//   { name: "Settings", icon: Settings, href: "/settings" },
// ]

// export function DashboardSidebar() {
//   const { isSidebarOpen, isPinned, setPinned } = useLayout()
//   const pathname = usePathname()

//   const handleMouseEnter = () => {
//     document.dispatchEvent(new CustomEvent("sidebar:hover:enter"))
//   }

//   const handleMouseLeave = () => {
//     document.dispatchEvent(new CustomEvent("sidebar:hover:leave"))
//   }

//   const handlePinToggle = () => {
//     setPinned(!isPinned)
//   }

//   const isActive = (href: string) => {
//     return pathname === href || pathname.startsWith(`${href}/`)
//   }

//   return (
//     <motion.div
//       className="fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl border-r border-gray-700"
//       initial={false}
//       animate={{
//         width: isSidebarOpen ? 240 : 70,
//       }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       style={{ 
//         minWidth: '70px', // Ensure minimum width so it's always visible
//         display: 'block', // Force display
//         position: 'fixed', // Ensure it stays fixed
//         zIndex: 9999 // High z-index to stay on top
//       }}
//     >
//       {/* Header */}
//       <div className="flex h-16 items-center justify-between px-4">
//         <motion.div
//           animate={{ opacity: isSidebarOpen ? 1 : 0.8 }}
//           transition={{ duration: 0.2 }}
//           className="text-xl font-bold text-white"
//         >
//           {isSidebarOpen ? "Hotel OS" : "HO"}
//         </motion.div>
        
//         {/* Pin/Unpin button - only show when sidebar is open */}
//         <AnimatePresence>
//           {isSidebarOpen && (
//             <motion.button
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               onClick={handlePinToggle}
//               className={`p-1.5 rounded-lg transition-colors ${
//                 isPinned 
//                   ? 'text-blue-400 bg-blue-900/30 hover:bg-blue-900/50' 
//                   : 'text-gray-400 hover:text-white hover:bg-gray-700'
//               }`}
//               title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
//             >
//               {isPinned ? (
//                 <Pin className="h-4 w-4" />
//               ) : (
//                 <PinOff className="h-4 w-4" />
//               )}
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Pin status indicator */}
//       {isPinned && (
//         <div className="px-4 pb-2">
//           <div className="flex items-center text-xs text-blue-400">
//             <Pin className="h-3 w-3 mr-1" />
//             <AnimatePresence>
//               {isSidebarOpen && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   Sidebar pinned open
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       )}

//       {/* Navigation Menu */}
//       <div className="px-3 py-4">
//         {menuItems.map((item) => {
//           const active = isActive(item.href)
//           return (
//             <Link key={item.name} href={item.href} className="block">
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className={`group mb-2 flex cursor-pointer items-center rounded-lg p-3 transition-all duration-200 ${
//                   active 
//                     ? "bg-blue-600 text-white shadow-lg" 
//                     : "text-gray-300 hover:bg-gray-700 hover:text-white"
//                 }`}
//               >
//                 <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : ""}`} />
//                 <AnimatePresence mode="wait">
//                   {isSidebarOpen && (
//                     <motion.span
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="ml-3 font-medium"
//                     >
//                       {item.name}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </Link>
//           )
//         })}
//       </div>

//       {/* Footer */}
//       <div className="absolute bottom-4 left-0 right-0 px-3">
//         <div className={`flex items-center p-2 rounded-lg bg-gray-800 ${!isSidebarOpen ? 'justify-center' : ''}`}>
//           <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
//             H
//           </div>
//           <AnimatePresence mode="wait">
//             {isSidebarOpen && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -10 }}
//                 transition={{ duration: 0.2 }}
//                 className="ml-3"
//               >
//                 <div className="text-sm font-medium text-white">Hotel Admin</div>
//                 <div className="text-xs text-gray-400">Management Panel</div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Users, BedDouble, MessageSquare, TrendingUp, Calendar, ClipboardList, Settings, LucideLayoutDashboard } from 'lucide-react'
import { useLayout } from "../providers/layout-providers"

interface MenuItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  allowedRoles?: string[]
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: LucideLayoutDashboard, href: "/dashboard", allowedRoles: ["SUPERADMIN", "HOTEL_ADMIN"] }, // Available to all
  { name: "Analytics", icon: Users, href: "/booking/analytics" }, // Available to all
  { name: "Check-Booking", icon: BedDouble, href: "/booking/checkbooking" }, // Available to all
  { name: "Create-Booking", icon: MessageSquare, href: "/booking/createbooking" }, // Available to all
  { name: "Hotel-Setup", icon: TrendingUp, href: "/hotels/settings", allowedRoles: ["SUPERADMIN", "HOTEL_ADMIN"] },
  { name: "Calendar", icon: Calendar, href: "/calendar", allowedRoles: ["SUPERADMIN", "HOTEL_ADMIN"] },
  { name: "Room-Setup", icon: ClipboardList, href: "/room/manage", allowedRoles: ["SUPERADMIN", "HOTEL_ADMIN"] },
  { name: "Room-Type-Setup", icon: ClipboardList, href: "/room-dummy/room-type", allowedRoles: ["SUPERADMIN", "HOTEL_ADMIN"] },
  { name: "Settings", icon: Settings, href: "/settings", allowedRoles: ["SUPERADMIN", "HOTEL_ADMIN"] },
]

export function DashboardSidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useLayout()
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Debug: Log session data
  console.log("Session data:", session)
  console.log("User role:", session?.user?.role)
  console.log("Session status:", status)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isHovering) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 300)
    } else {
      setIsSidebarOpen(true)
    }
    return () => clearTimeout(timeout)
  }, [isHovering, setIsSidebarOpen])

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // If no allowedRoles specified, show to everyone
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true
    }
    
    // If session is still loading, don't filter yet
    if (status === "loading") {
      return true
    }
    
    // If no session or no role, hide restricted items
    if (!session?.user?.role) {
      console.log(`Hiding ${item.name} - no user role`)
      return false
    }
    
    // Check if user's role is in the allowedRoles array
    const hasAccess = item.allowedRoles.includes(session.user.role)
    console.log(`${item.name}: User role "${session.user.role}" ${hasAccess ? 'has' : 'does not have'} access`)
    
    return hasAccess
  })

  console.log("Filtered menu items:", filteredMenuItems.map(item => item.name))

  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl"
      initial={false}
      animate={{
        width: isSidebarOpen ? 240 : 70,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex h-16 items-center justify-center">
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-white"
        >
          {isSidebarOpen ? "Hotel OS" : "HO"}
        </motion.div>
      </div>
      
      {/* Debug info - remove this in production */}
      {isSidebarOpen && session && (
        <div className="px-3 py-2 text-xs text-gray-400">
          Role: {session.user?.role || 'No role'}
        </div>
      )}
      
      <div className="px-3 py-4 my-3">
        {filteredMenuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.name} href={item.href} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`group mb-2 flex cursor-pointer items-center rounded-lg p-2 transition-colors ${
                  active 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  )
}