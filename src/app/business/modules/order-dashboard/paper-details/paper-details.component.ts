import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProviderServices } from '../../../../../../src/app/business/services/provider-services.service';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';


@Component({
  selector: 'app-paper-details',
  templateUrl: './paper-details.component.html',
  styleUrls: ['./paper-details.component.css']
})
export class PaperDetailsComponent implements OnInit {
  @Input() orders;
  @Input() loading;
  @Output() actionPerformed = new EventEmitter<any>();
  selectedOrders: any;
  orderSelected: any[];
  providerLabels: any[];
  allLabels: any;
  users: any;
  selectedUser: any;
  constructor(
    private provider_services: ProviderServices,
    public router: Router,
    private groupService: GroupStorageService,

  ) { }

  ngOnInit(): void {
    this.getProviders();
  }

  stopprop(event) {
    event.stopPropagation();
  }


  showActionPopup(order, timetype) {
    this.actionPerformed.emit({
      selectedOrder: order,
      type: timetype
    })
  }
  getProviders() {
    const apiFilter = {};
    this.provider_services.getUsers(apiFilter).subscribe(data => {
      this.users = data;
      console.log("this.users", this.users);
      if (this.groupService.getitemFromGroupStorage('appt-selectedUser')) {
        this.selectedUser = this.groupService.getitemFromGroupStorage('appt-selectedUser');
        console.log("If selected user", this.selectedUser)
      } else {
        if (this.users && this.users[0]) {
          this.selectedUser = this.users[0];
          console.log("else selected user", this.selectedUser)
        }
        else {
          this.selectedUser = false;
          console.log("else else selected user", this.selectedUser)
        }
      }
    });
  }

  gotoDetails(order) {
    this.router.navigate(['provider', 'orders', order.uid]);
  }

}
