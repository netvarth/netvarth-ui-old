import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JaldeeDriveComponent } from './jaldee-drive/jaldee-drive.component';
import { FolderFilesComponent } from './folder-files/folder-files.component';

const routes: Routes = [
    { path: '', component: JaldeeDriveComponent },
    { path: 'folderfiles', component: FolderFilesComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class JaldeeDriveRoutingModule {}
