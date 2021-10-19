import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderReimburseReportComponent } from './provider-reimburse-report.component';
import { PagerModule } from '../../../../../../shared/modules/pager/pager.module';
import { FormsModule } from '@angular/forms';
import { RequestForModule } from '../../../../request-for/request-for.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
const routes:Routes = [
  {path: '', component: ProviderReimburseReportComponent}
]
@NgModule({
    imports: [
      CommonModule,
      PagerModule,
      FormsModule,
      RequestForModule,
      MatTooltipModule,
      MatDatepickerModule,
      MatCheckboxModule,
      MatIconModule,
      MatMenuModule,
      MatButtonModule,
      [RouterModule.forChild(routes)]
    ],
    declarations: [ProviderReimburseReportComponent],
    exports: [ProviderReimburseReportComponent]
})

export class ProviderReimburseReportModule {}
