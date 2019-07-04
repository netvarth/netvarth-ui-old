import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { SearchModule } from '../search/search.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';

// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './header.component';
import { OwlModule } from 'ngx-owl-carousel';
import { SearchPopularMoreoptionsModule } from '../search-popular-moreoptions/search-popular-moreoptions.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { LearnmoreModule } from '../learnmore/learnmore.module';

@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        SearchModule,
        LearnmoreModule,
        OwlModule,
        SearchPopularMoreoptionsModule,
        LoadingSpinnerModule
       // MatMenuModule,
      //  MatIconModule
    ],
    declarations: [HeaderComponent],
    exports: [HeaderComponent]
})
export class HeaderModule {
}
