import { Injectable } from "@angular/core";
import { TeleBooking } from "../models/booking-model";
import { DateTimeProcessor } from "./datetime-processor.service";
import { ServiceMeta } from "./service-meta";

@Injectable({
    providedIn: 'root'
})

export class TeleBookingService {

    constructor(private servicemeta: ServiceMeta, private dateTimeProcessor: DateTimeProcessor) { }

    getAvailableBookings(countrycode, phonenumber) {
        console.log("getAvailableBookings");
        let bookings = [];
        return new Promise((resolve, reject) => {
            this.getAvailableBookingAppointments(countrycode, phonenumber).then(
                (appointments: any) => {
                    for (let i = 0; i < appointments.length; i++) {
                        let busName = "";
                        let busId = ""
                        let userName;
                        let userId;
                        if (appointments[i].provider) {
                            userName = appointments[i].provider.firstName + ' ' + appointments[i].provider.lastName;
                            userId = appointments[i].provider.id;
                        } else {
                            busName = appointments[i].providerAccount.businessName;
                            busId = appointments[i].providerAccount.id;
                        }
                        let consumerName = "";
                        if (appointments[i].appmtFor[0].firstName) {
                            consumerName = appointments[i].appmtFor[0].firstName;
                        }
                        if (appointments[i].appmtFor[0].lastName) {
                            consumerName += " " + appointments[i].appmtFor[0].lastName;
                        }
                        let teleMode = 'video';
                        if (appointments[i].service.virtualServiceType && appointments[i].service.virtualServiceType === 'audioService') {
                            teleMode = 'audio';
                        }
                        let teleUrl = '';
                        if (appointments[i].service.virtualCallingModes[0].callingMode !== 'VideoCall' && appointments[i].service.virtualCallingModes[0].callingMode !== 'WhatsApp') {
                            teleUrl = appointments[i].service.virtualCallingModes[0].value;
                        }
                        let bookingWindow = '';
                        bookingWindow = appointments[i].schedule.apptSchedule.timeSlots[0].sTime + " - " +
                            appointments[i].schedule.apptSchedule.timeSlots[0].eTime;
                        let bookingTime = this.getSingleTime(appointments[i].appmtTime);
                        
                        let bookingStatus = appointments[i].apptStatus;

                        if (appointments[i].apptStatus === 'Started') {
                            bookingStatus = 'is waiting for you';
                        }

                        let booking = new TeleBooking(appointments[i].appmtDate, bookingTime, '',
                            bookingWindow, appointments[i].appointmentEncId, 'appt', appointments[i].service.name,
                            busName, busId, userName, userId, appointments[i].uid, appointments[i].service.virtualCallingModes[0].callingMode,
                            teleMode, teleUrl, bookingStatus, '', consumerName, appointments[i].location.place,
                            appointments[i].location.googleMapUrl);
                        bookings.push(booking);
                    }
                    this.getAvaiableBookingCheckins(countrycode, phonenumber).then(
                        (checkins: any) => {
                            console.log(checkins);
                            for (let i = 0; i < checkins.length; i++) {
                                let token = '';
                                if (checkins[i].showToken) {
                                    console.log(checkins[i].token);
                                    if(checkins[i].token) {
                                        token = checkins[i].token;
                                    } else {
                                        token = '1';
                                    }
                                    
                                }
                                let bookingTime = '';
                                if (checkins[i].serviceTime) {
                                    bookingTime = checkins[i].serviceTime;
                                } 
                                let busName = "";
                                let busId = "";
                                let userId;
                                let userName;
                                if (checkins[i].provider) {
                                    userName = checkins[i].provider.firstName + ' ' + checkins[i].provider.lastName;
                                    userId = checkins[i].provider.id;
                                } else {
                                    busName = checkins[i].providerAccount.businessName;
                                    busId = checkins[i].providerAccount.id;
                                }
                                let consumerName = "";
                                if (checkins[i].waitlistingFor[0].firstName) {
                                    consumerName = checkins[i].waitlistingFor[0].firstName;
                                }
                                if (checkins[i].waitlistingFor[0].lastName) {
                                    consumerName += " " + checkins[i].waitlistingFor[0].lastName;
                                }
                                let teleMode = 'video';
                                if (checkins[i].service.virtualServiceType && checkins[i].service.virtualServiceType === 'audioService') {
                                    teleMode = 'audio';
                                }
                                let teleUrl = '';
                                if (checkins[i].service.virtualCallingModes[0].callingMode !== 'VideoCall' && checkins[i].service.virtualCallingModes[0].callingMode !== 'WhatsApp') {
                                    teleUrl = checkins[i].service.virtualCallingModes[0].value;
                                }
                                let bookingWindow = '';
                                bookingWindow = checkins[i].queue.queueStartTime + " - " +
                                    checkins[i].queue.queueEndTime;

                                let bookingStatus = checkins[i].waitlistStatus;
                                if (checkins[i].waitlistStatus === 'started') {
                                    bookingStatus = 'Doctor is waiting for you';
                                }

                                let booking = new TeleBooking(checkins[i].date, bookingTime,
                                     bookingWindow, token, checkins[i].checkinEncId, 'wl', checkins[i].service.name,
                                    busName, busId, userName, userId, checkins[i].ynwUuid, checkins[i].service.virtualCallingModes[0].callingMode,
                                    teleMode, teleUrl, bookingStatus, '', consumerName, checkins[i].queue.location.place,
                                    checkins[i].queue.location.googleMapUrl);
                                bookings.push(booking);
                            }
                            resolve(bookings);
                        });
                });
        });
    }
    getSingleTime(slot) {
        const slots = slot.split('-');
        return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
    getAvailableBookingAppointments(countrycode, phonenumber) {
        return new Promise((resolve, reject) => {
            this.getAvailableTeleAppointments(countrycode, phonenumber).subscribe(
                (appointments: any) => {
                    resolve(appointments);
                }, () => {
                    resolve([]);
                }
            )
        });
    }
    getAvaiableBookingCheckins(countrycode, phonenumber) {
        return new Promise((resolve, reject) => {
            this.getAvailableTeleCheckins(countrycode, phonenumber).subscribe(
                (checkins: any) => {
                    resolve(checkins);
                }, () => {
                    resolve([]);
                }
            )
        });
    }

    getAvailableTeleAppointments(countrycode, phonenumber) {
        const url = 'consumer/appointment/meeting/' + countrycode + '/' + phonenumber;
        return this.servicemeta.httpGet(url);
    }

    getAvailableTeleCheckins(countrycode, phonenumber) {
        const url = 'consumer/waitlist/meeting/' + countrycode + '/' + phonenumber;
        return this.servicemeta.httpGet(url);
    }
}
