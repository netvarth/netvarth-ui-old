import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { GeneralComponent } from '../general/general.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MedicalrecordService } from '../medicalrecord.service';
import { SubSink } from 'subsink';




@Component({
  selector: 'app-clinicalnotes',
  templateUrl: './clinicalnotes.component.html',
  styleUrls: ['./clinicalnotes.component.css']
})
export class ClinicalnotesComponent implements OnInit, OnDestroy {

  @Input() showClinicalNotesDetails;
  @Input() changes;
  @Input() details;
  @Input() type;
  @Input() b_id;
  // @Input() mRListUsingId;
  mrId = 0;
  clinicalNotes: any[];
  allergies: any;
  currentMRId: any;
  patientDetails: any;
  userId;
  customerDetails: any;
  editclinicaldialogRef: any;
  symptoms: any;
  diagnosis: any;
  complaints: any;
  observations: any;
  misc_notes: any;
  vaccinationHistory: any;
  Cdata;
  isLoaded = false;
  clinical_constant = projectConstantsLocal.CLINICAL_NOTES;
  clinicalNotesValue:any;
  clinicalNotesType:any;
  clinicalNotesAddList:any=[];
  customerId:any;
  private subscriptions = new SubSink();
  constructor(

    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private location: Location,
    private medicalrecordService: MedicalrecordService,
  ) {


  }

