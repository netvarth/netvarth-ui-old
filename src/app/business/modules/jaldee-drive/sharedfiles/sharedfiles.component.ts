import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sharedfiles',
  templateUrl: './sharedfiles.component.html',
  styleUrls: ['./sharedfiles.component.css']
})
export class SharedfilesComponent implements OnInit {
  sharedFolder: any;

  constructor(private router: Router,
    public location: Location) {

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
