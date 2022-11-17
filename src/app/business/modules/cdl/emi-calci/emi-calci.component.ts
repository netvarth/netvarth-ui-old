import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-emi-calci',
  templateUrl: './emi-calci.component.html',
  styleUrls: ['./emi-calci.component.scss']
})
export class EmiCalciComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goBack() {
    this.location.back();
  }

}
