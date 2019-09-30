import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { HealthCareComponent } from './healthcare.component';
import { HealthcareRoutingModule } from './healthcare.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule,
      BreadCrumbModule,
      HealthcareRoutingModule
    ],
    declarations: [HealthCareComponent],
    exports: [HealthCareComponent],
    providers: []
})

export class HealthcareModule {
}
