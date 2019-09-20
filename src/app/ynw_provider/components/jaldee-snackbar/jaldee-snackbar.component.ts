import { Component, Inject, Renderer2 } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { projectConstants } from '../../../shared/constants/project-constants';
@Component
({
  'selector': 'app-jaldee-snackbar',
  'templateUrl': './jaldee-snackbar.component.html'
})

export class JaldeeSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data,
    private snackBarRef: MatSnackBarRef<JaldeeSnackbarComponent>,
    private ren: Renderer2
  ) {
    console.log(data.message);
    setTimeout(() => {
      const snackEl = document.getElementsByClassName('mat-snack-bar-container').item(0);
      ren.listen(snackEl, 'click', () => this.dismiss());
      }, projectConstants.TIMEOUT_DELAY);
  }

  private started = false;
  public progress = 50;
  dismiss() {
    this.snackBarRef.dismiss();
  }
}