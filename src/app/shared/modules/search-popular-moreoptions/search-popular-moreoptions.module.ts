import { NgModule } from '@angular/core';
import { SharedModule } from '../common/shared.module';
import { SearchPopularMoreOptionsComponent } from './search-popular-moreoptions.component';
@NgModule({
    imports: [
      SharedModule
    ],
    declarations: [SearchPopularMoreOptionsComponent],
    exports: [SearchPopularMoreOptionsComponent]
})
export class SearchPopularMoreoptionsModule {
}
