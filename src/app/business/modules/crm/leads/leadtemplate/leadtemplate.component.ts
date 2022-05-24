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
    selector: 'app-leadtemplate',
    templateUrl: './leadtemplate.component.html',
    styleUrls: ['./leadtemplate.component.css']
  })
  export class LeadtemplateComponent implements OnInit {
    public leadMasterList:any=[];
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
          if(this.type==='leadCreateTemplate'){
            this.getLeadmaster()
          }
          else{
            this.router.navigate(['provider', 'settings']);
          }
      }
      redirecToHelp(){
        this.router.navigate(['provider', 'lead']);
        }
        goback() {
            this.locationobj.back();
        }
        getLeadmaster(){
            this.crmService.getLeadMasterList().subscribe((response)=>{
              console.log('LeadMasterList :',response);
              this.leadMasterList.push(response)
            })
          }
        saveLeadMaster(leadMasterValue){
            console.log('leadmastervalue',leadMasterValue)
            // console.log('leadMasterValue',leadMasterValue)
            // this.router.navigate(['provider', 'lead', 'create-lead'])
          if(leadMasterValue !==undefined){
            this.crmService.leadActivityName = 'Create';
            this.crmService.leadMasterToCreateServiceData=leadMasterValue
            this.router.navigate(['provider', 'lead', 'create-lead'])
            // this.router.navigate(['provider', 'lead', 'create-lead'])
          }
          else{
            this.router.navigate(['provider', 'lead'])
          }
          }
          createLead(createText: any){
            console.log('createText',createText)
            this.crmService.leadActivityName = createText;
            this.newTask= createText;
            if(createText !==undefined){
                this.router.navigate(['provider', 'lead', 'create-lead'])
            }
            else{
              this.router.navigate(['provider', 'lead'])
            }
            
          }
}