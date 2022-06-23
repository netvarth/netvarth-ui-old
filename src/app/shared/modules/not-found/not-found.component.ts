import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['../../../../assets/css/pages/error/error-3.css','../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', './not-found.component.scss']
})
export class NotFoundComponent {
    constructor(
        private lStorageService: LocalStorageService,
        private router: Router) {}
    gotoHome() {
        const customId = this.lStorageService.getitemfromLocalStorage('customId');
        const reqFrom = this.lStorageService.getitemfromLocalStorage('reqFrom');
        if (customId) {
            if (reqFrom === 'cuA') {
                this.router.navigate(['customapp', customId]);
            } else if (reqFrom==='CUSTOM_WEBSITE'){
                let source = this.lStorageService.getitemfromLocalStorage('source');
                this.lStorageService.removeitemfromLocalStorage('reqFrom');
                this.lStorageService.removeitemfromLocalStorage('source');
                window.location.href = source;
            } else {
                this.router.navigate([customId]);
            }
        } else {
            this.router.navigate(['/']);
        }
    }
 }
