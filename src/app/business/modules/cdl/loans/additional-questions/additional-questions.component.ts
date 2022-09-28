import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-additional-questions',
  templateUrl: './additional-questions.component.html',
  styleUrls: ['./additional-questions.component.css']
})
export class AdditionalQuestionsComponent implements OnInit {

  constructor(
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  submit() {
    this.router.navigate(['provider', 'cdl', 'loans', 'approved']);
  }


  goBack() {
    this.location.back();
  }
}
