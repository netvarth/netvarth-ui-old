import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { SearchModule } from '../search/search.module';
import { LearnmoreModule } from '../learnmore/learnmore.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';

// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './header.component';

@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        SearchModule,
        LearnmoreModule
       // MatMenuModule,
      //  MatIconModule
    ],
    declarations: [HeaderComponent],
    exports: [HeaderComponent]
})
export class HeaderModule {
}
