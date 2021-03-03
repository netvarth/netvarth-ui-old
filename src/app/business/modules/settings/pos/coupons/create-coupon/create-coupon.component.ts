import { Component, OnInit } from '@angular/core';
import '../../../../../../../assets/js/pages/custom/wizard/wizard-3';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { TimewindowPopupComponent } from '../../../ordermanager/catalog/timewindowpopup/timewindowpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { ServiceListDialogComponent } from '../../../../../shared/service-list-dialog/service-list-dialog.component';
import { ItemListDialogComponent } from '../../../../../shared/item-list-dialog/item-list-dialog.component';
import { DepartmentListDialogComponent } from '../../../../../shared/department-list-dialog/department-list-dialog.component';
import { ConsumerGroupDialogComponent } from '../../../../../shared/consumer-group-dialog/consumer-group-dialog.component';
import { UsersListDialogComponent } from '../../../../../shared/users-list-dialog/users-list-dialog.component';
import { ConsumerLabelDialogComponent } from '../../../../../shared/consumer-label-dialog/consumer-label-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css', '../../../../../../../assets/css/style.bundle.css', '../../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../../assets/css/pages/wizard/wizard-3.css']

})
export class CreateCouponComponent implements OnInit {
  consumerLabeldialogRef: any;
  services: any = [];
  items: any = [];
  departments: any = [];
  users: any = [];
  customer_groups: any = [];
  customer_labels: any = [];
  couponBasedOnValue: any = [];
  servicedialogRef: any;
  itemdialogRef: any;
  userdialogRef: any;
  consumerGroupdialogRef: any;
  departmentdialogRef: any;
  showServiceSection: boolean;
  showCatalogSection: boolean;
  active_user: any;
  deptObj;
  department_list: any = [];
  item_list: any = [];
  customer_label_list: any = [];
  customer_group_list: any = [];
  user_list: any = [];
  catalog_list: any = [];
  enddateError: boolean;
  startdateError: boolean;
  timewindow_list: any = [];
  timewindowdialogRef: any;
  max_char_count: any;
  char_count: number;
  isfocused: boolean;
  coupon_timeslots: any = [];
  public couponForm: FormGroup;
  step = 1;
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  weekdays = projectConstantsLocal.myweekdaysSchedule;
  bookingMode = projectConstantsLocal.BOOKING_MODE;
  selday_arr: any = [];
  selallweekdays = false;
  couponId: any;
  action: any;
  couponDetails: any;
  constructor(private formbuilder: FormBuilder,
    public fed_service: FormMessageDisplayService,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private router: Router,
    private activated_route:ActivatedRoute,
    public dialog: MatDialog, ) {
      this.activated_route.params.subscribe(params => {
        this.couponId = params.id;
      });
      this.activated_route.queryParams.subscribe(qparams => {
        this.action = qparams.action;
      });
       this.timewindow_list=[];
    this.createForm();
  }

