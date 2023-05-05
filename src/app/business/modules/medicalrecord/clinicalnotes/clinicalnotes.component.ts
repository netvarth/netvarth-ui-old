import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CdlService } from '../../cdl/cdl.service';
import { FileService } from '../../../../../../src/app/shared/services/file-service';


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
  @Input() suggestions: any = [];
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
selectedFiles = {
  "Symptoms": { files: [], base64: [], caption: [] },
  "Observations": { files: [], base64: [], caption: [] },
  "Diagnosis": { files: [], base64: [], caption: [] },
  "Notes": { files: [], base64: [], caption: [] },
  "Allergies": { files: [], base64: [], caption: [] },
  "Complaints": { files: [], base64: [], caption: [] },
  "Vaccination Notes": { files: [], base64: [], caption: [] }
}
  filesToUpload: any = [];
  businessId: any;
  businessDetails: any;
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
  clinicalNotesValue: any;
  // clinicalNotesTypeObservations:any;
  // clinicalNotesNotes: any;
  // clinicalNotesAllergies: any;
  // clinicalNotesComplaints: any;
  // clinicalNotesVaccinationNotes: any;
  clinicalNotesAddList: any = [];
  customerId: any;
  medicalRecordInfo: any;
  @Input() medicalInfo;
  private subscriptions = new SubSink();
  customerphoneno: any;
  viewVisitDetails: boolean = this.medicalrecordService.viewVisitDetails;
  patientId: any;
  bookingId: any;
  bookingType: any;
  api_loading: boolean;
  @Input() tempClinicalNOtes;
  sign = true;
  btnName: string = 'Save';
  filteredOptions: Observable<string[]>;
  myControl = new UntypedFormControl('');


  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodesO: number[] = [ENTER, COMMA];
  symptomsCtrl = new UntypedFormControl('');
  observationsCtrl = new UntypedFormControl('');
  diagnosisCtrl = new UntypedFormControl('');
  notesCtrl = new UntypedFormControl('');
  allergiesCtrl = new UntypedFormControl('');
  vaccinationNotesCtrl = new UntypedFormControl('');
  complaintsCtrl = new UntypedFormControl('');

  filteredSymptoms: Observable<string[]>;
  filteredObservations: Observable<string[]>;
  filteredDiagnosis: Observable<string[]>;
  filteredNotes: Observable<string[]>;
  filteredAllergies: Observable<string[]>;
  filteredVaccinationNotes: Observable<string[]>;
  filteredComplaints: Observable<string[]>;


  clinicalNotesTypeSymptoms: string[];
  clinicalNotesTypeObservations: string[];
  clinicalNotesNotes: string[];
  clinicalNotesAllergies: string[];
  clinicalNotesVaccinationNotes: string[];
  clinicalNotesComplaints: string[];
  clinicalNotesTypeDiagnosis: string[];
  apiloading: any = false;
  
  @ViewChild('symptomsInput') symptomsInput: ElementRef<HTMLInputElement>;
  @ViewChild('observationsInput') observationsInput: ElementRef<HTMLInputElement>;
  @ViewChild('diagnosisInput') diagnosisInput: ElementRef<HTMLInputElement>;
  @ViewChild('notesInput') notesInput: ElementRef<HTMLInputElement>;
  @ViewChild('allergiesInput') allergiesInput: ElementRef<HTMLInputElement>;
  @ViewChild('vaccinationNotesInput') vaccinationNotesInput: ElementRef<HTMLInputElement>;
  @ViewChild('complaintsInput') complaintsInput: ElementRef<HTMLInputElement>;
  Symptoms: any;
  Observations: any;
  Diagnosis: any;
  Notes: any;
  Allergies: any;
  Complaints: any;
  Vaccination: any;

  addSymptoms(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesTypeSymptoms.push(value);
      this.sign = false;
      console.log(this.clinicalNotesTypeSymptoms);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.symptomsCtrl.setValue(null);
  }
  addObservations(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesTypeObservations.push(value);
      console.log(this.clinicalNotesTypeObservations);
      this.sign = false;
    }
    // Clear the input value
    event.chipInput!.clear();
    this.observationsCtrl.setValue(null);
  }


  addDiagnosis(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesTypeDiagnosis.push(value);
      this.sign = false;
      console.log(this.clinicalNotesTypeDiagnosis);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.diagnosisCtrl.setValue(null);
  }

  addAllergies(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesAllergies.push(value);
      console.log(this.clinicalNotesAllergies);
      this.sign = false;
    }
    // Clear the input value
    event.chipInput!.clear();
    this.allergiesCtrl.setValue(null);
  }

  addNotes(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesNotes.push(value);
      console.log(this.clinicalNotesNotes);
      this.sign = false;
    }
    // Clear the input value
    event.chipInput!.clear();
    this.notesCtrl.setValue(null);
  }


  addVaccinationNotes(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesVaccinationNotes.push(value);
      this.sign = false;
      console.log(this.clinicalNotesVaccinationNotes);
    }
    // Clear the input value
    event.chipInput!.clear();
    this.vaccinationNotesCtrl.setValue(null);
  }

  addComplaints(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.clinicalNotesComplaints.push(value);
      console.log(this.clinicalNotesComplaints);
      this.sign = false;
    }
    // Clear the input value
    event.chipInput!.clear();
    this.complaintsCtrl.setValue(null);
  }





  removeSymptoms(symptom: string): void {
    const index = this.clinicalNotesTypeSymptoms.indexOf(symptom);
    if (index >= 0) {
      this.clinicalNotesTypeSymptoms.splice(index, 1);
    }
  }
  removeObservations(observation: string): void {
    const index = this.clinicalNotesTypeObservations.indexOf(observation);
    if (index >= 0) {
      this.clinicalNotesTypeObservations.splice(index, 1);
    }
  }

  removeDiagnosis(diagnosis: string): void {
    const index = this.clinicalNotesTypeDiagnosis.indexOf(diagnosis);
    if (index >= 0) {
      this.clinicalNotesTypeDiagnosis.splice(index, 1);
    }
  }

  removeAllergies(allergy: string): void {
    const index = this.clinicalNotesAllergies.indexOf(allergy);
    if (index >= 0) {
      this.clinicalNotesAllergies.splice(index, 1);
    }
  }
  removeNotes(note: string): void {
    const index = this.clinicalNotesNotes.indexOf(note);
    if (index >= 0) {
      this.clinicalNotesNotes.splice(index, 1);
    }
  }

  removeVaccinationNotes(vaccinationNote: string): void {
    const index = this.clinicalNotesVaccinationNotes.indexOf(vaccinationNote);
    if (index >= 0) {
      this.clinicalNotesVaccinationNotes.splice(index, 1);
    }
  }

  removeComplaints(complaint: string): void {
    const index = this.clinicalNotesComplaints.indexOf(complaint);
    if (index >= 0) {
      this.clinicalNotesComplaints.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesTypeSymptoms.push(event.option.viewValue);
    this.symptomsInput.nativeElement.value = '';
    this.symptomsCtrl.setValue(null);
    this.sign = false;
  }
  selectedObservation(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesTypeObservations.push(event.option.viewValue);
    this.observationsInput.nativeElement.value = '';
    this.observationsCtrl.setValue(null);
    this.sign = false;
  }

  selectedDiagnosis(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesTypeDiagnosis.push(event.option.viewValue);
    this.diagnosisInput.nativeElement.value = '';
    this.diagnosisCtrl.setValue(null);
    this.sign = false;
  }
  selectedAllergy(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesAllergies.push(event.option.viewValue);
    this.allergiesInput.nativeElement.value = '';
    this.allergiesCtrl.setValue(null);
    this.sign = false;
  }

  selectedNotes(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesNotes.push(event.option.viewValue);
    this.notesInput.nativeElement.value = '';
    this.diagnosisCtrl.setValue(null);
    this.sign = false;
  }
  selectedVaccinationNotes(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesVaccinationNotes.push(event.option.viewValue);
    this.vaccinationNotesInput.nativeElement.value = '';
    this.vaccinationNotesCtrl.setValue(null);
    this.sign = false;
  }

  selectedComplaints(event: MatAutocompleteSelectedEvent): void {
    this.clinicalNotesComplaints.push(event.option.viewValue);
    this.complaintsInput.nativeElement.value = '';
    this.complaintsCtrl.setValue(null);
    this.sign = false;
  }



  private _filter(value: string, type): string[] {
    const filterValue = value.toLowerCase();
    return this.suggestions[type].filter(symptom => symptom.toLowerCase().includes(filterValue));
  }


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
    private fileService: FileService,
    private cdlservice: CdlService
  ) {
  }
  ngOnInit() {
    console.log(this.suggestions);
    // .asObservable();
    console.log("Suggestions:111", this.suggestions);
    this.cdlservice.getBusinessProfile().subscribe((data) => {
      this.businessDetails = data;
      if (this.businessDetails && this.businessDetails.id) {
        this.businessId = this.businessDetails.id;
      }
    })
    this.filteredSymptoms = new BehaviorSubject(this.suggestions.symptoms);
    this.filteredObservations = new BehaviorSubject(this.suggestions.observations);
    this.filteredAllergies = new BehaviorSubject(this.suggestions.allergies);
    this.filteredDiagnosis = new BehaviorSubject(this.suggestions.diagnosis);
    this.filteredNotes = new BehaviorSubject(this.suggestions.notes);
    this.filteredVaccinationNotes = new BehaviorSubject(this.suggestions.vaccinationNotes);
    this.filteredComplaints = new BehaviorSubject(this.suggestions.complaints);

    if (!this.showClinicalNotesDetails) {
      this.filteredSymptoms = this.symptomsCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((symptom: string | null) => (symptom ? this._filter(symptom, 'symptoms') : this.suggestions.symptoms.slice())),
      );
      console.log("FilteredSymtoms",this.filteredSymptoms);
      this.filteredObservations = this.observationsCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((observation: string | null) => (observation ? this._filter(observation, 'observations') : this.suggestions.slice())),
      );

      this.filteredDiagnosis = this.diagnosisCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((diagnosis: string | null) => (diagnosis ? this._filter(diagnosis, 'diagnosis') : this.suggestions.diagnosis.slice())),
      );

      this.filteredAllergies = this.allergiesCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((allergy: string | null) => (allergy ? this._filter(allergy, 'allergies') : this.suggestions.allergies.slice())),
      );

      this.filteredComplaints = this.complaintsCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((complaint: string | null) => (complaint ? this._filter(complaint, 'complaints') : this.suggestions.complaints.slice())),
      );

      this.filteredNotes = this.notesCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((notes: string | null) => (notes ? this._filter(notes, 'notes') : this.suggestions.notes.slice())),
      );

      this.filteredVaccinationNotes = this.vaccinationNotesCtrl.valueChanges.pipe(
        startWith(<string>null),
        map((vaccinationNotes: string | null) => (vaccinationNotes ? this._filter(vaccinationNotes, 'vaccinationNotes') : this.suggestions.VaccinationNotes.slice())),
      );
    }
    this.api_loading = false;
    console.log('showClinicalNotesDetails::', this.showClinicalNotesDetails);
    console.log('medicalInfo', this.medicalInfo)
    console.log('this.activatedRoute.parent.snapshot.params', this.activatedRoute.parent.snapshot.params)
    this.patientId = this.activatedRoute.parent.snapshot.params['id'];
    this.bookingType = this.activatedRoute.parent.snapshot.params['type'];
    this.bookingId = this.activatedRoute.parent.snapshot.params['uid'];
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    const medicalRecordCustId = this.activatedRoute.parent.snapshot.params['id'];
    this.customerId = medicalRecordCustId;
    console.log('medicalRecordCustId', medicalRecordCustId)
    this.mrId = parseInt(medicalrecordId, 0);
    console.log('this.mrId', this.mrId)
    this.getClinicalNotes(this.mrId)

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
        console.log('clinicalNotes:::', this.clinicalNotes)
        this.isLoaded = true;
        this.sign = false;

      });
      // }

    }
    
    // console.log('mRListUsingId:::',this.mRListUsingId)
  }
  getClinicalNotes(medicalrecordId) {
    this.subscriptions.sink = this.provider_services.GetMedicalRecord(medicalrecordId).subscribe((res) => {
      console.log('resmedicalrecordId', res);
      this.medicalRecordInfo = res;
      this.sign = false;
    }, ((error) => {
      // alert('jjjj')
      // if(this.showClinicalNotesDetails=true){
      //   this.reloadComponent()
      // }
      // this.reloadComponent()
    }))

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
        this.sign = false;

      });
    }
  }

  getMRClinicalNotes(mrId) {
    const _this = this;
    // let response = '';
    for (let i = 0; i < this.clinical_constant.length; i++) {
      this.clinical_constant[i].value = '';

    }
    console.log("Clinical Constant:", this.clinical_constant);
    const compArray = this.clinical_constant;

    return new Promise((resolve) => {
      _this.provider_services.getClinicalRecordOfMRById(mrId)
        .subscribe((res: any) => {
          console.log('res', res)
          this.clinicalNotes = res;
          // if(res.length>0){
          //   this.clinicalNotes = res;
          //   // this.showClinicalNotesDetails=true;
          // }
          // else{
          //   // this.showClinicalNotesDetails=false;
          // }
          // this.clinicalNotes = res;
          // if (res.clinicalNotes) {
          //   response = res.clinicalNotes;
          //   // this.clinicalNotes= res;
          // } else {
          //   response = res;
          //   // this.clinicalNotes = res;
          // }
          // Object.entries(response).forEach(
          //   function ([key, v]) {
          //     console.log("Key:", key);
          //     console.log("Value:", v);
          //     console.log("Type:", typeof(v));
          //     const index = compArray.findIndex(element => element.id === key);
          //     compArray[index].value = v;
          //     console.log(compArray);
          //   });
        },
          error => {
            _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
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
  handleClinicalNotes(data, type) {
  }
  saveClinicalNotes(symtopData, observationData, DiagnosisData, NotesData, AllergiesData, ComplaintsData, VaccinationData) {
    if (symtopData || observationData || DiagnosisData || NotesData || AllergiesData || ComplaintsData || VaccinationData) {
      this.api_loading = true;
     
    let symptoms=[];
    let observations=[];
    let diagnosis=[];
    let notes=[];
    let allergies=[];
    let complaints=[];
    let vaccination=[];
    for (let i = 0; i < this.filesToUpload.length; i++) {
      console.log('clinicalNotesAddListxx', this.filesToUpload);
      
      if (this.filesToUpload[i]["type"] == 'Symptoms') {
        symptoms.push(this.filesToUpload[i])
      }
      if (this.filesToUpload[i]["type"] == 'Observations') {
        observations.push(this.filesToUpload[i]);
      }

      if (this.filesToUpload[i]["type"] == 'Diagnosis') {
        diagnosis.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Notes') {
        notes.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Allergies') {
       allergies.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Complaints') {
        complaints.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Vaccination Notes') {
        vaccination.push(this.filesToUpload[i]);
      }
    }
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
if(symptoms.length>0){
  let newData= {
    'type': 'Symptoms',
    'clinicalNotes': symtopData,
    'attachments':symptoms
  }
  payload.splice(payload.findIndex(e => e.type === "Symptoms"),1);
  payload.push(newData)
}
if(observations.length>0){
  let newData= {
    'type': 'Observations',
    'clinicalNotes': observationData,
    'attachments':observations
  }
  payload.splice(payload.findIndex(e => e.type === "Observations"),1);
  payload.push(newData)
}
if(diagnosis.length>0){
  let newData= {
    'type': 'Diagnosis',
    'clinicalNotes': DiagnosisData,
    'attachments':diagnosis
  }
  payload.splice(payload.findIndex(e => e.type === "Diagnosis"),1);
  payload.push(newData)
}
if(notes.length>0){
  let newData= {
    'type': 'Notes',
    'clinicalNotes': NotesData,
    'attachments':notes
  }
  payload.splice(payload.findIndex(e => e.type === "Notes"),1);
  payload.push(newData)
}
if(allergies.length>0){
  let newData= {
    'type': 'Allergies',
    'clinicalNotes': AllergiesData,
    'attachments':allergies
  }
  payload.splice(payload.findIndex(e => e.type === "Allergies"),1);
  payload.push(newData)
}if(allergies.length>0){
  let newData= {
    'type': 'Allergies',
    'clinicalNotes': AllergiesData,
    'attachments':allergies
  }
  payload.splice(payload.findIndex(e => e.type === "Allergies"),1);
  payload.push(newData)
}
if(complaints.length>0){
  let newData= {
    'type': 'Complaints',
    'clinicalNotes': ComplaintsData,
    'attachments':complaints
  }
  payload.splice(payload.findIndex(e => e.type === "Complaints"),1);
  payload.push(newData)
}
if(vaccination.length>0){
  let newData= {
    'type': 'Vaccination Notes',
    'clinicalNotes': VaccinationData,
    'attachments':vaccination
  }
  payload.splice(payload.findIndex(e => e.type === "Vaccination Notes"),1);
  payload.push(newData)
}
      console.log('this.payload',payload);
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
        // alert('jjjj')
        this.UpdateClinicalNotesList(this.clinicalNotesTypeSymptoms, this.clinicalNotesTypeObservations, this.clinicalNotesTypeDiagnosis,
          this.clinicalNotesNotes, this.clinicalNotesAllergies, this.clinicalNotesComplaints, this.clinicalNotesVaccinationNotes)
      }
      else if (this.medicalInfo === undefined && this.mrId === 0) {
      
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
    else {
      const error = 'Please add Clinical Notes';
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.api_loading = false;
    }

  }
  UpdateClinicalNotesList(symtopData, observationData, DiagnosisData, NotesData, AllergiesData, ComplaintsData, VaccinationData) {
    let symptoms=[];
    let observations=[];
    let diagnosis=[];
    let notes=[];
    let allergies=[];
    let complaints=[];
    let vaccination=[];
    for (let i = 0; i < this.filesToUpload.length; i++) {
      console.log('clinicalNotesAddListxx', this.filesToUpload);
      
      if (this.filesToUpload[i]["type"] == 'Symptoms') {
        symptoms.push(this.filesToUpload[i])
      }
      if (this.filesToUpload[i]["type"] == 'Observations') {
        observations.push(this.filesToUpload[i]);
      }

      if (this.filesToUpload[i]["type"] == 'Diagnosis') {
        diagnosis.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Notes') {
        notes.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Allergies') {
       allergies.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Complaints') {
        complaints.push(this.filesToUpload[i]);
      }
      if (this.filesToUpload[i]["type"] == 'Vaccination Notes') {
        vaccination.push(this.filesToUpload[i]);
      }
    }
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
    if(symptoms.length>0){
      let newData= {
        'type': 'Symptoms',
        'clinicalNotes': symtopData,
        'attachments':symptoms
      }
      payload.splice(payload.findIndex(e => e.type === "Symptoms"),1);
      payload.push(newData)
    }
    if(observations.length>0){
      let newData= {
        'type': 'Observations',
        'clinicalNotes': observationData,
        'attachments':observations
      }
      payload.splice(payload.findIndex(e => e.type === "Observations"),1);
      payload.push(newData)
    }
    if(diagnosis.length>0){
      let newData= {
        'type': 'Diagnosis',
        'clinicalNotes': DiagnosisData,
        'attachments':diagnosis
      }
      payload.splice(payload.findIndex(e => e.type === "Diagnosis"),1);
      payload.push(newData)
    }
    if(notes.length>0){
      let newData= {
        'type': 'Notes',
        'clinicalNotes': NotesData,
        'attachments':notes
      }
      payload.splice(payload.findIndex(e => e.type === "Notes"),1);
      payload.push(newData)
    }
    if(allergies.length>0){
      let newData= {
        'type': 'Allergies',
        'clinicalNotes': AllergiesData,
        'attachments':allergies
      }
      payload.splice(payload.findIndex(e => e.type === "Allergies"),1);
      payload.push(newData)
    }if(allergies.length>0){
      let newData= {
        'type': 'Allergies',
        'clinicalNotes': AllergiesData,
        'attachments':allergies
      }
      payload.splice(payload.findIndex(e => e.type === "Allergies"),1);
      payload.push(newData)
    }
    if(complaints.length>0){
      let newData= {
        'type': 'Complaints',
        'clinicalNotes': ComplaintsData,
        'attachments':complaints
      }
      payload.splice(payload.findIndex(e => e.type === "Complaints"),1);
      payload.push(newData)
    }
    if(vaccination.length>0){
      let newData= {
        'type': 'Vaccination Notes',
        'clinicalNotes': VaccinationData,
        'attachments':vaccination
      }
      payload.splice(payload.findIndex(e => e.type === "Vaccination Notes"),1);
      payload.push(newData)
    }
    console.log('payload',payload);
    this.clinicalNotesAddList.push(payload)
    console.log('clinicalNotesAddList', payload);
    console.log('this.medicalInfo.id', this.medicalInfo)
    this.updateMrwithClinicalNotes(payload, this.mrId)
  }

  updateMrwithClinicalNotes(payload, mrId) {
    this.provider_services.updateMrClinicalNOtes(payload, mrId)
      .subscribe((data) => {
        this.snackbarService.openSnackBar('Clinical Notes Updated Successfully');
        // console.log('updated successfully');
        //   const bookingId = 0;
        // const bookingType = 'FOLLOWUP';
        // const patientId=this.customerId;
        this.reloadComponent()
        this.showClinicalNotesDetails = true;
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
          this.customerphoneno = data[0].phoneNo;
        });
    return this.customerphoneno;
  }
  goback(type_from) {
    // this.location.back()
    if (this.customerDetails && this.customerDetails.id) {
      this.getCustomerbyId(this.customerDetails.id)
    }

    const back_type = this.medicalrecordService.getReturnTo();
    console.log('type_from', type_from)
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
  getColor(item) {
    if (item.type === 'Symptoms') {
      return 'rgba(0, 222, 213, 0.05)'
    }
    else if (item.type === 'Observations') {
      return 'rgba(222, 173, 0, 0.05)'
    }
    else if (item.type === 'Diagnosis') {
      return 'rgba(0, 115, 222, 0.05)'
    }
    else if (item.type === 'Notes') {
      return 'rgba(0, 222, 75, 0.05)'
    }
    else if (item.type === 'Allergies') {
      return 'rgba(222, 107, 0, 0.05)'
    }
    else if (item.type === 'Complaints') {
      return 'rgba(251, 125, 125, 0.05)'
    }
    else if (item.type === 'Vaccination Notes') {
      return 'rgba(0, 169, 222, 0.05)'
    }

  }
  getColorType(item) {
    if (item.type === 'Symptoms') {
      return '#00DED5'
    }
    else if (item.type === 'Observations') {
      return '#DEBA00'
    }
    else if (item.type === 'Diagnosis') {
      return '#0066DE'
    }
    else if (item.type === 'Notes') {
      return '#00DE66'
    }
    else if (item.type === 'Allergies') {
      return '#DE5000'
    }
    else if (item.type === 'Complaints') {
      return '#E75050'
    }
    else if (item.type === 'Vaccination Notes') {
      return '#008EDE'
    }
  }
  getBorderColor(item) {
    if (item.type === 'Symptoms') {
      return '2px solid #00DED5'
    }
    else if (item.type === 'Observations') {
      return '2px solid #DEBA00'
    }
    else if (item.type === 'Diagnosis') {
      return '2px solid #0066DE'
    }
    else if (item.type === 'Notes') {
      return '2px solid #00DE66'
    }
    else if (item.type === 'Allergies') {
      return '2px solid #DE5000'
    }
    else if (item.type === 'Complaints') {
      return '2px solid #E75050'
    }
    else if (item.type === 'Vaccination Notes') {
      return '2px solid #008EDE'
    }
  }
  updateClinicalNotes(data) {
    console.log('data',data);
    this.btnName = 'Save'
    console.log('this.medicalInfo', this.medicalInfo);
    this.medicalInfo = 'MedicalInfoClinicalNotesUpdate'
    this.showClinicalNotesDetails = false;
    this.clinicalNotes.forEach((item) => {
      if (item.type === 'Symptoms') {
        this.clinicalNotesTypeSymptoms = item.clinicalNotes;
        if(item.attachments){
          this.selectedFiles['Symptoms'].files = item.attachments;
        }
      }
      if (item.type === 'Observations') {
        this.clinicalNotesTypeObservations = item.clinicalNotes
        if(item.attachments){
          this.selectedFiles['Observations'].files = item.attachments;
        }
      }
      if (item.type === 'Diagnosis') {
        this.clinicalNotesTypeDiagnosis = item.clinicalNotes
        if(item.attachments){
          this.selectedFiles['Diagnosis'].files = item.attachments;
        }
      }
      if (item.type === 'Notes') {
        this.clinicalNotesNotes = item.clinicalNotes
        if(item.attachments){
          this.selectedFiles['Notes'].files = item.attachments;
        }
      }
      if (item.type === 'Allergies') {
        this.clinicalNotesAllergies = item.clinicalNotes
        if(item.attachments){
          this.selectedFiles['Allergies'].files = item.attachments;
        }
      }
      if (item.type === 'Complaints') {
        this.clinicalNotesComplaints = item.clinicalNotes
        if(item.attachments){
          this.selectedFiles['Complaints'].files = item.attachments;
        }
      }
      if (item.type === 'Vaccination Notes') {
        this.clinicalNotesVaccinationNotes = item.clinicalNotes
        if(item.attachments){
          this.selectedFiles['Vaccination Notes'].files = item.attachments;
        }
      }
    })

  }
  // autoGrowTextZone() {
  //   this.sign = false;
  // }
  filesSelected(event, type) {
    this.apiloading = true;
    console.log("Event ", event, type)
    const input = event.target.files;
    console.log("input ", input)
    let fileUploadtoS3 = [];
    const _this = this;
    this.fileService.filesSelected(event, _this.selectedFiles[type]).then(
      () => {
        let index = _this.filesToUpload && _this.filesToUpload.length > 0 ? _this.filesToUpload.length : 0;
        for (const pic of input) {
          const size = pic["size"] / 1024;
          let fileObj = {
            owner: _this.businessId,
            ownerType: "Provider",
            fileName: pic["name"],
            fileSize: size / 1024,
            caption: "",
            fileType: pic["type"].split("/")[1],
            action: 'add'
          }
          console.log("pic", pic)
          fileObj['file'] = pic;
          fileObj['type'] = type;
          fileObj['order'] = index;
          _this.filesToUpload.push(fileObj);
          fileUploadtoS3.push(fileObj);
          index++;
        }

        _this.cdlservice.uploadFilesToS3(fileUploadtoS3).subscribe(
          (s3Urls: any) => {
            if (s3Urls && s3Urls.length > 0) {
              _this.uploadAudioVideo(s3Urls).then(
                (dataS3Url) => {
                  console.log(dataS3Url);
                  _this.apiloading = false;
                  console.log("Sending Attachment Success");
                });
            }
          }, error => {
            _this.apiloading = false;
            _this.snackbarService.openSnackBar(error,
              { panelClass: "snackbarerror" }
            );
          }
        );

      }).catch((error) => {
        _this.apiloading = false;
        _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      })


  }

  // filesSelected(event, type) {
  //   this.apiloading = true;
  //   console.log("Event ", event, type)
  //   const input = event.target.files;
  //   console.log("input ", input)
  //   let fileUploadtoS3 = [];
  //   const _this = this;
  //   this.fileService.filesSelected(event, _this.selectedFiles[type]).then(
  //     () => {
  //       let index = _this.filesToUpload && _this.filesToUpload.length > 0 ? _this.filesToUpload.length : 0;
  //       for (const pic of input) {
  //         const size = pic["size"] / 1024;
  //         let fileObj = {
  //           owner: _this.businessId,
  //           ownerType: "Provider",
  //           fileName: pic["name"],
  //           fileSize: size / 1024,
  //           caption: "",
  //           fileType: pic["type"].split("/")[1],
  //           action: 'add'
  //         }
  //         console.log("pic", pic)
  //         fileObj['file'] = pic;
  //         fileObj['type'] = type;
  //         fileObj['order'] = index;
  //         _this.filesToUpload.push(fileObj);
  //         fileUploadtoS3.push(fileObj);
  //         index++;
  //       }

  //       _this.cdlservice.uploadFilesToS3(fileUploadtoS3).subscribe(
  //         (s3Urls: any) => {
  //           if (s3Urls && s3Urls.length > 0) {
  //             _this.uploadAudioVideo(s3Urls).then(
  //               (dataS3Url) => {
  //                 console.log(dataS3Url);
  //                 _this.apiloading = false;
  //                 console.log("Sending Attachment Success");
  //               });
  //           }
  //         }, error => {
  //           _this.apiloading = false;
  //           _this.snackbarService.openSnackBar(error,
  //             { panelClass: "snackbarerror" }
  //           );
  //         }
  //       );

  //     }).catch((error) => {
  //       _this.apiloading = false;
  //       _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     })


  // }
  uploadAudioVideo(data) {
    const _this = this;
    let count = 0;
    console.log("DAta:", data);
    return new Promise(async function (resolve, reject) {
      for (const s3UrlObj of data) {
        console.log('_this.filesToUpload', _this.filesToUpload)
        let file = _this.filesToUpload.filter((fileObj) => {
          return ((fileObj.order === (s3UrlObj.orderId)) ? fileObj : '');
        })[0];
        console.log("File:", file);
        if (file) {
          file['driveId'] = s3UrlObj.driveId;
          await _this.uploadFiles(file['file'], s3UrlObj.url, s3UrlObj.driveId).then(
            () => {
              count++;
              if (count === data.length) {
                resolve(true);
                console.log('_this.filesToUpload', _this.filesToUpload)
              }
            }
          );
        }
        else {
          resolve(true);
        }
      }
    })
  }
  uploadFiles(file, url, driveId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.cdlservice.videoaudioS3Upload(file, url)
        .subscribe(() => {
          console.log("Final Attchment Sending Attachment Success", file)
          _this.cdlservice.videoaudioS3UploadStatusUpdate('COMPLETE', driveId).subscribe((data: any) => {
            resolve(true);
          })
        }, error => {
          console.log('error', error)
          _this.snackbarService.openSnackBar(_this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          resolve(false);
        });
    })
  }
  getImage(url, file) {
    return this.fileService.getImage(url, file);
  }
  deleteTempImage(i, type, file) {
    console.log("this.selectedFiles[type]", file)
    console.log('file', file);
    delete file['s3path'];
    delete file['uid'];
    if (file.driveId) {
      file["action"] = "remove";
      file["type"] = type;
      this.filesToUpload.push(file);
    }
    let files = this.filesToUpload.filter((fileObj) => {
      if (fileObj && fileObj.fileName && this.selectedFiles[type] && this.selectedFiles[type].files[i] && this.selectedFiles[type].files[i].name) {
        if (fileObj.type) {
          return (fileObj.fileName === this.selectedFiles[type].files[i].name && fileObj.type === type);
        }
      }
    });

    if (files && files.length > 0) {
      let fileIndex = this.filesToUpload.indexOf(files[0])
      if (!file.driveId) {
        this.filesToUpload.splice(fileIndex, 1);
      }
    }
    console.log("this.filesToUpload", this.filesToUpload)
    this.selectedFiles[type].files.splice(i, 1);
    this.selectedFiles[type].base64.splice(i, 1);
    this.selectedFiles[type].caption.splice(i, 1);

  }
  getImagefromUrl(url, file) {
    if (file.fileType == 'pdf') {
      return './assets/images/pdf.png';
    } else if (file.fileType == 'application/vnd.ms-excel' || file.fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return './assets/images/xls.png';
    } else if (file.fileType == 'audio/mp3' || file.fileType == 'audio/mpeg' || file.fileType == 'audio/ogg') {
      return './assets/images/audio.png';
    } else if (file.fileType == 'video/mp4' || file.fileType == 'video/mpeg') {
      return './assets/images/video.png';
    } else if (file.fileType == 'application/msword' || file.fileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.fileType.includes('docx') || file.fileType.includes('doc')) {
      return './assets/images/ImgeFileIcon/wordDocsBgWhite.jpg';
    } else if (file.fileType.includes('txt')) {
      return './assets/images/ImgeFileIcon/docTxt.png';
    } else {
      return url;
    }
  }
}
