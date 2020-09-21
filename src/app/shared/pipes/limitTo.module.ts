import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './limitTo.pipe';

// import { MatMenuModule } from '@angular/material/menu';
// import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [TruncatePipe],
    exports: [TruncatePipe]
})
export class TruncateModule {
}
