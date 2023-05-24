import { Injectable } from '@angular/core';
import { DateTimeProcessor } from 'jaldee-framework/calendar/date-time';
import { projectConstantsLocal } from 'jaldee-framework/constants';
import { ServiceMeta } from 'jaldee-framework/service-meta';
import { GroupStorageService } from 'jaldee-framework/storage/group';

@Injectable({
  providedIn: 'root'
})
export class DentalHomeService {
  user: any;
  capabilities: any;
  patientDetails: any;
  constructor(
    private dateTimeProcessor: DateTimeProcessor,
    private servicemeta: ServiceMeta,
    private groupService: GroupStorageService
  ) {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
  }

 
  

  

 
  getBusinessProfile() {
    const url = 'provider/bProfile';
    return this.servicemeta.httpGet(url, null);
  }
  uploadFilesToS3(data) {
    const url = 'provider/fileShare/upload';
    return this.servicemeta.httpPost(url, data);
  }
  videoaudioS3Upload(file, url) {
    return this.servicemeta.httpPut(url, file);
  }
  videoaudioS3UploadStatusUpdate(status, id) {
    const url = 'provider/fileShare/upload/' + status + '/' + id;
    return this.servicemeta.httpPut(url, null);
  }
  createDenatlChart(post_data) {
    const url = 'provider/mr/dentalchart';
    return this.servicemeta.httpPost(url, post_data);

  }
  getPatientDetails() {
    return this.patientDetails;
  }
   createMedicalRecordForFollowUp(id,data) {
    const url = 'provider/mr/patient/' + id;
    return this.servicemeta.httpPost(url, data);
  }

  createMedicalRecord(data, bookingId) {
    const url = 'provider/mr/' + bookingId;
    return this.servicemeta.httpPost(url, data);
  }
  setPatientDetails(data) {
    this.patientDetails = data;
  }
  getTeethDetails(mrId) {
    const url = 'provider/mr/dentalchart/' + mrId;
    return this.servicemeta.httpGet(url, null);
  }
  updateMR(id, data) {
    const url = 'provider/mr/dentalchart/' +  id;
    return this.servicemeta.httpPut(url, data);
  }
  getTeethDetailsById(mrId, teethId) {
    const url = 'provider/mr/dentalchart/' + mrId + '/tooth/' + teethId;
    return this.servicemeta.httpGet(url, null);
  }
  deleteTeethById(mrid , data){
    const url = 'provider/mr/dentalchart/' + mrid;
    return this.servicemeta.httpDelete(url,data);
  }
}