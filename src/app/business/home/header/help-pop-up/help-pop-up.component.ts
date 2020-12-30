import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProviderStartTourComponent } from '../../../../ynw_provider/components/provider-start-tour/provider-start-tour.component';
import { JoyrideService } from 'ngx-joyride';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-pop-up',
  templateUrl: './help-pop-up.component.html',
  styleUrls: ['./help-pop-up.component.css']
})
export class HelpPopUpComponent implements OnInit {
  screenWidth;
  no_of_grids;
  constructor(public dialogRef: MatDialogRef<HelpPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly joyrideService: JoyrideService,
    public router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 375) {
      this.no_of_grids = 2;
    } else {
      this.no_of_grids = 3;
    }
  }
  tourIconClicked() {
    this.dialogRef.close();
    const tourDialog = this.dialog.open(ProviderStartTourComponent, {
      width: '25%',
      panelClass: ['popup-class', 'commonpopupmainclass']

    });

    tourDialog.afterClosed().subscribe(result => {
      if (result === 'startTour') {
        this.joyrideService.startTour(
          {
            steps: ['step1@provider/settings', 'step2@provider/settings', 'step3@provider/settings', 'step4'],
            showPrevButton: false,
            stepDefaultPosition: 'top',
            themeColor: '#212f23'
          }
          // Your steps order
        ).subscribe(
          step => {
          },
          error => {
          },
          () => {
            this.router.navigate(['provider', 'settings']);
          }
        );
      }
    });
  }
}
