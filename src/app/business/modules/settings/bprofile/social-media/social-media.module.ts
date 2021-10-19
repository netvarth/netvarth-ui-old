import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule, Routes } from "@angular/router";
import { SocialMediaComponent } from "./social-media.component";
const routes: Routes = [
    { path: '', component: SocialMediaComponent }
]
@NgModule({
    declarations: [SocialMediaComponent],
    exports: [SocialMediaComponent],
    imports: [
        CommonModule,
        MatGridListModule,
        FormsModule,
        [RouterModule.forChild(routes)]
    ]
})
export class SocialMediaModule {}