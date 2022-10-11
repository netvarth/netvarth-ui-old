import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
// import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html'
})

export class MaintenanceComponent implements OnInit {
  loading = false;
  constructor(
    public shared_services: SharedServices,
    private router: Router,
    private lStorageService: LocalStorageService
  ) { }
  ngOnInit() {
    console.log('maintainance');
  }
  goHome() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 500);
    this.shared_services.getSystemDate().subscribe(
      ()=>{
        this.lStorageService.setitemonLocalStorage('maintainance',true);
        // this.router.navigate(['/']).then(
        //   ()=> {
            if (this.lStorageService.getitemfromLocalStorage('customId')) {
              if(this.lStorageService.getitemfromLocalStorage('reqFrom')==='cuA') {
                this.router.navigate(['customapp'],this.lStorageService.getitemfromLocalStorage('customId'));
              } else if (this.lStorageService.getitemfromLocalStorage('reqFrom')==='CUSTOM_WEBSITE'){
                let source = this.lStorageService.getitemfromLocalStorage('source');
                this.lStorageService.removeitemfromLocalStorage('reqFrom');
                this.lStorageService.removeitemfromLocalStorage('source');
                window.location.href = source;
              } else {
                window.location.href = this.lStorageService.getitemfromLocalStorage('customId');
              }
            } else {
              window.location.href = '';
            }
          }, (error)=> {
            console.log("Error:",error);
          }
        // );
      // }
    )

  }
}
