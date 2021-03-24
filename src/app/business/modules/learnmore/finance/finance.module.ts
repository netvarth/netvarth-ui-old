import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { FinanceComponent } from './finance.component';
import { FinanceRoutingModule } from './finance.routing.module';
import { BreadCrumbModule } from '../../../../shared/modules/breadcrumb/breadcrumb.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
  imports: [
    SharedModule,
    BreadCrumbModule,
    FinanceRoutingModule
  ],
  declarations: [FinanceComponent],
  exports: [FinanceComponent],
  providers: []
})

export class FinanceModule {
}
