import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizeFirstPipeModule } from '../../../pipes/capitalize.module';
import { InboxOuterComponent } from './inbox-outer.component';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { HeaderModule } from '../../header/header.module';
import { LoadingSpinnerModule } from '../../loading-spinner/loading-spinner.module';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
const routes: Routes = [
  { path: '', component: InboxOuterComponent}
];
@NgModule({
    imports: [
        CapitalizeFirstPipeModule,
        CommonModule,
        [RouterModule.forChild(routes)],
        ReactiveFormsModule,
        FormsModule,
        Nl2BrPipeModule,
        HeaderModule,
        LoadingSpinnerModule,
        ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
    ],
    declarations: [
      InboxOuterComponent
    ],
    exports: [InboxOuterComponent]
})
export class InboxModule {
}
