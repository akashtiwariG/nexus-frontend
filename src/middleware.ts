// // import { NextResponse } from "next/server"
// // import type { NextRequest } from "next/server"
// // import { getToken } from "next-auth/jwt"

// // // Configure which paths should be protected
// // const protectedPaths = ["/dashboard", "/profile", "/settings", "/admin", "/hotel-setup", "/hotels/settings", "/booking"]

// // // Paths that should be accessible to logged in users (redirect to dashboard if logged in)
// // const authRoutes = ["/login", "/signup", "/forgot-password"]

// // // Public paths that don't need authentication
// // const publicPaths = ["/", "/api", "/_next", "/favicon.ico"]

// // export default async function middleware(request: NextRequest) {
// //   const { pathname } = request.nextUrl

// //   // Skip middleware for public paths, API routes, and static files
// //   if (publicPaths.some((path) => pathname.startsWith(path))) {
// //     return NextResponse.next()
// //   }

// //   try {
// //     // Get the token (if it exists)
// //     const token = await getToken({
// //       req: request,
// //       secret: process.env.NEXTAUTH_SECRET,
// //     })

// //     console.log("Middleware - Path:", pathname)
// //     console.log("Middleware - Token exists:", !!token)
// //     console.log("Middleware - User ID:", token?.uid || token?.sub)

// //     // Check if the path is a protected route
// //     const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

// //     // Check if the path is an auth route (login, signup)
// //     const isAuthPath = authRoutes.some((path) => pathname.startsWith(path))

// //     // If the path is protected and the user is not logged in,
// //     // redirect to the login page
// //     if (isProtectedPath && !token) {
// //       const url = new URL("/login", request.url)
// //       url.searchParams.set("callbackUrl", encodeURI(pathname))
// //       console.log("Middleware - Redirecting to login:", url.toString())
// //       return NextResponse.redirect(url)
// //     }

// //     // If the user is logged in and trying to access auth pages,
// //     // redirect to the dashboard
// //     if (isAuthPath && token) {
// //       console.log("Middleware - Redirecting authenticated user to dashboard")
// //       return NextResponse.redirect(new URL("/dashboard", request.url))
// //     }

// //     // Allow the request to continue
// //     return NextResponse.next()
// //   } catch (error) {
// //     console.error("Middleware error:", error)
// //     return NextResponse.next()
// //   }
// // }

// // // Configure which paths the middleware should run on
// // export const config = {
// //   matcher: [
// //     /*
// //      * Match all request paths except for the ones starting with:
// //      * - api (API routes)
// //      * - _next/static (static files)
// //      * - _next/image (image optimization files)
// //      * - favicon.ico (favicon file)
// //      */
// //     "/((?!api|_next/static|_next/image|favicon.ico).*)",
// //   ],
// // }


// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { getToken } from "next-auth/jwt"

// // Define role-based access control
// const rolePermissions = {
//   super_admin: [
//     "/dashboard", "/profile", "/settings", "/admin", 
//     "/hotel-setup", "/hotels/settings", "/booking", 
//     "/booking/createbooking", "/booking/checkbooking"
//   ],
//   hotel_admin: [
//     "/dashboard", "/profile", "/settings", "/admin", 
//     "/booking", "/booking/createbooking", "/booking/checkbooking"
//     // Excluding: /hotel-setup, /hotels/settings
//   ],
//   front_desk: [
//     "/dashboard", "/booking/createbooking", "/booking/checkbooking"
//     // Only these specific pages
//   ]
// }

// // All protected paths (union of all role permissions)
// const protectedPaths = [
//   "/dashboard", "/profile", "/settings", "/admin", 
//   "/hotel-setup", "/hotels/settings", "/booking",
//   "/booking/createbooking", "/booking/checkbooking"
// ]

// // Paths that should be accessible to logged in users (redirect to dashboard if logged in)
// const authRoutes = ["/login", "/signup", "/forgot-password"]

// // Public paths that don't need authentication
// const publicPaths = ["/", "/api", "/_next", "/favicon.ico"]

// function hasPermission(userRole: string, requestedPath: string): boolean {
//   const allowedPaths = rolePermissions[userRole as keyof typeof rolePermissions] || []
  
//   // Check if the requested path matches any allowed path
//   return allowedPaths.some(allowedPath => {
//     // Exact match or path starts with allowed path (for nested routes)
//     return requestedPath === allowedPath || requestedPath.startsWith(allowedPath + "/")
//   })
// }

// export default async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Skip middleware for public paths, API routes, and static files
//   if (publicPaths.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next()
//   }

//   try {
//     // Get the token (if it exists)
//     const token = await getToken({
//       req: request,
//       secret: process.env.NEXTAUTH_SECRET,
//     })

//     console.log("Middleware - Path:", pathname)
//     console.log("Middleware - Token exists:", !!token)
//     console.log("Middleware - User Role:", token?.role)

