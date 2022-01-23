// import { Component, OnInit } from '@angular/core';
// import { SharedServices } from '../../services/shared-services';
// import { SharedFunctions } from '../../functions/shared-functions';
// import { ActivatedRoute } from '@angular/router';
// @Component({
//   selector: 'app-maintenance',
//   templateUrl: './maintenance.component.html'
// })
// export class MaintenanceComponent implements OnInit {

//   kwdet: any = [];
//   api_error = null;
//   domain;
// showheaderandfooter = false;
//   constructor(
//     private activaterouterobj: ActivatedRoute,
//     public shared_services: SharedServices,
//     public shared_functions: SharedFunctions
//   ) { }
//   ngOnInit() {
//     this.activaterouterobj.paramMap
//       .subscribe(params => {
//           this.showheaderandfooter = true;
//       });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
    public location: Location,
    private router: Router,
    public shared_functions: SharedFunctions) { }
  ngOnInit() {
    console.log('maintaince')
    this.activaterouterobj.paramMap
      .subscribe(params => {
        console.log(params)
        this.showheaderandfooter = true;
      });
  }
  goHome() {
    this.router.navigate(['/home']);
    // this.location.back();
    // window.location.reload();
  }
}