  ngOnInit(): void {


    this.getItems();
    this.getCustomerLabels();
    this.getCustomerGroups();
    this.getCatalogs();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.active_user.type === 'BRANCH') {
      this.getUsers();
      this.getDepartments();
    }

  }

  createForm() {
    this.couponForm = this.formbuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      couponCode: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      description: [''],
      calculationType: [''],
      amount: [''],
      couponRules: this.formbuilder.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        firstCheckinOnly: [''],
        minBillAmount: [''],
        maxDiscountValue: [''],
        isproviderAcceptCoupon: [''],
        maxProviderUseLimit: [''],
        validTimeRange: [''],
        policies: this.formbuilder.group({
          departments: [[], [Validators.required]],
          services: [[]],
          users: [[], [Validators.required]],
          catalogues: [[], [Validators.required]],
          consumerGroups: [[], [Validators.required]],
          consumerLabels: [[], [Validators.required]],
          items: [[], [Validators.required]],
          isDepartment: [''],
          isUser: [''],
          isItem: [''],
          isCustomerGroup: [''],
          isCustomerLabel: [''],
          isCatalogBased: [''],
          isServiceBased: ['']
        })

      }),

      bookingChannel: [''],
      couponBasedOn: ['']
    });
    if(this.action ==='edit'){
     
      this.getCouponById(this.couponId).then(
        (result) => {
          this.updateForm(result);
        }
      );
    }

  }
  updateForm(coupon){
    console.log('couponDeatils'+coupon);
    this.couponForm.patchValue({
      name: coupon.name,
      couponCode: coupon.couponCode,
      description: coupon.description,
      calculationType: coupon.calculationType,
      amount: coupon.amount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountValue: coupon.maxDiscountValue,
      bookingChannel:coupon.bookingChannel
    });
    this.couponForm.get('couponRules').patchValue({
      startDate: new Date(coupon.couponRules.startDate).toISOString().slice(0, 10),
      endDate: new Date(coupon.couponRules.endDate).toISOString().slice(0, 10),
      minBillAmount: coupon.couponRules.minBillAmount,
      maxDiscountValue: coupon.couponRules.maxDiscountValue,
      maxConsumerUseLimitPerProvider: coupon.couponRules.maxConsumerUseLimitPerProvider,
      maxProviderUseLimit: coupon.couponRules.maxProviderUseLimit,
      firstCheckinOnly:coupon.couponRules.firstCheckinOnly,
      isproviderAcceptCoupon: (coupon.couponRules.maxProviderUseLimit ?true:false),

     
    });
this.couponForm.get('couponRules').get('policies').patchValue({
  isDepartment:(coupon.couponRules.policies.departments && coupon.couponRules.policies.departments.length>0)?true:false,
  isServiceBased:(coupon.couponRules.policies.services && coupon.couponRules.policies.services.length>0)?true:false,
  isUser:(coupon.couponRules.policies.users && coupon.couponRules.policies.users.length>0)? true:false,
  catalogues:(coupon.couponRules.policies.catalogues && coupon.couponRules.policies.catalogues.length>0 )? coupon.couponRules.policies.catalogues:[],
  isCatalogBased:(coupon.couponRules.policies.catalogues && coupon.couponRules.policies.catalogues.length>0 )?true:false,
   isItem: (coupon.couponRules.policies.items &&coupon.couponRules.policies.items.length>0)?true:false,
  isCustomerGroup: (coupon.couponRules.policies.consumerGroups&& coupon.couponRules.policies.consumerGroups.length>0)?true:false,
  isCustomerLabel: (coupon.couponRules.policies.consumerLabels && coupon.couponRules.policies.consumerLabels.length>0)?true:false


});
if(coupon.couponRules.policies.items &&coupon.couponRules.policies.items.length>0){
  this.items=coupon.couponRules.policies.items ;
}
if(coupon.couponRules.policies.users &&coupon.couponRules.policies.users.length>0){
  this.users=coupon.couponRules.policies.users ;
}
if(coupon.couponRules.policies.services &&coupon.couponRules.policies.services.length>0){
  this.services=coupon.couponRules.policies.services ;
}
if(coupon.couponRules.policies.departments &&coupon.couponRules.policies.departments.length>0){
  this.departments=coupon.couponRules.policies.departments ;
}
if(coupon.couponRules.policies.customerGroup &&coupon.couponRules.policies.customerGroup.length>0){
  this.customer_groups=coupon.couponRules.policies.customerGroup ;
}
if(coupon.couponRules.policies.customerLabel &&coupon.couponRules.policies.customerLabel.length>0){
  this.customer_labels=coupon.couponRules.policies.customerLabel ;
}

this.timewindow_list=coupon.couponRules.validTimeRange[0].timeSlots;

if (coupon.couponRules.validTimeRange && coupon.couponRules.validTimeRange.length>0 ){

  for (let j = 0; j < coupon.couponRules.validTimeRange[0].repeatIntervals.length; j++) {
      // pushing the day details to the respective array to show it in the page
      this.selday_arr.push(Number(coupon.couponRules.validTimeRange[0].repeatIntervals[j]));
  }
  if (this.selday_arr.length === 7) {
      this.selallweekdays= true;
  } else {
      this.selallweekdays = false;
  }
}


  }

  check_existsinweek_array(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            ret = i;
        }
    }
    return ret;
}
  handleCalculationType(event) {

  }
  handleBaseChange(event) {
  
  }
  getCouponById( couponId){
    const _this=this;
    return new Promise((resolve) => {
      _this.provider_services.getProviderCoupons(couponId).subscribe(
        (result: any) => {
     
          resolve(result);
        });
    });
  }

  showTimewindow() {
    this.timewindowdialogRef = this.dialog.open(TimewindowPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        windowlist: this.timewindow_list
      }
    });
    this.timewindowdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.timewindow_list.push(result);
      }
    });
  }
  deletetimeslot(index) {
    this.timewindow_list.splice(index, 1);
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.couponForm.get('description').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.couponForm.get('description').value.length;
  }
  gotoNext() {
    this.step = this.step + 1;
  }
  // wizard
  gotoPrevious() {
    this.step = this.step - 1;
  }
  resetApiErrors() {
  }
  compareDate(dateValue, startOrend) {
    const UserDate = dateValue;
    this.startdateError = false;
    this.enddateError = false;
    const ToDate = new Date().toString();
    const l = ToDate.split(' ').splice(0, 4).join(' ');
    const sDate = this.couponForm.get('validFrom').value;
    const sDate1 = new Date(sDate).toString();
    const l2 = sDate1.split(' ').splice(0, 4).join(' ');
    if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
        return this.startdateError = true;
      }
      return this.startdateError = false;
    } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
        return this.enddateError = true;
      }
      return this.enddateError = false;
    }
  }
  handleDaychange(index) {
    const selindx = this.selday_arr.indexOf(index);
    if (selindx === -1) {
      this.selday_arr.push(index);
    } else {
      this.selday_arr.splice(selindx, 1);
    }
    if (this.selday_arr.length === 7) {
      this.selallweekdays = true;
    } else {
      this.selallweekdays = false;
    }

  }
  getDepartments() {

    this.provider_services.getDepartments()
      .subscribe(
        data => {
          this.deptObj = data;
          this.department_list = this.deptObj.departments;

        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }

  getItems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;

      });
  }
  getCustomerLabels() {

    this.provider_services.getLabelList()
      .subscribe(
        (data: any) => {
          this.customer_label_list = data;
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }
  getCustomerGroups() {

    this.provider_services.getCustomerGroup().subscribe((data: any) => {
      this.customer_group_list = data;

    });
  }
  getCatalogs() {
    this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;

      });
  }
  getUsers() {
    this.provider_services.getUsers().subscribe(
      (data: any) => {
        this.user_list = data;
      },

      (error: any) => {
        this.wordProcessor.apiErrorAutoHide(this, error);
      });
  }
  openServiceDialog() {
    this.servicedialogRef = this.dialog.open(ServiceListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'services': this.services
      }

    });
    this.servicedialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.services = result;
      }
    });
  }
  openItemDialog() {
    this.itemdialogRef = this.dialog.open(ItemListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'items': this.items
      }

    });
    this.itemdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.items = result;
      }
    });

  }
  openDepartmentDialog() {
    this.departmentdialogRef = this.dialog.open(DepartmentListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'departments': this.departments
      }

    });
    this.departmentdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.departments = result;
      }
    });
  }
  openCustomerGroupDialog() {
    this.consumerGroupdialogRef = this.dialog.open(ConsumerGroupDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'groups': this.customer_groups
      }

    });
    this.consumerGroupdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customer_groups = result;
      }
    });

  }
  openCustomerLabelDialog() {
    this.consumerLabeldialogRef = this.dialog.open(ConsumerLabelDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'labels': this.customer_labels
      }

    });
    this.consumerLabeldialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customer_labels = result;
      }
    });

  }
  openUserDialog() {
    this.userdialogRef = this.dialog.open(UsersListDialogComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        'users': this.users
      }

    });
    this.userdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users = result;
      }
    });
  }

  onSubmit() {
    this.couponBasedOnValue = [];
    const form_data = this.couponForm.value;
    const timeRangeObject = [{
      'recurringType': 'Weekly',
      'repeatIntervals': this.selday_arr,
      'timeSlots': this.timewindow_list,
      'startDate': form_data.couponRules.startDate,
      'terminator': {
        'endDate': form_data.couponRules.endDate,
        'noOfOccurance': ''
      },
    }];

    console.log(timeRangeObject);
    form_data.couponRules.validTimeRange = timeRangeObject;
    if (form_data.couponRules.policies.isServiceBased) {
      form_data.couponRules.policies.services = this.services;
      this.couponBasedOnValue.push('ServiceBased');
    }
    if (form_data.couponRules.policies.isCatalogBased) {
      this.couponBasedOnValue.push('CatalogueBased');

    }
    console.log('base' + this.couponBasedOnValue);
    if (form_data.couponRules.policies.isDepartment) {
      form_data.couponRules.policies.departments = this.departments;

    }
    if (form_data.couponRules.policies.isUser) {
      form_data.couponRules.policies.users = this.users;

    }

    if (form_data.couponRules.policies.isItem) {
      form_data.couponRules.policies.items = this.items;

    }
    if (form_data.couponRules.policies.isCustomerGroup) {
      form_data.couponRules.policies.customerGroup = this.customer_groups;

    }
    if (form_data.couponRules.policies.isCustomerLabel) {
      form_data.couponRules.policies.customerLabel = this.customer_labels;

    }
    form_data.couponBasedOn = this.couponBasedOnValue;
    delete form_data.couponRules.policies.isDepartment;
    delete form_data.couponRules.policies.isUser;
    delete form_data.couponRules.policies.isItem;
    delete form_data.couponRules.policies.isCustomerGroup;
    delete form_data.couponRules.policies.isCustomerLabel;
    delete form_data.couponRules.policies.isServiceBased;
    delete form_data.couponRules.policies.isCatalogBased;
    console.log(form_data);
    this.createCoupon(form_data);
  }

  createCoupon(data) {
    this.provider_services.createCoupon(data)
      .subscribe(result => {
        console.log('createdSuccessfully');
        this.router.navigate(['provider', 'settings', 'pos', 'coupons']);
      });
  }
  redirecToCoupon() {
    this.router.navigate(['provider', 'settings', 'pos', 'coupons']);
  }
}



