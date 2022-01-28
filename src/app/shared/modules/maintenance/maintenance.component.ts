import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { ActivatedRoute, Router } from '@angular/router';
// import { projectConstants } from '../../../app.component';
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
    private router: Router,
  ) { }
  ngOnInit() {
    console.log('maintaince')
    this.activaterouterobj.paramMap
      .subscribe(params => {
        console.log(params)
        this.showheaderandfooter = true;
      });
  }
  goHome() {

    this.shared_services.getSystemDate().subscribe(
      ()=>{
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    )
  }
}
