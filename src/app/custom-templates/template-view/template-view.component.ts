import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrls: ['./template-view.component.css']
})
export class TemplateViewComponent implements OnInit {
  template: string;
  templateUrl: any;

  constructor(private activaterouterobj: ActivatedRoute) { 
    this.activaterouterobj.paramMap
    .subscribe(params => {
      this.template = params.get('template');
    })
  }

  ngOnInit(): void {
  }
}
