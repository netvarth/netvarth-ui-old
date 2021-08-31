import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
import { SportsComponent } from './sports.component';
import { SportsRoutingModule } from './sports.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      BreadCrumbModule,
      SportsRoutingModule
    ],
    declarations: [SportsComponent],
    exports: [SportsComponent],
    providers: []
})

export class SportsModule {
}
