import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-actions',
  templateUrl: './order-actions.component.html',
  styleUrls: ['./order-actions.component.css']
})
export class OrderActionsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
