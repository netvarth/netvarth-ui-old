import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html'
})
export class MaintenanceComponent implements OnInit {

  kwdet: any = [];
  api_error = null;
  domain;
showheaderandfooter = false;
  constructor(
    private activaterouterobj: ActivatedRoute,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions
  ) { }
  ngOnInit() {
    this.activaterouterobj.paramMap
      .subscribe(params => {
          this.showheaderandfooter = true;
      });
  }
}
