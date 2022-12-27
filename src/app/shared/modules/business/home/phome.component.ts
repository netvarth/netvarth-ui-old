import { Component, OnInit} from '@angular/core';;
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ProviderServices } from '../../../../business/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-phome',
  templateUrl: './phome.component.html'
})
export class PhomeComponent implements OnInit {
  qParams;
  evnt;
  constructor(
    public router: Router,
    public shared_functions: SharedFunctions,
    private activateRoute: ActivatedRoute,
    private groupService: GroupStorageService,
    private providerServices: ProviderServices,
    private lStorageService: LocalStorageService
  ) {
    this.activateRoute.queryParams.subscribe(data => {
      this.qParams = data;
    });

    this.evnt = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.shared_functions.isBusinessOwner()) {
          this.providerServices.getAccountSettings().then(
              (settings: any) => {
                if (router.url === '\/business') {
                  setTimeout(() => {
                    if (this.groupService.getitemFromGroupStorage('isCheckin') === 0) {
                      if (this.lStorageService.getitemfromLocalStorage('cdl')) {
                        router.navigate(['provider', 'providercdl']);
                      } else if (settings.appointment) {
                        router.navigate(['provider', 'appointments']);
                      } else if (settings.waitlist) {
                        router.navigate(['provider', 'check-ins']);
                      }  else if (settings.order) {
                        router.navigate(['provider', 'orders']);
                      } else if(settings.enableTask) {
                        router.navigate(['provider', 'crm']);
                      }  else {
                        router.navigate(['provider', 'settings']);
                      }
                    } else {
                      router.navigate(['provider', 'settings']);
                    }
                  }, 500);
                }
              });
        } else {
          router.navigate(['business', 'login']);
        }
      }
    });
  }

  ngOnInit() {
    const a = document.getElementById("fb-root");
    if (a) {
      a.classList.add('visible_chat');
    }
  }
  ngOnDestroy() {
    const a = document.getElementById("fb-root");
    if (a) {
    a.classList.remove('visible_chat');
    }
  }
}
