import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-questionnaire-list',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css', '../../../../../../assets/css/style.bundle.css']
})
export class QuestionnaireComponent implements OnInit {
  questionnaire: any = [];
  loading = true;
  constructor(private providerservices: ProviderServices,
    private location: Location, private router: Router,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor) { }

  ngOnInit(): void {
    this.getQuestionnaire();
  }
  getQuestionnaire() {
    this.providerservices.getAllQuestionnaire().subscribe(data => {
      this.questionnaire = data;
      this.loading = false;
    });
  }
  changeQnrStatus(qnr) {
    const status = (qnr.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
    this.providerservices.changeQuestionnaireStatus(status, qnr.id).subscribe(data => {
      this.getQuestionnaire();
    },
      error => {
        this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      });
  }
  gotoDetails(qnr) {
    this.router.navigate(['provider', 'settings', 'general', 'questionnaire', qnr.id]);
  }
  goBack() {
    this.location.back();
  }
  stopprop(ev) {
    ev.stopPropagation();
  }
}
