import { Component, Input, OnInit } from '@angular/core';
import { projectConstantsLocal } from '../../../../../../../../src/app/shared/constants/project-constants';
import { CrmService } from '../../../crm.service';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrls: ['./activitylog.component.css']
})
export class ActivitylogComponent implements OnInit {
  @Input() taskid;
  @Input() action;
  @Input() taskType;
  activityList:any=[];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  public activityType:any;
  constructor( 

    private crmService: CrmService,


    ) { }
    ngOnChanges(){
      console.log('this.action',this.action)
      if(this.action){
        this.getActivitylog();
      }
    }
  ngOnInit(): void {
    console.log('this.action',this.action)
    console.log('this.taskType',this.taskType)
    if(this.taskType != 'SubTask'){
      this.activityType='Activity'
    }
    else{
      this.activityType='SubActivity'
    }
    this.getActivitylog();

  }
  getActivitylog(){
    this.crmService.getActivitylog(this.taskid).subscribe(data => {
      this.activityList = data;
      console.log('activityList',this.activityList)
  })
  }

}

