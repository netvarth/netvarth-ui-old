import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-tour',
  templateUrl: './provider-tour.component.html'
})

export class ProviderTourComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit() {
    // localStorage.removeItem('new_provider');
  }
}

