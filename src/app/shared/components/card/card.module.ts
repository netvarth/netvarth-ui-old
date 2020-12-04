import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CapitalizeFirstPipeModule } from '../../pipes/capitalize.module';
import { TruncateModule } from '../../pipes/limitTo.module';
import { CardComponent } from './card.component';


@NgModule({
    declarations: [
        CardComponent
    ],
    imports: [
        CommonModule,
        TruncateModule,
        CapitalizeFirstPipeModule
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