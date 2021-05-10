import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { projectConstants } from '../../../../../app.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
// import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-checkins',
  templateUrl: './booking-checkins.component.html',
  styleUrls: ['./booking-checkins.component.css']
})
export class BookingCheckinsComponent implements OnInit {
  loading = false;
  selQIds: any = [];
  selectedView: any;
  activeQs: any = [];
  chkSelectAppointments = false;
  appt_list: any = [];
  todayAppointments = [];
  filterapplied = false;
  noFilter = true;
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
  today_blocked_count = 0;
  scheduled_count = 0;
  started_count = 0;
  cancelled_count = 0;
  completed_count = 0;
  check_in_filtered_list: any = [];
  selected_location = null;
  startedCheckins: any = [];
  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    checkinEncId: '',
    patientId: '',
    queue: 'all',
    location: 'all',
    service: 'all',
    waitlist_status: 'all',
    waitlistMode: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1,
    futurecheckin_date: null,
    age: 'all',
    gender: 'all'
  };
  statusAction = 'new';
  time_type = 1;
  server_date;
  Mfilter: any = [];

  constructor(
    // private groupService: GroupStorageService,
    private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private lStorageService: LocalStorageService,
    private provider_services: ProviderServices

  ) { }

  ngOnInit(): void {
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    this.getTodayWL();
  }

  getTodayWL() {
    this.Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    console.log(this.Mfilter)

      const promise = this.getTodayWLCount(this.Mfilter);
      promise.then(
        result => {
          // _this.chkSelectAppointments = false;
          this.provider_services.getTodayWaitlist(this.Mfilter)
            .subscribe(
              (data: any) => {
                this.appt_list = [];
                this.appt_list = data;
                console.log(this.appt_list)
                this.todayAppointments = this.shared_functions.groupBy(this.appt_list, 'waitlistStatus');
                if (this.filterapplied === true) {
                  this.noFilter = false;
                } else {
                  this.noFilter = true;
                }
                this.setCounts(this.appt_list);
                this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, this.statusAction);
                this.startedCheckins = this.getActiveAppointments(this.todayAppointments, 'started');
                this.loading = false;
              },
              () => {
                // this.load_waitlist = 1;
                this.loading = false;
              },
              () => {
                this.loading = false;
              });
        },
        () => {
          this.loading = false;
        });
    
  }
  setFilterForApi() {
    // let api_filter = {};
    // const filter = this.lStorageService.getitemfromLocalStorage('wlfilter');
    // console.log(filter);
    // if(filter){
    //   api_filter = filter;
    // }
   
    // if (this.time_type === 1) {
    //   if (this.token && this.time_type === 1) {
    //     api_filter['token-eq'] = this.token;
    //   }
    // }
    
    // if (this.filter.first_name !== '') {
    //   api_filter['firstName-eq'] = this.filter.first_name;
    // }
    // if (this.filter.last_name !== '') {
    //   api_filter['lastName-eq'] = this.filter.last_name;
    // }
    // if (this.filter.phone_number !== '') {
    //   api_filter['phoneNo-eq'] = this.filter.phone_number;
    // }
    // if (this.filter.checkinEncId !== '') {
    //   api_filter['checkinEncId-eq'] = this.filter.checkinEncId;
    // }
    // if (this.filter.patientId !== '') {
    //   api_filter['waitlistingFor-eq'] = this.getPatientIdFilter(this.filter.patientId);
    // }
    // if (this.filterService.length > 0 && this.filter.service !== 'all') {
    //   api_filter['service-eq'] = this.filterService.toString();
    // }
    // if (this.apptStatuses.length > 0 && this.filter.waitlist_status !== 'all') {
    //   api_filter['waitlistStatus-eq'] = this.apptStatuses.toString();
    // }
    // if (this.apptModes.length > 0 && this.filter.waitlistMode !== 'all') {
    //   api_filter['waitlistMode-eq'] = this.apptModes.toString();
    // }
  
    // if (this.time_type !== 1) {
    //   if (this.filter.check_in_start_date != null) {
    //     api_filter['date-ge'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date);
    //   }
    //   if (this.filter.check_in_end_date != null) {
    //     api_filter['date-le'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_end_date);
    //   }
     
    // }
    // if (this.paymentStatuses.length > 0 && this.filter.payment_status !== 'all') {
    //   api_filter['billPaymentStatus-eq'] = this.paymentStatuses.toString();
    // }
    // if (this.time_type === 3) {
    //   if (this.filterQ.length > 0 && this.filter.queue !== 'all') {
    //     api_filter['queue-eq'] = this.filterQ.toString();
    //   }
    //   if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
    //     api_filter['location-eq'] = this.filterLocation.toString();
    //   }
    //   if (this.ageGroups.length > 0 && this.filter.age !== 'all') {
    //     const kids = moment(new Date()).add(-12, 'year').format('YYYY-MM-DD');
    //     const adults = moment(new Date()).add(-60, 'year').format('YYYY-MM-DD');
    //     if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') === -1) {
    //       api_filter['dob-ge'] = kids;
    //     } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
    //       api_filter['dob-le'] = kids;
    //       api_filter['dob-ge'] = adults;
    //     } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
    //       api_filter['dob-le'] = adults;
    //     } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
    //       api_filter['dob-ge'] = adults;
    //     } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
    //       api_filter['dob-le'] = adults;
    //       api_filter['dob-ge'] = kids;
    //     } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') !== -1) {
    //       api_filter['dob-le'] = kids;
    //     }
    //   }
    //   if (this.genderList.length > 0 && this.filter.gender !== 'all') {
    //     api_filter['gender-eq'] = this.genderList.toString();
    //   }
    // }
    // if (this.time_type !== 3) {
    //   if (this.selected_location && this.selected_location.id) {
    //     api_filter['location-eq'] = this.selected_location.id;
    //   }
    // }
   
    // if (this.labelFilterData !== '') {
    //   api_filter['label-eq'] = this.labelFilterData;
    // }
   
    // return api_filter;
  }
  getActiveQIdsFromView(view) {
    const qIds = [];
    if (view && view.customViewConditions.queues && view.customViewConditions.queues.length > 0) {
      for (let i = 0; i < view.customViewConditions.queues.length; i++) {
        if (view.customViewConditions.queues[i].queueState === 'ENABLED') {
          qIds.push(view.customViewConditions.queues[i]['id']);
        }
      }
    }
    return qIds;
  }
  getTodayWLCount(Mfilter = null) {
      Mfilter['waitlistStatus-neq'] = 'prepaymentPending,failed';
    return new Promise((resolve) => {
      this.provider_services.getwaitlistTodayCount(Mfilter)
        .subscribe(
          data => {
            this.today_waitlist_count = data; 
            resolve(data);
          },
          () => {
          });
    });
  }
  setCounts(list) {
    this.today_arrived_count = this.getCount(list, 'arrived');
    this.today_checkedin_count = this.getCount(list, 'checkedIn');
    this.today_blocked_count = this.getCount(list, 'blocked');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count + this.today_blocked_count;
    this.today_started_count = this.getCount(list, 'started');
    this.today_completed_count = this.getCount(list, 'done');
    this.today_cancelled_count = this.getCount(list, 'cancelled');
    this.today_waitlist_count = this.today_checkins_count + this.today_started_count + this.today_completed_count + this.today_cancelled_count;
    this.cancelled_count = this.today_cancelled_count;
    this.scheduled_count = this.today_checkins_count;
    this.started_count = this.today_started_count;
    this.completed_count = this.today_completed_count;
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
  getCount(list, status) {
    return list.filter(function (elem) {
      return elem.waitlistStatus === status;
    }).length;
  }
  getScheduledAppointment(appointments) {
    let scheduledList = [];
    if (appointments['arrived']) {
      scheduledList = appointments['arrived'].slice();
    }
    if (appointments['checkedIn']) {
      Array.prototype.push.apply(scheduledList, appointments['checkedIn'].slice());
    }
    if (appointments['blocked']) {
      Array.prototype.push.apply(scheduledList, appointments['blocked'].slice());
    }
    if (this.time_type === 1) {
      this.sortCheckins(scheduledList);
    }
    return scheduledList;
  }
  getCancelledAppointment(appointments) {
    let cancelledList = [];
    if (appointments['cancelled']) {
      cancelledList = appointments['cancelled'].slice();
    }
    return cancelledList;
  }
  getStartedAppointment(appointments) {
    let startedList = [];
    if (appointments['started']) {
      startedList = appointments['started'].slice();
    }
    return startedList;
  }
  getCompletedAppointment(appointments) {
    let completedList = [];
    if (appointments['done']) {
      completedList = appointments['done'].slice();
    }
    if (appointments['settled']) {
      Array.prototype.push.apply(completedList, appointments['settled'].slice());
    }
    return completedList;
  }
  sortCheckins(checkins) {
    checkins.sort(function (message1, message2) {
      if (message1.token > message2.token) {
        return 11;
      } else if (message1.token < message2.token) {
        return -1;
      } else {
        return 0;
      }
    });
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
