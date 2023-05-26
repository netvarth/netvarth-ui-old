import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loading',
  templateUrl: './skeleton-loading.component.html',
  styleUrls: ['./skeleton-loading.component.css']
})
export class SkeletonLoadingComponent implements OnInit {
  @Input() type;
  constructor() { }

  ngOnInit(): void {
  }

}
