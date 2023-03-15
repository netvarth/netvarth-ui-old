import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-snippet',
  templateUrl: './booking-snippet.component.html',
  styleUrls: ['./booking-snippet.component.css']
})
export class BookingSnippetComponent implements OnInit {
  @Input() type;
  @Input() title;
  @Input() bookings;

  constructor() { }

  ngOnInit(): void {
  }

}
