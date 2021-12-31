import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-sharedfiles',
  templateUrl: './sharedfiles.component.html',
  styleUrls: ['./sharedfiles.component.css']
})
export class SharedfilesComponent implements OnInit {
  sharedFolder: any;
  isHealthCare = false;
  customer_label='';
  provider_label='';

  constructor(private router: Router,
    public location: Location, private wordProcessor:WordProcessor) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');

  }

  ngOnInit(): void {
  }
  onCancel() {

    this.location.back();

  }
  publicfolder(foldername) {
    this.sharedFolder = foldername;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        foldername: foldername,
      }
    };
    this.router.navigate(['provider', 'drive', 'folderfiles'], navigationExtras);
  }
}
