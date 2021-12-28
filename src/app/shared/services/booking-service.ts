import { Injectable } from "@angular/core";
import { ServiceMeta } from "./service-meta";

@Injectable()
export class BookingService {
  constructor(private servicemeta: ServiceMeta) { }



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

  /**
   * To get all the checkin services of a particular location
   * @param locid location id
   * @returns services
   */
  getServicesByLocationId(locid) {
    if (locid) {
      const url = 'consumer/waitlist/services/' + locid;
      return this.servicemeta.httpGet(url);
    }
  }

  /**
   * To get all the checkin services of a particular location
   * @param locationId location id
   * @returns Promise of services
   */
  getCheckinServices(locationId) {
    const _this = this;
    return new Promise(function (resolve) {
      _this.getServicesByLocationId(locationId)
        .subscribe((wlServices: any) => {
          resolve(wlServices);
        },
          () => {
            resolve([]);
          }
        );
    });
  }
  
    /**
   * To get all the appointent services of a particular location
   * @param locid location id
   * @returns services
   */
  getServicesforAppontmntByLocationId(locid) {
    if (locid) {
      const url = 'consumer/appointment/service/' + locid;
      return this.servicemeta.httpGet(url);
    }
  }

  /**
   * To get all the appointment services of a particular location
   * @param locationId location id
   * @returns Promise of services
   */
  getAppointmentServices(locationId) {
    const _this = this;
    return new Promise(function (resolve) {
      _this.getServicesforAppontmntByLocationId(locationId)
        .subscribe((apptServices: any) => {
          resolve(apptServices);
        },
          () => {
            resolve([]);
          }
        );
    });
  }
}