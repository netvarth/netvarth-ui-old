import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { Location } from '@angular/common';

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
  adwords_exceed = Messages.ADWORD_EXCEED_LIMIT;

  constructor(
    private activaterouterobj: ActivatedRoute,
    private provider_servicesobj: ProviderServices,
    // private routerobj: Router,
    private sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog,
    private location: Location,
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
    if (this.screenWidth > 1700) {
      divider = divident / 5;
    } else if (this.screenWidth > 1111 && this.screenWidth < 1700) {
       divider = divident / 4;
    } else if (this.screenWidth > 900 && this.screenWidth < 1111) {
      divider = divident / 3;
    } else if (this.screenWidth > 375 && this.screenWidth < 900) {
      divider = divident / 2;
    } else if (this.screenWidth < 375) {
      divider = divident / 1;
    }
    console.log(divident);
    console.log(divider);
    this.no_of_grids = Math.round(divident / divider);
    console.log(this.no_of_grids);
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
        if (this.adon_list.length > 0) {
          this.final_list = this.adon_list[0].addons;
          console.log(this.final_list);
        }
      });
  }
  redirecToAddon() {
   // this.routerobj.navigate(['provider', 'license', 'addons']);
   this.location.back();
  }
  addAdon(id) {
    this.provider_servicesobj.addAddonPackage(id)
        .subscribe((data) => {
          if (data) {
            this.sharedfunctionObj.openSnackBar('Addon added');
            this.getUpgradableaddonPackages();
            // this.routerobj.navigate(['provider', 'license']);
            setTimeout(() => {
              this.location.back();
            }, 2000);
          }
        },
          error => {
            // this.api_error = this.sharedfunctionObj.apiErrorAutoHide(this, error);
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
  }

  askConfirm(id) {
    console.log(id);
    const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Are you sure to add this Add-on?'
      }
    });
    dialogrefd.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 1) {
        this.addAdon(id);
      }
    });
  }

}
