import { Component, OnInit } from '@angular/core';
// import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
// import { projectConstants } from '../../../../../../../src/app/app.component';
// import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import {  Router,ActivatedRoute } from '@angular/router';
import { CrmService } from '../../crm.service';
// import { FormBuilder,Validators } from '@angular/forms';
// import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
// import * as moment from 'moment';
// import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
// import { MatDialog } from '@angular/material/dialog';
// import { SnackbarService } from '../../../../../shared/services/snackbar.service';
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
      constructor(private locationobj: Location,
        // private lStorageService: LocalStorageService,
        private router: Router,
        private activated_route: ActivatedRoute,
         private crmService: CrmService,
         public fed_service: FormMessageDisplayService,
        //  private createTaskFB: FormBuilder,
        //  private dialog: MatDialog, 
        //  private snackbarService: SnackbarService,
        //  private datePipe:DatePipe,
        //  private _Activatedroute:ActivatedRoute,
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
        // this.getTaskmaster()
    }
    redirecToHelp(){
    this.router.navigate(['provider', 'task']);
    }
    goback() {
        this.locationobj.back();
      }
      getTaskmaster(){
        this.crmService.getTaskMasterList().subscribe((response:any)=>{
          console.log('TaskMasterList :',response);
          this.taskMasterList.push(response)
          
        })
        
      }
      saveTaskMaster(taskMasterValue){
        // console.log('taskmastervalue',taskMasterValue)
        // console.log('taskMasterValue',taskMasterValue)
      if(taskMasterValue !==undefined){
        this.crmService.taskActivityName = 'Create';
        this.crmService.taskMasterToCreateServiceData= taskMasterValue;
        // console.log('l.....................')
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