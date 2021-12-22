import { NgModule } from '@angular/core';
import { ClickOutsideModule } from 'ng4-click-outside';
import { RatingStarModule  } from '../ratingstar/ratingstar.module';
import { SearchDataStorageService  } from '../../services/search-datastorage.services';
import { SearchMoreOptionsComponent } from './search-moreoptions.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from "@angular/common";
@NgModule({
    imports: [
      MatDialogModule,
      CommonModule,
      MatSlideToggleModule,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatCheckboxModule,
      RatingStarModule,
      ClickOutsideModule,
    ],
    declarations: [SearchMoreOptionsComponent],
    exports: [SearchMoreOptionsComponent],
    providers: [SearchDataStorageService]
})

export class SearchMoreoptionsModule {
}
