import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../common/material.module';
import { SearchModule } from '../search/search.module';

// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from './header.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        SearchModule
       // MatMenuModule,
      //  MatIconModule
    ],
    declarations: [HeaderComponent],
    exports: [HeaderComponent]
})
export class HeaderModule {
}
