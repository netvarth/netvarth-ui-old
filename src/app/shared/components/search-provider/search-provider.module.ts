import { NgModule } from '@angular/core';
import { SearchProviderComponent } from './search-provider.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { HeaderModule } from '../../modules/header/header.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        HeaderModule
    ],
    declarations: [
        SearchProviderComponent
    ],
    exports: [
        SearchProviderComponent
    ]
})

export class SearchProviderModule {}
