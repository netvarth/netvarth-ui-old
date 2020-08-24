import { Component, OnInit } from '@angular/core';
import { GlobalService } from './shared/services/global-service';
export let projectConstants: any = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private globalService: GlobalService

  ) { }

  ngOnInit() {
    projectConstants = this.globalService.getGlobalConstants();
  }
}
