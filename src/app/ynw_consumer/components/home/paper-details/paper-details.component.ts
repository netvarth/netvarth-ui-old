import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-paper-details',
  templateUrl: './paper-details.component.html',
  styleUrls: ['./paper-details.component.css']
})
export class PaperDetailsComponent implements OnInit {

 
  constructor(
    public _location: Location,
  ) { }

  ngOnInit(): void {
  }

  previous()
  {
    this._location.back();
  }

  
  goBack()
  {
    // if(this.timetype == 1)
    // {
      this.previous();
    // }
    // else
    // {
    //   this.timetype -=1;
    // }
  }

}
