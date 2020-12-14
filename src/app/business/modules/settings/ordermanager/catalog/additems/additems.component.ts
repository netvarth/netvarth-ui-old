import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  selecteditemfordelete: any = [];
  selecteditemforadd: any = [];
  selecteditemforupdate: any = [];
  screenWidth: number;
  no_of_grids: number;
  min: any;
  max: any;


  constructor(private router: Router,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private provider_servicesobj: ProviderServices) {
    this.emptyMsg = this.shared_functions.getProjectMesssages('ITEM_LISTEMPTY');
    this.activated_route.queryParams.subscribe(
      (qParams) => {
      this.action = qParams.action;
      this.cataId = qParams.id;
      }
      );
      this.onResize();
      }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    let divider;
    const divident = this.screenWidth / 37.8;
    if (this.screenWidth > 1000) {
       divider = divident / 4;
    } else if (this.screenWidth > 400 && this.screenWidth < 1000) {
      divider = divident / 2;
    }  else if (this.screenWidth < 400) {
      divider = divident / 1;
    }
    this.no_of_grids = Math.round(divident / divider);
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
  //   this.itemQtyForm = this.formBuilder.group({
  //     users: this.formBuilder.array([
  //      this.formBuilder.group({
  //       min: [null, [Validators.required]],
  //       max: [null, [Validators.required]]
  //      })
  //    ])
  // });
  }
  ngOnDestroy() {
  }
  getitems() {
    this.provider_servicesobj.getProviderItems()
      .subscribe((data) => {
        this.catalogItem = data;
        this.api_loading = false;
        if (this.seletedCatalogItems !== null) {
          this.selectedCount = this.seletedCatalogItems.length;
          console.log(this.selectedCount);
          console.log(this.catalogItem);
          for (const itm of this.catalogItem) {
            for (const selitem of this.seletedCatalogItems) {
               if (itm.itemId === selitem.item.itemId) {
                itm.selected = true;
                itm.id = selitem.id;
                itm.minQuantity = selitem.minQuantity;
                itm.maxQuantity = selitem.maxQuantity;
               }
            }
        }
          console.log(this.catalogItem);

        } else {
          for (const itm of this.catalogItem) {
                itm.minQuantity = '1';
                itm.maxQuantity = '5';
              
        }
        }
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
    this.api_loading = true;
    this.catalogItemsSelected = [];
    for (let ia = 0; ia < this.catalogItem.length; ia++) {
      this.seletedCatalogItems1 = {};
      this.selecteditemfordelete = [];
      this.selecteditemforupdate = [];
      this.selecteditemforadd = [];
      console.log('minquty_' + this.catalogItem[ia].itemId + '');
      if (this.catalogItem[ia].selected === true) {
       this.seletedCatalogItems1.minQuantity = (<HTMLInputElement>document.getElementById('minquty_' + this.catalogItem[ia].itemId + '')).value || '1';
       this.seletedCatalogItems1.maxQuantity = (<HTMLInputElement>document.getElementById('maxquty_' + this.catalogItem[ia].itemId + '')).value || '5';
       this.seletedCatalogItems1.item = this.catalogItem[ia];
       this.catalogItemsSelected.push(this.seletedCatalogItems1);
      }
    }
    console.log(this.catalogItemsSelected);
    console.log(this.seletedCatalogItems);
    if (this.action === 'edit' && this.cataId !== 'add') {
    const deleteresult = this.seletedCatalogItems.filter(o1 => this.catalogItemsSelected.filter(o2 => o2.item.itemId === o1.item.itemId).length === 0);
    if (deleteresult.length > 0) {
      for (const selitem of deleteresult) {
      this.selecteditemfordelete.push(selitem.item.itemId);
    }
  }
  console.log(deleteresult);
  const addresult = this.catalogItemsSelected.filter(o1 => this.seletedCatalogItems.filter(o2 => o2.item.itemId === o1.item.itemId).length === 0);
  if (addresult.length > 0) {
    for (const selitem of addresult) {
    this.selecteditemforadd.push(selitem);
  }
}
const updateminresult = this.catalogItemsSelected.filter(o1 => this.seletedCatalogItems.filter(o2 => o2.minQuantity == o1.minQuantity).length === 0);
const updatemaxresult = this.catalogItemsSelected.filter(o1 => this.seletedCatalogItems.filter(o2 => o2.maxQuantity == o1.maxQuantity).length === 0);

console.log(updateminresult);
console.log(updatemaxresult);
if (updatemaxresult.length > 0 || updateminresult.length > 0) {
  this.selecteditemforupdate = updateminresult.concat(updatemaxresult);
}
let updateitemsselected = [];
if (this.selecteditemforupdate.length > 0 ) {
  updateitemsselected = [...new Map(this.selecteditemforupdate.map(item => [item.item['itemId'], item])).values()];
}

console.log(updateitemsselected);



    if (this.selecteditemfordelete.length > 0) {
      this.deleteItems(this.selecteditemfordelete);
    }
    if (this.selecteditemforadd.length > 0) {
      this.addItems(this.selecteditemforadd);
    }
    if (updateitemsselected.length > 0 && this.selecteditemforadd.length > 0) {
      const updateitem = [];
      for (const itm of updateitemsselected) {
        for (const selitem of this.selecteditemforadd) {
           if (itm.item.itemId !== selitem.item.itemId) {
            updateitem.push(itm);
           }
        }
    }
    console.log(updateitem);
    if (updateitem.length > 0) {
      this.updateItems(updateitem);
    }
    } else {
      this.updateItems(updateitemsselected);
    }

      if (!this.api_loading) {
        this.shared_functions.openSnackBar('Items updated');
       // this.shared_functions.setitemonLocalStorage('selecteditems', this.catalogItemsSelected);
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'edit',
                          isFrom: true }
    };
    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', this.cataId], navigationExtras);
  }
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
  addItems(addlist) {
    console.log(addlist);
    // this.provider_servicesobj.addCatalogItems(this.cataId, addlist).subscribe(
    //   (data) => {
    //     this.api_loading = false;
    //   }, error => {
    //     this.api_loading = false;
    //     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //     }
    //     );
  }
  deleteItems(deletelist) {
    console.log(deletelist);
    // this.provider_servicesobj.deleteCatalogItems(this.cataId, deletelist).subscribe(
    //   (data) => {
    //     this.api_loading = false;
    //   }, error => {
    //     this.api_loading = false;
    //     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //     }
    //     );
  }
  updateItems(updatelist) {
    console.log(updatelist);
    const passlist: any = {};
    const passingupdateList = [];
    for (const selitem of updatelist) {
      passlist.id = selitem.item.id;
      passlist.maxQuantity = selitem.maxQuantity;
      passlist.minQuantity = selitem.minQuantity;
      passingupdateList.push(passlist);
  }
    console.log(passingupdateList);
    // this.provider_servicesobj.updateCatalogItems(this.cataId, passingupdateList).subscribe(
    //   (data) => {
    //     this.api_loading = false;
    //   }, error => {
    //     this.api_loading = false;
    //     this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //     }
    //     );
  }
  getItemImg(item) {
    if (item.itemImages) {
        const img = item.itemImages.filter(image => image.displayImage);
        if (img[0]) {
            return img[0].url;
        } else {
            return '../../../../assets/images/order/Items.svg';
        }
    } else {
        return '../../../../assets/images/order/Items.svg';
    }
}

}
