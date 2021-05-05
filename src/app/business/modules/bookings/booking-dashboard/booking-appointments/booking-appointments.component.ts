import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { projectConstants } from '../../../../../app.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-appointments',
  templateUrl: './booking-appointments.component.html',
  styleUrls: ['./booking-appointments.component.css']
})
export class BookingAppointmentsComponent implements OnInit {

  startedAppts: any = [];
  selQIds: any = [];
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    appointmentEncId: '',
    patientId: '',
    appointmentMode: 'all',
    schedule: 'all',
    location: 'all',
    service: 'all',
    apptStatus: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1,
    future_appt_date: null,
    age: 'all',
    gender: 'all'
  };
  activeSchedules: any = [];
  chkSelectAppointments = false;
  appt_list: any = [];
  todayAppointments = [];
  futureAppointments = [];
  filterapplied = false;
  noFilter = true;
  check_in_filtered_list: any = [];
  statusAction = 'new';
  apptByTimeSlot: any = [];
  scheduleSlots: any = [];
  loading = true;
  availableSlotDetails: any = [];
  selected_location = null;
  today_waitlist_count: any = 0;
  future_waitlist_count: any = 0;
  history_waitlist_count: any = 0;
  today_checkins_count = 0;
  today_arrived_count = 0;
  today_started_count = 0;
  today_completed_count = 0;
  today_cancelled_count = 0;
  today_rejected_count = 0;
  today_cancelled_checkins_count = 0;
  today_checkedin_count = 0;
  today_bloacked_count = 0;
  scheduled_count = 0;
  started_count = 0;
  cancelled_count = 0;
  completed_count = 0;
  labelFilterData = '';
  selected_type = '';
  server_date;
  time_type = 1;
  token;
  services: any = [];
  apptModes: any = [];
  paymentStatuses: any = [];
  apptStatuses: any = [];
  ageGroups: any = [];
  filteredSchedule: any = [];
  filterLocation: any = [];
  genderList: any = [];
  @ViewChildren('appSlots') slotIds: QueryList<ElementRef>;

  constructor(
    private groupService: GroupStorageService,
    private provider_services: ProviderServices,
    private dateTimeProcessor: DateTimeProcessor,
    private lStorageService: LocalStorageService,

    private shared_services: SharedServices,
    private shared_functions: SharedFunctions
  ) { }

  ngOnInit(): void {
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.getTodayAppointments();
  }

  getTodayAppointments() {
    const Mfilter = this.setFilterForApi();
    if (this.groupService.getitemFromGroupStorage('appt_selQ')) {
      this.selQIds = this.groupService.getitemFromGroupStorage('appt_selQ');
    } else {

    }
    if (this.selQIds) {
      Mfilter['schedule-eq'] = this.selQIds.toString();
      const qs = [];
      qs.push(this.selQIds);
      this.groupService.setitemToGroupStorage('appt_selQ', this.selQIds);
      this.groupService.setitemToGroupStorage('appt_history_selQ', qs);
      this.groupService.setitemToGroupStorage('appt_future_selQ', this.selQIds);
    }
    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    // this.resetPaginationData();
    // this.pagination.startpageval = 1;
    // this.pagination.totalCnt = 0;
    // if (this.activeSchedules.length > 0) {
      const promise = this.getTodayAppointmentsCount(Mfilter);
      promise.then(
        result => {
          this.chkSelectAppointments = false;
          this.provider_services.getTodayAppointments(Mfilter)
            .subscribe(
              (data: any) => {
                this.appt_list = data;
                this.todayAppointments = this.shared_functions.groupBy(this.appt_list, 'apptStatus');
                if (this.filterapplied === true) {
                  this.noFilter = false;
                } else {
                  this.noFilter = true;
                }
                this.setCounts(this.appt_list);
                this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, this.statusAction);
                this.apptByTimeSlot = this.shared_functions.groupBy(this.check_in_filtered_list, 'appmtTime');
                this.handleApptSelectionType();
                this.startedAppts = this.getActiveAppointments(this.todayAppointments, 'started');
                console.log(this.startedAppts);
              },
              () => {
                // this.load_waitlist = 1;
                this.loading = false;
              },
              () => {
                this.loading = false;
                setTimeout(() => {
                  const activeTimeSlot = this.getActiveTimeSlot(this.availableSlotDetails.availableSlots);
                  if (activeTimeSlot !== '') {
                    this.scrollToSection(activeTimeSlot);
                  }
                }, 500);

              });
        });
    // }
    //  else {
    //   this.loading = false;
    // }
  }
  getTodayAppointmentsCount(Mfilter = null) {
    const queueid = this.groupService.getitemFromGroupStorage('appt_selQ');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      if (this.selected_location && this.selected_location.id) {
        Mfilter['location-eq'] = this.selected_location.id;
      }
      if (queueid) {
        Mfilter['schedule-eq'] = queueid;
      }
      no_filter = true;
    }
    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    return new Promise((resolve) => {
      this.provider_services.getTodayAppointmentsCount(Mfilter)
        .subscribe(
          data => {
            if (no_filter) { this.today_waitlist_count = data; }
            resolve(data);
          },
          () => {
          });
    });
  }
  setCounts(list) {
    this.today_arrived_count = this.getCount(list, 'Arrived');
    this.today_checkedin_count = this.getCount(list, 'Confirmed');
    this.today_bloacked_count = this.getCount(list, 'blocked');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count + this.today_bloacked_count;
    this.today_started_count = this.getCount(list, 'Started');
    this.today_completed_count = this.getCount(list, 'Completed');
    this.today_cancelled_count = this.getCount(list, 'Cancelled');
    this.today_rejected_count = this.getCount(list, 'Rejected');
    this.today_cancelled_checkins_count = this.today_cancelled_count + this.today_rejected_count;
    this.scheduled_count = this.today_checkins_count;
    this.started_count = this.today_started_count;
    this.completed_count = this.today_completed_count;
    this.cancelled_count = this.today_cancelled_checkins_count;
    this.today_waitlist_count = this.today_checkins_count + this.today_started_count + this.today_completed_count + this.today_cancelled_checkins_count;
  }
  getActiveAppointments(appointments, status) {
    if (status === 'new') {
      return this.getScheduledAppointment(appointments);
    } else if (status === 'started') {
      return this.getStartedAppointment(appointments);
    } else if (status === 'completed') {
      return this.getCompletedAppointment(appointments);
    } else {
      return this.getCancelledAppointment(appointments);
    }
  }
  getScheduledAppointment(appointments) {
    let scheduledList = [];
    if (appointments['Confirmed']) {
      scheduledList = appointments['Confirmed'].slice();
    }
    if (appointments['Arrived']) {
      Array.prototype.push.apply(scheduledList, appointments['Arrived'].slice());
    }
    if (appointments['blocked']) {
      Array.prototype.push.apply(scheduledList, appointments['blocked'].slice());
    }
    this.sortCheckins(scheduledList);
    return scheduledList;
  }
  getCancelledAppointment(appointments) {
    let cancelledList = [];
    if (appointments['Cancelled']) {
      cancelledList = appointments['Cancelled'].slice();
    }
    if (appointments['Rejected']) {
      Array.prototype.push.apply(cancelledList, appointments['Rejected'].slice());
    }
    return cancelledList;
  }
  getStartedAppointment(appointments) {
    let startedList = [];
    if (appointments['Started']) {
      startedList = appointments['Started'].slice();
    }
    return startedList;
  }
  getCompletedAppointment(appointments) {
    let completedList = [];
    if (appointments['Completed']) {
      completedList = appointments['Completed'].slice();
    }
    if (appointments['Settled']) {
      Array.prototype.push.apply(completedList, appointments['Settled'].slice());
    }
    return completedList;
  }
  handleApptSelectionType(type?) {
    if (type) {
      this.selected_type = type;
    }
    this.groupService.setitemToGroupStorage('selected_type', this.selected_type);
    this.scheduleSlots = [];
    if (this.selected_type !== 'booked' && this.selQIds.length > 0) {
      this.loading = true;
      const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
      const today = moment(server).format('YYYY-MM-DD');
      const schIds = this.selQIds.toString();
      const ids = schIds.replace(/,/g, '-');
      this.getSlotBYScheduleandDate(ids, today);
    }
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.time_type === 1) {
      if (this.selQIds) {
        api_filter['schedule-eq'] = this.selQIds.toString();
      }
      if (this.token && this.time_type === 1) {
        api_filter['token-eq'] = this.token;
      }
    }
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.phone_number !== '') {
      api_filter['phoneNo-eq'] = this.filter.phone_number;
    }
    if (this.filter.appointmentEncId !== '') {
      api_filter['appointmentEncId-eq'] = this.filter.appointmentEncId;
    }
    if (this.filter.patientId !== '') {
      api_filter['appmtFor-eq'] = this.getPatientIdFilter(this.filter.patientId);
    }
    if (this.services.length > 0 && this.filter.service !== 'all') {
      api_filter['service-eq'] = this.services.toString();
    }
    if (this.apptStatuses.length > 0 && this.filter.apptStatus !== 'all') {
      api_filter['apptStatus-eq'] = this.apptStatuses.toString();
    }
    if (this.apptModes.length > 0 && this.filter.appointmentMode !== 'all') {
      api_filter['appointmentMode-eq'] = this.apptModes.toString();
    }
    if (this.time_type !== 1) {
      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_end_date);
      }
    }
    if (this.paymentStatuses.length > 0 && this.filter.payment_status !== 'all') {
      api_filter['paymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.time_type === 3) {
      if (this.filteredSchedule.length > 0 && this.filter.schedule !== 'all') {
        api_filter['schedule-eq'] = this.filteredSchedule.toString();
      }
      if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
        api_filter['location-eq'] = this.filterLocation.toString();
      }
      if (this.ageGroups.length > 0 && this.filter.age !== 'all') {
        const kids = moment(new Date()).add(-12, 'year').format('YYYY-MM-DD');
        const adults = moment(new Date()).add(-60, 'year').format('YYYY-MM-DD');
        if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-ge'] = kids;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-le'] = kids;
          api_filter['dob-ge'] = adults;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = adults;
        } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-ge'] = adults;
        } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = adults;
          api_filter['dob-ge'] = kids;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = kids;
        }
      }
      if (this.genderList.length > 0 && this.filter.gender !== 'all') {
        api_filter['gender-eq'] = this.genderList.toString();
      }
    }
    if (this.time_type !== 3) {
      if (this.selected_location && this.selected_location.id) {
        api_filter['location-eq'] = this.selected_location.id;
      }
    }
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
    }
    // if (this.filter.apptStatus === 'all' && this.time_type === 3 && this.firstTime) {
    //   api_filter['apptStatus-eq'] = this.setWaitlistStatusFilterForHistory();
    // }
    return api_filter;
  }
  getActiveTimeSlot(slots) {
    const curDate = new Date();
    const curTime = curDate.getHours() + ':' + curDate.getMinutes();
    let activeTime = '';
    if (slots && slots.length > 1) {
      activeTime = slots[0].time.split('-')[0];
      for (let indx = 0; indx < slots.length; indx++) {
        if (slots[indx].time.split('-')[0] > curTime) {
          break;
        }
        activeTime = this.getSingleTime(slots[indx].time);
      }
    }
    return activeTime;
  }
  scrollToSection(curTime) {
    // if (this.time_type === 2) {
    //   this.slotIds.toArray().forEach(element => {
    //     if (element.nativeElement.innerText === this.futureUnAvailableSlots[0]) {
    //       element.nativeElement.scrollIntoViewIfNeeded();
    //       return false;
    //     }
    //   });
    // }
    // if (this.time_type === 1) {
    this.slotIds.toArray().forEach(element => {
      if (element.nativeElement.innerText === curTime) {
        element.nativeElement.scrollIntoViewIfNeeded({ behavior: 'smooth', block: 'start' });
        return false;
      }
    });
    // }
  }
  getCount(list, status) {
    return list.filter(function (elem) {
      return elem.apptStatus === status;
    }).length;
  }
  sortCheckins(checkins) {
    checkins.sort(function (message1, message2) {
      if (message1.appmtTime > message2.appmtTime) {
        return 11;
      } else if (message1.appmtTime < message2.appmtTime) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  getSlotBYScheduleandDate(scheduleid, date) {
    this.provider_services.getSlotsByScheduleandDate(scheduleid, date).subscribe(
      (data: any) => {
        this.scheduleSlots = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].availableSlots) {
            for (let j = 0; j < data[i].availableSlots.length; j++) {
              if ((this.selected_type === 'all' && this.apptByTimeSlot[data[i].availableSlots[j].time] && this.apptByTimeSlot[data[i].availableSlots[j].time][0].schedule.id === data[i].scheduleId) || (data[i].availableSlots[j].active && data[i].availableSlots[j].noOfAvailbleSlots !== '0')) {
                data[i].availableSlots[j]['scheduleId'] = data[i].scheduleId;
                if (this.scheduleSlots.indexOf(data[i].availableSlots[j]) === -1) {
                  this.scheduleSlots.push(data[i].availableSlots[j]);
                }
              }
            }
          }
        }
        setTimeout(() => {
          this.loading = false;
        }, 200);
      }
    );
  }
  getPatientIdFilter(patientid) {
    const idFilter = 'memberJaldeeId::' + patientid;
    return idFilter;
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }

}

