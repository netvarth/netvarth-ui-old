import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { ReligiousComponent } from './religious.component';
import { ReligiousRoutingModule } from './religious.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      ReligiousRoutingModule
    ],
    declarations: [ReligiousComponent],
    exports: [ReligiousComponent],
    providers: []
})

export class ReligiousModule {
}