//     // Check if the path is a protected route
//     const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

//     // Check if the path is an auth route (login, signup)
//     const isAuthPath = authRoutes.some((path) => pathname.startsWith(path))

//     // If the path is protected and the user is not logged in,
//     // redirect to the login page
//     if (isProtectedPath && !token) {
//       const url = new URL("/login", request.url)
//       url.searchParams.set("callbackUrl", encodeURI(pathname))
//       console.log("Middleware - Redirecting to login:", url.toString())
//       return NextResponse.redirect(url)
//     }

//     // If the user is logged in and trying to access auth pages,
//     // redirect to the dashboard
//     if (isAuthPath && token) {
//       console.log("Middleware - Redirecting authenticated user to dashboard")
//       return NextResponse.redirect(new URL("/dashboard", request.url))
//     }

//     // Role-based access control for protected paths
//     if (isProtectedPath && token) {
//       const userRole = token.role as string
      
//       if (!hasPermission(userRole, pathname)) {
//         console.log(`Middleware - Access denied for role ${userRole} to path ${pathname}`)
        
//         // Redirect to dashboard with error message
//         const url = new URL("/dashboard", request.url)
//         url.searchParams.set("error", "access_denied")
//         return NextResponse.redirect(url)
//       }
//     }

//     // Allow the request to continue
//     return NextResponse.next()
//   } catch (error) {
//     console.error("Middleware error:", error)
//     return NextResponse.next()
//   }
// }

// // Configure which paths the middleware should run on
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// }

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define role-based access control with consistent role names
const rolePermissions = {
  SUPERADMIN: [
    "/dashboard", "/profile", "/settings", "/admin", 
    "/hotel-setup", "/hotels/settings", "/booking", 
    "/booking/createbooking", "/booking/checkbooking",
    "/room/manage", "/room", "/calendar"
  ],
  HOTEL_ADMIN: [
    "/dashboard", "/profile", "/settings", "/admin", 
    "/booking", "/booking/createbooking", "/booking/checkbooking",
    "/room/manage", "/room", "/calendar"
    // Excluding: /hotel-setup, /hotels/settings
  ],
  FRONT_DESK: [
    "/dashboard", "/booking/createbooking", "/booking/checkbooking"
    // Only these specific pages
  ]
}

// All protected paths (union of all role permissions)
const protectedPaths = [
  "/dashboard", "/profile", "/settings", "/admin", 
  "/hotel-setup", "/hotels/settings", "/booking",
  "/booking/createbooking", "/booking/checkbooking",
  "/room/manage", "/room", "/calendar"
]

// Paths that should be accessible to logged in users (redirect to dashboard if logged in)
const authRoutes = ["/login", "/signup", "/forgot-password"]

// Public paths that don't need authentication
const publicPaths = ["/", "/api", "/_next", "/favicon.ico", "/public"]

function hasPermission(userRole: string, requestedPath: string): boolean {
  // Normalize role to uppercase for consistency
  const normalizedRole = userRole?.toUpperCase()
  const allowedPaths = rolePermissions[normalizedRole as keyof typeof rolePermissions] || []
  
  // Check if the requested path matches any allowed path
  return allowedPaths.some(allowedPath => {
    // Exact match or path starts with allowed path (for nested routes)
    return requestedPath === allowedPath || requestedPath.startsWith(allowedPath + "/")
  })
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public paths, API routes, and static files
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  try {
    // Get the token (if it exists)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log("Middleware - Path:", pathname)
    console.log("Middleware - Token exists:", !!token)
    console.log("Middleware - User Role:", token?.role)

    // Check if the path is a protected route
    const isProtectedPath = protectedPaths.some((path) => 
      pathname === path || pathname.startsWith(path + "/")
    )

    // Check if the path is an auth route (login, signup)
    const isAuthPath = authRoutes.some((path) => 
      pathname === path || pathname.startsWith(path + "/")
    )

    // If the path is protected and the user is not logged in,
    // redirect to the login page
    if (isProtectedPath && !token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      console.log("Middleware - Redirecting to login:", url.toString())
      return NextResponse.redirect(url)
    }

    // If the user is logged in and trying to access auth pages,
    // redirect to the dashboard
    if (isAuthPath && token) {
      console.log("Middleware - Redirecting authenticated user to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Role-based access control for protected paths
    if (isProtectedPath && token) {
      const userRole = token.role as string
      
      if (!hasPermission(userRole, pathname)) {
        console.log(`Middleware - Access denied for role ${userRole} to path ${pathname}`)
        
        // Redirect to dashboard with error message
        const url = new URL("/dashboard", request.url)
        url.searchParams.set("error", "access_denied")
        url.searchParams.set("message", `Access denied. Required role permissions not met.`)
        return NextResponse.redirect(url)
      } else {
        console.log(`Middleware - Access granted for role ${userRole} to path ${pathname}`)
      }
    }

    // Allow the request to continue
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}