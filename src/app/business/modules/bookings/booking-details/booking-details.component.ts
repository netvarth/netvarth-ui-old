import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  @Input() bookingData;
  @Input() bookingType;
  constructor() { }

  ngOnInit(): void {
  }

}
