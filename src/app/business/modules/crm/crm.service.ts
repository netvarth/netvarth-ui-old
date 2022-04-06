import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  public memberList:any=[
    {
      "assignId":1,
      "assignMemberName":'Adhil',
      "assignMemberContactNo":'5550007890',
      "assignMemberLocation":'Location 1'
    },
    {
      "assignId":2,
      "assignMemberName":'Jhony',
      "assignMemberContactNo":'5550007890',
      "assignMemberLocation":'Location 2'
    },
    {
      "assignId":3,
      "assignMemberName":'Angela',
      "assignMemberContactNo":'5550007890',
      "assignMemberLocation":'Location 3'
    },
    {
      "assignId":4,
      "assignMemberName":'Adam',
      "assignMemberContactNo":'5550007890',
      "assignMemberLocation":'Location 4'
    }
  ]

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

    // getMemberList():Observable <any>{
    //     let inputStr:any =[
    //       {
    //         "assignId":1,
    //         "assignMemberName":'Adhil',
    //         "assignMemberContactNo":'5550007890',
    //         "assignMemberLocation":'Location 1'
    //       },
    //       {
    //         "assignId":2,
    //         "assignMemberName":'Jhony',
    //         "assignMemberContactNo":'5550007890',
    //         "assignMemberLocation":'Location 2'
    //       },
    //       {
    //         "assignId":3,
    //         "assignMemberName":'Angela',
    //         "assignMemberContactNo":'5550007890',
    //         "assignMemberLocation":'Location 3'
    //       },
    //       {
    //         "assignId":4,
    //         "assignMemberName":'Adam',
    //         "assignMemberContactNo":'5550007890',
    //         "assignMemberLocation":'Location 4'
    //       }
    //     ]
    //     console.log(inputStr)
    //     return inputStr.asObservable()
    //   }

    getMemberList(){
     return  this.memberList
    }

}
