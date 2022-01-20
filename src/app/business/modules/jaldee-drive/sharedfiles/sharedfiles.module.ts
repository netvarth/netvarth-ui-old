import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedfilesComponent } from "./sharedfiles.component";

const routes: Routes = [
    { path: '', component: SharedfilesComponent }
]

@NgModule({
    imports:[
        CommonModule,
        [RouterModule.forChild(routes)]
    ],
    exports: [
        SharedfilesComponent
    ],
    declarations: [
        SharedfilesComponent
    ]
})
export class SharedfilesModule {}