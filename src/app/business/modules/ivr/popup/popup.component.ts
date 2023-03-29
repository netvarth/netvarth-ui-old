import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  users: any;
  constructor(
    public usersDialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.users) {
      this.users = this.data.users
    }
  }

  assignCall(id) {
    this.usersDialogRef.close({ id: id });
  }

  assignMyself()
  {
    this.usersDialogRef.close({ assignMyself: true });
  }

  close() {
    this.usersDialogRef.close();
  }



}
