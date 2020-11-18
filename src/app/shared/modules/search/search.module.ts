import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { SearchMoreoptionsModule } from '../../../shared/modules/search-moreoptions/search-moreoptions.module';
import { SearchDataStorageService  } from '../../services/search-datastorage.services';
import { SearchComponent } from './search.component';
import { SearchPopularMoreoptionsModule } from '../../../shared/modules/search-popular-moreoptions/search-popular-moreoptions.module';
import { OwlModule } from 'ngx-owl-carousel';
@NgModule({
    imports: [
      SharedModule,
      SearchMoreoptionsModule,
      SearchPopularMoreoptionsModule,
      OwlModule
    ],
    declarations: [SearchComponent],
    exports: [SearchComponent],
    providers: [SearchDataStorageService]
})

export class SearchModule {
}
