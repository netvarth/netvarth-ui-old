import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-actions',
  templateUrl: './service-actions.component.html',
  styleUrls: ['./service-actions.component.css','../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class ServiceActionsComponent implements OnInit {
  @Input() waitlist_data;
  bookingType;
  constructor(
    private activated_route: ActivatedRoute

  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
    });
   }

  ngOnInit(): void {
  console.log(this.waitlist_data)
  console.log(this.bookingType)
  }

}
