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
  activityList:any=[];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  constructor( 

    private crmService: CrmService,


    ) { }
    ngOnChanges(){
      if(this.action){
        this.getActivitylog();
      }
    }
  ngOnInit(): void {
    this.getActivitylog();

  }
  getActivitylog(){
    this.crmService.getActivitylog(this.taskid).subscribe(data => {
      this.activityList = data;
      console.log('activityList',this.activityList)
  })
  }

}

