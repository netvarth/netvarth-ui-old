import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import * as moment from 'moment';
import { SubSink } from 'subsink';



@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.css', '../../../../../../../assets/css/style.bundle.css', '../../../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../../assets/css/pages/wizard/wizard-3.css']

})
export class CreateCouponComponent implements OnInit, OnDestroy {
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
  char_count = 0;
  max_char_count = 500;
  isfocused: boolean;
  coupon_timeslots: any = [];
  public couponForm: FormGroup;
  step = 1;
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  weekdays = projectConstantsLocal.myweekdaysSchedule;
  bookingMode = projectConstantsLocal.BOOKING_MODE;
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX10;
  selday_arr: any = [];
  selallweekdays = false;
  couponId: any;
  action: any;
  couponDetails: any;
  coupon_title = 'Create Coupon'
  calculationType: any;
  published = false;
  private subscriptions = new SubSink();
  weekdayError=false;
  startDaterequired=false;
  endDaterequired=false;
  minbillamountError=false;
  constructor(private formbuilder: FormBuilder,
    public fed_service: FormMessageDisplayService,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
     private groupService: GroupStorageService,
    private snackbarService: SnackbarService,
    private router: Router,
    private sharedfunctionObj: SharedFunctions,
    private activated_route: ActivatedRoute,
    public dialog: MatDialog, ) {
    this.subscriptions.sink = this.activated_route.params.subscribe(params => {
      this.couponId = params.id;
    });
    this.subscriptions.sink = this.activated_route.queryParams.subscribe(qparams => {
      this.action = qparams.action;
    });
    this.timewindow_list = [];
    this.createForm();
  }

