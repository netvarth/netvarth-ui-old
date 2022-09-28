import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
@Component({
  selector: 'app-additional-questions',
  templateUrl: './additional-questions.component.html',
  styleUrls: ['./additional-questions.component.css']
})
export class AdditionalQuestionsComponent implements OnInit {

  constructor(
    private location: Location,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  submit() {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        from: 'additionalqa'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }





  goBack() {
    this.location.back();
  }
}
