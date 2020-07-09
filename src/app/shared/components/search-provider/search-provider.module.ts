import { NgModule } from '@angular/core';
import { SearchProviderComponent } from './search-provider.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/common/material.module';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { HeaderModule } from '../../modules/header/header.module';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CapitalizeFirstPipeModule,
        HeaderModule,
        LoadingSpinnerModule
    ],
    declarations: [
        SearchProviderComponent
    ],
    exports: [
        SearchProviderComponent
    ]
})

export class SearchProviderModule {}
