import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { ProfessionalCareComponent } from './professional.component';
import { ProfessionalcareRoutingModule } from './professional.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      BreadCrumbModule,
      ProfessionalcareRoutingModule
    ],
    declarations: [ProfessionalCareComponent],
    exports: [ProfessionalCareComponent],
    providers: []
})

export class ProfessionalcareModule {
}
