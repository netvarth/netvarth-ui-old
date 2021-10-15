import { Component, Input, OnInit } from '@angular/core';

//import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  @Input() content;
  @Input() path;
  ngOnInit() {
  }
}
