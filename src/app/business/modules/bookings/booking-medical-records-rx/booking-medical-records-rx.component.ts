import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProviderServices } from "../../../../business/services/provider-services.service";

@Component({
  selector: 'app-booking-medical-records-rx',
  templateUrl: './booking-medical-records-rx.component.html',
  styleUrls: ['./booking-medical-records-rx.component.css']
})
export class BookingMedicalRecordsRXComponent implements OnInit {
  @Input() customerId;
  @Input() providerId;
  @Input() waitlist_data;
  @Input() source;
  @Input() type;
  mrList: any = [];
  rxList: any = [];
  loading = false;
  waitlistmr: any = [];
  small_device_display = false;
  constructor(private provider_services: ProviderServices,
    private router: Router) { }

  ngOnInit(): void {
    this.onResize();
    if (this.source !== 'details' || (this.source === 'details' && (this.waitlist_data.waitlistStatus && this.waitlist_data.waitlistStatus !== 'blocked') || (this.waitlist_data.apptStatus && this.waitlist_data.apptStatus !== 'blocked'))) {
      this.getMedicalRecords();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getMedicalRecords() {
    this.loading = true;
    const filter = {};
    if (this.customerId) {
      filter['patientId-eq'] = this.customerId;
    }
    if (this.providerId) {
      filter['provider-eq'] = this.providerId;
    }
    this.provider_services.GetMedicalRecordList(filter)
      .subscribe((data: any) => {
        if(this.customerId || this.providerId){
          this.mrList = data;
          this.rxList = this.mrList.filter(mr => mr.prescriptionCreated);
          if (this.source === 'details') {
            const uuid = (this.waitlist_data.waitlistStatus) ? this.waitlist_data.ynwUuid : this.waitlist_data.uid;
            this.waitlistmr = this.mrList.filter(mr => mr.uuid === uuid);
          }
        }
        else{
          this.mrList = [];
          this.rxList = [];
        }
       
        this.loading = false;
      });
  }
  gotoMrDetails(mr) {
    console.log('this.type',this.type)
    let bookingId;
    let bookingType;
    // const mrId = (mr.id) ? mr.id : (this.waitlistmr[0]) ? this.waitlistmr[0].id : 0;
    const mrId=0;
    const consumerId = (this.customerId) ? this.customerId : mr.providerConsumer.id;
    if (mr.bookingType) {
      bookingType = mr.bookingType;
      bookingId = (mr.uuid) ? mr.uuid : 0;
    } else {
      bookingType = (this.source === 'customer-details') ? 'FOLLOWUP' : (this.waitlist_data.waitlistStatus) ? 'TOKEN' : 'APPT';
      bookingId = (this.source === 'customer-details') ? 0 : (this.waitlist_data.ynwUuid) ? this.waitlist_data.ynwUuid : this.waitlist_data.uid;
    }
    if (this.type === 'rx') {
      this.router.navigate(['provider', 'customers', consumerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
    } else {
      this.router.navigate(['provider', 'customers', consumerId, bookingType, bookingId, 'medicalrecord', mrId,'clinicalnotes']);
    }
  }
  gotoMrList() {
    const qparams = { 'calledfrom': 'list' };
    if (this.providerId) {
      qparams['providerId'] = this.providerId
    }
    const navigationExtras: NavigationExtras = {
      queryParams: qparams
    };
    const id = (this.customerId) ? this.customerId : 'all';
    this.router.navigate(['provider', 'customers', id, 'FOLLOWUP', 0, 'medicalrecord', 0, 'list'], navigationExtras);
  }
  showAddRecord() {
    if (this.source === 'dashboard') {
      return false;
    }
    if (this.source === 'details') {
      if (this.type === 'mr' && this.waitlistmr.length > 0) {
        return false;
      }
      if (this.type === 'rx' && this.waitlistmr.length > 0 && this.waitlistmr[0].prescriptionCreated) {
        return false;
      }
    }
    return true;
  }
}
