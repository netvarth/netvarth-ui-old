import { Component, OnInit } from '@angular/core';
// import { projectConstants } from '../../../../../../../src/app/app.component';
import { Location } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import {  Router,ActivatedRoute } from '@angular/router';
import { CrmService } from '../../crm.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
    selector: 'app-tasktemplate',
    templateUrl: './tasktemplate.component.html',
    styleUrls: ['./tasktemplate.component.css']
  })
  export class TasktemplateComponent implements OnInit {
      public taskMasterList:any=[];
      public taskMasterListData:any;
      public newTask:any;
      public type:any;
      api_loading_Sel_Template:boolean;
      constructor(
        private locationobj: Location,
        private router: Router,
        private activated_route: ActivatedRoute,
         private crmService: CrmService,
         public fed_service: FormMessageDisplayService,
         private groupService:GroupStorageService
         ){

      }
    ngOnInit(): void {
        const user = this.groupService.getitemFromGroupStorage('ynw-user');
        console.log(user)
        this.activated_route.queryParams.subscribe(qparams => {
          console.log('qparams',qparams)
          if (qparams.type) {
              this.type = qparams.type;
          }
        });
        if(this.type==='activityCreateTemplate'){
          this.getTaskmaster()
        }
        else{
          this.router.navigate(['provider', 'settings']);
        }
    }
    redirecToHelp(){
    this.router.navigate(['provider', 'task']);
    }
    goback() {
        this.locationobj.back();
      }
      getTaskmaster(){
        this.api_loading_Sel_Template=true;
        this.crmService.getTaskMasterList().subscribe((response:any)=>{
          console.log('TaskMasterList :',response);
          this.api_loading_Sel_Template=false;
          this.taskMasterList.push(response)
          
        })
        
      }
      saveTaskMaster(taskMasterValue){
      if(taskMasterValue !==undefined){
        this.crmService.taskActivityName = 'Create';
        this.crmService.taskMasterToCreateServiceData= taskMasterValue;
        this.router.navigate(['provider', 'task', 'create-task'])
      }
      else{
        this.router.navigate(['provider', 'task'])
      }
      }
      createTask(createText: any){
        console.log('createText',createText)
        this.crmService.taskActivityName = createText;
        this.newTask= createText;
        if(createText !==undefined){
          this.router.navigate(['provider', 'task', 'create-task'])
        }
        else{
          this.router.navigate(['provider', 'task'])
        }
        
      }
  }