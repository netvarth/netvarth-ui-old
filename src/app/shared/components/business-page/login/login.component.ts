import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from 'subsink';
import { AccountService } from '../../../../shared/services/account.service';

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
  subscriptions = new SubSink();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private s3Processor: S3UrlProcessor,
    private lStorageService: LocalStorageService
    ) { 
      this.activatedRoute.params.subscribe(
        (params: any) => {
          this.businessCustomId = params.id;
        }
      )
      this.activatedRoute.queryParams.subscribe(
        (queryParams: any) => {
          if (queryParams.target)
          this.target = queryParams.target;
        }
      )
    }

  ngOnInit(): void {
    const _this = this;
    this.getAccountIdFromEncId(this.businessCustomId).then(
      (uniqueId: any) => {
        this.uniqueId = uniqueId;
        _this.getproviderBprofileDetails().then(() => {});
      });
  }

  actionPerformed(response) {
    const _this = this;
    let target = _this.lStorageService.getitemfromLocalStorage('target');
    _this.lStorageService.removeitemfromLocalStorage('target');
    _this.router.navigateByUrl(target);
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
