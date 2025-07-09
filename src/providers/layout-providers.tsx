// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// type LayoutContextType = {
//   isSidebarOpen: boolean
//   setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
// }

// const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

// export function LayoutProvider({ children }: { children: React.ReactNode }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const [isHovering, setIsHovering] = useState(false)

//   useEffect(() => {
//     const handleMouseEnter = () => setIsHovering(true)
//     const handleMouseLeave = () => setIsHovering(false)

//     document.addEventListener("sidebar:hover:enter", handleMouseEnter)
//     document.addEventListener("sidebar:hover:leave", handleMouseLeave)

//     return () => {
//       document.removeEventListener("sidebar:hover:enter", handleMouseEnter)
//       document.removeEventListener("sidebar:hover:leave", handleMouseLeave)
//     }
//   }, [])

//   useEffect(() => {
//     let timeout: NodeJS.Timeout
//     if (!isHovering) {
//       timeout = setTimeout(() => {
//         setIsSidebarOpen(false)
//       }, 300)
//     } else {
//       setIsSidebarOpen(true)
//     }
//     return () => clearTimeout(timeout)
//   }, [isHovering])

//   return <LayoutContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>{children}</LayoutContext.Provider>
// }

// export function useLayout() {
//   const context = useContext(LayoutContext)
//   if (context === undefined) {
//     throw new Error("useLayout must be used within a LayoutProvider")
//   }
//   return context
// }

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type LayoutContextType = {
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
  isPinned: boolean
  setPinned: (pinned: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // Initialize with sidebar always visible (collapsed by default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved state on mount - this runs once per app session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPinned = localStorage.getItem('sidebar-pinned')
      const savedOpen = localStorage.getItem('sidebar-open')
      
      if (savedPinned !== null) {
        const pinned = JSON.parse(savedPinned)
        setIsPinned(pinned)
        
        // If pinned, always open
        if (pinned) {
          setIsSidebarOpen(true)
        } else if (savedOpen !== null) {
          // If not pinned, restore last open state
          setIsSidebarOpen(JSON.parse(savedOpen))
        }
      }
      setIsInitialized(true)
    }
  }, [])

  // Save states to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('sidebar-pinned', JSON.stringify(isPinned))
      localStorage.setItem('sidebar-open', JSON.stringify(isSidebarOpen))
    }
  }, [isPinned, isSidebarOpen, isInitialized])

  // Handle hover events
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsHovering(true)
    }
    
    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    document.addEventListener("sidebar:hover:enter", handleMouseEnter)
    document.addEventListener("sidebar:hover:leave", handleMouseLeave)

    return () => {
      document.removeEventListener("sidebar:hover:enter", handleMouseEnter)
      document.removeEventListener("sidebar:hover:leave", handleMouseLeave)
    }
  }, [])

  // Auto-collapse logic (only when not pinned)
  useEffect(() => {
    if (!isInitialized) return
    if (isPinned) {
      // If pinned, always keep open
      setIsSidebarOpen(true)
      return
    }

    let timeout: NodeJS.Timeout
    if (!isHovering) {
      timeout = setTimeout(() => {
        setIsSidebarOpen(false)
      }, 300)
    } else {
      setIsSidebarOpen(true)
    }
    return () => clearTimeout(timeout)
  }, [isHovering, isPinned, isInitialized])

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }

  const setPinned = (pinned: boolean) => {
    setIsPinned(pinned)
    if (pinned) {
      setIsSidebarOpen(true) // Open when pinned
    }
  }

  return (
    <LayoutContext.Provider 
      value={{ 
        isSidebarOpen, 
        setIsSidebarOpen, 
        toggleSidebar,
        isPinned,
        setPinned
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}