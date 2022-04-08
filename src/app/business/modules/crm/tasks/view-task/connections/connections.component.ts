import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  connected_with : any;
  @Input() taskid;
  constructor() { }

  ngOnInit(): void {

    

  let connections = [
    {
      taskId : 1,
      name : "Lead 1",
      created_at : "April 11"
    },
    {
      taskId : 2,
      name : "Lead 2",
      created_at : "April 12"
    },
    {
      taskId : 1,
      name : "Project Lead",
      created_at : "April 13"
    },
    {
      taskId : 1,
      name : "Lead 1",
      created_at : "April 11"
    },
    {
      taskId : 2,
      name : "Lead 2",
      created_at : "April 12"
    },
    {
      taskId : 1,
      name : "Project Lead",
      created_at : "April 13"
    }
  ]


this.connected_with = connections.filter((task: { taskId: number; }) => task.taskId === +this.taskid);
console.log("Connections : ",this.connected_with);



  }

}
