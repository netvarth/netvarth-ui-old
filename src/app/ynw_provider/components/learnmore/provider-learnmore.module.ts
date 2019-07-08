import { NgModule } from '@angular/core';
import { ProviderLearnmoreComponent } from './provider-learnmore.component';
import { ProviderLearnmoreRoutingModule } from './provider-learnmore-routing.module';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { HealthCareComponent } from './healthcare/healthcare.component';
import { ProfessionalCareComponent } from './professional/professional.component';
import { VastuComponent } from './vastu/vastu.component';
import { ReligiousComponent } from './religious/religious.component';
import { FinanceComponent } from './finance/finance.component';
import { FoodJointComponent } from './foodjoints/foodjoints.component';
import { VeterinaryComponent } from './veterinary/veterinary.component';
import { PersonalCareComponent } from './personalcare/personalcare.component';
@NgModule({
    imports: [
        ProviderLearnmoreRoutingModule,
        CommonModule,
        SharedModule,
        MaterialModule
    ],
    declarations: [
        HealthCareComponent,
        PersonalCareComponent,
        VastuComponent,
        FoodJointComponent,
        VeterinaryComponent,
        ProfessionalCareComponent,
        FinanceComponent,
        ReligiousComponent,
        ProviderLearnmoreComponent
    ],
    exports: [ProviderLearnmoreComponent]
})
export class ProviderLearnmoreModule {}
