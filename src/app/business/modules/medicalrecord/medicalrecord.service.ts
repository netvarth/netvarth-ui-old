import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalrecordService {
  patientData: any;
  mr_payload_new: any = {
    'bookingType': 'NA',
    'consultationMode': 'OP',
    'mrConsultationDate': new Date()
  };
  private patientDetails = new BehaviorSubject<any>('');
  patient_data = this.patientDetails.asObservable();
  private mrId = new BehaviorSubject<number>(0);
  _mrUid = this.mrId.asObservable();
  drugList: any = [];

  constructor(private provider_services: ProviderServices) {

    this.patient_data.subscribe(res => {
      this.patientData = JSON.parse(res.customerDetail);
      if (res.booking_type) {
        this.mr_payload_new['bookingType'] = res.booking_type;

      } if (res.consultationMode) {
        this.mr_payload_new['consultationMode'] = res.consultationMode;
      }

    });
  }

  getDrugList() {
    return this.drugList;
  }

  setDrugList(data) {
    this.drugList = data;
  }
  setPatientDetailsForMR(data) {
    this.patientDetails.next(data);
  }
  setCurrentMRID(uid) {
    this.mrId.next(uid);

  }
  createMR(data) {
    this.mr_payload_new.append(data);
    return new Promise((resolve, reject) => {
      this.provider_services.createMedicalRecord(this.mr_payload_new, this.patientData.id)
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            reject(error);

          }
        );
    });

  }
}
