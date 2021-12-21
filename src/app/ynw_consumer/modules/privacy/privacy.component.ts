import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  @Output() approvePolicy = new EventEmitter<any>();
  
  checkPolicy = true;
 
  constructor() { }

  ngOnInit(): void {
  }
  
  changePolicy(event) {
    this.checkPolicy = event.target.checked;
    this.approvePolicy.emit(this.checkPolicy);
  }
}
