import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { FoodJointComponent } from './foodjoints.component';
import { FoodjointsRoutingModule } from './foodjoints.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      BreadCrumbModule,
      FoodjointsRoutingModule
    ],
    declarations: [FoodJointComponent],
    exports: [FoodJointComponent],
    providers: []
})

export class FoodjointsModule {
}
