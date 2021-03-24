import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { ProfessionalCareComponent } from './professional.component';
import { ProfessionalcareRoutingModule } from './professional.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      BreadCrumbModule,
      ProfessionalcareRoutingModule
    ],
    declarations: [ProfessionalCareComponent],
    exports: [ProfessionalCareComponent],
    providers: []
})

export class ProfessionalcareModule {
}
