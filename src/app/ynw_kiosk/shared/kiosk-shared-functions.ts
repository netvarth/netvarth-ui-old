import { Injectable } from '@angular/core';
import {Observable,  Subject } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';


@Injectable()

export class KioskSharedFunctions {

    private subject = new Subject<any>();

    constructor(
      private dialog: MatDialog,
      private snackBar: MatSnackBar
    ) {}



  sendMessage(message: any) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
