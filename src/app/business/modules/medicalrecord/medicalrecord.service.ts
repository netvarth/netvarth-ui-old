import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalrecordService {
  patientData: any;
  mr_payload_new: any = {
    'bookingType': 'FOLLOWUP',
    'consultationMode': 'OP',
    'mrConsultationDate': new Date()
  };
  private patientDetails = new BehaviorSubject<any>('');
  patient_data = this.patientDetails.asObservable();
  private mrId = new BehaviorSubject<number>(0);
  _mrUid = this.mrId.asObservable();
  drugList: any = [];

  constructor(private provider_services: ProviderServices) {
  }


  getDrugList() {
    return this.drugList;
  }

  setDrugList(data) {
    this.drugList = data;
  }
  setPatientDetailsForMR(data) {

    this.patientData = JSON.parse(data.customerDetail);
    if (data.booking_type) {
      this.mr_payload_new['bookingType'] = data.booking_type;

    } if (data.consultationMode) {
      this.mr_payload_new['consultationMode'] = data.consultationMode;
    }

    this.patientDetails.next(data);
  }
  setCurrentMRID(uid) {
    this.mrId.next(uid);

  }
  createMR(data) {
    this.mr_payload_new.append(data);
    if (this.mr_payload_new.bookingType === 'FOLLOWUP') {

      return new Promise((resolve, reject) => {
        this.provider_services.createMedicalRecordForFollowUp(this.mr_payload_new, this.patientData.id)
          .subscribe(
            response => {
              resolve(response);
            },
            error => {
              reject(error);

            }
          );
      });

    } else {
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
}
