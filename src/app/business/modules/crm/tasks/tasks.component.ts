import { Component, OnInit } from '@angular/core';
import { CrmService } from '../crm.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor(private crmService: CrmService) { }

  ngOnInit(): void {
    this.crmService.getTasks().subscribe(
      (tasks: any) => {
        
      }
    )
  }

}
