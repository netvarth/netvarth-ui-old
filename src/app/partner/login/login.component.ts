import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../shared/services/account.service';
import { AuthService } from '../../shared/services/auth-service';
import { DomainConfigGenerator } from '../../shared/services/domain-config-generator.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { S3UrlProcessor } from '../../shared/services/s3-url-processor.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  partnerParentId: any;
  target: any;
  accountConfig: any;
  theme: any;
  imgPath: any;
  uniqueId: any;
  subscriptions = new SubSink();
  loading: boolean;
  accountId: any;
  partnerId: any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private s3Processor: S3UrlProcessor,
    private lStorageService: LocalStorageService,
    private configService: DomainConfigGenerator,
    private authService: AuthService) { 
    this.activatedRoute.params.subscribe(
      (params: any) => {
        this.partnerParentId = params.id;
        this.partnerId = params.partnerId;
        this.lStorageService.setitemonLocalStorage("partnerId", this.partnerId);
      }
    )
    this.activatedRoute.queryParams.subscribe(
      (queryParams: any) => {
        if (queryParams.target){
          this.target = queryParams.target;
        }
        if (queryParams.src) {
          this.lStorageService.setitemonLocalStorage('source', queryParams.src);
          this.lStorageService.setitemonLocalStorage('reqFrom', 'CUSTOM_WEBSITE');
        } else if (!this.lStorageService.getitemfromLocalStorage('reqFrom')){
          this.lStorageService.setitemonLocalStorage('reqFrom','WEB_LINK');
        }
      }
    )
  }
  getAccountConfig(uniqueId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.configService.getUIAccountConfig(uniqueId).subscribe(
        (uiconfig: any) => {
          _this.accountConfig = uiconfig;
          if (uiconfig['theme']) {
            _this.theme = uiconfig['theme'];
            _this.lStorageService.setitemonLocalStorage('theme', uiconfig['theme']);
          }
          if (uiconfig['imagePath'] && uiconfig['imagePath']['login']) {
            _this.imgPath = uiconfig['imagePath']['login'];
          } else {
            _this.imgPath = './assets/images/login_pge.png';
          }
          resolve(true);
        }, (error) => {
          resolve(false);
        });
    })
  }

  ngOnInit(): void {
    const _this = this;
    this.getAccountIdFromEncId(this.partnerParentId).then(
      (uniqueId: any) => {
        this.uniqueId = uniqueId;
        _this.getAccountConfig(uniqueId).then(
          (status) => {
            _this.getproviderBprofileDetails().then(() => {
              _this.authService.goThroughLogin().then(
                (status) => {
                  if (status) {
                    _this.goToPartnerHome();
                  } else {
                    _this.loading = false;
                  }
                }
              )
            });
          });
      });
  }
  goToPartnerHome() {
    this.router.navigate([this.partnerParentId, 'partner', this.partnerId]);
  }
  actionPerformed(response) {
    const _this = this;
    let target = _this.lStorageService.getitemfromLocalStorage('target');
    if (target) {
      _this.lStorageService.removeitemfromLocalStorage('target');
      _this.router.navigateByUrl(target);
    } else {
      this.goToPartnerHome();
    }
  }
  getproviderBprofileDetails() {
    const self = this;
    return new Promise(function (resolve, reject) {
      let accountS3List = 'businessProfile';
      self.subscriptions.sink = self.s3Processor.getJsonsbyTypes(self.uniqueId,
        null, accountS3List).subscribe(
          (accountS3s: any) => {
            self.accountId = accountS3s.businessProfile.id;
            // if (accountS3s.businessProfile.customId) {
            //   self.businessCustomId = accountS3s.businessProfile.customId;
            // } else {
            //   self.businessCustomId = accountS3s.businessProfile.accEncUid;
            // }
            // self.lStorageService.setitemonLocalStorage('customId', self.businessCustomId);
            // self.lStorageService.setitemonLocalStorage('accountId', accountS3s.businessProfile.id);
            resolve(true);
          });
    })
  }
  /**
    * 
    * @param encId encId/customId which represents the Account
    * @returns the unique provider id which will gives access to the s3
    */
 getAccountIdFromEncId(encId) {
  const _this = this;
  return new Promise(function (resolve, reject) {
    _this.accountService.getBusinessUniqueId(encId).subscribe(
      (id) => {
        resolve(id);
      },
      error => {
        if (error.status === 404) {
          _this.router.navigate(['/not-found']);
        }
        reject();
      }
    );
  });
}
}
