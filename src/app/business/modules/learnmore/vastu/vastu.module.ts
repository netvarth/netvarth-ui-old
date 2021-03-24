import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { VastuComponent } from './vastu.component';
import { VastuRoutingModule } from './vastu.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      BreadCrumbModule,
      VastuRoutingModule
    ],
    declarations: [VastuComponent],
    exports: [VastuComponent],
    providers: []
})

export class VastuModule {
}
