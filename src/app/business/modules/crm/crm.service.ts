import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  public taskToCraeteViaServiceData:any;
  public leadToCraeteViaServiceData:any;
  public leadActivityName:any;
  public taskActivityName:any;
  public taskToviewViaServiceData:any;
  public subtaskToView:any;
  public taskMasterToCreateServiceData:any;
  public leadMasterToCreateServiceData:any;
  public updateSubTaskData:any;
  public followUpTableToOverView:any;
  

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
    getLeadCategoryList(){
      const url ='provider/lead/category';
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


    getLeadType(){
      const url ='provider/lead/type';
      return this.servicemeta.httpGet(url, null);
    }

    getLeadStatus(){
      const url ='provider/lead/status';
      return this.servicemeta.httpGet(url, null);
    }
    getLeadPriority(){
      const url ='provider/lead/priority';
      return this.servicemeta.httpGet(url, null);
    }
    // addMembers(data) {
    //   return this.servicemeta.httpPost('provider/familyMember', data);
    // }
    addTask(data){
      return this.servicemeta.httpPost('provider/task', data);
    }

    addLead(data){
      return this.servicemeta.httpPost('provider/lead', data);
    }
    getProviderLocations() {
      return this.servicemeta.httpGet('provider/locations');
    }
    // getTotalTask() {
    //   const url = 'provider/task/provider';
    //   return this.servicemeta.httpGet(url);
    // }
    
    getTotalTask(filter = {}) {
      const url = 'provider/task/provider?isSubTask-eq=false'
      return this.servicemeta.httpGet(url, null, filter);
    }
    getTotalLead(filter = {}) {
      const url = 'provider/lead/'
      return this.servicemeta.httpGet(url, null, filter);
    }

    getTotalTaskCount(filter) {
      const url = 'provider/task/provider/count?isSubTask-eq=false';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getTotalLeadCount(filter) {
      const url = 'provider/lead/count';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getInprogressTask(filter = {}) {
      const url = 'provider/task/provider?status-eq=3&&isSubTask-eq=false';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getInprogressLead(filter = {}) {
      const url = 'provider/lead?status-eq=8';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getInprogressTaskCount(filter) {
      const url = 'provider/task/provider/count?status-eq=3&&isSubTask-eq=false';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getInprogressLeadCount(filter) {
      const url = 'provider/lead/count?status-eq=8';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getCompletedTask(filter = {}) {
      const url = 'provider/task/provider?status-eq=5&&isSubTask-eq=false';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getCompletedTaskCount(filter) {
      const url = 'provider/task/provider/count?status-eq=5&&isSubTask-eq=false';
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




    getCompletedLead(filter = {}) {
      const url = 'provider/lead?status-eq=10';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getCompletedLeadCount(filter) {
      const url = 'provider/lead/count?status-eq=10';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getNewLead(filter){
      const url = 'provider/lead/?status-eq=6';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getNewLeadCount(filter){
      const url = 'provider/lead/count?status-eq=6';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getFailedLead(filter = {}) {
      const url = 'provider/lead?status-eq=9';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getFailedLeadCount(filter) {
      const url = 'provider/lead/count?status-eq=9';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getTransferredLead(filter = {}) {
      const url = 'provider/lead?status-eq=11';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getTransferredLeadCount(filter) {
      const url = 'provider/lead/count?status-eq=11';
      return this.servicemeta.httpGet(url, null, filter);
    }

    getDelayedLead(filter = {}) {
      const url = 'provider/lead?status-eq=4';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getDelayedLeadCount(filter) {
      const url = 'provider/lead/count?status-eq=4';
      return this.servicemeta.httpGet(url, null, filter);
    }
    getLeadDetails(leadUid)
    {
      const url = 'provider/lead/' + leadUid;
      return this.servicemeta.httpGet(url);
    }

    getSubTaskDetails(taskUid)
    {
      const url = 'provider/task/provider';
      return this.servicemeta.httpGet(url);
    }


    getLeadTaskDetails(taskUid)
    {
      const url = 'provider/task/provider?originFrom-eq=Lead&originUid-eq=' + taskUid;
      return this.servicemeta.httpGet(url);
    }



    updateTask(taskUid ,updateTaskData){
      console.log(updateTaskData)
      const url='provider/task/'+ taskUid
      return this.servicemeta.httpPut(url, updateTaskData);
    }


    updateLead(leadUid ,updateLeadData){
      console.log(updateLeadData)
      const url='provider/lead/'+ leadUid
      return this.servicemeta.httpPut(url, updateLeadData);
    }
    addAssigneeMember(taskUid,userId){
      const url='provider/task/'+taskUid + '/manager' + userId
      return this.servicemeta.httpPost(url);
    }
    addNotes(taskUid,notesData){
      const url ='provider/task/'+taskUid+'/notes';
      return this.servicemeta.httpPut(url,notesData)
    }

    addLeadNotes(leadUid,notesData){
      const url ='provider/lead/'+leadUid+'/note';
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
      // const req = new HttpRequest('POST', 'provider/task/ta_64a19eb3-9561-42f9-a346-0e50cc57bb73-pt/attachment', formData, {
      //   reportProgress: true,
      //   responseType: 'json'
      // });
      // console.log("Form Data : ",req)
      return this.http.post<any>('provider/task/ta_64a19eb3-9561-42f9-a346-0e50cc57bb73-pt/attachment', formData, {
              reportProgress: true,
              observe: 'events'
            });
    }
    
    addProgressvalue(taskUid,progressValue , data){
      const url ='provider/task/'+ taskUid + '/progress/' + progressValue;
      return this.servicemeta.httpPut(url , data)
    }
    previousProgress(taskUid)
    {
      const url = 'provider/task/' + taskUid + '/progresslog';
      return this.servicemeta.httpGet(url);
    }

    previousLeadProgress(taskUid)
    {
      const url = 'provider/lead/' + taskUid + '/progresslog';
      return this.servicemeta.httpGet(url);
    }

    getActivitylog(taskUid)
    {
      const url = 'provider/task/' + taskUid + '/activity';
      return this.servicemeta.httpGet(url);
    }
    addStatus(taskUid,statusId){
      const url ='provider/task/'+taskUid+'/status/'+statusId
      return this.servicemeta.httpPut(url)
    }

    addLeadStatus(leadUid,statusId){
      const url ='provider/lead/'+leadUid+'/status/'+statusId
      return this.servicemeta.httpPut(url)
    }

    getTaskMasterList(){
      const url = 'provider/task/master';
      return this.servicemeta.httpGet(url);
    }

    getLeadMasterList(){
      const url = 'provider/lead/master?originFrom-eq=None&&isSubTask-eq=false';
      return this.servicemeta.httpGet(url);
    }
    createProviderCustomer(data) {
      const url = 'provider/customers';
      return this.servicemeta.httpPost(url, data);
    }
    getLeadTokens(leadUid){
      const url = 'provider/lead/' + leadUid + '/waitlist';
      return this.servicemeta.httpGet(url);
    }

    getProviderTerminologies(accountUniqueId) {
      const path = projectConstantsLocal.UIS3PATH + accountUniqueId + '/spTerminologies.json?t=' + new Date();
      console.log("Path:", path);
      return this.servicemeta.httpGet(path);
    }
    getSPTerminologies(accountUniqueId) {
      const _this = this;
      console.log("getSPTerminologies:", accountUniqueId);
      return new Promise(function (resolve, reject) {
          _this.getProviderTerminologies(accountUniqueId).subscribe(
              (terminologies: any) => {
                  resolve(terminologies);
              }, () => {
                  _this.getProviderTerminologies('default').subscribe(
                      (terminologies: any) => {
                          resolve(terminologies);
                      }, (error) => {
                          reject(error);
                      }
                  )
              }
          );
      })
  }
  getEnquiryCategoryList(){
    const url ='provider/enquire/category';
    return this.servicemeta.httpGet(url, null);
  }
  createEnquiry(data){
    return this.servicemeta.httpPost('provider/enquire', data);
  }
  getEnquiryTemplate(){
    const url ='provider/enquire/master';
    return this.servicemeta.httpGet(url, null);
  }
  getLeadTemplate(){
    const url ='provider/lead/master';
    return this.servicemeta.httpGet(url, null);
  }
  getFollowUPOne(filter = {}){
    const url ='provider/task/provider?originFrom-eq=Enquire&title-eq=Follow Up 1';
    return this.servicemeta.httpGet(url, null,filter);
  }
  getFollowUPTwo(filter = {}){
    const url ='provider/task/provider?originFrom-eq=Enquire&title-eq=Follow Up 2';
    return this.servicemeta.httpGet(url, null,filter);
  }
  // getTotalLeadCount(filter) {
  //   const url = 'provider/lead/count';
  //   return this.servicemeta.httpGet(url, null, filter);
  // }
  getTotalFollowUPOneCount(filter){
    const url = 'provider/task/provider/count?originFrom-eq=Enquire&title-eq=Follow Up 1';
      return this.servicemeta.httpGet(url, null, filter);
  }
  getTotalFollowUPTwoCount(filter){
    const url = 'provider/task/provider/count?originFrom-eq=Enquire&title-eq=Follow Up 2';
      return this.servicemeta.httpGet(url, null, filter);
  }
  getTotalEnquiryNone(filter = {}) {
    const url = 'provider/task/provider?isSubTask-eq=false&originFrom-eq=None'
    return this.servicemeta.httpGet(url, null, filter);
  }
  // updateTask(taskUid ,updateTaskData){
  //   console.log(updateTaskData)
  //   const url='provider/task/'+ taskUid
  //   return this.servicemeta.httpPut(url, updateTaskData);
  // }
  statusToPending(taskUid,data){
    console.log(data)
      const url='provider/task/'+ taskUid + '/status/pending'
      return this.servicemeta.httpPut(url, data);
  }
  statusToRejected(taskUid,data){
    console.log(data)
      const url='provider/task/'+ taskUid + '/status/rejected'
      return this.servicemeta.httpPut(url, data);
  }
  statusToProceed(taskUid){
    // console.log(data)
      const url='provider/task/'+ taskUid + '/status/closed'
      return this.servicemeta.httpPut(url);
  }
  getLeadQnrDetails(categoryId){
    const url = 'provider/questionnaire/lead/' + categoryId + '/WALKIN';
    return this.servicemeta.httpGet(url);
  }
  addkyc(data){
    return this.servicemeta.httpPost('provider/customers/KYC/create', data);
  }
  getkyc(id){
    const url = 'provider/customers/KYC/' + id;
    return this.servicemeta.httpGet(url);
  }
  crifVerification(data){
    return this.servicemeta.httpPost('provider/crif/processinquiry', data);
  }
}
