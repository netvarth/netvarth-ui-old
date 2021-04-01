import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { CustomerActionsComponent } from '../customer-actions/customer-actions.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']

})
export class CustomerCreateComponent implements OnInit {
  dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;

  create_cap = Messages.CREATE_CAP;
  mobile_cap = Messages.MOBILE_CAP;
  f_name_cap = Messages.FIRST_NAME_CAP;
  l_name_cap = Messages.LAST_NAME_CAP;
  email_cap = Messages.EMAIL_ID_CAP;
  gender_cap = Messages.GENDER_CAP;
  male_cap = Messages.MALE_CAP;
  female_cap = Messages.FEMALE_CAP;
  dob_cap = Messages.DOB_CAP;
  adrress_cap = Messages.ADDRESS_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  step = 1;
  tday = new Date();
  minday = new Date(1900, 0, 1);
  search_data = null;
  disableButton = false;
  api_loading = true;
  customer_label = '';
  source;
  phoneNo: any;
  email: any;
  firstName: any;
  lastName: any;
  dob: any;
  action;
  form_data = null;
  create_new = false;
  qParams = {};
  foundCustomer = false;
  searchClicked = false;
  customer_data: any = [];
  customerPhone: any;
  breadcrumbs_init = [
    // {
    //     title: 'Check-ins',
    //     url: 'provider/check-ins'
    // },
    {
      title: 'Customers',
      url: 'provider/customers'
    }

  ];
  breadcrumbs = this.breadcrumbs_init;
  breadcrumb_moreoptions: any = [];
  checkin_type;
  customidFormat;
  loading = true;
  haveMobile = true;
  viewCustomer = false;
  customerId;
  customer;
  customerName;
  timeslot;
  comingSchduleId;
  date;
  thirdParty;
  customerCount;
  customerPlaceholder = '';
  jld;
  customerErrorMsg = '';
  customerErrorMsg1 = '';
  customerErrorMsg2 = '';
  serviceIdParam;
  userId;
  deptId;
  type;
  customerDetails: any = [];
  todayvisitDetails: any = [];
  futurevisitDetails: any = [];
  historyvisitDetails: any = [];
  customerAction = '';
  waitlistModes = {
    WALK_IN_CHECKIN: 'Walk in Check-in',
    PHONE_CHECKIN: 'Phone in Check-in',
    ONLINE_CHECKIN: 'Online Check-in',
    WALK_IN_APPOINTMENT: 'Walk in Appointment',
    PHONE_IN_APPOINTMENT: 'Phone in Appointment',
    ONLINE_APPOINTMENT: 'Online Appointment'
  };
  domain;
  communication_history: any = [];
  todayVisitDetailsArray: any = [];
  futureVisitDetailsArray: any = [];
  showMoreFuture = false;
  showMoreToday = false;
  showMoreHistory = false;
  selectedDetailsforMsg: any = [];
  uid;
  customernotes = '';
  subdomain;
  showToken;
  virtualServicemode;
  virtualServicenumber;
  group;
  questionnaireList: any = [];
  questionAnswers;
  qnrLoaded = false;
  serviceId;
  bookingMode;
  showBookingQnr = false;
  newCustomerId;
  qnrSource = 'customer-create';
  constructor(
    // public dialogRef: MatDialogRef<AddProviderCustomerComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private _location: Location, public dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor) {
    // this.search_data = this.data.search_data;
    const customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.customer_label = customer_label.charAt(0).toUpperCase() + customer_label.slice(1).toLowerCase();
    this.customernotes = this.customer_label + ' note';
    this.activated_route.queryParams.subscribe(qparams => {
      const user = this.groupService.getitemFromGroupStorage('ynw-user');
      this.domain = user.sector;
      this.subdomain = user.subSector;
      this.source = qparams.source;
      this.showToken = qparams.showtoken;
      console.log(JSON.stringify(qparams));
      if (qparams.selectedGroup) {
        this.group = qparams.selectedGroup;
      }
      if (qparams.uid) {
        this.uid = qparams.uid;
      }
      if (qparams.type) {
        this.type = qparams.type;
      }
      if (qparams.bookingMode) {
        this.bookingMode = qparams.bookingMode;
      }
      if (qparams.serviceId) {
        this.serviceId = qparams.serviceId;
      }
      if (qparams.virtualServicemode) {
        this.virtualServicemode = qparams.virtualServicemode;
      }
      if (qparams.virtualServicenumber) {
        this.virtualServicenumber = qparams.virtualServicenumber;
      }
      if (qparams.phone) {
        this.phoneNo = qparams.phone;
        if (this.source === 'appt-block' || this.source === 'waitlist-block' || this.source === 'token' || this.source === 'checkin' || this.source === 'appointment' || this.source === 'clist' || this.source === 'order') {
          this.getJaldeeIntegrationSettings();
          this.save_btn = 'Proceed';
        }
      } else {
        if (this.type && this.type === 'create' && (this.source === 'token' || this.source === 'checkin' || this.source === 'appointment' || this.source === 'appt-block' || this.source === 'waitlist-block' || this.source === 'order')) {
          this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
          if (this.source === 'waitlist-block') {
            if (this.showToken) {
              this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create token';
            } else {
              this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create check-in';
            }
          } else if (this.source === 'appt-block') {
            this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create appointment';
          } else {
            this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create ' + this.source;
          }
          this.save_btn = 'Proceed';
        }
      }
      if (qparams.email) {
        this.email = qparams.email;
      }
      if (qparams.checkinType) {
        this.checkin_type = qparams.checkinType;
      }
      if (qparams.noMobile) {
        this.haveMobile = false;
      }
      if (qparams.serviceId) {
        this.serviceIdParam = qparams.serviceId;
      }
      if (qparams.userId) {
        this.userId = qparams.userId;
      }
      if (qparams.deptId) {
        this.deptId = qparams.deptId;
      }
      if (qparams.timeslot) {
        this.timeslot = qparams.timeslot;
      }
      if (qparams.date) {
        this.date = qparams.date;
      }
      if (qparams.scheduleId) {
        this.comingSchduleId = qparams.scheduleId;
      }
      if (qparams.thirdParty) {
        this.thirdParty = qparams.thirdParty;
      }
      if (qparams.id) {
        this.customerId = qparams.id;
      }
      this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
      this.breadcrumbs_init = [

        {
          title: this.customer_label.charAt(0).toUpperCase() + this.customer_label.slice(1) + 's',
          url: 'provider/customers'
        }

      ];
      if (this.customerId) {
        if (this.customerId === 'add') {
          const breadcrumbs = [];
          this.breadcrumbs_init.map((e) => {
            breadcrumbs.push(e);
          });
          breadcrumbs.push({
            title: 'Add'
          });
          this.breadcrumbs = breadcrumbs;
          this.action = 'add';
          this.createForm();
          this.getGlobalSettingsStatus();
        } else {
          this.activated_route.queryParams.subscribe(
            (qParams) => {
              this.action = qParams.action;
              this.getCustomers(this.customerId).then(
                (customer) => {
                  this.customer = customer;
                  this.customerName = this.customer[0].firstName;
                  if (this.action === 'edit') {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                      breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                      title: this.customerName
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.viewCustomer = false;
                    this.createForm();
                    this.getGlobalSettingsStatus();
                  } else if (this.action === 'view') {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                      breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                      title: this.customerName
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.viewCustomer = true;
                    this.loading = false;
                    if (this.customerId) {
                      this.getCustomerTodayVisit();
                      this.getCustomerFutureVisit();
                      this.getCustomerHistoryVisit();
                    }
                  }
                }
              );
            }
          );
        }
        this.api_loading = false;
      }
    });

  }
  getCustomers(customerId) {
    const _this = this;
    const filter = { 'id-eq': customerId };
    return new Promise(function (resolve, reject) {
      _this.provider_services.getProviderCustomers(filter)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }

  getJaldeeCustomer() {
    const filter = { 'primaryMobileNo-eq': this.phoneNo };
    this.provider_services.getJaldeeCustomer(filter)
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            if (data[0].userProfile) {
              this.customerDetails = data[0].userProfile;
              this.amForm.get('mobile_number').setValue(data[0].userProfile.primaryMobileNo);
              this.amForm.get('first_name').setValue(data[0].userProfile.firstName);
              this.amForm.get('last_name').setValue(data[0].userProfile.lastName);
              if (this.customerDetails.email) {
                this.amForm.get('email_id').setValue(this.customerDetails.email);
              }
              if (this.customerDetails.address) {
                this.amForm.get('address').setValue(this.customerDetails.address);
              }
            }
            this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
            this.customerErrorMsg1 = 'The system found the record details in Jaldee.com';
            if (this.source === 'waitlist-block' || this.source === 'appt-block' || this.source === 'clist') {
              this.customerErrorMsg2 = 'Do you want to add the ' + this.customer_label + '?';
            } else {
              this.customerErrorMsg2 = 'Do you want to add the ' + this.customer_label + ' to create ' + this.source + '?';
            }
            this.loading = false;
          } else {
            this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
            if (this.source === 'waitlist-block' || this.source === 'appt-block' || this.source === 'clist') {
              this.customerErrorMsg = 'Please fill ' + this.customer_label + ' details';
            } else {
              this.customerErrorMsg = 'Please fill ' + this.customer_label + ' details to create ' + this.source;
            }
            this.loading = false;
          }
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
          this.loading = false;
        }
      );
  }
  getJaldeeIntegrationSettings() {
    this.loading = true;
    this.provider_services.getJaldeeIntegrationSettings().subscribe(
      (data: any) => {
        if (data.walkinConsumerBecomesJdCons) {
          this.getJaldeeCustomer();
        } else {
          this.customerErrorMsg = 'This record is not found in your ' + this.customer_label + 's list.';
          if (this.source === 'waitlist-block') {
            if (this.showToken) {
              this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create token';
            } else {
              this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create check-in';
            }
          } else if (this.source === 'appt-block') {
            this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create appointment';
          } else {
            this.customerErrorMsg1 = 'Please fill ' + this.customer_label + ' details to create ' + this.source;
          }
          this.loading = false;
        }
      }
    );
  }

  getCustomerCount() {
    this.provider_services.getProviderCustomersCount()
      .subscribe(
        data => {
          this.customerCount = data;
          this.jld = 'JLD' + this.thirdParty + this.customerCount;
          this.amForm.get('customer_id').setValue(this.jld);
        });
  }
  ngOnInit() {
    this.breadcrumbs = this.breadcrumbs_init;
    // this.breadcrumbs = [{
    //     title: this.wordProcessor.firstToUpper(this.customer_label) + 's',
    //     url: 'provider/customers'
    // },
    // {
    //     title: 'Add'
    // }
    // ];
  }

  getGlobalSettingsStatus() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        this.customidFormat = data.jaldeeIdFormat;
        if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
          if (this.thirdParty) {
            this.amForm.addControl('customer_id', new FormControl(''));
            this.customerPlaceholder = this.customer_label + ' id';
            this.getCustomerCount();
          } else {
            this.amForm.addControl('customer_id', new FormControl('', Validators.required));
            this.customerPlaceholder = this.customer_label + ' id *';
          }
        }
        // this.createForm();
      });
  }
  createForm() {
    this.getCustomerQnr();
    if (!this.haveMobile) {
      this.amForm = this.fb.group({
        first_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        last_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        email_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
        dob: [''],
        gender: [''],
        address: ['']
      });
      this.loading = false;
    } else {
      this.amForm = this.fb.group({
        mobile_number: ['', Validators.compose([Validators.maxLength(10),
        Validators.minLength(10), Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])],
        customer_id: [''],
        first_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        last_name: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)])],
        email_id: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
        dob: [''],
        gender: [''],
        address: ['']
      });
      if (this.action === 'edit') {
        this.updateForm();
      }
      this.loading = false;
    }
    if (this.phoneNo) {
      this.amForm.get('mobile_number').setValue(this.phoneNo);
    }
    if (this.email) {
      this.amForm.get('email_id').setValue(this.email);
    }
  }
  updateForm() {
    this.amForm.setValue({
      'first_name': this.customer[0].firstName || null,
      'last_name': this.customer[0].lastName || null,
      'email_id': this.customer[0].email || null,
      'dob': this.customer[0].dob || null,
      'gender': this.customer[0].gender || null,
      'mobile_number': this.customer[0].phoneNo || null,
      'customer_id': this.customer[0].jaldeeId || null,
      'address': this.customer[0].address || null,
    });
  }
  onSubmit(form_data) {
    this.disableButton = true;
    this.showBookingQnr = false;
if (this.questionnaireList && this.questionnaireList.labels) {
this.validateQnr(form_data);
} else {
  this.customerActions(form_data);
}

  }
  customerActions(form_data) {
    let datebirth;
    if (form_data.dob) {
      datebirth = this.dateTimeProcessor.transformToYMDFormat(form_data.dob);
    }
    if (this.action === 'add') {
      const post_data = {
        //   'userProfile': {
        'firstName': form_data.first_name,
        'lastName': form_data.last_name,
        'dob': datebirth,
        'gender': form_data.gender,
        'phoneNo': form_data.mobile_number,
        'address': form_data.address,
        //   }
      };
      if (form_data.mobile_number) {
        post_data['countryCode'] = '+91';
      }
      if (form_data.email_id && form_data.email_id !== '') {
        post_data['email'] = form_data.email_id;
      }
      if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
        if (form_data.customer_id) {
          post_data['jaldeeId'] = form_data.customer_id;
        } else {
          post_data['jaldeeId'] = this.jld;
        }
      }
      this.provider_services.createProviderCustomer(post_data)
        .subscribe(
          data => {
            this.wordProcessor.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
            this.snackbarService.openSnackBar(Messages.PROVIDER_CUSTOMER_CREATED);
            const qParams = {};
            qParams['pid'] = data;
            this.newCustomerId = data;
            console.log(this.source);
            console.log(this.questionAnswers);
            if (this.questionAnswers) {
              this.submitQnr(form_data, data);
            } else {
              if (this.source === 'appt-block' || this.source === 'waitlist-block') {
                console.log(this.serviceId);
                console.log(this.bookingMode);
                this.getProviderQuestionnaire(form_data);
              } else {
              this.goBackAfterAdd(form_data, data);
              }
            }
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.disableButton = false;
          });
    } else if (this.action === 'edit') {
      const post_data = {
        //   'userProfile': {
        'id': this.customerId,
        'firstName': form_data.first_name,
        'lastName': form_data.last_name,
        'dob': datebirth,
        'gender': form_data.gender,
        'phoneNo': form_data.mobile_number,
        'email': form_data.email_id,
        'address': form_data.address,
        //   }
      }; if (form_data.mobile_number) {
        post_data['countryCode'] = '+91';
      }
      // if (form_data.email_id && form_data.email_id !== '') {
      //     post_data['email'] = form_data.email_id;
      // }
      if (form_data.customer_id) {
        post_data['jaldeeId'] = form_data.customer_id;
      }
      this.provider_services.updateProviderCustomer(post_data)
        .subscribe(
          data => {
            this.wordProcessor.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
            this.snackbarService.openSnackBar('Updated Successfully');
            const qParams = {};
            qParams['pid'] = data;
            if (this.questionAnswers) {
              this.submitQnr(form_data, data);
            } else {
              this.goBackAfterEdit(form_data, data);
            }
          },
          error => {
            this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            this.disableButton = false;
          });
    }
  }
  goBackAfterAdd(form_data, data) {
    if (this.source === 'checkin' || this.source === 'token') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ph: form_data.mobile_number,
          checkin_type: this.checkin_type,
          haveMobile: this.haveMobile,
          id: data,
          thirdParty: this.thirdParty
        }
      };
      this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
    } else if (this.source === 'appointment') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ph: form_data.mobile_number,
          checkinType: this.checkin_type,
          haveMobile: this.haveMobile,
          id: data,
          timeslot: this.timeslot,
          scheduleId: this.comingSchduleId,
          date: this.date,
          thirdParty: this.thirdParty,
          serviceId: this.serviceIdParam,
          userId: this.userId,
          deptId: this.deptId,
          type: this.type
        }
      };
      this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
    } else if (this.source === 'appt-block') {
      this.confirmApptBlock(data);
    } else if (this.source === 'waitlist-block') {
      this.confirmWaitlistBlock(data);
    } else if (this.source === 'order') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ph: form_data.mobile_number,
          checkinType: this.checkin_type,
          haveMobile: this.haveMobile,
          id: data,
          type: this.type
        }
      };
      this.router.navigate(['provider', 'orders', 'order-wizard'], navigationExtras);
    } else {
      this.router.navigate(['provider', 'customers'], { queryParams: { selectedGroup: this.group, customerId: data } });
    }
  }
  goBackAfterEdit(form_data, data) {
    if (this.source === 'checkin' || this.source === 'token') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ph: form_data.mobile_number,
          checkin_type: this.checkin_type
        }
      };
      this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
    } else if (this.source === 'appointment') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ph: form_data.mobile_number,
          checkin_type: this.checkin_type
        }
      };
      this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
    } else if (this.source === 'order') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ph: form_data.mobile_number,
          checkinType: this.checkin_type,
          haveMobile: this.haveMobile,
          id: data,
          type: this.type
        }
      };
      this.router.navigate(['provider', 'orders', 'order-wizard'], navigationExtras);
    } else {
      this.router.navigate(['provider', 'customers']);
    }
  }
  confirmApptBlock(id) {
    const post_data = {
      'uid': this.uid,
      'consumer': {
        'id': id
      },
      'appmtFor': [{
        'id': id,
      }],
    };
    if (this.virtualServicemode && this.virtualServicenumber) {
      const virtualArray = {};
      virtualArray[this.virtualServicemode] = this.virtualServicenumber;
      post_data['virtualService'] = virtualArray;
    }
    this.provider_services.confirmAppointmentBlock(post_data)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'appointments']);
        });
  }
  confirmWaitlistBlock(id) {
    const post_data = {
      'ynwUuid': this.uid,
      'consumer': {
        'id': id
      },
      'waitlistingFor': [{
        'id': id
      }],
    };
    if (this.virtualServicemode && this.virtualServicenumber) {
      const virtualArray = {};
      virtualArray[this.virtualServicemode] = this.virtualServicenumber;
      post_data['virtualService'] = virtualArray;
    }
    this.provider_services.confirmWaitlistBlock(post_data)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'check-ins']);
        });
  }
  onCancel() {
    if (this.source === 'checkin' || this.source === 'token') {
      const showtoken = (this.source === 'checkin') ? false : true;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          checkin_type: this.checkin_type,
          haveMobile: this.haveMobile,
          thirdParty: this.thirdParty,
          showtoken: showtoken
        }
      };
      this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
    } else if (this.source === 'appointment') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          checkinType: this.checkin_type,
          haveMobile: this.haveMobile,
          timeslot: this.timeslot,
          scheduleId: this.comingSchduleId,
          date: this.date,
          thirdParty: this.thirdParty,
          serviceId: this.serviceIdParam,
          userId: this.userId,
          deptId: this.deptId,
          type: this.type
        }
      };
      this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
    } else {
      this._location.back();
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
    this.disableButton = false;
  }
  onFieldBlur(key) {
    this.amForm.get(key).setValue(this.toCamelCase(this.amForm.get(key).value));
  }
  toCamelCase(word) {
    if (word) {
      return this.wordProcessor.toCamelCase(word);
    } else {
      return word;
    }
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  searchCustomer(form_data, mod?) {
    let mode = 'id';
    if (mod) {
      mode = mod;
    }
    this.form_data = null;
    this.create_new = false;
    let post_data = {};
    const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
    const isEmail = emailPattern.test(form_data.mobile_number);
    if (isEmail) {
      mode = 'email';
    } else {
      const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const isNumber = phonepattern.test(form_data.mobile_number);
      const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const isCount10 = phonecntpattern.test(form_data.mobile_number);
      if (isNumber && isCount10) {
        mode = 'phone';
      } else {
        mode = 'id';
      }
    }
    // if (this.appt) {
    //     this.qParams['source'] = 'appointment';
    // } else {
    //     this.qParams['source'] = 'checkin';
    // }
    switch (mode) {
      case 'phone':
        post_data = {
          'phoneNo-eq': form_data.mobile_number
        };
        this.qParams['phone'] = form_data.mobile_number;
        break;
      case 'email':
        this.qParams['phone'] = form_data.mobile_number;
        post_data = {
          'email-eq': form_data.mobile_number
        };
        break;
      case 'id':
        post_data = {
          'jaldeeId-eq': form_data.mobile_number
        };
        break;
    }
    this.foundCustomer = false;
    this.provider_services.getCustomer(post_data)

      .subscribe(
        (data: any) => {
          if (data.length === 0) {
            this.form_data = data;
            this.create_new = true;
            this.searchClicked = true;
          } else {
            this.foundCustomer = true;
            this.customer_data = data[0];
            this.customerPhone = this.customer_data.phoneNo;
            this.searchClicked = true;
          }
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  findCustomer() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        source: 'clist'
      }
    };
    this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
  }
  editCustomer() {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit' }
    };
    this.router.navigate(['/provider/customers/' + this.customer[0].id], navigationExtras);
  }
  getCustomerTodayVisit() {
    this.provider_services.getCustomerTodayVisit(this.customerId).subscribe(
      (data: any) => {
        this.todayVisitDetailsArray = data;
        this.todayvisitDetails = this.todayVisitDetailsArray.slice(0, 5);
      }
    );
  }
  getCustomerFutureVisit() {
    this.provider_services.getCustomerFutureVisit(this.customerId).subscribe(
      (data: any) => {
        this.futureVisitDetailsArray = data;
        this.futurevisitDetails = this.futureVisitDetailsArray.slice(0, 5);
      }
    );
  }
  getCustomerHistoryVisit() {
    this.loading = true;
    this.provider_services.getCustomerHistoryVisit(this.customerId).subscribe(
      (data: any) => {
        this.historyvisitDetails = data;
        this.loading = false;
      }
    );
  }
  stopprop(event) {
    event.stopPropagation();
  }
  medicalRecord(visitDetails) {
    console.log(visitDetails);
    if (visitDetails.waitlist) {
      console.log(visitDetails.waitlist);
      let mrId = 0;
      if (visitDetails.waitlist.mrId) {
        mrId = visitDetails.waitlist.mrId;
      }
      const customerDetails = visitDetails.waitlist.waitlistingFor[0];
      const customerId = customerDetails.id;
      const bookingId = visitDetails.waitlist.ynwUuid;
      const bookingType = 'TOKEN';
      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);
    } else if (visitDetails.appointmnet) {
      let mrId = 0;
      if (visitDetails.appointmnet.mrId) {
        mrId = visitDetails.appointmnet.mrId;
      }
      const customerDetails = visitDetails.appointmnet.appmtFor[0];
      const customerId = customerDetails.id;
      const bookingId = visitDetails.appointmnet.uid;
      const bookingType = 'APPT';
      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId]);
    }
  }
  prescription(visitDetails) {
    console.log(visitDetails);
    if (visitDetails.waitlist) {
      console.log(visitDetails.waitlist);
      let mrId = 0;
      if (visitDetails.waitlist.mrId) {
        mrId = visitDetails.waitlist.mrId;
      }
      const customerDetails = visitDetails.waitlist.waitlistingFor[0];
      const customerId = customerDetails.id;
      const bookingId = visitDetails.waitlist.ynwUuid;
      const bookingType = 'TOKEN';
      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
    } else if (visitDetails.appointmnet) {
      let mrId = 0;
      if (visitDetails.appointmnet.mrId) {
        mrId = visitDetails.appointmnet.mrId;
      }
      const customerDetails = visitDetails.appointmnet.appmtFor[0];
      const customerId = customerDetails.id;
      const bookingId = visitDetails.appointmnet.uid;
      const bookingType = 'APPT';
      this.router.navigate(['provider', 'customers', customerId, bookingType, bookingId, 'medicalrecord', mrId, 'prescription']);
    }

  }
  gotoCustomerDetail(visit, time_type) {
    if (visit.waitlist) {
      this.router.navigate(['provider', 'check-ins', visit.waitlist.ynwUuid], { queryParams: { timetype: time_type } });
    } else {
      this.router.navigate(['provider', 'appointments', visit.appointmnet.uid], { queryParams: { timetype: time_type } });
    }
  }
  goBack() {
    this._location.back();
  }
  showConsumerNote(visitDetail) {
    let type;
    let checkin;
    if (visitDetail.waitlist) {
      type = 'checkin';
      checkin = visitDetail.waitlist;
    } else {
      type = 'appt';
      checkin = visitDetail.appointmnet;
    }
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin,
        type: type
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  showCustomerAction() {
    const notedialogRef = this.dialog.open(CustomerActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        customer: this.customer,
        // type: type
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'edit') {
        this.editCustomer();
      } else {
        this.getCustomers(this.customerId).then(
          (customer) => {
            this.customer = customer;
          });
      }
    });
  }
  showCommHistory(visitdetails) {
    this.loading = true;
    this.customerAction = 'inbox';
    this.selectedDetailsforMsg = visitdetails;
    this.getCommunicationHistory();
  }
  getCommunicationHistory() {
    let uuid;
    if (this.selectedDetailsforMsg.waitlist) {
      uuid = this.selectedDetailsforMsg.waitlist.ynwUuid;
    } else {
      uuid = this.selectedDetailsforMsg.appointmnet.uid;
    }
    this.provider_services.getProviderInbox()
      .subscribe(
        data => {
          const history: any = data;
          this.communication_history = [];
          for (const his of history) {
            if (his.waitlistId === uuid || his.waitlistId === uuid.replace('h_', '')) {
              this.communication_history.push(his);
            }
          }
          this.sortMessages();
          this.loading = false;
          this.shared_functions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  sortMessages() {
    this.communication_history.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return 11;
      } else if (message1.timeStamp > message2.timeStamp) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  goBackfromAction() {
    this.customerAction = '';
  }
  showMore(type) {
    if (type === 'today') {
      this.todayvisitDetails = this.todayVisitDetailsArray;
      this.showMoreToday = true;
    } else if (type === 'future') {
      this.futurevisitDetails = this.futureVisitDetailsArray;
      this.showMoreFuture = true;
    }
  }
  showLess(type) {
    if (type === 'today') {
      this.todayvisitDetails = this.todayVisitDetailsArray.slice(0, 5);
      this.showMoreToday = false;
    } else if (type === 'future') {
      this.futurevisitDetails = this.futureVisitDetailsArray.slice(0, 5);
      this.showMoreFuture = false;
    }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
  showHistory() {
    this.showMoreHistory = !this.showMoreHistory;
  }
  getCustomerQnr() {
    this.provider_services.getCustomerQuestionnaire().subscribe(data => {
      this.questionnaireList = data;
      this.qnrLoaded = true;
    });
  }
  getProviderQuestionnaire(form_data) {
    this.bookingMode = (this.bookingMode === 'WALK_IN_APPOINTMENT' || this.bookingMode === 'WALK_IN_CHECKIN') ? 'WALKIN' : 'PHONEIN';
    this.provider_services.getProviderQuestionnaire(this.serviceId, this.newCustomerId, this.bookingMode).subscribe(data => {
        console.log(data);
        this.questionnaireList = data;
        if (this.questionnaireList && this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
          this.showBookingQnr = true;
          if (this.source === 'waitlist-block') {
            this.qnrSource = 'proCheckin';
          } else {
            this.qnrSource = 'proAppt';
          }
        } else {
          this.goBackAfterAdd(form_data, data);
        }
    });
}
  getQuestionAnswers(event) {
    this.questionAnswers = event;
    this.disableButton = false;
  }
  submitQnr(form_data, id) {
    console.log(this.questionAnswers);
    const dataToSend: FormData = new FormData();
    if (this.questionAnswers.files) {
      for (const pic of this.questionAnswers.files.files) {
        dataToSend.append('files', pic, pic['name']);
      }
    }
    const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
    dataToSend.append('question', blobpost_Data);
    if (this.action === 'add') {
      this.AddQnr(id, dataToSend, form_data);
    } else {
      this.updateQnr(id, dataToSend, form_data);
    }
  }
  AddQnr(id, dataToSend, form_data) {
    this.provider_services.submitProviderCustomerQuestionnaire(id, dataToSend).subscribe(data => {
      if (this.source === 'appt-block' || this.source === 'waitlist-block') {
        console.log(this.serviceId);
        console.log(this.bookingMode);
        this.getProviderQuestionnaire(form_data);
      } else {
      this.goBackAfterAdd(form_data, id);
      }
    }, error => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    });
  }
  updateQnr(id, dataToSend, form_data) {
    this.provider_services.resubmitProviderCustomerQuestionnaire(id, dataToSend).subscribe(data => {
      if (this.source === 'appt-block' || this.source === 'waitlist-block') {
        console.log(this.serviceId);
        console.log(this.bookingMode);
        this.getProviderQuestionnaire(form_data);
      } else {
      this.goBackAfterEdit(form_data, id);
      }
    }, error => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    });
  }
  validateQnr(form_data?) {
    if (this.questionAnswers && this.questionAnswers.answers) {
      console.log(this.questionAnswers.answers);
      this.provider_services.validateProviderQuestionnaire(this.questionAnswers.answers).subscribe((data: any) => {
        if (data.length === 0) {
          if (this.showBookingQnr) {
          if (this.source === 'appt-block') {
            this.confirmApptBlock(this.newCustomerId);
          } else if (this.source === 'waitlist-block') {
            this.confirmWaitlistBlock(this.newCustomerId);
          } 
        } else {
  this.customerActions(form_data);
          }
        }
        this.shared_functions.sendMessage({ type: 'qnrValidateError', value: data });
      }, error => {
        this.disableButton = false;
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
    } else {
      this.disableButton = false;
      this.snackbarService.openSnackBar('Required fields missing', { 'panelClass': 'snackbarerror' });
    }
  }
}
