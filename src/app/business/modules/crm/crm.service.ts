import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  constructor(
    private servicemeta: ServiceMeta
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
    getTotalTask() {
      const url = 'provider/task/provider';
      return this.servicemeta.httpGet(url);
    }
    getInprogressTask() {
      const url = 'provider/task/provider?status-eq=3';
      return this.servicemeta.httpGet(url);
    }
    getCompletedTask() {
      const url = 'provider/task/provider?status-eq=5';
      return this.servicemeta.httpGet(url);
    }
    getDelayedTask() {
      const url = 'provider/task/provider?status-eq=4';
      return this.servicemeta.httpGet(url);
    }
    // https://scale.jaldee.com/v1/rest/provider/login

}
