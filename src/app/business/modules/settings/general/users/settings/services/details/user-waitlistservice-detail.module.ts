import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServiceModule } from '../../../../../../../../shared/modules/service/service.module';
import { LoadingSpinnerModule } from '../../../../../../../../shared/modules/loading-spinner/loading-spinner.module';
import { UserWaitlistServiceDetailComponent } from './user-waitlistservice-detail.component';
import { GalleryModule } from '../../../../../../../../shared/modules/gallery/gallery.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {path: '', component: UserWaitlistServiceDetailComponent}
]

@NgModule({
    imports: [
        CommonModule,
        LoadingSpinnerModule,
        ServiceModule,
        GalleryModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        UserWaitlistServiceDetailComponent
    ],
    exports: [UserWaitlistServiceDetailComponent]
})
export class UserWaitlistserviceDetailModule { }
