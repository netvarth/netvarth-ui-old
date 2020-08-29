import { Component, OnInit } from "@angular/core";
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-licenseusage',
templateUrl: './licenseusage.component.html'
})
export class licenseusageComponent implements OnInit{
    breadcrumb_moreoptions: any = [];

    breadcrumbs = [
      {
        title: 'License & Invoice',
        url: '/provider/license'
      },
      {
        title: 'License Usage'
      }
    ];
    constructor(
       public provider_services: ProviderServices,
       private routerobj: Router
      ) { }
    metric: any;
    metrics: any;
    metrices: any;
    ngOnInit() {
        this.provider_services.getLicenseUsage().subscribe (
            data=> {
              this.metric=data ;
              for(let i in this.metric)
              {
                if(i=== 'metricUsageInfo')
                {
                this.metrics=this.metric[i];
                }
                else if(i=== 'BooleanMetricUsageInfo')
                {
                  this.metrices=this.metric[i];
                }
              }  
          });
    }
     redirecToLicenseInvoice() {
        this.routerobj.navigate(['provider', 'license']);
    }
  }


