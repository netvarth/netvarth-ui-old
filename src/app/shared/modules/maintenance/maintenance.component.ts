import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
// import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html'
})

export class MaintenanceComponent implements OnInit {
  loading = false;
  constructor(
    public shared_services: SharedServices,
    // private router: Router,
    private lStorageService: LocalStorageService
  ) { }
  ngOnInit() {
    console.log('maintainance');
  }
  goHome() {
    this.loading = true;
    this.shared_services.getSystemDate().subscribe(
      ()=>{
        this.loading = false;
        this.lStorageService.setitemonLocalStorage('maintainance',true);
        // this.router.navigate(['/']).then(
        //   ()=> {
            if (this.lStorageService.getitemfromLocalStorage('customId')) {
              if(this.lStorageService.getitemfromLocalStorage('reqFrom')==='cuA') {
                window.location.href = 'customapp/' + this.lStorageService.getitemfromLocalStorage('customId') + '?at=' +  this.lStorageService.getitemfromLocalStorage('authToken');
              } else {
                window.location.href = this.lStorageService.getitemfromLocalStorage('customId');
              }
            } else {
              window.location.href = '';
            }
          }, (error)=> {
            this.loading = false;
          }
        // );
      // }
    )
  }
}
