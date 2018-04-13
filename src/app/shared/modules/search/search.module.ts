import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';

import { SearchDataStorageService  } from '../../services/search-datastorage.services';

import { SearchComponent } from './search.component';
// import { HttpCommonService } from '../../services/http-common.service';
@NgModule({
    imports: [
      SharedModule
    ],
    declarations: [SearchComponent],
    exports: [SearchComponent],
    providers: [SearchDataStorageService]
})

export class SearchModule {
}
