import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-actions',
  templateUrl: './service-actions.component.html',
  styleUrls: ['./service-actions.component.css','../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class ServiceActionsComponent implements OnInit {
  @Input() waitlist_data;
  @Input() bookingType;

  constructor() { }

  ngOnInit(): void {
  console.log(this.waitlist_data)
  console.log(this.bookingType)
  }

}
