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
  clinicalNotesTypeSymptoms:any;
  clinicalNotesTypeObservations:any;
  clinicalNotesTypeDiagnosis:any;
  clinicalNotesNotes:any;
  clinicalNotesAllergies:any;
  clinicalNotesComplaints:any;
  clinicalNotesVaccinationNotes:any;
  clinicalNotesAddList:any=[];
  customerId:any;
  medicalRecordInfo:any;
  @Input() medicalInfo;
  private subscriptions = new SubSink();
  customerphoneno: any;
  viewVisitDetails: boolean = this.medicalrecordService.viewVisitDetails;
  patientId: any;
  bookingId: any;
  bookingType: any;
  api_loading:boolean;
  @Input() tempClinicalNOtes;
  sign = true;
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
    this.api_loading=false;
    console.log('showClinicalNotesDetails::',this.showClinicalNotesDetails);
    console.log('medicalInfo',this.medicalInfo)
    console.log('this.activatedRoute.parent.snapshot.params',this.activatedRoute.parent.snapshot.params)
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
      this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
      this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
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
          this.sign=false;
  
        });
      // }
      
    }
    // console.log('mRListUsingId:::',this.mRListUsingId)
  }
  getClinicalNotes(medicalrecordId){
    this.subscriptions.sink= this.provider_services.GetMedicalRecord(medicalrecordId).subscribe((res)=>{
      console.log('resmedicalrecordId',res);
      this.medicalRecordInfo= res;
      this.sign=false;
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
        this.sign=false;

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
      this.sign = false;
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight + 15) + "px";
    }

  }
  handleClinicalNotes(data,type){
  }
  saveClinicalNotes(symtopData,observationData,DiagnosisData,NotesData,AllergiesData,ComplaintsData,VaccinationData){
    if (symtopData || observationData || DiagnosisData || NotesData || AllergiesData || ComplaintsData || VaccinationData) {
      this.api_loading=true;
      const bookingId = 0;
      const bookingType = 'FOLLOWUP';
      const patientId = this.customerId;
      let payload: any = []
      payload = [
        {
          'type': 'Symptoms',
          'clinicalNotes': symtopData
        },
        {
          'type': 'Observations',
          'clinicalNotes': observationData
        },
        {
          'type': 'Diagnosis',
          'clinicalNotes': DiagnosisData
        },
        {
          'type': 'Notes',
          'clinicalNotes': NotesData
        },
        {
          'type': 'Allergies',
          'clinicalNotes': AllergiesData
        },
        {
          'type': 'Complaints',
          'clinicalNotes': ComplaintsData
        },
        {
          'type': 'Vaccination Notes',
          'clinicalNotes': VaccinationData
        }
      ]

      console.log(payload);
      this.clinicalNotesAddList.push(payload)
      console.log('clinicalNotesAddList', payload);
      console.log(' this.mrId', this.mrId)

      // console.log('this.medicalInfo.id',this.medicalInfo)
      console.log('this.medicalInfo', this.medicalInfo)
      if (this.medicalInfo !== 'MedicalInfoClinicalNotesUpdate' && this.mrId !== 0) {
        console.log('this.medicalInfo.id', this.medicalInfo)
        this.provider_services.updateMrClinicalNOtes(payload, this.medicalInfo.id).subscribe((res) => {
          this.snackbarService.openSnackBar('Clinical notes added Successfully');
          this.reloadComponent()
          this.showClinicalNotesDetails = true;
        })
      }
      else if (this.medicalInfo === 'MedicalInfoClinicalNotesUpdate') {
        console.log('this.clinicalNotesTypeSymptoms', this.clinicalNotesTypeSymptoms);
        // alert('jjjj')
        this.UpdateClinicalNotesList(this.clinicalNotesTypeSymptoms, this.clinicalNotesTypeObservations, this.clinicalNotesTypeDiagnosis,
          this.clinicalNotesNotes, this.clinicalNotesAllergies, this.clinicalNotesComplaints, this.clinicalNotesVaccinationNotes)
      }
      else if (this.medicalInfo === undefined && this.mrId === 0) {
        // alert(this.medicalInfo)
        this.medicalrecordService.createMR('clinicalNotes', payload).then((res: any) => {
          this.mrId = res;
          console.log('this.mrId::', this.mrId)
          this.snackbarService.openSnackBar('Clinical Notes Created Successfully');
          this.router.navigate(['provider', 'customers', patientId, bookingType, bookingId, 'medicalrecord', this.mrId, 'prescription'])

        },
          error => {
            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
      }
    }
    else{
      const error='Please add Clinical Notes';
      this.snackbarService.openSnackBar(error,{ 'panelClass': 'snackbarerror' });
      this.api_loading=false;
    }
      
  }
  UpdateClinicalNotesList(symtopData,observationData,DiagnosisData,NotesData,AllergiesData,ComplaintsData,VaccinationData){
    let payload:any=[]
    payload =[
      {
        'type':'Symptoms',
          'clinicalNotes': symtopData
      },
      {
        'type':'Observations',
        'clinicalNotes':observationData
      },
      {
        'type':'Diagnosis',
        'clinicalNotes':DiagnosisData
      },
      {
        'type':'Notes',
        'clinicalNotes': NotesData
      },
      {
        'type':'Allergies',
        'clinicalNotes':AllergiesData
      },
      {
        'type':'Complaints',
        'clinicalNotes': ComplaintsData
      },
      {
        'type':'Vaccination Notes',
        'clinicalNotes': VaccinationData
      }
    ]
    console.log(payload);
    this.clinicalNotesAddList.push(payload)
    console.log('clinicalNotesAddList',payload);
  console.log('this.medicalInfo.id',this.medicalInfo)
    this.updateMrwithClinicalNotes(payload,this.mrId)
  }

  updateMrwithClinicalNotes(payload, mrId) {
    this.provider_services.updateMrClinicalNOtes(payload, mrId)
      .subscribe((data) => {
        this.snackbarService.openSnackBar( 'Clinical Notes Updated Successfully');
        // console.log('updated successfully');
      //   const bookingId = 0;
      // const bookingType = 'FOLLOWUP';
      // const patientId=this.customerId;
      this.reloadComponent()
        this.showClinicalNotesDetails=true;
      // this.router.navigate(['provider', 'customers', patientId, bookingType, bookingId, 'medicalrecord', this.mrId,'prescription'])

      },
        error => {
          this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });
  }
  getCustomerbyId(id) {
    const filter = { 'id-eq': id };
    this.provider_services.getCustomer(filter)
        .subscribe(
            (data: any) => {
                this.customerphoneno =data[0].phoneNo;
            });
    return this.customerphoneno;
}
  goback(type_from){
    // this.location.back()
    if(this.customerDetails && this.customerDetails.id){
      this.getCustomerbyId(this.customerDetails.id)
    }
    
    const back_type = this.medicalrecordService.getReturnTo();
    console.log('type_from',type_from)
    if (type_from === 'medical') {
      this.medicalrecordService.viewVisitDetails = false;
      this.viewVisitDetails = false;
      // console.log(' this.patientId', this.patientId);
      // console.log(' this.bookingType', this.bookingType);
      // console.log(' this.bookingId', this.bookingId);
      // console.log('mrId',this.mrId);
      // this.tempClinicalNOtes1
      // this.tempClinicalNOtes1.emit()
      // this.reloadComponent()
      this.location.back();
      // this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
    }
    else {
      if (back_type === 'waitlist') {
        // this.router.navigate(['provider', 'check-ins']);
        this.router.navigate(['provider', 'check-ins', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      } else if (back_type === 'appt') {
        // this.router.navigate(['provider', 'appointments']);
        this.router.navigate(['provider', 'appointments', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);
      } else if (back_type === 'patient') {
        // this.router.navigate(['provider', 'customers']);
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'prescription']);

      } 
      else if (back_type === 'list') {
        this.router.navigate(['provider', 'customers', this.patientId, this.bookingType, this.bookingId, 'medicalrecord', this.mrId, 'list']);
      }
       else {
        this.location.back();
      }
    }
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
  updateClinicalNotes(data){
    console.log(data);
    console.log('this.medicalInfo',this.medicalInfo);
    this.medicalInfo= 'MedicalInfoClinicalNotesUpdate'
    this.showClinicalNotesDetails= false;
    this.clinicalNotes.forEach((item)=>{
      if(item.type==='Symptoms'){
        this.clinicalNotesTypeSymptoms= item.clinicalNotes
      }
      if(item.type==='Observations'){
        this.clinicalNotesTypeObservations= item.clinicalNotes
      }
      if(item.type==='Diagnosis'){
        this.clinicalNotesTypeDiagnosis= item.clinicalNotes
      }
      if(item.type==='Notes'){
        this.clinicalNotesNotes= item.clinicalNotes
      }
      if(item.type==='Allergies'){
        this.clinicalNotesAllergies= item.clinicalNotes
      }
      if(item.type==='Complaints'){
        this.clinicalNotesComplaints= item.clinicalNotes
      }
      if(item.type==='Vaccination Notes'){
        this.clinicalNotesVaccinationNotes= item.clinicalNotes
      }
    })
    
  }
  // autoGrowTextZone() {
  //   this.sign = false;
  // }
}
