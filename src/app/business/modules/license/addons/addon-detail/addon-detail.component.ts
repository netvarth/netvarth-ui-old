import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-addon-detail',
  templateUrl: './addon-detail.component.html',
  styleUrls: ['./addon-detail.component.css']
})
export class AddonDetailComponent implements OnInit {
  disp_name: any;
  adon_metric: any;
  adon_list: any;
  screenWidth: number;
  no_of_grids: number;
  final_list: any;

  constructor(
    private activaterouterobj: ActivatedRoute,
    private provider_servicesobj: ProviderServices,
    private routerobj: Router,
    private sharedfunctionObj: SharedFunctions
  ) {
    this.activaterouterobj.queryParams.subscribe(qparams => {
      this.disp_name = qparams.disp_name;
     });
    this.onResize();
   }
   @HostListener('window:resize', ['$event'])
   onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
       divider = divident / 6;
    } else if (this.screenWidth > 500 && this.screenWidth < 1000) {
      divider = divident / 4;
    } else if (this.screenWidth > 375 && this.screenWidth < 500) {
      divider = divident / 3;
    } else if (this.screenWidth < 375) {
      divider = divident / 2;
    }
    this.no_of_grids = Math.round(divident / divider);
   }

  ngOnInit() {
    this.getUpgradableaddonPackages();
  }
  getUpgradableaddonPackages() {
    this.provider_servicesobj.getUpgradableAddonPackages()
      .subscribe((data: any) => {
        this.adon_list = [];
        this.adon_metric = data;
        this.adon_list = this.adon_metric.filter(sch => sch.metricDisplayName === this.disp_name);
        console.log(this.adon_list);
        this.final_list = this.adon_list[0].addons;
        console.log(this.final_list);
      });
  }
  redirecToAddon() {
    this.routerobj.navigate(['provider', 'license', 'addons']);
}
  addAdon(id) {
    this.provider_servicesobj.addAddonPackage(id)
        .subscribe((data) => {
          if (data) {
            this.sharedfunctionObj.openSnackBar('Addon added');
            this.getUpgradableaddonPackages();
            this.routerobj.navigate(['provider', 'license']);
          }
        },
          error => {
            // this.api_error = this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
  }

}
