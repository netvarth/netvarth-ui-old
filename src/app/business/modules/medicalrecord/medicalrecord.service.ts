import { Injectable } from '@angular/core';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalrecordService {
  bookingType: any;
  department: any;
  serviceName: any;
  patientDetails: any;
  bookingId: any;
  patientData: any;
  mr_payload_new: any = {
    'bookingType': 'FOLLOWUP',
    'consultationMode': 'OP'

  };
  doctorId;

  // private back_type = new BehaviorSubject<any>('');
  // back_nav = this.back_type.asObservable();

  drugList: any = [];

  constructor(private provider_services: ProviderServices) {
  }


  getDrugList() {
    return this.drugList;
  }

  setDrugList(data) {
    this.drugList = data;
  }
  setPatientDetails(data) {
    this.patientDetails = data;
  }
  getPatientDetails() {
    return this.patientDetails;
  }


  // setBacknav(back) {
  //   this.back_type.next(back);
  // }
  setDoctorId(id) {
    this.doctorId = id;
  }
  getDoctorId() {
    return this.doctorId;
  }
  setParams(type, id) {
    this.bookingType = type;
    this.bookingId = id;
    this.mr_payload_new['bookingType'] = type;
  }
  setServiceDept(service, department) {
    this.serviceName = service;
    this.department = department;
  }
  getServiceName() {
    return this.serviceName;
  }
  getDepartmentName() {
    return this.department;
  }
  createMR(key, value) {
    if (key !== 'clinicalNotes') {
      delete this.mr_payload_new['clinicalNotes'];
    } if (key !== 'prescriptions') {
      delete this.mr_payload_new['prescriptions'];
    }

    let mrObject = {};
    const $this = this;
    mrObject = $this.mr_payload_new;
    mrObject[key] = value;
    if (mrObject['bookingType'] === 'FOLLOWUP') {

      return new Promise((resolve, reject) => {
        this.provider_services.createMedicalRecordForFollowUp(mrObject, $this.patientDetails.id)
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

        this.provider_services.createMedicalRecord(mrObject, $this.bookingId)
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
    const $this = this;

    delete $this.mr_payload_new['clinicalNotes'];
    delete this.mr_payload_new['prescriptions'];


    if ($this.bookingType === 'FOLLOWUP') {

      return new Promise((resolve, reject) => {
        this.provider_services.createMedicalRecordForFollowUp($this.mr_payload_new, $this.patientData.id)
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
        this.provider_services.createMedicalRecord($this.mr_payload_new, $this.bookingId)
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
