import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from './media.component';
import { UserSearchSocialMediaModule } from './providerUserBprofileSearchSocialMedia/provideruserbprofilesearchsocialmedia.module';
const routes: Routes = [
    {path: '', component: MediaComponent }
]
@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        MatGridListModule,
        UserSearchSocialMediaModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        MediaComponent
    ],
    exports: [MediaComponent]
})
export class MediaModule { }
