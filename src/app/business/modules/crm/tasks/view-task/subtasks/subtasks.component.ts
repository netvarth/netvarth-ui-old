import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
import { CrmSelectMemberComponent } from '../../../../../shared/crm-select-member/crm-select-member.component';
import { CrmService } from '../../../crm.service';

@Component({
  selector: 'app-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.css']
})
export class SubtasksComponent implements OnInit {
  @Input() taskid;
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
  subTaskList: any;
  taskDetails: any;
  subTaskDetails: any;
  constructor( 
    private router: Router,
    private crmService: CrmService,
    private dialog: MatDialog,



    ) { }
  ngOnInit(): void {

    this.crmService.getSubTaskDetails(this.taskid).subscribe(data => {
      this.taskDetails = data;
      let subTaskFilter = this.taskDetails.filter(data => data.parentTaskUid == this.taskid);
      this.subTaskDetails = subTaskFilter;
      console.log("Task Details : ",this.subTaskDetails);
  })

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


  createSubTask(taskid)
  {
    this.router.navigate(['provider', 'task','create-subtask',taskid]);
  }


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

  openEditTask(taskdata: any, editText: any) {
    this.crmService.taskToCraeteViaServiceData = taskdata
    const newTaskData = this.crmService.taskToCraeteViaServiceData
    setTimeout(() => {
      this.crmService.taskActivityName = editText;
      newTaskData;
      this.router.navigate(['provider', 'task', 'create-task']);
    }, projectConstants.TIMEOUT_DELAY);

  }

  viewTask(taskUid,taskData:any) {
    this.crmService.taskToCraeteViaServiceData = taskData;
    this.router.navigate(['/provider/viewtask/' + taskUid]);

  }
  


  
  
}
