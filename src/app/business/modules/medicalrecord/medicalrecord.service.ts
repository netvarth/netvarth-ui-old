import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalrecordService {
  bookingId: any;
  patientData: any;
  mr_payload_new: any = {
    'bookingType': 'FOLLOWUP',
    'consultationMode': 'OP',
    'mrConsultationDate': new Date()
  };
  private patientDetails = new BehaviorSubject<any>('');
  patient_data = this.patientDetails.asObservable();
  private mrId = new BehaviorSubject<any>(0);
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
    } else {
      this.mr_payload_new['bookingType'] = 'FOLLOWUP';
    } if (data.consultationMode) {
      this.mr_payload_new['consultationMode'] = data.consultationMode;
    }
    if (data.booking_id) {
      this.bookingId = data.booking_id;
    }

    this.patientDetails.next(data);
  }
  setCurrentMRID(uid) {
    console.log(uid);

    this.mrId.next(uid);

  }
  createMR(key, value) {
    console.log(this.bookingId);

    const _this = this;
    const mrObject = _this.mr_payload_new;
    mrObject[key] = value;
    if (mrObject.bookingType === 'FOLLOWUP') {

      return new Promise((resolve, reject) => {
        this.provider_services.createMedicalRecordForFollowUp(mrObject, _this.patientData.id)
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
        this.provider_services.createMedicalRecord(mrObject, _this.bookingId)
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
  createMRForUploadPrescription() {
    const _this = this;
    console.log(_this.patientData.id);

    if (_this.mr_payload_new.bookingType === 'FOLLOWUP') {

      return new Promise((resolve, reject) => {
        this.provider_services.createMedicalRecordForFollowUp(_this.mr_payload_new, _this.patientData.id)
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
        this.provider_services.createMedicalRecord(_this.mr_payload_new, _this.bookingId)
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
