import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../app.component';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
    dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
    tooltipcls = '';
    name_cap = Messages.ITEM_NAME_CAP;
    price_cap = Messages.PRICES_CAP;
    taxable_cap = Messages.TAXABLE_CAP;
    edit_btn = Messages.EDIT_BTN;
    delete_btn = Messages.DELETE_BTN;
    add_item_cap = 'ADD CATALOG';
    item_enable_btn = Messages.ITEM_ENABLE_CAP;
    catalog_list: any = [];
    query_executed = false;
    emptyMsg = '';
    domain;
    breadcrumb_moreoptions: any = [];
    frm_items_cap = 'Catalog creation and management';
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
            title: 'Items',
            url: '/provider/settings/ordermanager/items'
        }
    ];
    item_status = projectConstants.ITEM_STATUS;
    breadcrumbs = this.breadcrumbs_init;
    itemnameTooltip = 'Click here to edit catalog';
    additemdialogRef;
    edititemdialogRef;
    statuschangedialogRef;
    removeitemdialogRef;
    isCheckin;
    active_user;
    order = 'status';
    constructor(private provider_servicesobj: ProviderServices,
        public shared_functions: SharedFunctions,
        private router: Router, private dialog: MatDialog,
        private routerobj: Router,
        private sharedfunctionObj: SharedFunctions) {
        this.emptyMsg = 'No Catalogs found';
    }

    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.getCatalog();
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.isCheckin = this.sharedfunctionObj.getitemFromGroupStorage('isCheckin');
        this.sharedfunctionObj.removeitemfromLocalStorage('selecteditems');
    }
    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy() {
        if (this.additemdialogRef) {
            this.additemdialogRef.close();
        }
        if (this.edititemdialogRef) {
            this.edititemdialogRef.close();
        }
        if (this.statuschangedialogRef) {
            this.statuschangedialogRef.close();
        }
        if (this.removeitemdialogRef) {
            this.removeitemdialogRef.close();
        }
    }
    performActions(action) {
        if (action === 'learnmore') {
            this.routerobj.navigate(['/provider/' + this.domain + '/billing->items']);
        }
    }

    getCatalog() {
        this.provider_servicesobj.getProviderCatalogs()
            .subscribe(data => {
                this.catalog_list = data;
                this.query_executed = true;
            });
    }
    getItemPic(img) {
        return this.sharedfunctionObj.showlogoicon(img);
    }

    formatPrice(price) {
        return this.sharedfunctionObj.print_PricewithCurrency(price);
    }
    addCatalog() {
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add']);
    }
    editCatalog(catalog) {
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'edit' }
        };
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', catalog.id], navigationExtras);
    }
    dochangeStatus(catalog) {
        if (catalog.catalogStatus === 'ACTIVE') {
            const stat = 'INACTIVE';
            this.provider_servicesobj.stateChangeCatalog(catalog.id, stat).subscribe(
                () => {
                    this.getCatalog();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        } else {
            const stat = 'ACTIVE';
            this.provider_servicesobj.stateChangeCatalog(catalog.id, stat).subscribe(
                () => {
                    this.getCatalog();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
        }
    }
    changeStatus(catalogid) {
        this.provider_servicesobj.enableItem(catalogid)
            .subscribe(
                () => {
                    this.getCatalog();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    showDetails(id) {
        if (!id) {
            return;
        }
        const navigationExtras: NavigationExtras = {
            queryParams: { action: 'view' }
        };
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', id], navigationExtras);
    }

    doRemoveCatalog(catalog) {
        const id = catalog.id;
        if (!id) {
            return false;
        }
        this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
            width: '50%',
            panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
            disableClose: true,
            data: {
                'message': this.sharedfunctionObj.getProjectMesssages('ITEM_DELETE').replace('[name]', catalog.catalogName)
            }
        });
        this.removeitemdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteItem(id);
            }
        });
    }

    deleteItem(id) {
        this.provider_servicesobj.deleteItem(id)
            .subscribe(
                () => {
                    this.getCatalog();
                },
                error => {
                    this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                }
            );
    }
    learnmore_clicked(mod, e) {
        e.stopPropagation();
        this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
    }
    redirecToJaldeeIordermanager() {
        this.routerobj.navigate(['provider', 'settings' , 'ordermanager']);
    }
    redirecToHelp() {
        this.routerobj.navigate(['/provider/' + this.domain + '/billing->items']);
    }

}
