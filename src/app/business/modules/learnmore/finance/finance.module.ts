import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { FinanceComponent } from './finance.component';
import { FinanceRoutingModule } from './finance.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
  imports: [
    SharedModule,
    HeaderModule,
    FinanceRoutingModule
  ],
  declarations: [FinanceComponent],
  exports: [FinanceComponent],
  providers: []
})

export class FinanceModule {
}
