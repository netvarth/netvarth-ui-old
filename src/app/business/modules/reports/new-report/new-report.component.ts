import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ReportDataService } from '../reports-data.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';


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
  bill_payment_status: { value: string; displayName: string; }[];
  waitlist_mode_list: { displayName: string; value: string; }[];
  appointment_status_list: { displayName: string; value: string; }[];
  appointment_mode_list: { displayName: string; value: string; }[];
  payment_purpose: { value: string; displayName: string; }[];
  donation_timePeriod: string;
  appointment_timePeriod: string;

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




  report_criteria: any;
  report_type: any;
  public reportForm: FormGroup;
  time_period;
  payment_modes;
  payment_status;
  pay_confirm_num;

  constructor(
    private router: Router,
    private activated_route: ActivatedRoute,
    public shared_functions: SharedFunctions,
    private report_data_service: ReportDataService,
    private provider_services: ProviderServices,
    public dateformat: DateFormatPipe,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService
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
    this.minDate = new Date(new Date().setDate(new Date().getDate() - 90));
  }

  ngOnInit() {
    this.payment_timePeriod = this.appointment_timePeriod = this.waitlist_timePeriod = this.donation_timePeriod = this.order_timePeriod = 'LAST_THIRTY_DAYS';
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
    console.log(JSON.stringify(res));
    if (Object.keys(res).length !== 0) {
      switch (this.report_type) {

        case 'payment': {
          this.payment_paymentStatus = res.status || 0;
          this.payment_paymentMode = res.paymentMode || 0;
          this.payment_paymentPurpose = res.paymentPurpose || 0;
          this.payment_amount = res.amount;
          this.payment_transactionType = res.transactionType || 0;
          this.payment_timePeriod = res.dateRange || 'LAST_THIRTY_DAYS';
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
          this.waitlist_billpaymentstatus = res.billPaymentStatus || 0;
          this.waitlist_status = res.waitlistStatus || 0;
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
      }
    }

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
    console.log(JSON.stringify(res));
    switch (this.report_type) {
      case 'payment': {
        if (res.jaldee_customers === '' || res.jaldee_customers === undefined || res.jaldee_customers === 'All') {
          this.payment_customer = 'All';
          // this.payment_customerId = 0;
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
          // this.donation_customerId = 0;
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
          // this.appointment_customerId = 0;
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
          'providerOwnConsumerId': this.payment_customerId

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

        // } else if (this.payment_transactionType === 'appointment') {
        //   delete this.filterparams.queue;
        // } else if (this.payment_transactionType === 'waitlist') {
        //   delete this.filterparams.schedule;
        // }
        if (this.payment_paymentPurpose === 0) {
          delete this.filterparams.paymentPurpose;
        }
        if (this.payment_amount === undefined) {
          delete this.filterparams.amount;
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
          'apptStatus': this.appointment_status,
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
        if (this.appointment_status === 0) {
          delete this.filterparams.apptStatus;
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

    } else if (reportType === 'token') {
      if (this.waitlist_timePeriod === 'DATE_RANGE' && (this.waitlist_startDate === undefined || this.waitlist_endDate === undefined)) {
        this.snackbarService.openSnackBar('Start Date or End Date should not be empty', { 'panelClass': 'snackbarerror' });
      } else {
        this.filterparams = {
          'billPaymentStatus': this.waitlist_billpaymentstatus,
          'queue': this.token_queue_id,
          'service': this.token_service_id,
          'waitlistStatus': this.waitlist_status,
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
        if (this.waitlist_status === 0) {
          delete this.filterparams.waitlistStatus;
        }
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

        this.filterparams = {

          'service': this.donation_service_id,
          'donationAmount': this.donation_amount


        };
        if (this.donation_service === 'All') {
          delete this.filterparams.service;
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
        if (this.donation_timePeriod === 'DATE_RANGE') {
          filter['date-ge'] = this.dateformat.transformTofilterDate(this.donation_startDate);
          filter['date-le'] = this.dateformat.transformTofilterDate(this.donation_endDate);
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

  } redirecToReports() {
    this.router.navigate(['provider', 'reports']);
  }



  passPayloadForReportGeneration(payload) {
    this.btn_disabled = true;
    this.report_loading = true;

    this.generateReportByCriteria(payload).then(res => {
      this.report_loading = false;
      this.btn_disabled = false;
      this.report_data_service.storeSelectedValues(res);
      this.generatedReport(res);
    },
      (error) => {
        this.report_loading = false;
        this.btn_disabled = false;
        this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
      });

  }
  goToSelectionPage(type, selected_id) {
    console.log(selected_id);
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
    });
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
          'waitlistStatus': this.waitlist_status,
          'waitlistMode': this.waitlist_mode,
          'dateRange': this.waitlist_timePeriod,
          'startDate': this.waitlist_startDate,
          'endDate': this.waitlist_endDate


        };
      }
      if (this.report_type === 'appointment') {
        selectedValues = {
          'paymentStatus': this.appointment_billpaymentstatus,
          'apptStatus': this.appointment_status,
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
      resolve(selectedValues);
    });

  }
  generatedReport(report) {
    this.setSelectedData().then(res => {
      localStorage.setItem('report', JSON.stringify(report));
      this.router.navigate(['provider', 'reports', 'generated-report']);
    },
    );

  }
}
