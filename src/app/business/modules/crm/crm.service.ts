import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CrmService {

  constructor(
    // private servicemeta: ServiceMeta
    ) { }

     getTasks() : Observable <any> {
       let taskList: any = {
         "taskId": 1,
         "taskName": 'Task 1'
       };
       console.log(taskList)
       return taskList.asObservable();
    }


}
