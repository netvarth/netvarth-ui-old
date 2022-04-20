import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ReportDataService } from '../reports-data.service';
import { ProviderServices } from '../../../services/provider-services.service';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
// import { ExportBookingReportComponent } from '../../export-booking-report/export-booking-report.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Location } from '@angular/common';
import { ConfirmBoxComponent } from '../../../../business/shared/confirm-box/confirm-box.component';
@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {

  order_customerchosen: string;
  waitlist_customerchosen: string;
  appointment_customerchosen: string;
  donation_customerchosen: string;
  payment_customerchosen: string;
  user_chosen: string;
  customerchosen: string;
  order_customerId: any;
  order_customer: string;
  order_endDate: any;
  order_startDate: any;
  order_timePeriod: any;
  delivery_mode_list: { displayName: string; value: string; }[];
  delivery_mode: any;
  minDate: Date;
  btn_disabled: boolean;
  report_loading: boolean;
  mxDate: Date;
  donation_timeperiod_list: { value: string; displayName: string; }[];
  customer_label: any;
  filterparams: any = {};
  donation_startDate: any;
  donation_endDate: any;
  waitlist_endDate: any;
  waitlist_startDate: any;
  appointment_endDate: any;
  appointment_startDate: any;
  payment_endDate: any;
  payment_startDate: any;
  reportTitle: any;
  waitlist_customerId: number;
  token_service_id: any;
  token_schedule_id: number;
  token_schedule: string;
  token_queue_id: number;
  payment_transactionType: any;
  transactionType: { displayName: string; value: string; }[];
  donation_amount: any;
  waitlist_timePeriod: any;
  waitlist_mode: number;
  waitlist_status: number;
  waitlist_customer: any;
  token_service: any;
  token_queue: any;
  waitlist_billpaymentstatus: any;
  appointment_billpaymentstatus: any;
  appointment_mode: any;
  appointment_status: any;
  appointment_paymentStatus: any;
  waitlist_status_list: { displayName: string; value: string; }[];
  waitlist_intstatus_list: { displayName: string; value: string; }[];
  bill_payment_status: { value: string; displayName: string; }[];
  waitlist_mode_list: { displayName: string; value: string; }[];
  appointment_status_list: { displayName: string; value: string; }[];
  appointment_intstatus_list: { displayName: string; value: string; }[];
  appointment_mode_list: { displayName: string; value: string; }[];
  payment_purpose: { value: string; displayName: string; }[];
  donation_timePeriod: string;
  appointment_timePeriod: string;
  crm_timePeriod: string;
  appointment_service_id: number;
  appointment_service: string;
  donation_service_id: any;
  donation_service: string;
  payment_service_id: any;
  payment_service: string;
  appointment_schedule_id: any;
  appointment_schedule: string;
  donation_schedule: string;
  donation_schedule_id: number;
  payment_schedule: string;
  payment_schedule_id: number;
  donation_queue: string;
  donation_queue_id: any;
  appointment_queue_id: number;
  appointment_queue: string;
  payment_queue: string;
  payment_queue_id: any;
  appointment_customerId: any;
  appointment_customer: string;
  donation_customerId: any;
  donation_customer: string;
  payment_customerId: any;
  payment_customer: string;
  schedules: any;
  services: any;
  queues: any;
  customerId: any;
  hide_dateRange = true;
  payment_timePeriod: any;
  customer: string;
  order_status: any;
  order_status_list: any;
  payment_amount: any;
  payment_paymentPurpose: any;
  payment_paymentMode: any;
  payment_paymentStatus: any;
  reportDateCategory: any;
  payment_donationName: any;
  payment_donationPhone: any;
  payment_donationEmail: any;
  donation_donorFirstName: string;
  donation_donorLastName: string;
  donation_donorPhoneNumber: any;
  user_endDate;
  user_startDate;
  crm_startDate;
  crm_EndDate;
  user_timePeriod;
  user_users;
  report_criteria: any;
  report_type: any;
  public reportForm: FormGroup;
  time_period;
  payment_modes;
  payment_status;
  pay_confirm_num;
  user: string;
  user_id: any;
  loading = false;
  @ViewChild('selectIntStatus') selectIntStatus: MatSelect;
  @ViewChild('select') select: MatSelect;
  @ViewChild('apptStatusSelect') apptStatusSelect: MatSelect;
  @ViewChild('apptIntStatusSelect') apptIntStatusSelect: MatSelect;

  waitlistStatusFilter: any = [];
  apptStatusFilter: any= [];
  apptIntStatusFilter: any = [];
  waitlistIntStatusFilter: any = [];
  
  
  allWlStatusSelected = false;
  allApptStatusSelected = false;
  allWlIntStatusSelected = false;
  allApptIntStatusSelected = false;
  constructor(
    private router: Router,
    private activated_route: ActivatedRoute,
    public shared_functions: SharedFunctions,
    private locationobj: Location,
    private report_data_service: ReportDataService,
    private provider_services: ProviderServices,
    public dateformat: DateFormatPipe,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
    this.activated_route.queryParams.subscribe(qparams => {
      if (qparams.report_type) {
        this.report_type = qparams.report_type;
        this.reportTitle = this.report_type;
        if (this.report_type === 'token') {
          this.reportTitle = 'Check-in/Token';
        }

      }
    });
    this.mxDate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.minDate = new Date("September 1, 2020 01:15:00");
  }

  ngOnInit() {
    this.payment_timePeriod = this.crm_timePeriod = this.appointment_timePeriod = this.waitlist_timePeriod = this.donation_timePeriod = this.order_timePeriod = this.user_timePeriod = 'LAST_THIRTY_DAYS';
    this.time_period = projectConstantsLocal.REPORT_TIMEPERIOD;
    this.payment_modes = projectConstantsLocal.PAYMENT_MODES;
    this.payment_status = projectConstantsLocal.PAYMENT_STATUS;
    this.payment_purpose = projectConstantsLocal.PAYMENT_PURPOSE;
    this.appointment_mode_list = projectConstantsLocal.APPOINTMENT_MODE;
    this.appointment_status_list = projectConstantsLocal.APPOINTMENT_STATUS;
    this.waitlist_mode_list = projectConstantsLocal.WAITLIST_MODE;
    this.waitlist_status_list = projectConstantsLocal.WAITLIST_STATUS;
    this.order_status_list = projectConstantsLocal.ORDER_STATUS_CLASS;
    this.bill_payment_status = projectConstantsLocal.BILL_PAYMENT_STATUS;
    this.transactionType = projectConstantsLocal.REPORT_TRANSACTION_TYPE;
    this.donation_timeperiod_list = projectConstantsLocal.DONATION_TIMEPERIOD;
    this.delivery_mode_list = projectConstantsLocal.DELIVERY_STATUS;
    this.payment_paymentPurpose = 0;
    this.payment_paymentStatus = this.appointment_paymentStatus = 0;
    this.payment_paymentMode = 0;
    this.appointment_mode = this.waitlist_mode = this.delivery_mode = 0;
    this.appointment_status = this.waitlist_status = this.order_status = 0;
    this.payment_customer = this.appointment_customer = this.waitlist_customer = this.donation_customer = 'Any';
    this.payment_transactionType = 0;
    this.waitlist_billpaymentstatus = this.appointment_billpaymentstatus = 0;
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');


    if (this.report_type === 'token' || this.report_type === 'appointment') {
        this.provider_services.getInternalStatus()
          .subscribe(
            (data: any) => {
              // this.internalStats = data;
              console.log("Internal Statuses", data);

              this.waitlist_intstatus_list = this.appointment_intstatus_list = data.map(function(status) {
                return { 'value': status.statusId, displayName: status.status }
              })

            });
    }


    this.report_data_service._service_data.subscribe((res: any) => {
      this.setServiceData(res);
    });
    this.report_data_service._schedule_data.subscribe(res => {
      this.setScheduleData(res);
    });
    this.report_data_service._queue_data.subscribe(res => {
      this.setQueueData(res);
    });
    this.report_data_service._customers.subscribe(res => {
      this.setCustomerData(res);

    });
    this.report_data_service._reports.subscribe(res => {
      this.setReportData(res);
    });
  }
  setReportData(res) {
    if (Object.keys(res).length !== 0) {
      switch (this.report_type) {
        case 'payment': {
          this.payment_paymentStatus = res.status || 0;
          this.payment_paymentMode = res.paymentMode || 0;
          this.payment_paymentPurpose = res.paymentPurpose || 0;
          this.payment_amount = res.amount;
          this.payment_transactionType = res.transactionType || 0;
          this.payment_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          this.payment_donationName = res.donationName;
          this.payment_donationEmail = res.donationEmail;
          this.payment_donationPhone = res.donationPhone;
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.payment_startDate = res.startDate;
            this.payment_endDate = res.endDate;
          }
          break;
        }
        case 'donation': {
          this.donation_amount = res.donationAmount;
          this.donation_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.donation_startDate = res.startDate;
            this.donation_endDate = res.endDate;
          }
          break;
        }
        case 'appointment': {
          this.appointment_billpaymentstatus = res.paymentStatus || 0;
          this.appointment_status = res.apptStatus || 0;
          this.appointment_mode = res.appointmentMode || 0;
          this.appointment_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.appointment_startDate = res.startDate;
            this.appointment_endDate = res.endDate;
          }
          break;
        }
        case 'token': {
          // console.log("Token: ...", res.waitlistStatus);
          this.waitlist_billpaymentstatus = res.billPaymentStatus || 0;
          // this.waitlist_status = res.waitlistStatus || 0;
          // if (res.waitlistStatus) {
          //   this.waitlistStatusFilter = res.waitlistStatus.split(',');
          // }
          // console.log("Token: ", this.waitlistStatusFilter.toString());
          // this.waitlist_status = this.waitlistStatusFilter.toString();
          this.waitlist_mode = res.waitlistMode || 0;
          this.waitlist_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.waitlist_startDate = res.startDate;
            this.waitlist_endDate = res.endDate;
          }
          break;
        }
        case 'order': {
          this.order_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.order_startDate = res.startDate;
            this.order_endDate = res.endDate;
            this.delivery_mode = res.delivery_mode;
          }
        }
        case 'user': {
          this.user_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.user_startDate = res.startDate;
            this.user_endDate = res.endDate;
          }
        }
        case 'crm': {
          this.crm_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
          if (res.dateRange === 'DATE_RANGE') {
            this.hide_dateRange = false;
            this.crm_startDate = res.startDate;
            this.crm_EndDate = res.endDate;
          }
        }
      }
    }
  }
  setApptStatusFilter() {
    this.apptStatusFilter = [];
    let newStatus = true;
    this.apptStatusSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      } else {
        this.apptStatusFilter.push(item.value);
      }
    });
    this.allApptStatusSelected = newStatus;
    console.log(this.apptStatusFilter);
  }
  toggleAllApptSelection () {
    const _this = this;
    this.apptStatusFilter = [];
    if (this.allApptStatusSelected) {
      this.apptStatusSelect.options.forEach(function (item: MatOption) {
        item.select();
        _this.apptStatusFilter.push(item.value);
      });
    } else {
      this.apptStatusSelect.options.forEach(function(item: MatOption) {
        item.deselect();
      });
    }
    console.log(this.apptStatusFilter);
  }

  /**
   * @author Mani E V
   */

   setApptIntStatusFilter() {
    this.apptIntStatusFilter = [];
    let newStatus = true;
    this.apptIntStatusSelect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      } else {
        this.apptIntStatusFilter.push(item.value);
      }
    });
    this.allApptIntStatusSelected = newStatus;
    console.log(this.apptIntStatusFilter);
  }
  toggleAllApptIntStatusSelection () {
    const _this = this;
    this.apptIntStatusFilter = [];
    if (this.allApptIntStatusSelected) {
      this.apptIntStatusSelect.options.forEach(function (item: MatOption) {
        item.select();
        _this.apptIntStatusFilter.push(item.value);
      });
    } else {
      this.apptIntStatusSelect.options.forEach(function(item: MatOption) {
        item.deselect();
      });
    }
    console.log(this.apptIntStatusFilter);
  }
  setWLIntStatusFilter() {
    this.waitlistIntStatusFilter = [];
    let newIntStatus = true;
    this.selectIntStatus.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newIntStatus = false;
      } else {
        this.waitlistIntStatusFilter.push(item.value);
      }
    });
    this.allWlIntStatusSelected = newIntStatus;
    console.log(this.waitlistIntStatusFilter);
  }

  setStatusFilter() {
    this.waitlistStatusFilter = [];
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      } else {
        this.waitlistStatusFilter.push(item.value);
      }
    });
    this.allWlStatusSelected = newStatus;
    console.log(this.waitlistStatusFilter);
  }
  toggleAllSelection () {
    const _this = this;
    this.waitlistStatusFilter = [];
    if (this.allWlStatusSelected) {
      this.select.options.forEach(function (item: MatOption) {
        item.select();
        _this.waitlistStatusFilter.push(item.value);
      });
    } else {
      this.select.options.forEach(function(item: MatOption) {
        item.deselect();
      });
    }
    console.log(this.waitlistStatusFilter);
  }
  /**
   * @author Mani E V
   */
  toggleAllIntStatusSelection () {
    const _this = this;
    this.waitlistIntStatusFilter = [];
    if (this.allWlIntStatusSelected) {
      this.selectIntStatus.options.forEach(function (item: MatOption) {
        item.select();
        _this.waitlistIntStatusFilter.push(item.value);
      });
    } else {
      this.selectIntStatus.options.forEach(function(item: MatOption) {
        item.deselect();
      });
    }
    console.log(this.waitlistIntStatusFilter);
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  setServiceData(res) {
    switch (this.report_type) {
      case 'payment': {
        if (res === 'All') {
          this.payment_service = 'All';
          this.payment_service_id = 0;
        } else {
          this.payment_service = res.split(',').length - 1 + ' services selected';
          this.payment_service_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'donation': {
        if (res === 'All') {
          this.donation_service = 'All';
          this.donation_service_id = 0;
        } else {
          this.donation_service = res.split(',').length - 1 + ' services selected';
          this.donation_service_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'appointment': {
        if (res === 'All') {
          this.appointment_service = 'All';
          this.appointment_service_id = 0;
        } else {
          this.appointment_service = res.split(',').length - 1 + ' services selected';
          this.appointment_service_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'token': {
        if (res === 'All') {
          this.token_service = 'All';
          this.token_service_id = 0;
        } else {
          this.token_service = res.split(',').length - 1 + ' services selected';
          this.token_service_id = res.replace(/,\s*$/, '');
        }
        break;
      }
    }

  }
  setScheduleData(res) {
    switch (this.report_type) {
      case 'payment': {
        if (res === 'All') {
          this.payment_schedule = 'All';
          this.payment_schedule_id = 0;
        } else {
          this.payment_schedule = res.split(',').length - 1 + ' schedules selected';
          this.payment_schedule_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'donation': {
        if (res === 'All') {
          this.donation_schedule = 'All';
          this.donation_schedule_id = 0;
        } else {
          this.donation_schedule = res.split(',').length - 1 + ' schedules selected';
          this.donation_schedule_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'appointment': {
        if (res === 'All') {
          this.appointment_schedule = 'All';
          this.appointment_schedule_id = 0;
        } else {
          this.appointment_schedule = res.split(',').length - 1 + ' schedules selected';
          this.appointment_schedule_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'token': {
        if (res === 'All') {
          this.token_schedule = 'All';
          this.token_schedule_id = 0;
        } else {
          this.token_schedule = res.split(',').length - 1 + ' schedules selected';
          this.token_schedule_id = res.replace(/,\s*$/, '');
        }
        break;
      }
    }
  }
  setCustomerData(res) {
    switch (this.report_type) {
      case 'payment': {
        if (res.jaldee_customers === '' || res.jaldee_customers === undefined || res.jaldee_customers === 'All') {
          this.payment_customer = 'All';
        } else {
          this.payment_customer = res.jaldee_customers.split(',').length + ' ' + this.customer_label + 's selected';
          this.payment_customerchosen = res.customers.replace(/,\s*$/, '');
          this.payment_customerId = res.jaldee_customers.replace(/,\s*$/, '');
        }
        break;
      }
      case 'donation': {
        if (res.jaldee_customers === '' || res.jaldee_customers === undefined || res.jaldee_customers === 'All') {
          this.donation_customer = 'All';
        } else {
          this.donation_customer = res.jaldee_customers.split(',').length + ' ' + this.customer_label + 's selected';
          this.donation_customerchosen = res.customers.replace(/,\s*$/, '');
          this.donation_customerId = res.jaldee_customers.replace(/,\s*$/, '');
        }
        break;
      }
      case 'appointment': {
        if (res.jaldee_customers === '' || res.jaldee_customers === undefined || res.jaldee_customers === 'All') {
          this.appointment_customer = 'All';
        } else {
          this.appointment_customer = res.jaldee_customers.split(',').length + ' ' + this.customer_label + 's selected';
          this.appointment_customerchosen = res.customers.replace(/,\s*$/, '');
          this.appointment_customerId = res.jaldee_customers.replace(/,\s*$/, '');
        }
        break;
      }
      case 'token': {
        if (res.jaldee_customers === '' || res.jaldee_customers === undefined || res.jaldee_customers === 'All') {
          this.waitlist_customer = 'All';
        } else {
          this.waitlist_customer = res.jaldee_customers.split(',').length + ' ' + this.customer_label + 's selected';
          this.waitlist_customerchosen = res.customers.replace(/,\s*$/, '');
          this.waitlist_customerId = res.jaldee_customers.replace(/,\s*$/, '');
        }
        break;
      }
      case 'order': {
        if (res.jaldee_customers === '' || res.jaldee_customers === undefined || res.jaldee_customers === 'All') {
          this.order_customer = 'All';
        } else {
          this.order_customer = res.jaldee_customers.split(',').length + ' ' + this.customer_label + 's selected';
          this.order_customerchosen = res.customers.replace(/,\s*$/, '');
          this.order_customerId = res.jaldee_customers.replace(/,\s*$/, '');
        }
        break;
      }
      case 'user': {
        if (res === 'All') {
          this.user = 'All';
          this.user_id = 0;
        } else {
          this.user = res.split(',').length - 1 + ' users selected';
          this.user_id = res.replace(/,\s*$/, '');
        }
        break;
      }
    }
  }
  setQueueData(res) {
    switch (this.report_type) {
      case 'payment': {
        if (res === 'All') {
          this.payment_queue = 'All';
          this.payment_queue_id = 0;
        } else {
          this.payment_queue = res.split(',').length - 1 + ' queues selected';
          this.payment_queue_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'donation': {
        if (res === 'All') {
          this.donation_queue = 'All';
          this.donation_queue_id = 0;
        } else {
          this.donation_queue = res.split(',').length - 1 + ' queues selected';
          this.donation_queue_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'appointment': {
        if (res === 'All') {
          this.appointment_queue = 'All';
          this.appointment_queue_id = 0;
        } else {
          this.appointment_queue = res.split(',').length - 1 + ' queues selected';
          this.appointment_queue_id = res.replace(/,\s*$/, '');
        }
        break;
      }
      case 'token': {
        if (res === 'All') {
          this.token_queue = 'All';
          this.token_queue_id = 0;
        } else {
          this.token_queue = res.split(',').length - 1 + ' queues selected';
          this.token_queue_id = res.replace(/,\s*$/, '');
        }
        break;
      }
    }
  }
  generateReport(reportType) {
    if (reportType === 'payment') {
      if (this.payment_donationEmail) {
        const curemail = this.payment_donationEmail.trim();
        const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
        const result2 = pattern2.test(curemail);
        if (!result2) {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
          return;
        }
      }
      if (this.payment_timePeriod === 'DATE_RANGE' && (this.payment_startDate === undefined || this.payment_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'status': this.payment_paymentStatus,
          'paymentMode': this.payment_paymentMode,
          'paymentPurpose': this.payment_paymentPurpose,
          'amount': this.payment_amount,
          'transactionType': this.payment_transactionType,
          'queue': this.payment_queue_id,
          'service': this.payment_service_id,
          'schedule': this.payment_schedule_id,
          'providerOwnConsumerId': this.payment_customerId,
          'donationEmail': this.payment_donationEmail,
          'donationPhone': this.payment_donationPhone,
        };
        if (this.payment_paymentMode === 0) {
          delete this.filterparams.paymentMode;
        }
        if (this.payment_paymentStatus === 0) {
          delete this.filterparams.status;
        }
        if (this.payment_service_id === 0) {
          delete this.filterparams.service;
        }
        if (this.payment_schedule_id === 0) {
          delete this.filterparams.schedule;
        }
        if (this.payment_queue_id === 0) {
          delete this.filterparams.queue;
        }
        if (this.payment_transactionType === 0) {
          delete this.filterparams.transactionType;
        }
        if (this.payment_paymentPurpose === 0) {
          delete this.filterparams.paymentPurpose;
        }
        if (this.payment_amount === undefined) {
          delete this.filterparams.amount;
        }
        if (this.payment_donationEmail === '' || this.payment_donationEmail === undefined) {
          delete this.filterparams.payment_donationEmail;
        }
        if (this.payment_donationPhone === '' || this.payment_donationPhone === undefined) {
          delete this.filterparams.payment_donationPhone;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.payment_timePeriod === 'DATE_RANGE') {
          filter['paymentOn-ge'] = this.dateformat.transformTofilterDate(this.payment_startDate);
          filter['paymentOn-le'] = this.dateformat.transformTofilterDate(this.payment_endDate);
        }
        if (this.pay_confirm_num) {
          filter['transactionEncId-like'] = 'confirmationNo::' + this.pay_confirm_num;
        }
        if (this.payment_donationName !== '' || this.payment_donationName !== undefined) {
          filter['donationName-like'] = this.payment_donationName;
        }
        const request_payload: any = {};
        request_payload.reportType = this.report_type.toUpperCase();
        request_payload.reportDateCategory = this.payment_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    } else if (reportType === 'appointment') {
      if (this.appointment_timePeriod === 'DATE_RANGE' && (this.appointment_startDate === undefined || this.appointment_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'paymentStatus': this.appointment_billpaymentstatus,
          'schedule': this.appointment_schedule_id,
          'service': this.appointment_service_id,
          // 'apptStatus': this.appointment_status,
          'appointmentMode': this.appointment_mode,
          'apptForId': this.appointment_customerId
        };
        if (!this.appointment_customerId) {
          delete this.filterparams.appmtFor;
        }
        if (this.appointment_schedule_id === 0) {
          delete this.filterparams.schedule;
        }
        if (this.appointment_billpaymentstatus === 0) {
          delete this.filterparams.paymentStatus;
        }
        if (this.appointment_service_id === 0) {
          delete this.filterparams.service;
        }
        if (this.apptStatusFilter.length > 0) {
          // this.waitlist_status = this.waitlistStatusFilter.toString();
          this.filterparams['apptStatus'] = this.apptStatusFilter.toString();
          }
        // if (this.appointment_status === 0) {
        //   delete this.filterparams.apptStatus;
        // }
        if (this.apptIntStatusFilter.length > 0) {
          this.filterparams['internalStatus'] = this.apptIntStatusFilter.toString();
        }
        if (this.appointment_mode === 0) {
          delete this.filterparams.appointmentMode;
        }
        if (this.appointment_customerId === 0) {
          delete this.filterparams.providerOwnConsumerId;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.appointment_timePeriod === 'DATE_RANGE') {
          if (this.appointment_startDate === undefined || this.appointment_endDate === undefined) {
            this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });

          }
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.appointment_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.appointment_endDate);
        }
        const request_payload: any = {};
        request_payload.reportType = this.report_type.toUpperCase();
        request_payload.reportDateCategory = this.appointment_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    } 
    else if (reportType === 'crm') {
      if (this.crm_timePeriod === 'DATE_RANGE' && (this.crm_startDate === undefined || this.crm_EndDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'paymentStatus': this.appointment_billpaymentstatus,
          'schedule': this.appointment_schedule_id,
          'service': this.appointment_service_id,
          // 'apptStatus': this.appointment_status,
          'appointmentMode': this.appointment_mode,
          'apptForId': this.appointment_customerId
        };
        if (!this.appointment_customerId) {
          delete this.filterparams.appmtFor;
        }
        if (this.appointment_schedule_id === 0) {
          delete this.filterparams.schedule;
        }
        if (this.appointment_billpaymentstatus === 0) {
          delete this.filterparams.paymentStatus;
        }
        if (this.appointment_service_id === 0) {
          delete this.filterparams.service;
        }
        if (this.apptStatusFilter.length > 0) {
          // this.waitlist_status = this.waitlistStatusFilter.toString();
          this.filterparams['apptStatus'] = this.apptStatusFilter.toString();
          }
        // if (this.appointment_status === 0) {
        //   delete this.filterparams.apptStatus;
        // }
        if (this.apptIntStatusFilter.length > 0) {
          this.filterparams['internalStatus'] = this.apptIntStatusFilter.toString();
        }
        if (this.appointment_mode === 0) {
          delete this.filterparams.appointmentMode;
        }
        if (this.appointment_customerId === 0) {
          delete this.filterparams.providerOwnConsumerId;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.crm_timePeriod === 'DATE_RANGE') {
          if (this.crm_startDate === undefined || this.crm_EndDate === undefined) {
            this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });

          }
          filter['createdDate-ge'] = this.dateformat.transformTofilterDate(this.crm_startDate);
          filter['createdDate-le'] = this.dateformat.transformTofilterDate(this.crm_EndDate);
        }
        const request_payload: any = {};
        request_payload.reportType = 'CRM_TASK';
        request_payload.reportDateCategory = this.crm_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    }
    
    
    
    else if (reportType === 'token') {
      if (this.waitlist_timePeriod === 'DATE_RANGE' && (this.waitlist_startDate === undefined || this.waitlist_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'billPaymentStatus': this.waitlist_billpaymentstatus,
          'queue': this.token_queue_id,
          'service': this.token_service_id,
          // 'waitlistStatus': this.waitlist_status,
          'waitlistMode': this.waitlist_mode,
          'waitlistingForId': this.waitlist_customerId
        };
        if (!this.waitlist_customerId) {
          delete this.filterparams.waitlistingFor;
        }
        if (this.waitlist_billpaymentstatus === 0) {
          delete this.filterparams.billPaymentStatus;
        }
        if (this.token_service_id === 0) {
          delete this.filterparams.service;
        }
        if (this.token_queue_id === 0) {
          delete this.filterparams.queue;
        }
        console.log("Token: ", this.waitlistStatusFilter.toString());
        if (this.waitlistStatusFilter.length > 0) {
        // this.waitlist_status = this.waitlistStatusFilter.toString();
        this.filterparams['waitlistStatus'] = this.waitlistStatusFilter.toString();
        }
        if (this.waitlistIntStatusFilter.length > 0) {
          this.filterparams['internalStatus'] = this.waitlistIntStatusFilter.toString();
        }
        // if (this.waitlist_status === 0) {
        //   delete this.filterparams.waitlistStatus;
        // }
        if (this.waitlist_mode === 0) {
          delete this.filterparams.waitlistMode;
        }
        if (this.waitlist_customerId === 0) {
          delete this.filterparams.providerOwnConsumerId;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.waitlist_timePeriod === 'DATE_RANGE') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.waitlist_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.waitlist_endDate);
        }
        const request_payload: any = {};
        request_payload.reportType = this.report_type.toUpperCase();
        request_payload.reportDateCategory = this.waitlist_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    } else if (reportType === 'donation') {
      if (this.donation_timePeriod === 'DATE_RANGE' && (this.donation_startDate === undefined || this.donation_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        let donorName = ''
        this.filterparams = {
          'service': this.donation_service_id,
          'donationAmount': this.donation_amount,
          'donorPhoneNumber': this.donation_donorPhoneNumber
        };
        if (this.donation_service === 'All') {
          delete this.filterparams.service;
        }
        if (this.donation_amount === undefined) {
          delete this.filterparams.amount;
        }
        if (this.donation_donorPhoneNumber == '') {
          delete this.filterparams.donorPhoneNumber;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.donation_timePeriod === 'DATE_RANGE') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.donation_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.donation_endDate);
        }
        if (this.donation_donorFirstName !== '' && this.donation_donorFirstName !== undefined) {
          donorName = 'firstName::' + this.donation_donorFirstName;
          if (this.donation_donorLastName !== '' && this.donation_donorLastName !== undefined) {
            donorName = donorName + ',lastName::' + this.donation_donorLastName;
          }
        }
        if (this.donation_donorFirstName === '' || this.donation_donorFirstName === undefined && this.donation_donorLastName !== '' && this.donation_donorLastName !== undefined) {
          donorName = 'lastName::' + this.donation_donorLastName;
        }
        this.filterparams['donor'] = donorName;
        if (this.filterparams['donor'] == '' || this.filterparams['donor'] == undefined) {
          delete filter['donor'];
        } else {
          filter['donor-like'] = donorName;
          delete filter['donor'];
        }
        const request_payload: any = {};
        request_payload.reportType = this.report_type.toUpperCase();
        request_payload.reportDateCategory = this.donation_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    } else if (reportType === 'order') {
      if (this.order_timePeriod === 'DATE_RANGE' && (this.order_startDate === undefined || this.order_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'orderStatus': this.order_status,
          'homeDelivery': true,
          'storePickup': true,
          'providerOwnConsumerId': this.order_customerId
        };
        if (this.order_status === 0) {
          delete this.filterparams.orderStatus;
        }
        if (this.order_customerId === 0) {
          delete this.filterparams.providerOwnConsumerId;
        }
        if (this.delivery_mode === 'homeDelivery') {
          delete this.filterparams.storePickup;

        } else if (this.delivery_mode === 'storePickup') {
          delete this.filterparams.homeDelivery;
        } else if (this.delivery_mode === 0) {
          delete this.filterparams.homeDelivery;
          delete this.filterparams.storePickup;
        }
        if (this.order_status === 'Any') {
          delete this.filterparams.orderStatus;
        }
        if (this.donation_amount === undefined) {
          delete this.filterparams.amount;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.order_timePeriod === 'DATE_RANGE') {
          filter['orderDate-ge'] = this.dateformat.transformTofilterDate(this.order_startDate);
          filter['orderDate-le'] = this.dateformat.transformTofilterDate(this.order_endDate);
        }
        const request_payload: any = {};
        request_payload.reportType = this.report_type.toUpperCase();
        request_payload.reportDateCategory = this.order_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    }
    else if (reportType === 'user') {
      if (this.user_timePeriod === 'DATE_RANGE' && (this.user_startDate === undefined || this.user_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'user': this.user_id
        };
        if (this.user_id === 0 || this.user_id === undefined) {
          delete this.filterparams.user;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.user_timePeriod === 'DATE_RANGE') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.user_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.user_endDate);
        }
        if (this.user_timePeriod === 'LAST_THIRTY_DAYS') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() - 30)))
          filter['date-le'] = this.dateformat.transformTofilterDate(new Date());
        }
        if (this.user_timePeriod === 'LAST_WEEK') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() - 7)))
          filter['date-le'] = this.dateformat.transformTofilterDate(new Date());
        }
        if (this.user_timePeriod === 'TODAY') {
          filter['date-eq'] = this.dateformat.transformTofilterDate(new Date());
        }
        const request_payload: any = {};
        request_payload.reportType = this.report_type.toUpperCase();
        request_payload.reportDateCategory = this.user_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    }
   
  }
  changeTimePeriod(event) {
    if (event.value === 'DATE_RANGE') {
      this.hide_dateRange = false;
    } else {
      this.hide_dateRange = true;
    }
  }
  generateReportByCriteria(payload) {
    return new Promise((resolve, reject) => {
      this.provider_services.generateReport(payload)
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          }
        );
    });
  }
  generateUserReportByCriteria(payload) {
    return new Promise((resolve, reject) => {
      this.provider_services.generateUserReport(payload.filter)
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(error);
            this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
          }
        );
    });
  }
  redirecToReports() {
    this.locationobj.back();
    // this.router.navigate(['provider', 'reports']);
  }
  passPayloadForReportGeneration(payload) {
    this.btn_disabled = true;
    this.report_loading = true;
    if (this.report_type === 'user') {
      this.generateUserReportByCriteria(payload).then(res => {
        this.report_loading = false;
        this.btn_disabled = false;
        this.report_data_service.storeSelectedValues(res);
        this.lStorageService.setitemonLocalStorage('reportCriteria', payload);
        this.generateUserReport(res, payload);
      },
        (error) => {
          this.report_loading = false;
          this.btn_disabled = false;
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        });
    } else {
      this.generateReportByCriteria(payload).then(res => {
        this.report_loading = false;
        this.btn_disabled = false;
        this.report_data_service.storeSelectedValues(res);
        this.lStorageService.setitemonLocalStorage('reportCriteria', payload);
        this.generatedReport(res);
      },
        (error) => {
          this.report_loading = false;
          this.btn_disabled = false;
          this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
        });
    }
  }
  goToSelectionPage(type, selected_id) {
    this.setSelectedData().then(res => {
      this.report_data_service.storeSelectedValues(res);
      if (type === 'service') {
        this.router.navigate(['provider', 'reports', 'service'], { queryParams: { report_type: this.report_type, data: selected_id } });
      }
      if (type === 'schedule') {
        this.router.navigate(['provider', 'reports', 'schedule'], { queryParams: { report_type: this.report_type, data: selected_id } });
      }
      if (type === 'queue') {
        this.router.navigate(['provider', 'reports', 'queue'], { queryParams: { report_type: this.report_type, data: selected_id } });
      }
      if (type === 'customer') {
        this.router.navigate(['provider', 'reports', 'customer'], { queryParams: { report_type: this.report_type, data: selected_id } });
      }
      if (type === 'user') {
        this.router.navigate(['provider', 'reports', 'user'], { queryParams: { report_type: this.report_type, data: selected_id } });
      }
    });
  }
  generateUserReport(reportData, payload) {
    this.setSelectedData().then(res => {
      this.lStorageService.setitemonLocalStorage('report', JSON.stringify(reportData));
      const navigationExtras: NavigationExtras = {
        queryParams: {
          filter: JSON.stringify(payload)
        }
      };
      this.router.navigate(['provider', 'reports', 'user-report'], navigationExtras);
    },
    );
  }
  setSelectedData() {
    let selectedValues = {};
    return new Promise((resolve) => {
      if (this.report_type === 'payment') {
        selectedValues = {
          'status': this.payment_paymentStatus,
          'paymentMode': this.payment_paymentMode,
          'paymentPurpose': this.payment_paymentPurpose,
          'amount': this.payment_amount,
          'transactionType': this.payment_transactionType,
          'dateRange': this.payment_timePeriod,
          'startDate': this.payment_startDate,
          'endDate': this.payment_endDate
        };
      }
      if (this.report_type === 'token') {
        selectedValues = {
          'billPaymentStatus': this.waitlist_billpaymentstatus,
          'waitlistStatus': this.waitlistStatusFilter.toString(),
          'waitlistMode': this.waitlist_mode,
          'dateRange': this.waitlist_timePeriod,
          'startDate': this.waitlist_startDate,
          'endDate': this.waitlist_endDate
        };
      }
      if (this.report_type === 'appointment') {
        selectedValues = {
          'paymentStatus': this.appointment_billpaymentstatus,
          'apptStatus': this.apptStatusFilter.toString(),
          'appointmentMode': this.appointment_mode,
          'dateRange': this.appointment_timePeriod,
          'startDate': this.appointment_startDate,
          'endDate': this.appointment_endDate
        };
      } if (this.report_type === 'donation') {
        selectedValues = {
          'donationAmount': this.donation_amount,
          'dateRange': this.donation_timePeriod,
          'startDate': this.donation_startDate,
          'endDate': this.donation_endDate
        };
      } if (this.report_type === 'order') {
        selectedValues = {
          'delivery_mode': this.delivery_mode,
          'dateRange': this.order_timePeriod,
          'startDate': this.order_startDate,
          'endDate': this.order_endDate
        };
      }
      if (this.report_type === 'user') {
        selectedValues = {
          'dateRange': this.user_timePeriod,
          'startDate': this.user_startDate,
          'endDate': this.user_endDate
        };
      }
      resolve(selectedValues);
    });
  }
  generatedReport(report) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        buttonCount:1,
        buttonCaption: 'OK',
        message: 'Your report generation is in progress. You can view the report once it is generated.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.setSelectedData().then(res => {
        this.lStorageService.setitemonLocalStorage('report', JSON.stringify(report));
      },
      );
      this.router.navigate(['provider', 'reports', 'report-list']);
    });
    
  }

  // loadBookingQuestionaaireReport(list) {
  //   const dialogRef = this.dialog.open(ExportBookingReportComponent, {
  //     width: '100%',
  //     panelClass: ['export-class', 'popup-class', 'commonpopupmainclass'],
  //     disableClose: true,
  //     data: {
  //       bookingList: list,
  //       criteria: this.waitlist_timePeriod
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loading = false;
  //   });
  // }

  // generateSummary(reportType) {
  //   this.loading = true;
  //   if (reportType === 'token') {
  //     if (this.waitlist_timePeriod === 'DATE_RANGE' && (this.waitlist_startDate === undefined || this.waitlist_endDate === undefined)) {
  //       this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
  //     } else {
  //       this.filterparams = {
  //         'billPaymentStatus': this.waitlist_billpaymentstatus,
  //         'queue': this.token_queue_id,
  //         'service': this.token_service_id,
  //         // 'waitlistStatus': this.waitlist_status,
  //         'waitlistMode': this.waitlist_mode,
  //         'waitlistingForId': this.waitlist_customerId
  //       };
  //       if (!this.waitlist_customerId) {
  //         delete this.filterparams.waitlistingForId;
  //       }
  //       if (this.waitlist_billpaymentstatus === 0) {
  //         delete this.filterparams.billPaymentStatus;
  //       }
  //       if (this.token_service_id === 0) {
  //         delete this.filterparams.service;
  //       }
  //       if (this.token_queue_id === 0) {
  //         delete this.filterparams.queue;
  //       }
        
  //       if (this.waitlistStatusFilter.length > 0) {
  //         this.filterparams ['waitlistStatus'] = this.waitlistStatusFilter.toString();
  //         // delete this.filterparams.waitlistStatus;
  //       }
  //       if (this.waitlistIntStatusFilter.length > 0) {
  //         this.filterparams['internalStatus'] = this.waitlistIntStatusFilter.toString();
  //       }
  //       // if (this.waitlist_status === 0) {
  //       //   delete this.filterparams.waitlistStatus;
  //       // }
  //       if (this.waitlist_mode === 0) {
  //         delete this.filterparams.waitlistMode;
  //       }
  //       if (this.waitlist_customerId === 0) {
  //         delete this.filterparams.providerOwnConsumerId;
  //       }
  //       const filter = {};
  //       for (const key in this.filterparams) {
  //         if (this.filterparams.hasOwnProperty(key)) {
  //           // assign property to new object with modified key
  //           filter[key + '-eq'] = this.filterparams[key];
  //         }
  //       }
  //       if (this.waitlist_timePeriod === 'DATE_RANGE') {
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(this.waitlist_startDate);
  //         filter['date-le'] = this.dateformat.transformTofilterDate(this.waitlist_endDate);
  //       }
  //       if (this.waitlist_timePeriod === 'LAST_THIRTY_DAYS') {
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() - 30)))
  //         filter['date-le'] = this.dateformat.transformTofilterDate(new Date());
  //       }
  //       if (this.waitlist_timePeriod === 'LAST_WEEK') {
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() - 7)))
  //         filter['date-le'] = this.dateformat.transformTofilterDate(new Date());
  //       }
  //       if (this.waitlist_timePeriod === 'NEXT_WEEK') {
  //         filter['date-le'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() + 7)))
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() + 1)))
  //       }
  //       if (this.waitlist_timePeriod === 'TODAY') {
  //         filter['date-eq'] = this.dateformat.transformTofilterDate(new Date());
  //       }

  //       // const request_payload: any = {};
  //       // request_payload.reportType = 'QNRTOKEN';
  //       // request_payload.reportDateCategory = this.waitlist_timePeriod;
  //       // request_payload.filter = filter;
  //       // request_payload.responseType = 'INLINE';
  //       // this.passPayloadForReportGeneration(request_payload);
  //       // this.report_data_service.setReportCriteriaInput(request_payload);

  //       if (this.waitlist_timePeriod === 'TODAY') {
  //         this.provider_services.getTodayWaitlist(filter).subscribe(
  //           data => {
  //             const list = data;
  //            this.loadBookingQuestionaaireReport(list);
  //           },
  //           () => { },
  //           () => { });
  //       } else if (this.waitlist_timePeriod === 'NEXT_WEEK') {
  //         this.provider_services.getFutureWaitlist(filter).subscribe(
  //           data => {
  //             const list = data;
  //             this.loadBookingQuestionaaireReport(list);
  //           },
  //           () => { },
  //           () => { });
  //       } else {
  //         this.provider_services.getHistoryWaitlist(filter).subscribe(
  //           (data:any) => {   
  //             this.provider_services.getTodayWaitlist(filter).subscribe(
  //               (tdata:any) => {
  //                 const list = [...data,...tdata];
  //                this.loadBookingQuestionaaireReport(list);
  //               },
  //               () => { },
  //               () => { });

  //             // this.loadBookingQuestionaaireReport(list);
  //           },
  //           () => { this.loading = false; },
  //           () => { this.loading = false; });
  //       }
  //     }
  //   } else if (reportType === 'appointment') {
  //     if (this.appointment_timePeriod === 'DATE_RANGE' && (this.appointment_startDate === undefined || this.appointment_endDate === undefined)) {
  //       this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
  //     } else {
  //       this.filterparams = {
  //         'paymentStatus': this.appointment_billpaymentstatus,
  //         'schedule': this.appointment_schedule_id,
  //         'service': this.appointment_service_id,
  //         // 'apptStatus': this.appointment_status,
  //         'appointmentMode': this.appointment_mode,
  //         // 'apptForId': this.appointment_customerId
  //       };
  //       // if (!this.appointment_customerId) {
  //       //   delete this.filterparams.appmtFor;
  //       // }
  //       if (this.appointment_schedule_id === 0) {
  //         delete this.filterparams.schedule;
  //       }
  //       if (this.appointment_billpaymentstatus === 0) {
  //         delete this.filterparams.paymentStatus;
  //       }
  //       if (this.appointment_service_id === 0) {
  //         delete this.filterparams.service;
  //       }
  //       if (this.apptStatusFilter.length > 0) {
  //         this.filterparams ['apptStatus'] = this.apptStatusFilter.toString();
  //         // delete this.filterparams.waitlistStatus;
  //       }
  //       if (this.apptIntStatusFilter.length > 0) {
  //         this.filterparams['internalStatus'] = this.apptIntStatusFilter.toString();
  //       }
  //       // if (this.appointment_status === 0) {
  //       //   delete this.filterparams.apptStatus;
  //       // }
  //       if (this.appointment_mode === 0) {
  //         delete this.filterparams.appointmentMode;
  //       }
  //       if (this.appointment_customerId === 0) {
  //         delete this.filterparams.providerOwnConsumerId;
  //       }
  //       const filter = {};
  //       for (const key in this.filterparams) {
  //         if (this.filterparams.hasOwnProperty(key)) {
  //           // assign property to new object with modified key
  //           filter[key + '-eq'] = this.filterparams[key];
  //         }
  //       }
  //       if (this.appointment_timePeriod === 'DATE_RANGE') {
  //         if (this.appointment_startDate === undefined || this.appointment_endDate === undefined) {
  //           this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });

  //         }
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(this.appointment_startDate);
  //         filter['date-le'] = this.dateformat.transformTofilterDate(this.appointment_endDate);
  //       }
  //       if (this.appointment_timePeriod === 'DATE_RANGE') {
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(this.waitlist_startDate);
  //         filter['date-le'] = this.dateformat.transformTofilterDate(this.waitlist_endDate);
  //       }
  //       if (this.appointment_timePeriod === 'LAST_THIRTY_DAYS') {
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() - 30)))
  //         filter['date-le'] = this.dateformat.transformTofilterDate(new Date());
  //       }
  //       if (this.appointment_timePeriod === 'LAST_WEEK') {
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() - 7)))
  //         filter['date-le'] = this.dateformat.transformTofilterDate(new Date());
  //       }
  //       if (this.appointment_timePeriod === 'NEXT_WEEK') {
  //         filter['date-le'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() + 7)))
  //         filter['date-ge'] = this.dateformat.transformTofilterDate(new Date(new Date().setDate(new Date().getDate() + 1)))
  //       }
  //       if (this.appointment_timePeriod === 'TODAY') {
  //         filter['date-eq'] = this.dateformat.transformTofilterDate(new Date());
  //       }
  //       if (this.appointment_timePeriod === 'TODAY') {
  //         this.provider_services.getTodayAppointments(filter).subscribe(
  //           data => {
  //             const list = data;
  //             this.loadBookingQuestionaaireReport(list);
  //           },
  //           () => { },
  //           () => { });
  //       } else if (this.appointment_timePeriod === 'NEXT_WEEK') {
  //         this.provider_services.getFutureAppointments(filter).subscribe(
  //           data => {
  //             const list = data;
  //             this.loadBookingQuestionaaireReport(list);
  //           },
  //           () => { },
  //           () => { });
  //       } else {
  //         this.provider_services.getHistoryAppointments(filter).subscribe(
  //           data => {
  //             const list = data;
  //             this.loadBookingQuestionaaireReport(list);
  //           },
  //           () => { this.loading = false; },
  //           () => { this.loading = false; });
  //       }
  //     }
  //   }
    
  // }
  generateSummary(reportType) {
    this.loading = true;
    if (reportType === 'token') {
      if (this.waitlist_timePeriod === 'DATE_RANGE' && (this.waitlist_startDate === undefined || this.waitlist_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'billPaymentStatus': this.waitlist_billpaymentstatus,
          'queue': this.token_queue_id,
          'service': this.token_service_id,
          // 'waitlistStatus': this.waitlist_status,
          'waitlistMode': this.waitlist_mode,
          'waitlistingForId': this.waitlist_customerId
        };
        if (!this.waitlist_customerId) {
          delete this.filterparams.waitlistingFor;
        }
        if (this.waitlist_billpaymentstatus === 0) {
          delete this.filterparams.billPaymentStatus;
        }
        if (this.token_service_id === 0) {
          delete this.filterparams.service;
        }
        if (this.token_queue_id === 0) {
          delete this.filterparams.queue;
        }
        console.log("Token: ", this.waitlistStatusFilter.toString());
        if (this.waitlistStatusFilter.length > 0) {
        // this.waitlist_status = this.waitlistStatusFilter.toString();
        this.filterparams['waitlistStatus'] = this.waitlistStatusFilter.toString();
        }
        if (this.waitlistIntStatusFilter.length > 0) {
          this.filterparams['internalStatus'] = this.waitlistIntStatusFilter.toString();
        }
        // if (this.waitlist_status === 0) {
        //   delete this.filterparams.waitlistStatus;
        // }
        if (this.waitlist_mode === 0) {
          delete this.filterparams.waitlistMode;
        }
        if (this.waitlist_customerId === 0) {
          delete this.filterparams.providerOwnConsumerId;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.waitlist_timePeriod === 'DATE_RANGE') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.waitlist_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.waitlist_endDate);
        }
        const request_payload: any = {};
        request_payload.reportType = 'QNRTOKEN';
        request_payload.reportDateCategory = this.waitlist_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    } else if (reportType === 'appointment') {
      if (this.appointment_timePeriod === 'DATE_RANGE' && (this.appointment_startDate === undefined || this.appointment_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'paymentStatus': this.appointment_billpaymentstatus,
          'schedule': this.appointment_schedule_id,
          'service': this.appointment_service_id,
          // 'apptStatus': this.appointment_status,
          'appointmentMode': this.appointment_mode,
          'apptForId': this.appointment_customerId
        };
        if (!this.appointment_customerId) {
          delete this.filterparams.appmtFor;
        }
        if (this.appointment_schedule_id === 0) {
          delete this.filterparams.schedule;
        }
        if (this.appointment_billpaymentstatus === 0) {
          delete this.filterparams.paymentStatus;
        }
        if (this.appointment_service_id === 0) {
          delete this.filterparams.service;
        }
        if (this.apptStatusFilter.length > 0) {
          // this.waitlist_status = this.waitlistStatusFilter.toString();
          this.filterparams['apptStatus'] = this.apptStatusFilter.toString();
          }
        // if (this.appointment_status === 0) {
        //   delete this.filterparams.apptStatus;
        // }
        if (this.apptIntStatusFilter.length > 0) {
          this.filterparams['internalStatus'] = this.apptIntStatusFilter.toString();
        }
        if (this.appointment_mode === 0) {
          delete this.filterparams.appointmentMode;
        }
        if (this.appointment_customerId === 0) {
          delete this.filterparams.providerOwnConsumerId;
        }
        const filter = {};
        for (const key in this.filterparams) {
          if (this.filterparams.hasOwnProperty(key)) {
            // assign property to new object with modified key
            filter[key + '-eq'] = this.filterparams[key];
          }
        }
        if (this.appointment_timePeriod === 'DATE_RANGE') {
          if (this.appointment_startDate === undefined || this.appointment_endDate === undefined) {
            this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });

          }
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.appointment_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.appointment_endDate);
        }
        const request_payload: any = {};
        request_payload.reportType = 'QNRAPPT';
        request_payload.reportDateCategory = this.appointment_timePeriod;
        request_payload.filter = filter;
        request_payload.responseType = 'INLINE';
        this.passPayloadForReportGeneration(request_payload);
        this.report_data_service.setReportCriteriaInput(request_payload);
      }
    
    
    }
    
  }
}
