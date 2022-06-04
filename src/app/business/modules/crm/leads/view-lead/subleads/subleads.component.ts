


import { Component,Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CrmService } from '../../../crm.service';
import { projectConstants } from '../../../../../../app.component';
import { projectConstantsLocal } from '../../../../../../../../src/app/shared/constants/project-constants';
import { CrmSelectMemberComponent } from '../../../../../shared/crm-select-member/crm-select-member.component';


@Component({
  selector: 'app-subleads',
  templateUrl: './subleads.component.html',
  styleUrls: ['./subleads.component.css']
})
export class SubleadsComponent implements OnInit {
  @Input() leadid;
  leadDetails:any;
  subLeadDetails:any;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  totalCnt: any;
  perPage: any;
  endminday: any;
  auditStartdate: any;
  auditStatus: number;
  ackStatus: boolean;
  auditSelAck: any;
  notAckStatus: boolean;
  startpageval: number;
  holdauditSelAck: any;
  holdauditStartdate: any;
  holdauditEnddate: any;
  auditEnddate: any;
  filterapplied: boolean;

  constructor(
    private router: Router,
    private crmService: CrmService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // this.crmService.getSubLeadDetails(this.leadid).subscribe(data => {
    //   this.leadDetails = data;
    //   console.log("Lead Details... : ",this.subLeadDetails);
     
    //  this.leadDetails = this.leadDetails.filter(obj => obj.originId === 0);
     // let subTaskFilter = this.leadDetails.filter(data => data.originUid == this.leadid);
    //  this.leadDetails.map((element)=>{
    //   // console.log("Map Element :",element);
    //    if(element.originId === 0){
    //      this.subLeadDetails.push(element)
    //      console.log("Map called :",this.subLeadDetails)
    //    }
    //  })
     //= subTaskFilter;
     // this.subLeadDetails 
     // console.log("Lead Details22... : ",this.subLeadDetails);
  //})
  }

  createSubLead()
  {
    this.router.navigate(['provider', 'Ttask','create-task']);
  }


  gettotalCnt() {
    return this.totalCnt;
  }

  getperPage() {
    return this.perPage;
  }

  do_search(pagecall, status?) {
    this.endminday = this.auditStartdate;
    this.auditStatus = 1;
    if (status === 'ackStatus') {
      if (this.ackStatus === true) {
        if (this.auditSelAck.indexOf('true') === -1) {
          this.auditSelAck.push('true');
        }
      } else {
        this.auditSelAck.splice(this.auditSelAck.indexOf('true'), 1);
      }
    }
    if (status === 'notAckStatus') {
      if (this.notAckStatus === true) {
        if (this.auditSelAck.indexOf('false') === -1) {
          this.auditSelAck.push('false');
        }
      } else {
        this.auditSelAck.splice(this.auditSelAck.indexOf('false'), 1);
      }
    }
    if (pagecall === false) {
      this.startpageval = 1;
      this.holdauditSelAck = this.auditSelAck.join(',');
      this.holdauditStartdate = this.auditStartdate;
      this.holdauditEnddate = this.auditEnddate;
    }
    let startseldate = '';
    let endseldate = '';


    if (endseldate !== '' || startseldate !== '' || this.notAckStatus || this.ackStatus) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }


  handle_pageclick(pg) {
    this.startpageval = pg;
    this.do_search(true);
  }


  // createSubTask(taskid)
  // {
  //   this.router.navigate(['provider', 'task','create-subtask',taskid]);
  // }


  stopprop(event) {
    event.stopPropagation();
  }

  openTaskCompletion(taskData:any){
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'taskComplete',
        taskName:taskData,
      }
    });
    dialogRef.afterClosed().subscribe((res)=>{
      console.log(res)
    })
  
  }

  openEditTask(subtaskdata: any, editText: any) {
    this.crmService.taskToCraeteViaServiceData = subtaskdata
    const newTaskData = this.crmService.taskToCraeteViaServiceData
    setTimeout(() => {
      this.crmService.taskActivityName = editText;
      newTaskData;
      this.router.navigate(['provider', 'task', 'create-task']);
    }, projectConstants.TIMEOUT_DELAY);

  }

  viewTask(taskUid,taskData:any) {
    this.crmService.taskToCraeteViaServiceData = taskData;
    this.router.navigate(['/provider/viewsubtask/' + taskUid]);

  }
  
  openDialogStatusChange(taskData:any){
    console.log('openDialogStatusChange',taskData)
    const dialogRef= this.dialog.open(CrmSelectMemberComponent,{
      width:'100%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data:{
        requestType:'statusChange',
        taskDetails:taskData,
      }
    });
    dialogRef.afterClosed().subscribe((res:any)=>{
      console.log('resssssssss',res);
    })
  }

  


}

