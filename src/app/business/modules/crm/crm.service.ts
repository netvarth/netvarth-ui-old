import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  public taskToCraeteViaServiceData:any;
  public taskActivityName:any;
  

  constructor(
    private servicemeta: ServiceMeta,
    private http: HttpClient
    ) { }

     getTasks() : Observable <any> {
       let taskList: any = {
         "taskId": 1,
         "taskName": 'Task 1'
       };
       console.log(taskList)
       return taskList.asObservable();
    }

    getMemberList() {
      const url = 'provider/user';
      return this.servicemeta.httpGet(url, null);
    }
    getCategoryList(){
      const url ='provider/task/category';
      return this.servicemeta.httpGet(url, null);
    }
    getTaskType(){
      const url ='provider/task/type';
      return this.servicemeta.httpGet(url, null);
    }
    getTaskStatus(){
      const url ='provider/task/status';
      return this.servicemeta.httpGet(url, null);
    }
    getTaskPriority(){
      const url ='provider/task/priority';
      return this.servicemeta.httpGet(url, null);
    }
    // addMembers(data) {
    //   return this.servicemeta.httpPost('provider/familyMember', data);
    // }
    addTask(data){
      return this.servicemeta.httpPost('provider/task', data);
    }
    getProviderLocations() {
      return this.servicemeta.httpGet('provider/locations');
    }
    // getTotalTask() {
    //   const url = 'provider/task/provider';
    //   return this.servicemeta.httpGet(url);
    // }
    
    getTotalTask(filter = {}) {
      const url = 'provider/task/provider'
      return this.servicemeta.httpGet(url, null, filter);
    }
    getTotalTaskCount(filter) {
      const url = 'provider/task/provider/count';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getInprogressTask(filter = {}) {
      const url = 'provider/task/provider?status-eq=3';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getInprogressTaskCount(filter) {
      const url = 'provider/task/provider/count?status-eq=3';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getCompletedTask(filter = {}) {
      const url = 'provider/task/provider?status-eq=5';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getCompletedTaskCount(filter) {
      const url = 'provider/task/provider/count?status-eq=5';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getDelayedTask(filter = {}) {
      const url = 'provider/task/provider?status-eq=4';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getDelayedTaskCount(filter) {
      const url = 'provider/task/provider/count?status-eq=4';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getTaskDetails(taskUid)
    {
      const url = 'provider/task/' + taskUid;
      return this.servicemeta.httpGet(url);
    }

    getSubTaskDetails(taskUid)
    {
      const url = 'provider/task/provider';
      return this.servicemeta.httpGet(url);
    }



    updateTask(taskUid ,updateTaskData){
      console.log(updateTaskData)
      const url='provider/task/'+ taskUid
      return this.servicemeta.httpPut(url, updateTaskData);
    }
    addAssigneeMember(taskUid,userId){
      const url='provider/task/'+taskUid + '/manager' + userId
      return this.servicemeta.httpPost(url);
    }
    addNotes(taskUid,notesData){
      const url ='provider/task/'+taskUid+'/notes';
      return this.servicemeta.httpPut(url,notesData)
    }
    getNotes(){
      // const url = 'provider';
      // return this.servicemeta.httpGet(url, null);
    }
    // https://scale.jaldee.com/v1/rest/provider/login
    // addDepartmentServices(data, id) {
    //   const url = 'provider/departments/' + id + '/service';
    //   return this.servicemeta.httpPost(url, data);
    // }
    taskStatusCloseDone(taskUid){
      const url='provider/task/'+taskUid + '/status/closed';
      return this.servicemeta.httpPut(url)
    }
    addTaskClosingDetails(taskUid,taskDetails){
      const url='provider/task/'+taskUid + '/closingdetails';
      return this.servicemeta.httpPut(url,taskDetails)
    }


    upload(file: File): Observable<HttpEvent<any>> {
      const formData: FormData = new FormData();
      formData.append('file', file);
      console.log("Form Data : ",formData)
      const req = new HttpRequest('POST', 'provider/task/ta_64a19eb3-9561-42f9-a346-0e50cc57bb73-pt/attachment', formData, {
        reportProgress: true,
        responseType: 'json'
      });
      console.log("Form Data : ",req)
      return this.http.request(req);
    }
    // getFiles(): Observable<any> {
    //   return this.http.get(`provider/task/ta_64a19eb3-9561-42f9-a346-0e50cc57bb73-pt`);
    // }
    addProgressvalue(taskUid,progressValue , data){
      const url ='provider/task/'+ taskUid + '/progress/' + progressValue;
      return this.servicemeta.httpPut(url , data)
    }

}
