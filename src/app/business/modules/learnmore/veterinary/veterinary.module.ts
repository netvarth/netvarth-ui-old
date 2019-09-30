import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { VeterinaryComponent } from './veterinary.component';
import { VeterinaryRoutingModule } from './veterinary.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [ 
      SharedModule,
      HeaderModule,
      VeterinaryRoutingModule
    ],
    declarations: [VeterinaryComponent],
    exports: [VeterinaryComponent],
    providers: []
})

export class VeterinaryModule {
}
