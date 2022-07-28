import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { SharedfilesComponent } from "./sharedfiles.component";

const routes: Routes = [
    { path: '', component: SharedfilesComponent },
    { path: 'folders',loadChildren: ()=> import('../folders/folders.module').then(m=>m.FoldersModule) },

]

@NgModule({
    imports:[
        CommonModule,
        CapitalizeFirstPipeModule,
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