  ngOnInit() {
    console.log('showClinicalNotesDetails::',this.showClinicalNotesDetails)
    console.log('this.activatedRoute.parent.snapshot.params',this.activatedRoute.parent.snapshot.params)
    // this.patientId = params.get('id');
    //   this.bookingType = params.get('type');
    //   this.bookingId = params.get('uid');
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    const medicalRecordCustId = this.activatedRoute.parent.snapshot.params['id'];
    this.customerId= medicalRecordCustId
    console.log('medicalRecordCustId',medicalRecordCustId)
    this.mrId = parseInt(medicalrecordId, 0);
    console.log('this.mrId',this.mrId)
    this.getClinicalNotes( this.mrId)

    if (this.mrId === 0 || this.mrId === undefined) {
      this.isLoaded = true;
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';
      }
      this.clinicalNotes = this.clinical_constant;


    } else if (this.mrId !== 0) {
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;
      // if(this.mrId !==0){
        this.getMRClinicalNotes(this.mrId).then((res: any) => {
          this.clinicalNotes = res;
          console.log('clinicalNotes:::',this.clinicalNotes)
          this.isLoaded = true;
  
        });
      // }
      
    }
    // console.log('mRListUsingId:::',this.mRListUsingId)
  }
  getClinicalNotes(medicalrecordId){
    this.subscriptions.sink= this.provider_services.GetMedicalRecord(medicalrecordId).subscribe((res)=>{
      console.log('resmedicalrecordId',res)
    })
  }

  ngOnChanges() {
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);
    // this.getClinicalNotes( this.mrId)
    if (this.mrId === 0 || this.mrId === undefined) {
      this.isLoaded = true;
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;


    } else if (this.mrId !== 0) {
      for (let i = 0; i < this.clinical_constant.length; i++) {
        this.clinical_constant[i].value = '';

      }
      this.clinicalNotes = this.clinical_constant;
      this.getMRClinicalNotes(this.mrId).then((res: any) => {
        this.clinicalNotes = res;
        console.log('clinicalNotes2::', this.clinicalNotes)
        this.isLoaded = true;

      });
    }
  }

  getMRClinicalNotes(mrId) {
    const $this = this;
    let response = '';
    for (let i = 0; i < this.clinical_constant.length; i++) {
      this.clinical_constant[i].value = '';

    }
    const compArray = this.clinical_constant;

    return new Promise((resolve) => {
      $this.provider_services.getClinicalRecordOfMRById(mrId)
        .subscribe((res: any) => {
          console.log('res',res)
          this.clinicalNotes = res;
          // if(res.length>0){
          //   this.clinicalNotes = res;
          //   // this.showClinicalNotesDetails=true;
          // }
          // else{
          //   // this.showClinicalNotesDetails=false;
          // }
          // this.clinicalNotes = res;
          if (res.clinicalNotes) {
            response = res.clinicalNotes;
            // this.clinicalNotes= res;
          } else {
            response = res;
            // this.clinicalNotes = res;
          }

          Object.entries(response).forEach(
            function ([key, v]) {
              const index = compArray.findIndex(element => element.id === key);
              compArray[index].value = v;

            });
        },
          error => {
            $this.snackbarService.openSnackBar($this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });


      resolve(compArray);
    });

  }

  ngOnDestroy() {

  }
  addOrEditClinicalNotes(object) {

    // const navigationExtras: NavigationExtras = {
    //   relativeTo: this.activatedRoute,
    //   queryParams: {
    //     'data': JSON.stringify(object),
    //     'clinicalNotes': JSON.stringify(this.clinicalNotes)
    //   }
    // };
    // this.router.navigate(['./edit'], navigationExtras);
    console.log('object', object);
    const dialogref = this.dialog.open(GeneralComponent, {
      width: '100%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'data': JSON.stringify(object),
        'clinicalNotes': JSON.stringify(this.clinicalNotes),
        'mrId': this.mrId,
        'details': this.details,
        'type': this.type,
        'uid': this.b_id
      }
    });
    dialogref.afterClosed().subscribe((data: any) =>
      console.log(data)
    );
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  autoGrowTextZone(e) {
    if (e) {
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight + 15) + "px";
    }

  }
  handleClinicalNotes(data,type){
    // console.log('data',data);
    console.log('type',type);
    this.clinicalNotesValue= data;
    this.clinicalNotesType=(type);
    const payload = {
      'type':this.clinicalNotesType,
      'clinicalNotes': this.clinicalNotesValue
    };
    
    console.log(payload);
    this.clinicalNotesAddList.push(payload)

  }
  saveClinicalNotes(){
    // console.log('type',type)
    console.log('this.clinicalNotesValue::',this.clinicalNotesValue)
    // const payload = {
    //   'type':this.clinicalNotesType,
    //   'clinicalNotes': this.clinicalNotesValue
    // };
    // console.log('payload::',payload)
    // console.log('clinicalNotesAddList:::',this.clinicalNotesAddList)
    // console.log('this.clinicalNotesType',this.clinicalNotesType);
    // this.customerDetails = data.providerConsumer;
    // const customerId = this.customerDetails.id;
      const bookingId = 0;
      const bookingType = 'FOLLOWUP';
      const patientId=this.customerId
    this.medicalrecordService.createMR('clinicalNotes', this.clinicalNotesAddList).then((res:any) => {
      this.mrId= res;
      console.log('this.mrId::',this.mrId)
      this.snackbarService.openSnackBar('Medical Record Created Successfully');
      // this.reloadComponent()
      this.router.navigate(['provider', 'customers', patientId, bookingType, bookingId, 'medicalrecord', this.mrId,'prescription'])

    },
      error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
  }
  goback(){
    this.location.back()
  }
  getColor(item){
    if(item.type==='Symptoms'){
      return 'rgba(0, 222, 213, 0.05)'
    }
    else if(item.type==='Observations'){
      return 'rgba(222, 173, 0, 0.05)'
    }
    else if(item.type==='Diagnosis'){
      return 'rgba(0, 115, 222, 0.05)'
    }
    else if(item.type==='Notes'){
      return 'rgba(0, 222, 75, 0.05)'
    }
    else if(item.type==='Allergies'){
      return 'rgba(222, 107, 0, 0.05)'
    }
    else if(item.type==='Complaints'){
      return 'rgba(251, 125, 125, 0.05)'
    }
    else if(item.type==='Vaccination Notes'){
      return 'rgba(0, 169, 222, 0.05)'
    }

  }
  getColorType(item){
    if(item.type==='Symptoms'){
      return '#00DED5'
    }
    else if(item.type==='Observations'){
      return '#DEBA00'
    }
    else if(item.type==='Diagnosis'){
      return '#0066DE'
    }
    else if(item.type==='Notes'){
      return '#00DE66'
    }
    else if(item.type==='Allergies'){
      return '#DE5000'
    }
    else if(item.type==='Complaints'){
      return '#E75050'
    }
    else if(item.type==='Vaccination Notes'){
      return '#008EDE'
    }
  }
  getBorderColor(item){
    if(item.type==='Symptoms'){
      return '2px solid #00DED5'
    }
    else if(item.type==='Observations'){
      return '2px solid #DEBA00'
    }
    else if(item.type==='Diagnosis'){
      return '2px solid #0066DE'
    }
    else if(item.type==='Notes'){
      return '2px solid #00DE66'
    }
    else if(item.type==='Allergies'){
      return '2px solid #DE5000'
    }
    else if(item.type==='Complaints'){
      return '2px solid #E75050'
    }
    else if(item.type==='Vaccination Notes'){
      return '2px solid #008EDE'
    }
  }
}
