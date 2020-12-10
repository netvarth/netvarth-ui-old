import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';


@Component({
  selector: 'app-additems',
  templateUrl: './additems.component.html',
  styleUrls: ['./additems.component.css'],
})
export class AddItemsComponent implements OnInit, OnDestroy {
  tooltipcls = '';
  name_cap = Messages.ITEM_NAME_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_item_cap = Messages.ADD_ITEM_CAP;
  item_enable_btn = Messages.ITEM_ENABLE_CAP;
  catalogItem: any = [];
  query_executed = false;
  emptyMsg = '';
  domain;
  breadcrumb_moreoptions: any = [];
  frm_items_cap = Messages.FRM_LEVEL_ITEMS_MSG;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Jaldee Order',
      url: '/provider/settings/ordermanager'
    },
    {
      title: 'Catalogs',
      url: '/provider/settings/ordermanager/catalogs'
    }
  ];
  item_status = projectConstants.ITEM_STATUS;
  breadcrumbs = this.breadcrumbs_init;
  itemnameTooltip = Messages.ITEMNAME_TOOLTIP;
  additemdialogRef;
  edititemdialogRef;
  statuschangedialogRef;
  removeitemdialogRef;
  isCheckin;
  active_user;
  order = 'status';
  selecteditems: any = [];
  selected;
  selectedCount = 0;
  api_loading = true;
  seletedCatalogItems = [];
  seletedCatalogItems1: any = {};
  tempcatalog = [];
  minquantity;
  maxquantity;
  action = '';
  cataId;
  catalogItemsSelected: any = [];

  constructor(private router: Router,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private provider_servicesobj: ProviderServices) {
    this.emptyMsg = this.shared_functions.getProjectMesssages('ITEM_LISTEMPTY');
    this.activated_route.queryParams.subscribe(
      (qParams) => {
      this.action = qParams.action;
      this.cataId = qParams.id;
      console.log(this.action);
      console.log(this.cataId);
     
      }
      );
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
    this.getitems();
    this.seletedCatalogItems = this.shared_functions.getitemfromLocalStorage('selecteditems');
    console.log(this.seletedCatalogItems);
  }
  ngOnDestroy() {
  }
  getitems() {
    this.provider_servicesobj.getProviderItems()
      .subscribe((data) => {
        this.catalogItem = data;
          console.log('cataloITem' + JSON.stringify(this.catalogItem));
          console.log('selectcataloITem' + JSON.stringify(this.seletedCatalogItems));

        this.api_loading = false;
        if (this.seletedCatalogItems !== null) {
          this.selectedCount = this.seletedCatalogItems.length;
          this.catalogItem.map(item => {
            if (this.seletedCatalogItems.includes(item.itemId)) {
              item.selected = true;
            }
          return item;
          });
          console.log('cataloITem' + JSON.stringify(this.catalogItem));

        }
        //   this.selectedCount = this.seletedCatalogItems.length;
        //   for (let e = 0; e < this.seletedCatalogItems.length; e++) {
        //   for (let i = 0; i < this.catalogItem.length; i++) {
        //       if (this.catalogItem[i].id === this.seletedCatalogItems[e].id) {
        //         this.catalogItem[i].selected = true;
        //       }
        //     }
        //   }
        //   console.log('cataloITem' + JSON.stringify(this.catalogItem));

        // }


      });
  }
  selectItem(item, index) {
    console.log(this.catalogItem[index].selected);
    if (this.catalogItem[index].selected === undefined || this.catalogItem[index].selected === false) {
      this.catalogItem[index].selected = true;
      this.selectedCount++;
    } else {
      this.catalogItem[index].selected = false;
      this.selectedCount--;
    }
    console.log(this.catalogItem[index].selected);
  }
  selectedItems() {
    console.log(this.action);
    console.log(this.cataId);
    for (let ia = 0; ia < this.catalogItem.length; ia++) {
      this.seletedCatalogItems1 = {};
      console.log('minquty_' + this.catalogItem[ia].itemId + '');
      if (this.catalogItem[ia].selected === true) {
       this.seletedCatalogItems1.minQuantity = (<HTMLInputElement>document.getElementById('minquty_' + this.catalogItem[ia].itemId + '')).value;
       this.seletedCatalogItems1.maxQuantity = (<HTMLInputElement>document.getElementById('maxquty_' + this.catalogItem[ia].itemId + '')).value;
       this.seletedCatalogItems1.item = this.catalogItem[ia];
       this.catalogItemsSelected.push(this.seletedCatalogItems1);
      }
    }
    console.log(this.catalogItemsSelected);

    if (this.action === 'edit' && this.cataId !== 'add') {
      this.provider_servicesobj.editCatalogItems(this.cataId, this.catalogItemsSelected).subscribe(
      (data) => {
        this.shared_functions.openSnackBar('Items updated');
        this.shared_functions.setitemonLocalStorage('selecteditems', this.catalogItemsSelected);
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'edit',
                          isFrom: true }
    };
    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', this.cataId], navigationExtras);
      }, error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
        );
      } else {
        console.log(this.catalogItemsSelected);
        this.shared_functions.setitemonLocalStorage('selecteditems', this.catalogItemsSelected);
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'add',
                          isFrom: true }
    };
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add'], navigationExtras);
      }
  }

  redirecToJaldeecatalog() {
    if (this.action === 'edit' && this.cataId !== 'add') {
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'edit',
                          isFrom: true }
    };
    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', this.cataId], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: { action: 'add',
                        isFrom: true }
  };
      this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add'], navigationExtras);
    }
   
  }
  redirecToHelp() {
    this.router.navigate(['/provider/' + this.domain + '/billing->items']);
  }

}
