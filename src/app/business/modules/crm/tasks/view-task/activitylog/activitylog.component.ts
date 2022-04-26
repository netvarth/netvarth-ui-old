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
  activityList:any=[];
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  constructor( 

    private crmService: CrmService,


    ) { }
  ngOnInit(): void {
    this.crmService.getActivitylog(this.taskid).subscribe(data => {
      this.activityList = data;
      console.log('activityList',this.activityList)
  })

  }
  


}
