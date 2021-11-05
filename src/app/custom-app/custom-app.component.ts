import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomainConfigGenerator } from "../shared/services/domain-config-generator.service";
import { SharedServices } from "../shared/services/shared-services";

@Component({
  selector: 'app-customapp',
  templateUrl: './custom-app.component.html',
  styleUrls: ['./custom-app.component.css']
})
export class CustomAppComponent implements OnInit {
  small_device_display: boolean;
  screenWidth: number;
  accountEncId: any;
  provider_id: any;
  templateJson: any;
  constructor(
    private activaterouterobj: ActivatedRoute,
    private shared_services: SharedServices,
    private router: Router,
    private domainConfigService: DomainConfigGenerator
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.onResize();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  ngOnInit() {
    const _this = this;
    this.activaterouterobj.paramMap
      .subscribe(params => {
        this.accountEncId = params.get('id');
        this.getAccountIdFromEncId(this.accountEncId).then(
          (id: any) => {
            _this.provider_id = id;
            _this.domainConfigService.getHometemplate(_this.provider_id).subscribe(
              (templateJson: any) => {
                this.templateJson = templateJson;
                  console.log(templateJson);
              });
          }, (error) => {
            console.log(error);
          }
        );
      });
  }

  /**
   * 
   * @param encId encId/customId which represents the Account
   * @returns the unique provider id which will gives access to the s3
   */
  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getBusinessUniqueId(encId).subscribe(
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