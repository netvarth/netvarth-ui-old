import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from 'subsink';
import { AccountService } from '../../../../shared/services/account.service';
import { DomainConfigGenerator } from '../../../../shared/services/domain-config-generator.service';
import { AuthService } from '../../../../shared/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  businessCustomId: any;
  target: any;
  uniqueId: any;
  accountId;
  theme;
  loading = true;
  subscriptions = new SubSink();
  imgPath: any;
  accountConfig: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private s3Processor: S3UrlProcessor,
    private lStorageService: LocalStorageService,
    private configService: DomainConfigGenerator,
    private authService: AuthService
  ) {
    this.activatedRoute.params.subscribe(
      (params: any) => {
        this.businessCustomId = params.id;
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
    this.getAccountIdFromEncId(this.businessCustomId).then(
      (uniqueId: any) => {
        this.uniqueId = uniqueId;
        _this.getAccountConfig(uniqueId).then(
          (status) => {
            _this.getproviderBprofileDetails().then(() => {
              _this.authService.goThroughLogin().then(
                (status) => {
                  if (status) {
                    _this.goToDashboard();
                  } else {
                    _this.loading = false;
                  }
                }
              )
            });
          });
      });
  }

  goToDashboard() {
    let theme = this.lStorageService.getitemfromLocalStorage('theme');
    let customId = this.lStorageService.getitemfromLocalStorage('customId');
    let accountId = this.lStorageService.getitemfromLocalStorage('accountId');
    let dashboardUrl = 'consumer?accountId=' + accountId + '&customId=' + customId + '&theme=' + theme;
    this.router.navigateByUrl(dashboardUrl);
  }
  actionPerformed(response) {
    const _this = this;
    let target = _this.lStorageService.getitemfromLocalStorage('target');
    if (target) {
      _this.lStorageService.removeitemfromLocalStorage('target');
      _this.router.navigateByUrl(target);
    } else {
      this.goToDashboard();
    }
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

  getproviderBprofileDetails() {
    const self = this;
    return new Promise(function (resolve, reject) {
      let accountS3List = 'businessProfile';
      self.subscriptions.sink = self.s3Processor.getJsonsbyTypes(self.uniqueId,
        null, accountS3List).subscribe(
          (accountS3s: any) => {
            self.accountId = accountS3s.businessProfile.id;
            if (accountS3s.businessProfile.customId) {
              self.businessCustomId = accountS3s.businessProfile.customId;
            } else {
              self.businessCustomId = accountS3s.businessProfile.accEncUid;
            }
            self.lStorageService.setitemonLocalStorage('customId', self.businessCustomId);
            self.lStorageService.setitemonLocalStorage('accountId', accountS3s.businessProfile.id);
            resolve(true);
          });
    })
  }
}
