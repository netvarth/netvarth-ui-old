import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
  selector: 'app-jaldee-cash',
  templateUrl: './jaldee-cash.component.html',
  styleUrls: ['./jaldee-cash.component.css']
})
export class JaldeeCashComponent implements OnInit {

  constructor(private location: Location,
    public shared_functions: SharedFunctions) { }

  ngOnInit(): void {
  }
  goBack () {
    this.location.back();
  }

}
