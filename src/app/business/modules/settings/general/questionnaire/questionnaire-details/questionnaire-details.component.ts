import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-questionnaire-details',
  templateUrl: './questionnaire-details.component.html',
  styleUrls: ['./questionnaire-details.component.css']
})
export class QuestionnaireDetailsComponent implements OnInit {
  questionnaire: any = [];
  loading = true;
  selectedQuestion;
  constructor(private providerservices: ProviderServices,
    private activated_route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    this.activated_route.params.subscribe(params => {
      this.getQuestionnaire(params.id);
    });
  }
  getQuestionnaire(id) {
    this.providerservices.getQuestionnairebyId(id).subscribe(data => {
      this.questionnaire = data;
      this.loading = false;
    });
  }
  goBack() {
    this.location.back();
  }
  selectQuesstion(question) {
    this.selectedQuestion = question;
  }
}
