import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../../../ynw_provider/shared/component/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { EditcatalogitemPopupComponent } from '../editcatalogitempopup/editcatalogitempopup.component';


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
  catalog: any = [];
  editcataItemdialogRef;
  addCatalogItems: any = [];
  itemsforadd: any = [];
  selecteditemCount = 0;
  catalogSelectedItemsadd: any = [];
  seletedCatalogItemsadd: any = {};
  heading = 'Add items to catalogue';

  constructor(private router: Router,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    public dialog: MatDialog,
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
    if (this.action === 'edit' || this.action === 'add' && this.cataId !== 'add') {
      this.heading = 'Edit catalogue items';
      this.getCatalog();
    } else {
      this.addCatalogItems = this.shared_functions.getitemfromLocalStorage('selecteditems');
      console.log(this.addCatalogItems);
    }
    
  }
  ngOnDestroy() {
  }


  getCatalog() {
    this.provider_servicesobj.getProviderCatalogs(this.cataId)
      .subscribe((data) => {
        this.catalog = data;
        this.api_loading = false;
        if (this.catalog.catalogItem) {
          this.seletedCatalogItems = this.catalog.catalogItem;
          console.log(this.seletedCatalogItems);
          console.log(this.catalogItem);
        }
        if (this.action === 'add' && this.cataId !== 'add') {
          this.heading = 'Add items to catalogue';
          this.itemsforadd = [];
          this.itemsforadd = this.catalogItem.filter(o1 => this.seletedCatalogItems.filter(o2 => o2.item.itemId === o1.itemId).length === 0);
          
        //     for (const itm of this.catalogItem) {
        //     for (const selitem of this.seletedCatalogItems) {
        //        if (itm.itemId === selitem.item.itemId) {
        //         console.log('gh');
        //         this.itemsforadd.push(itm);
        //        }
        //     }
        // }
        console.log(this.itemsforadd);
        }
       
      });
  }
  getitems() {
    this.provider_servicesobj.getProviderItems()
      .subscribe((data) => {
        this.catalogItem = data;
        this.api_loading = false;
        for (const itm of this.catalogItem) {
          itm.minQuantity = '1';
          itm.maxQuantity = '5';
         }
         if (this.addCatalogItems && this.addCatalogItems.length > 0) {
          this.selectedCount = this.addCatalogItems.length;
         for (const itm of this.catalogItem) {
            for (const selitem of this.addCatalogItems) {
               if (itm.itemId === selitem.item.itemId) {
                itm.selected = true;
                itm.id = selitem.id;
                itm.minQuantity = selitem.minQuantity;
                itm.maxQuantity = selitem.maxQuantity;
               }
            }
        }
         }

        // if (this.seletedCatalogItems !== null) {
        //   this.selectedCount = this.seletedCatalogItems.length;
        //   console.log(this.selectedCount);
        //   console.log(this.catalogItem);
        //   for (const itm of this.catalogItem) {
        //     for (const selitem of this.seletedCatalogItems) {
        //        if (itm.itemId === selitem.item.itemId) {
        //         itm.selected = true;
        //         itm.id = selitem.id;
        //         itm.minQuantity = selitem.minQuantity;
        //         itm.maxQuantity = selitem.maxQuantity;
        //        }
        //     }
        // }
        //   console.log(this.catalogItem);

        // } 
      });
  }
  selectItem(index) {
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
  selectaddItem(index) {
    console.log(this.itemsforadd[index].selected);
    if (this.itemsforadd[index].selected === undefined || this.itemsforadd[index].selected === false) {
      this.itemsforadd[index].selected = true;
      this.selecteditemCount++;
    } else {
      this.itemsforadd[index].selected = false;
      this.selecteditemCount--;
    }
    console.log(this.itemsforadd[index].selected);
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
    console.log(this.addCatalogItems);
        this.shared_functions.setitemonLocalStorage('selecteditems', this.catalogItemsSelected);
        const navigationExtras: NavigationExtras = {
          queryParams: { action: 'add',
                          isFrom: true }
    };
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add'], navigationExtras);
  }

  deleteCatalogItem(itm) {
    console.log(itm);
    console.log(this.cataId);

    this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': 'Do you really want to remove this item from catalogue?'
      }
    });
    this.removeitemdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api_loading = true;
        this.provider_servicesobj.deleteCatalogItem(this.cataId, itm.item.itemId).subscribe(
          (data) => {
            this.getCatalog();
            this.api_loading = false;
          }, error => {
            this.api_loading = false;
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
            );
      }
    });
  }
  editCatalogItem(item) {
    console.log(item);
    this.editcataItemdialogRef = this.dialog.open(EditcatalogitemPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        id: item.item.itemId,
        maxquantity: item.maxQuantity,
        minquantity: item.minQuantity

      }
    });
    this.editcataItemdialogRef.afterClosed().subscribe(result => {
      if (result) {
       console.log(result);
       this.api_loading = true;
       this.updateItems(result, item.id);
      }
    });
  }
  
  redirecToJaldeecatalog() {
    if (this.action === 'edit' || this.action === 'add' &&  this.cataId !== 'add') {
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
    this.provider_servicesobj.addCatalogItems(this.cataId, addlist).subscribe(
      (data) => {
        this.api_loading = false;
        this.shared_functions.openSnackBar('Items addeded');
        const navigationExtras: NavigationExtras = {
        queryParams: { action: 'edit',
                        isFrom: true }
      };
      this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', this.cataId], navigationExtras);

      }, error => {
        this.api_loading = false;
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
        );
  }
  updateItems(updatelist, id) {
    console.log(updatelist);
    const passlist: any = {};
      passlist.id = id;
      passlist.maxQuantity = updatelist.maxquantity;
      passlist.minQuantity = updatelist.minquantity;
      console.log(passlist);
     this.provider_servicesobj.updateCatalogItem(passlist).subscribe(
      (data) => {
        this.getCatalog();
        this.api_loading = false;
      }, error => {
        this.api_loading = false;
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
     );
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

selectedaddItems() {
  this.api_loading = true;
  this.catalogSelectedItemsadd = [];
  for (let ia = 0; ia < this.itemsforadd.length; ia++) {
    this.seletedCatalogItemsadd = {};
    this.selecteditemforadd = [];
    console.log('minquty_' + this.itemsforadd[ia].itemId + '');
    if (this.itemsforadd[ia].selected === true) {
     this.seletedCatalogItemsadd.minQuantity = (<HTMLInputElement>document.getElementById('minquty_' + this.itemsforadd[ia].itemId + '')).value || '1';
     this.seletedCatalogItemsadd.maxQuantity = (<HTMLInputElement>document.getElementById('maxquty_' + this.itemsforadd[ia].itemId + '')).value || '5';
     this.seletedCatalogItemsadd.item = this.itemsforadd[ia];
     this.catalogSelectedItemsadd.push(this.seletedCatalogItemsadd);
    }
  }
  if (this.catalogSelectedItemsadd.length > 0) {
  this.addItems(this.catalogSelectedItemsadd);
  }
    }


}
