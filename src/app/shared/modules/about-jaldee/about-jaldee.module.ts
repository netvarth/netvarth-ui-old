import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { AboutJaldeeComponent } from './about-jaldee.component';
import { AboutJaldeeRoutingModule } from './about-jaldee.routing.module';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule,
      HeaderModule,
      AboutJaldeeRoutingModule
    ],
    declarations: [AboutJaldeeComponent],
    exports: [AboutJaldeeComponent],
    providers: []
})

export class AboutJaldeeModule {
}
