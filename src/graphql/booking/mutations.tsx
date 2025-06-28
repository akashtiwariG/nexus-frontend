// import { gql } from "@apollo/client";

// export const CREATE_BOOKING = gql`
//   mutation CreateBooking($bookingData: BookingInput!) {
//     createBooking(bookingData: $bookingData) {
//       id
//       bookingNumber
//       bookingStatus
//     }
//   }
// `;
import { gql } from "@apollo/client"

export const CREATE_BOOKING = gql`
  mutation CreateBooking($bookingData: BookingInput!) {
    createBooking(bookingData: $bookingData) {
      id
      bookingNumber
      hotelId
      checkInDate
      checkOutDate
      numberOfGuests
      bookingSource
      specialRequests
      guest {
        firstName
        lastName
        email
        phone
      }
      roomTypeBookings {
        roomType
        numberOfRooms
      }
    }
  }
`
