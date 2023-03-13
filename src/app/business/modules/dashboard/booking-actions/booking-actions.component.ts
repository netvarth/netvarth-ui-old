import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-booking-actions',
  templateUrl: './booking-actions.component.html',
  styleUrls: ['./booking-actions.component.css']
})
export class BookingActionsComponent implements OnInit {
  action = "";
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
  }

}
