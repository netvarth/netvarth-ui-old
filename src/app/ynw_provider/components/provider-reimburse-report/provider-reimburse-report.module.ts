import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderReimburseReportComponent } from './provider-reimburse-report.component';
import { PagerModule } from '../../../shared/modules/pager/pager.module';
import { BreadCrumbModule } from '../../../shared/modules/breadcrumb/breadcrumb.module';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { FormsModule } from '@angular/forms';
@NgModule({
    imports: [
      CommonModule,
      PagerModule,
      BreadCrumbModule,
      MaterialModule,
      FormsModule
    ],
    declarations: [ProviderReimburseReportComponent],
    exports: [ProviderReimburseReportComponent]
})

export class ProviderReimburseReportModule {}
