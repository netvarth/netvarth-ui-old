import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable()
export class BookingService {
    constructor(private servicemeta: ServiceMeta) {}


    
    cancelBooking() {

    }

    /**
     * Cancel a Booking (Waitlist/Appointment/Order)
     * @param bookingId Booking Id
     * @param params accountId
     * @param type order/checkin/appointment
     * @returns true if success
     */
    cancelBookingAPI(bookingId, params, type) {
        if (type === 'checkin') {
          return this.servicemeta.httpDelete('consumer/waitlist/' + bookingId + '?account=' + params['account']);
        } else if (type === 'appointment') {
          return this.servicemeta.httpPut('consumer/appointment/cancel/' + bookingId + '?account=' + params['account']);
        } else if (type === 'order') {
          return this.servicemeta.httpPut('consumer/orders/' + bookingId + '?account=' + params['account']);
        }
      }
}