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
    'consultationMode': 'OP'

  };
  private patientDetails = new BehaviorSubject<any>('');
  patient_data = this.patientDetails.asObservable();
  private mrId = new BehaviorSubject<any>(0);
  private back_type = new BehaviorSubject<any>('');
  back_nav = this.back_type.asObservable();
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
  setBacknav(back) {
    this.back_type.next(back);
  }
  createMR(key, value) {
    if (key !== 'clinicalNotes') {
      delete this.mr_payload_new['clinicalNotes'];
    } if (key !== 'prescriptions') {
      delete this.mr_payload_new['prescriptions'];
    }

    let mrObject = {};
    const _this = this;
    mrObject = _this.mr_payload_new;
    mrObject[key] = value;
    if (mrObject['bookingType'] === 'FOLLOWUP') {

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
        console.log(JSON.stringify(mrObject));

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
    delete _this.mr_payload_new['clinicalNotes'];
    delete this.mr_payload_new['prescriptions'];


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
