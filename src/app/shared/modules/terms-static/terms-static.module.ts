import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { HeaderModule } from '../../../shared/modules/header/header.module';

// import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { TermsStaticComponent } from './terms-static.component';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule,
      HeaderModule
    ],
    declarations: [TermsStaticComponent],
    exports: [TermsStaticComponent],
    providers: []
})

export class TermsStaticModule {
}
