import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalrecordService {
  private patientDetails = new BehaviorSubject<any>('');
  patient_data = this.patientDetails.asObservable();
  private mrId = new BehaviorSubject<any>('');
  _mrUid = this.mrId.asObservable();
  drugList: any = [];

  constructor() { }

  getDrugList() {
    return this.drugList;
  }

  setDrugList(data) {
    this.drugList = data;
  }
  setPatientDetails(data) {
    this.patientDetails.next(data);
  }
  setCurrentMRID(uid) {
    this.mrId.next(uid);

  }
}
