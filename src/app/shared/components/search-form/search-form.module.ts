import { NgModule } from '@angular/core';
import { SearchFormComponent } from './search-form.component';
import { CommonModule } from '@angular/common';
import { SearchModule } from '../../modules/search/search.module';

@NgModule({
    imports: [
        CommonModule,
        SearchModule
    ],
    declarations: [
        SearchFormComponent
    ],
    exports: [
        SearchFormComponent
    ]
})
export class SearchFormModule { }
