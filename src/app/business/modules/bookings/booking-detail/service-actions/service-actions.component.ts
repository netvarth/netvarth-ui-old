import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-actions',
  templateUrl: './service-actions.component.html',
  styleUrls: ['./service-actions.component.css']
})
export class ServiceActionsComponent implements OnInit {
  @Input() waitlist_data;

  constructor() { }

  ngOnInit(): void {
  console.log(this.waitlist_data)
  }

}
