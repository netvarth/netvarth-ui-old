import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorMessagingService } from "./error-message.service";
import { WordProcessor } from "./word-processor.service";

@Injectable({
    providedIn: 'root'
})

export class SnackbarService {
    TIMEOUT_DELAY_LARGE: 4100;

    constructor(private snackBar: MatSnackBar,
        private errorMsgService: ErrorMessagingService,
        private wordProcessor: WordProcessor) {
        
    }
    
    openSnackBar(message: string, params: any = []) {
        const panelclass = (params['panelClass']) ? params['panelClass'] : 'snackbarnormal';
        if (params['panelClass'] === 'snackbarerror') {
          message = this.errorMsgService.getApiError(message);
        }
        let duration = this.TIMEOUT_DELAY_LARGE;
        if (params['duration']) {
          duration = params['duration'];
        }
        const replaced_message = this.wordProcessor.findTerminologyTerm(message);
        const snackBarRef = this.snackBar.open(replaced_message, '', { duration: duration, panelClass: panelclass });
        return snackBarRef;
      }
}