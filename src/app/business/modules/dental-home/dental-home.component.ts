import { Component, OnInit } from '@angular/core';
// import { RoutingService } from 'jaldee-framework/routing';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DentalHomeService } from './dental-home.service';
// import { CustomersService } from 'projects/provider/src/app/customers/customers.service';
import { SubSink } from 'subsink';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { ProviderServices } from '../../services/provider-services.service';
@Component({
  selector: 'app-dental-home',
  templateUrl: './dental-home.component.html',
  styleUrls: ['./dental-home.component.scss']
})
export class DentalHomeComponent implements OnInit {
  isAdult = true;
  isChild = false;
  isMixed = false;
  allApptIntStatusSelected;
  customerId: any;
  mrid: any;
  teethDetails: any;
  selectedTeeth: any;
  teethIndex: any;
  seelectedteethIndex: boolean;
  type = 'adult';
  teeth_loading = true;
  adultTeethArrayUpper = [{ index: 18, isSelected: false },
  { index: 17, isSelected: false },
  { index: 16, isSelected: false },
  { index: 15, isSelected: false },
  { index: 14, isSelected: false },
  { index: 13, isSelected: false },
  { index: 12, isSelected: false },
  { index: 11, isSelected: false },
  { index: 21, isSelected: false },
  { index: 22, isSelected: false },
  { index: 23, isSelected: false },
  { index: 24, isSelected: false },
  { index: 25, isSelected: false },
  { index: 26, isSelected: false },
  { index: 27, isSelected: false },
  { index: 28, isSelected: false }]
  adultTeethArrayLower = [{ index: 48, isSelected: false },
  { index: 47, isSelected: false },
  { index: 46, isSelected: false },
  { index: 45, isSelected: false },
  { index: 44, isSelected: false },
  { index: 43, isSelected: false },
  { index: 42, isSelected: false },
  { index: 41, isSelected: false },
  { index: 31, isSelected: false },
  { index: 32, isSelected: false },
  { index: 33, isSelected: false },
  { index: 34, isSelected: false },
  { index: 35, isSelected: false },
  { index: 36, isSelected: false },
  { index: 37, isSelected: false },
  { index: 38, isSelected: false }]
  childTeethArrayUpper = [{ index: 55, isSelected: false },
  { index: 54, isSelected: false },
  { index: 53, isSelected: false },
  { index: 52, isSelected: false },
  { index: 51, isSelected: false },
  { index: 61, isSelected: false },
  { index: 62, isSelected: false },
  { index: 63, isSelected: false },
  { index: 64, isSelected: false },
  { index: 65, isSelected: false },
  ]
  childTeethArrayLower = [{ index: 85, isSelected: false },
  { index: 84, isSelected: false },
  { index: 83, isSelected: false },
  { index: 82, isSelected: false },
  { index: 81, isSelected: false },
  { index: 71, isSelected: false },
  { index: 72, isSelected: false },
  { index: 73, isSelected: false },
  { index: 74, isSelected: false },
  { index: 75, isSelected: false }]
  mixedTeethArrayUpper1 = [{ index: 18, isSelected: false },
  { index: 17, isSelected: false },
  { index: 16, isSelected: false },
  { index: 15, isSelected: false },
  { index: 14, isSelected: false },
  { index: 13, isSelected: false },
  { index: 12, isSelected: false },
  { index: 11, isSelected: false },
  { index: 21, isSelected: false },
  { index: 22, isSelected: false },
  { index: 23, isSelected: false },
  { index: 24, isSelected: false },
  { index: 25, isSelected: false },
  { index: 26, isSelected: false },
  { index: 27, isSelected: false },
  { index: 28, isSelected: false }]
  mixedTeethArrayUpper2 = [
    // { index: 58, isSelected: false },
    // { index: 57, isSelected: false },
    // { index: 56, isSelected: false },
    { index: 55, isSelected: false },
    { index: 54, isSelected: false },
    { index: 53, isSelected: false },
    { index: 52, isSelected: false },
    { index: 51, isSelected: false },
    { index: 61, isSelected: false },
    { index: 62, isSelected: false },
    { index: 63, isSelected: false },
    { index: 64, isSelected: false },
    { index: 65, isSelected: false },
    // { index: 66, isSelected: false },
    // { index: 67, isSelected: false },
    // { index: 68, isSelected: false },
  ]
  mixedTeethArrayLower1 = [
    // { index: 88, isSelected: false },
    // { index: 87, isSelected: false },
    // { index: 86, isSelected: false },
    { index: 85, isSelected: false },
    { index: 84, isSelected: false },
    { index: 83, isSelected: false },
    { index: 82, isSelected: false },
    { index: 81, isSelected: false },
    { index: 71, isSelected: false },
    { index: 72, isSelected: false },
    { index: 73, isSelected: false },
    { index: 74, isSelected: false },
    { index: 75, isSelected: false },
    // { index: 76, isSelected: false },
    // { index: 77, isSelected: false },
    // { index: 78, isSelected: false }
  ]
  mixedTeethArrayLower2 = [{ index: 48, isSelected: false },
  { index: 47, isSelected: false },
  { index: 46, isSelected: false },
  { index: 45, isSelected: false },
  { index: 44, isSelected: false },
  { index: 43, isSelected: false },
  { index: 42, isSelected: false },
  { index: 41, isSelected: false },
  { index: 31, isSelected: false },
  { index: 32, isSelected: false },
  { index: 33, isSelected: false },
  { index: 34, isSelected: false },
  { index: 35, isSelected: false },
  { index: 36, isSelected: false },
  { index: 37, isSelected: false },
  { index: 38, isSelected: false }]
  private subscriptions = new SubSink();
  loading = true;
  customerDetails: any;
  firstName: any;
  indexSelection: any;
  bookingType: any;
  bookingId: any;
  constructor(
    private router: Router,
    // private routingService: RoutingService,
    private location: Location,
    // private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private dental_homeservice: DentalHomeService,
    // private customersService: CustomersService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private providerService: ProviderServices
  ) {
    this.route.queryParams.subscribe(params => {
      this.customerId = params['patientId'];
      if (params['mrid']) {
        this.mrid = params['mrid'];
        this.getTeethDetails()
      }
      if (params['custId']) {
        this.customerId = params['custId'];
      }
      if (params['bookingType']) {
        this.bookingType = params['bookingType'];
      }
      if (params['bookingId']) {
        this.bookingId = params['bookingId'];
      }
    });
  }
  ngOnInit(): void {
    this.getPatientDetails(this.customerId);
  }
  getPatientDetails(uid) {
    const filter = { 'id-eq': uid };
    this.subscriptions.sink = this.providerService.getCustomer(filter)
      .subscribe(
        (data: any) => {
          const response = data;
          this.loading = false;
          console.log('responseToken', response);
          if (response && response[0]) {
            this.customerDetails = response[0];
          }
          if(this.customerDetails.firstName){
            this.firstName = this.customerDetails.firstName;
          }
          // console.log('customerDetailPatientDetails::',  this.customerDetails);
          // if (this.customerDetails) {
          //   if (this.customerDetails.phoneNo) {
          //     this.tempPhoneNumber = this.customerDetails.phoneNo;
          //   }
          //   if (this.customerDetails.age && this.customerDetails.age.year) {
          //     this.customerDetailsAge = this.customerDetails.age.year
          //   }
          //   if (this.customerDetails.id) {
          //     this.patientId = this.customerDetails.id;

          //   }
          // }
          // if (this.customerDetails && this.customerDetails.memberJaldeeId) {
          //   this.display_PatientId = this.customerDetails.memberJaldeeId;
          // } else if (this.customerDetails && this.customerDetails.jaldeeId) {
          //   this.display_PatientId = this.customerDetails.jaldeeId;
          // }
          // this.mrService.setPatientDetails(this.customerDetails);
          this.dental_homeservice.setPatientDetails(this.customerDetails);
        },
        error => {
          // alert('getPatientDetails')
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getTeethDetails() {
    this.teeth_loading = true;
    this.dental_homeservice.getTeethDetails(this.mrid).subscribe((data) => {
      this.teethDetails = data;
      console.log('this.teethDetails', this.teethDetails)
      this.selectedTeeth = this.teethDetails.teeth;
      let dentalState  = this.teethDetails.dentalState;
      this.teeth_loading = false;
if(this.teethDetails && this.teethDetails.teeth && this.teethDetails.teeth.length>0){
  this.selectedTeeth.forEach((item) => {
    switch (dentalState) {
      case "PERMANENT":
        this.type = 'adult';
        this.isAdult = true;
        this.isChild = false;
        let index1 = this.adultTeethArrayUpper.findIndex(x => x.index === item.toothId);
    if (index1 !== -1) {
      this.adultTeethArrayUpper.splice(index1, 1, { index: item.toothId, isSelected: true });
    }

    let index2 = this.adultTeethArrayLower.findIndex(x => x.index === item.toothId);
    if (index2 !== -1) {
      this.adultTeethArrayLower.splice(index2, 1, { index: item.toothId, isSelected: true });
    }
        break;
    case "TEMPORARY":
      this.type = 'child';
      this.isChild = true;
      this.isAdult = false;
      let index3 = this.childTeethArrayUpper.findIndex(x => x.index === item.toothId);
    if (index3 !== -1) {
      this.childTeethArrayUpper.splice(index3, 1, { index: item.toothId, isSelected: true });
    }

    let index4 = this.childTeethArrayLower.findIndex(x => x.index === item.toothId);
    if (index4 !== -1) {
      this.childTeethArrayLower.splice(index4, 1, { index: item.toothId, isSelected: true });
    }
    break;
    case "MIXED":
      this.type = 'mixed';
      this.isMixed = true;
      let index5 = this.mixedTeethArrayUpper1.findIndex(x => x.index === item.toothId);
    if (index5 !== -1) {
      this.mixedTeethArrayUpper1.splice(index5, 1, { index: item.toothId, isSelected: true });
    }

    let index6 = this.mixedTeethArrayUpper2.findIndex(x => x.index === item.toothId);
    if (index6 !== -1) {
      this.mixedTeethArrayUpper2.splice(index6, 1, { index: item.toothId, isSelected: true });
    }
    let index7 = this.mixedTeethArrayLower1.findIndex(x => x.index === item.toothId);
    if (index7 !== -1) {
      this.mixedTeethArrayLower1.splice(index7, 1, { index: item.toothId, isSelected: true });
    }

    let index8 = this.mixedTeethArrayLower2.findIndex(x => x.index === item.toothId);
    if (index8 !== -1) {
      this.mixedTeethArrayLower2.splice(index8, 1, { index: item.toothId, isSelected: true });
    }
    break
      default:

        break;
    }
    
  });
}
     

    })
  }
  handleTeethSelectionType(type) {

    this.type = type;
    if (this.type === 'adult') {
      this.isAdult = true;
      this.isChild = false;
      this.isMixed = false;
    }
    else if (this.type === 'child') {
      this.isAdult = false;
      this.isChild = true;
      this.isMixed = false;
    }
    else if (this.type === 'mixed') {
      this.isAdult = false;
      this.isChild = false;
      this.isMixed = true;
    }
  }
  toothEdit(teeth) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        patientId: this.customerId,
        mrid: this.mrid,
        action: 'edit',
        teethId : teeth.toothId,
        type: this.type,
        bookingType : this.bookingType,
        bookingId : this.bookingId
      }
    };
    this.router.navigate(['provider','dental','teeth',teeth.toothId],navigationExtras);
    // this.routingService.setFeatureRoute('dental')
    // this.routingService.handleRoute('teeth/' + teeth.toothId, navigationExtras);

  }
  toothClicked(index,indexSelection) {
    this.teethIndex = index;
    this.indexSelection = indexSelection;
    if(!this.indexSelection){
      if (this.teethDetails && this.teethDetails.teeth) {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            patientId: this.customerId,
            mrid: this.mrid,
            type: this.type,
            action: 'edit',
            teethIndex : index,
            bookingType : this.bookingType,
            bookingId : this.bookingId
          }
        };
        this.router.navigate(['provider','dental','teeth',index],navigationExtras);
        // this.routingService.setFeatureRoute('dental')
        // this.routingService.handleRoute('teeth/' + index, navigationExtras);
        console.log(index);
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            patientId: this.customerId,
            type: this.type,
            teethIndex : index,
            bookingType : this.bookingType,
            bookingId : this.bookingId
          }
        };
        this.router.navigate(['provider','dental','teeth',index],navigationExtras);
        // this.routingService.setFeatureRoute('dental')
        // this.routingService.handleRoute('teeth/' + index, navigationExtras);
        console.log(index);
      }
  
    }
    

  }
  toggleAllApptIntStatusSelection() {

  }
  goBack(backFrom) {
    if(backFrom === 'medical'){
      this.router.navigate(['provider', 'customers', this.customerId , this.bookingType, this.bookingId, 'medicalrecord',this.mrid,'clinicalnotes']);
    } else{
      this.location.back();
    }
   
    
  }
  gotoView(index) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        patientId: this.customerId,
        mrid: this.mrid,
        bookingType : this.bookingType,
        bookingId : this.bookingId
      }
    };
    this.router.navigate(['provider','dental','teeth','id','view'],navigationExtras);
    // this.routingService.setFeatureRoute('dental/teeth/' + index)
    // this.routingService.handleRoute('/view', navigationExtras);

  }
  toothDelete(toothId){
    const postData = {
      toothId: toothId,
    };
    this.dental_homeservice.deleteTeethById(this.mrid,postData).subscribe((data) => {
      this.teethDetails = data;
      this.getTeethDetails()
    });
  }
}
