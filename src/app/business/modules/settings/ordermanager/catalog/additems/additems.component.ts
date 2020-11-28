import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
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
    constructor(private router: Router,
        public shared_functions: SharedFunctions,
        private provider_servicesobj: ProviderServices) {
        this.emptyMsg = this.shared_functions.getProjectMesssages('ITEM_LISTEMPTY');
    }

    ngOnInit() {
        const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.domain = user.sector;
        this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
        this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
        this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
        this.getitems();
    }
    ngOnDestroy() {
    }
    getitems() {
        this.provider_servicesobj.getProviderItems()
            .subscribe(data => {
                this.catalogItem = data;
                console.log(this.catalogItem);
                
            });
    }
    selectItem(item, index) {
        console.log(this.catalogItem[index].selected);
        if (this.catalogItem[index].selected === undefined || this.catalogItem[index].selected === false) {
            this.catalogItem[index].selected = true;
            this.selecteditems.push(item);
        } else {
            this.catalogItem[index].selected = false;
            this.selecteditems.splice(index, 1);
        }
        console.log(this.selecteditems);
    }
    redirecToJaldeecatalogcreation() {
        this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add']);
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/billing->items']);
    }

}
