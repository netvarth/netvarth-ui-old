import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderDataStorageService } from '../../../../../ynw_provider/services/provider-datastorage.service';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../../../shared/constants/project-messages';
import { QuestionService } from '../../../../../ynw_provider/components/dynamicforms/dynamic-form-question.service';
import { Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
@Component({
    selector: 'app-gallerymedia',
    templateUrl: './gallerymedia.component.html'
})
export class GalleryMediaComponent implements OnInit {
    domain: any;
    bProfile;
    serviceSector: any;
    subdomain: any;
    normal_domainfield_show: number;
    normal_subdomainfield_show: number;
    gallery_cap = Messages.GALLERY_CAP;
    frm_gallery_cap = '';
    customer_label = '';
    social_media_cap = Messages.BPROFILE_SOCIAL_MEDIA_CAP;
    frm_social_cap = '';
    image_list: ArrayBuffer;
    constructor(
        private provider_services: ProviderServices,
        private sharedfunctionobj: SharedFunctions,
        private provider_datastorage: ProviderDataStorageService,
        private dialog: MatDialog,
        private routerobj: Router,
        public shared_functions: SharedFunctions,
        private service: QuestionService
    ) {
        this.customer_label = this.sharedfunctionobj.getTerminologyTerm('customer');
    }
    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.frm_gallery_cap = Messages.FRM_LEVEL_GALLERY_MSG.replace('[customer]', this.customer_label);
        this.frm_social_cap = Messages.FRM_LEVEL_SOCIAL_MSG.replace('[customer]', this.customer_label);
        this.getGalleryImages();
    }

    getGalleryImages() {
        this.provider_services.getGalleryImages()
          .subscribe(
            data => {
              this.image_list = data;
              this.provider_datastorage.updateGalleryWeightageToBusinessProfile(this.image_list);
            },
            () => {
            }
          );
      }

}
