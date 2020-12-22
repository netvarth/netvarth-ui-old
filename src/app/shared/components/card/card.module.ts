import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { TruncateModule } from '../../pipes/limitTo.module';
import { CardComponent } from './card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        CardComponent
    ],
    imports: [
        CommonModule,
        TruncateModule,
        CapitalizeFirstPipeModule,
        MatMenuModule,
        MatIconModule
    ],
    exports: [
        CardComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class CardModule {
}