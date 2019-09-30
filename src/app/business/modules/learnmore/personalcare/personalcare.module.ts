import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { PersonalCareComponent } from './personalcare.component';
import { PersonalcareRoutingModule } from './personalcare.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      PersonalcareRoutingModule
    ],
    declarations: [PersonalCareComponent],
    exports: [PersonalCareComponent],
    providers: []
})

export class PersonalcareModule {
}
