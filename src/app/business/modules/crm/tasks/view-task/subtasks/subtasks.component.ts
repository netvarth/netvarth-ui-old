import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor( private router: Router ) { }
  ngOnInit(): void {

    let subtasks: any = [{
      "taskId": 1,
      "subtaskId": 1,
      "assignee" : "krishna",
      "subtaskName": 'Subtask 1',
      "duration": '9 days 2 hours',
      "status": 'Completed',
      "catogory": 'c1',
      "type": 'Type 1',
      "duedate": 'March 20, 2022'
    },
    {
      "taskId": 1,
      "subtaskId": 2,
      "assignee" : "mani",
      "subtaskName": 'Subtask 2',
      "duration": '10 Days 3 hours',
      "status": 'In Progress',
      "catogory": 'c2',
      "type": 'Type 1',
      "duedate": 'March 30, 2022'
    },
    {
      "taskId": 1,
      "subtaskId": 3,
      "assignee" : "aswin",
      "subtaskName": 'Subtask 3',
      "duration": '9 days 2 hours',
      "status": 'Completed',
      "catogory": 'c1',
      "type": 'Type 1',
      "duedate": 'March 20, 2022'
    },
    {
      "taskId": 1,
      "subtaskId": 4,
      "assignee" : "athira",
      "subtaskName": 'Subtask 4',
      "duration": '10 Days 3 hours',
      "status": 'In Progress',
      "catogory": 'c2',
      "type": 'Type 1',
      "duedate": 'March 30, 2022'
    }
  ];
    this.subTaskList = subtasks;
    console.log("Subtask List : ",this.subTaskList);
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


  createSubTask()
  {
    this.router.navigate(['provider', 'task','create-task'])
  }
  
}