  ngOnInit(): void {

     this.getCatalogs();
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
  
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumber(evt);
  }
  createForm() {
    this.couponForm = this.formbuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      couponCode: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
      description: [''],
      calculationType: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      couponRules: this.formbuilder.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        firstCheckinOnly: [''],
        minBillAmount: ['', [Validators.required]],
        maxDiscountValue: [''],
        isproviderAcceptCoupon: [''],
        maxProviderUseLimit: [''],
        validTimeRange: [''],
        policies: this.formbuilder.group({
          departments: [[]],
          services: [[]],
          users: [[]],
          catalogues: [[]],
          consumerGroups: [[]],
          consumerLabels: [[]],
          items: [[]],
          isDepartment: [''],
          isUser: [''],
          isItem: [''],
          isCustomerGroup: [''],
          isCustomerLabel: [''],
          isCatalogBased: [''],
          isServiceBased: ['']
        })

      }),

      bookingChannel: [[]],
      couponBasedOn: [[]]
    });
    if (this.action === 'edit') {
      this.coupon_title = 'Edit Coupon';
      this.getCouponById(this.couponId).then(
        (result) => {
          this.updateForm(result);
        }
      );
    }

  }
  updateForm(coupon) {
    this.couponDetails = coupon;
    if (coupon.calculationType === 'Fixed') {
      this.calculationType = 'Fixed';
    } else {
      this.calculationType = 'Percentage';
    }
    this.couponForm.patchValue({
      name: coupon.name,
      couponCode: coupon.couponCode,
      description: coupon.description,
      calculationType: coupon.calculationType,
      amount: coupon.amount,
      bookingChannel: coupon.bookingChannel
    });
    this.couponForm.get('couponRules').patchValue({
      startDate: new Date(coupon.couponRules.startDate).toISOString().slice(0, 10),
      endDate: new Date(coupon.couponRules.endDate).toISOString().slice(0, 10),
      minBillAmount: coupon.couponRules.minBillAmount,
      maxDiscountValue: coupon.couponRules.maxDiscountValue,
      maxConsumerUseLimitPerProvider: coupon.couponRules.maxConsumerUseLimitPerProvider,
      maxProviderUseLimit: coupon.couponRules.maxProviderUseLimit,
      firstCheckinOnly: coupon.couponRules.firstCheckinOnly,
      isproviderAcceptCoupon: (coupon.couponRules.maxProviderUseLimit ? true : false),


    });
    this.couponForm.get('couponRules').get('policies').patchValue({
      isDepartment: (coupon.couponRules.policies.departments && coupon.couponRules.policies.departments.length > 0) ? true : false,
      isServiceBased: (coupon.couponRules.policies.services && coupon.couponRules.policies.services.length > 0) ? true : false,
      isUser: (coupon.couponRules.policies.users && coupon.couponRules.policies.users.length > 0) ? true : false,
      catalogues: (coupon.couponRules.policies.catalogues && coupon.couponRules.policies.catalogues.length > 0) ? coupon.couponRules.policies.catalogues : [],
      isCatalogBased: (coupon.couponRules.policies.catalogues && coupon.couponRules.policies.catalogues.length > 0) ? true : false,
      isItem: (coupon.couponRules.policies.items && coupon.couponRules.policies.items.length > 0) ? true : false,
      isCustomerGroup: (coupon.couponRules.policies.consumerGroups && coupon.couponRules.policies.consumerGroups.length > 0) ? true : false,
      isCustomerLabel: (coupon.couponRules.policies.consumerLabels && coupon.couponRules.policies.consumerLabels.length > 0) ? true : false


    });
    if (coupon.couponRules.policies.items && coupon.couponRules.policies.items.length > 0) {
      this.items = coupon.couponRules.policies.items;
    }
    if (coupon.couponRules.policies.users && coupon.couponRules.policies.users.length > 0) {
      this.users = coupon.couponRules.policies.users;
    }
    if (coupon.couponRules.policies.services && coupon.couponRules.policies.services.length > 0) {
      this.services = coupon.couponRules.policies.services;
    }
    if (coupon.couponRules.policies.departments && coupon.couponRules.policies.departments.length > 0) {
      this.departments = coupon.couponRules.policies.departments;
    }
    if (coupon.couponRules.policies.customerGroup && coupon.couponRules.policies.customerGroup.length > 0) {
      this.customer_groups = coupon.couponRules.policies.customerGroup;
    }
    if (coupon.couponRules.policies.customerLabel && coupon.couponRules.policies.customerLabel.length > 0) {
      this.customer_labels = coupon.couponRules.policies.customerLabel;
    }

    this.timewindow_list = coupon.couponRules.validTimeRange[0].timeSlots;

    if (coupon.couponRules.validTimeRange && coupon.couponRules.validTimeRange.length > 0) {

      for (let j = 0; j < coupon.couponRules.validTimeRange[0].repeatIntervals.length; j++) {
        // pushing the day details to the respective array to show it in the page
        this.selday_arr.push(Number(coupon.couponRules.validTimeRange[0].repeatIntervals[j]));
      }
      if (this.selday_arr.length === 7) {
        this.selallweekdays = true;
      } else {
        this.selallweekdays = false;
      }
    }
    if (coupon.couponRules.published) {
      this.published = true;
      this.couponForm.disable();
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
    this.calculationType = event.value;
    console.log(this.calculationType);

  }
  handleBaseChange(event) {

  }
  getCouponById(couponId) {
    const _this = this;
    return new Promise((resolve) => {
      _this.subscriptions.sink = _this.provider_services.getProviderCoupons(couponId).subscribe(
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
    this.startDaterequired=false;
    this.endDaterequired=false;
    this.weekdayError=false;
    this.minbillamountError=false;
    if (this.step == 1) {
      let nameControl = this.couponForm.get('name');
      nameControl.markAsTouched();
      let codeControl = this.couponForm.get('couponCode');
      codeControl.markAsTouched();
      let amountControl = this.couponForm.get('amount');
      amountControl.markAsTouched();
      let calmodeControl = this.couponForm.get('calculationType');
      calmodeControl.markAsTouched();

      if (nameControl.valid && codeControl.valid && amountControl.valid && calmodeControl) {
        this.step = this.step + 1;
      } else {
        return;
      }
    }else if(this.step==2){
      const startDateVal=this.couponForm.get('couponRules').get('startDate').value;
      const endDateVal=this.couponForm.get('couponRules').get('endDate').value;
      const minbillamountval=this.couponForm.get('couponRules').get('minBillAmount').value;
    if(startDateVal==null||startDateVal==undefined ||startDateVal==''){
      this.startDaterequired=true;
    }
    if(endDateVal==null||endDateVal==undefined||endDateVal=='' ){
      this.endDaterequired=true;
    }
    if(minbillamountval==null||minbillamountval==''||minbillamountval==undefined){
      this.minbillamountError=true;
    }
     if(this.selday_arr.length==0){
       this.weekdayError=true;
     }
     if(this.couponForm.get)
     if(this.startDaterequired==false &&this.endDaterequired===false && this.weekdayError===false){
       this.step=this.step+1;
     }
    }
    // this.step = this.step + 1;


  }
  // wizard
  gotoPrevious() {
    this.step = this.step - 1;
  }
  resetApiErrors() {
  }
  compareDate(dateValue, startOrend) {
    this.startdateError = false;
    this.enddateError = false;
    const sDate = this.couponForm.get('couponRules').get('startDate').value;
    const eDate = this.couponForm.get('couponRules').get('endDate').value;
    if (startOrend === 0) {
      this.startDaterequired=false;
      if (moment(new Date(sDate)).isSame(moment(), 'day')) {
        return this.startdateError = false;
      } else if (moment(new Date(sDate)).isBefore(new Date())) {
        return this.startdateError = true;
      }
      else if (eDate!=null && moment(new Date(sDate)).isAfter(new Date(eDate))) {
        return this.startdateError = true;
      } else {
        return this.startdateError = false;
      }

    } else if (startOrend === 1) {
      this.endDaterequired=false;
      console.log(moment(sDate));
      console.log(moment(eDate));
      if (sDate!=null && moment(new Date(sDate)).isSame(moment(), 'day')) {
        return this.startdateError = false;
      }
      if (moment(new Date(sDate)).isAfter( new Date(eDate))) {
        return this.startdateError = true;
      } 
      if (moment(new Date(eDate)).isBefore( new Date(sDate))) {
        console.log('greater');
        return this.enddateError = true;
      }else {
        return this.enddateError = false;
      }

    }
  }
  handleDaychange(index) {
    this.weekdayError=false;
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


  getCatalogs() {
    this.subscriptions.sink = this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;

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

    const form_data = this.couponForm.value;
   if(this.checkpoliciesEntered(form_data)){
  
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


    form_data.couponRules.validTimeRange = timeRangeObject;
    if (form_data.couponRules.policies.isServiceBased && !this.couponBasedOnValue.includes('ServiceBased')) {
      this.couponBasedOnValue.push('ServiceBased');
    }
    if (form_data.couponRules.maxDiscountValue) {
      const discountVal = Number(form_data.couponRules.maxDiscountValue).toFixed(2);
      form_data.couponRules.maxDiscountValue = discountVal;
    }
    if (form_data.couponRules.policies.isCatalogBased && !this.couponBasedOnValue.includes('CatalogueBased')) {
      this.couponBasedOnValue.push('CatalogueBased');

    }
   
    if (form_data.couponRules.policies.isServiceBased) {
      form_data.couponRules.policies.services = this.services;
    }

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
  
    if (this.action === 'edit') {
      this.updateCoupon(form_data);
    } else {
      this.createCoupon(form_data);
    }
  }

  }

  createCoupon(data) {
    this.subscriptions.sink = this.provider_services.createCoupon(data)
      .subscribe(result => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('COUPON_CREATED'));
        this.redirecToCoupon();
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  updateCoupon(data) {
    data.id = this.couponDetails.id;
    this.subscriptions.sink = this.provider_services.updateCoupon(data)
      .subscribe(result => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('COUPON_UPDATED'));
        this.redirecToCoupon();
      }, error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
      );
  }
  redirecToCoupon() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        coupon_list: 'own_coupon'

      }
    };
    this.router.navigate(['provider', 'settings', 'pos', 'coupon'], navigationExtras);
  }
  checkpoliciesEntered(form_data){
    let policiesEntered=true;
    if (!form_data.couponRules.policies.isServiceBased && !form_data.couponRules.policies.isCatalogBased ) {
      this.snackbarService.openSnackBar('Limit coupon to either Services or Catalog', { 'panelClass': 'snackbarerror' });
       policiesEntered=false;
    }
    if (form_data.couponRules.policies.isServiceBased ) {
      if(this.services.length===0&& this.departments.length===0 && this.users.length==0)
      this.snackbarService.openSnackBar('Please add atleast one of either services or depatments or users for which this coupon applied for', { 'panelClass': 'snackbarerror' });
       policiesEntered=false;
    }
    if (form_data.couponRules.policies.isCatalogBased) {
      let catalog=form_data.couponRules.policies.catalogues.value; 
      if(catalog==''||catalog==undefined ||catalog==null)
      this.snackbarService.openSnackBar('Please choose the catalog', { 'panelClass': 'snackbarerror' });
       policiesEntered=false;
    }
    return policiesEntered;
  }
}



