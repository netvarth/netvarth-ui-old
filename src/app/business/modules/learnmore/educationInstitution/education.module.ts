import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { EducationComponent } from './education.component';
import { EducationRoutingModule } from './education.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      BreadCrumbModule,
      EducationRoutingModule
    ],
    declarations: [EducationComponent],
    exports: [EducationComponent],
    providers: []
})

export class EducationModule {
}
