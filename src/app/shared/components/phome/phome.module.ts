import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PhomeRoutingModule } from './phome-routing.module';
import { PhomeComponent } from './phome.component';
import { OwlModule } from 'ngx-owl-carousel';
import { HeaderModule } from '../../modules/header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { MaterialModule } from '../../modules/common/material.module';
import { LazyModule } from '../../modules/lazy-load/lazy.module';
@NgModule({
    imports: [
        CommonModule,
        OwlModule,
        HeaderModule,
        FooterModule,
        PhomeRoutingModule,
        RouterModule,
        MaterialModule,
        LazyModule
    ],
    declarations: [PhomeComponent]
})

export class PhomeModule { }
