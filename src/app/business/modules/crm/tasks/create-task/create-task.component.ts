import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../src/app/shared/constants/project-constants';
import { projectConstants } from '../../../../../../../src/app/app.component';
import { Messages } from '../../../../../../../src/app/shared/constants/project-messages';
import { Location } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
// import { LocalStorageService } from '../../../../../../../src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { CrmService } from '../../crm.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import * as moment from 'moment';
import  {CrmSelectMemberComponent} from '../../../../shared/crm-select-member/crm-select-member.component'
// import { Inject, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
// import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  tooltipcls = '';
  select_cap = Messages.SELECT_CAP;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  perPage = projectConstants.PERPAGING_LIMIT;
  apiloading = true;
  availableDates: any = [];
  minDate;
  maxDate;
  ddate;
  api_loading = false;

  //form variable start
  createTaskForm:any;
  taskError:null;
  selectMember:string='Select Member'
  categoryList:any=[
    {
      "id":1,
      "category": 'category 1'
    },
    {
      "id":2,
      "category": 'category 2'
    },
    {
      "id":3,
      "category": 'category 3'
    },
    {
      "id":4,
      "category": 'category 4'
    }

  ]
  public categoryListData:any=[]


  constructor(private locationobj: Location,
    // private lStorageService: LocalStorageService,
    private router: Router,
     private crmService: CrmService,
     public fed_service: FormMessageDisplayService,
     private createTaskFB: FormBuilder,
     private dialog: MatDialog,) { 
      this.router.navigate(['provider', 'task','create-task'])
     }

  ngOnInit(): void {
    console.log('jjjjj',this.crmService.getMemberList())
    const memberList = this.crmService.getMemberList()
    this.categoryListData.push(memberList)
    console.log('memberList',memberList)

    this.createTaskForm=this.createTaskFB.group({
      taskTitle:[null,[Validators.required]],
      taskDescription:[null,[Validators.required]],
      taskManager:[null],
      taskCategory:[null],
      userTaskType:[null],
      taskLocation:[null],
      taskStatus:[null],
      taskDate:[null],
      taskTime:[null],
      userTaskPriority:[null]


    }) 
  }

  goback() {
    this.locationobj.back();
  }
  resetErrors(){
    this.taskError = null;

  }
  taskTitle(event){
    // console.log(event)

  }
  hamdleTaskTitle(taskTitleValue){
    console.log('taskTitleValue',taskTitleValue)
    this.taskError=null

  }
  handleTaskDescription(textareaValue) {
    console.log(textareaValue)
    this.taskError=null
  }
  autoGrowTextZone(e) {
    console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  selectMemberDialog(handleselectMember:any){
    console.log(handleselectMember)
    const dialogRef  = this.dialog.open(CrmSelectMemberComponent, {
      width: '100%',
      // panelClass: ['popup-class', 'confirmationmainclass'],
      data:{
        requestType:'createtask',
        header:'Assign Member',
        memberList: this.categoryListData,
        assignMembername:this.selectMember
      }
  })
  dialogRef.afterClosed().subscribe((res:any)=>{
    console.log('create',res)
    this.selectMember = res.assignMemberName
  })
  }
  hamdleTaskManager(taskManger){
    console.log(taskManger)
  }
  handleTaskCategorySelection(taskCategory){
    console.log(taskCategory)

  }
  handleTaskLocation(taskLocation){
    console.log(taskLocation)

  }
  handleTaskStatus(taskStatus){
    console.log(taskStatus)

  }
  dateClass(date: Date): MatCalendarCellCssClasses {
    return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
  }
  handleDateChange(e){
    console.log(e)
  }
  showCreateTaskButtonCaption() {
    let caption = '';
    caption = 'Confirm';
    return caption;
}
  saveCreateTask(){
    // if(this.createTaskForm.controls.taskTitle.value=='' ){
    //   this.taskError==='Please give task title'
    // }
    // else if(this.createTaskForm.controls.taskDescription.value==''){
    //   this.taskError==='Please give task description'
    // }
    // else{
    //   this.createTaskForm.reset(this.createTaskForm.value);
    // }

  }
   onSubmitCraeteTaskForm(){
    console.log('taskTitle',this.createTaskForm.controls.taskTitle.value)
    console.log('taskDescription',this.createTaskForm.controls.taskDescription.value);
    console.log('taskManager',this.createTaskForm.controls.taskManager.value)
  }

}
