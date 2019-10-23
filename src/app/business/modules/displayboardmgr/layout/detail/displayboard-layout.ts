import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Messages } from '../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-displayboard-layout',
    templateUrl: './displayboard-layout.html'
})
export class DisplayboardLayoutComponent implements OnInit {

    amForm: FormGroup;
    char_count = 0;
    max_char_count = 250;
    isfocused = false;
    layout_id;
    cancel_btn = Messages.CANCEL_BTN;
    button_title = 'Save';
    service = false;
    statussel = false;
    statussel1 = false;
    statusse2 = false;
    statussel3 = false;
    layoutData: any = [];
    action = 'show';
    api_loading: boolean;
    name;
    layout;
    displayName;
    metric: any = [];
    id;
    board_list: any = [];
    displayBoardData: any = [];
    breadcrumbs_init = [
        {
            title: 'Settings',
            url: '/provider/settings'
        },
        {
            title: 'Displayboard',
            url: '/provider/settings/displayboard'
        },
        {
            title: 'Layouts',
            url: '/provider/settings/displayboard/layout'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    actionparam = 'show';
    constructor(
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        private router: Router,
        private shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute
    ) {
        this.activated_route.params.subscribe(params => {
            this.actionparam = params.id;
        }
        );
        this.activated_route.queryParams.subscribe(
            qparams => {
                this.layout_id = qparams.id;
                if (this.layout_id) {
                    this.editLayoutbyId(qparams.id);
                } else {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                }
            });
     }
    ngOnInit() {
        this.getDisplayboards();
    }
    editLayoutbyId(id) {
        this.provider_services.getBoardLayout(id).subscribe(data => {
            this.layoutData = data;
            console.log(this.layoutData);
            console.log(this.displayBoardData);
            this.displayBoardData = data;
            const breadcrumbs = [];
            this.breadcrumbs_init.map((e) => {
                breadcrumbs.push(e);
            });
            breadcrumbs.push({
                title: this.layoutData.name
            });
            this.breadcrumbs = breadcrumbs;
            this.name = this.layoutData.name;
            this.displayName = this.layoutData.displayName;
            this.layout = this.layoutData.layout;
            this.id = this.layoutData.id;


        });
    }
    onSubmit() {
        console.log( this.metric);
        if (this.actionparam === 'add') {
            const post_data = {
                'name': this.name,
                'layout': this.layout,
                'displayName': this.displayName,
                'metric': this.metric,
            };
            this.provider_services.createBoardLayout(post_data).subscribe(data => {
                this.editLayoutbyId(data);
            });
        }
        if (this.actionparam === 'edit') {
            const post_data = {
                'id': this.layoutData.id,
                'name': this.name,
                'layout': this.layout,
                'displayName': this.displayName,
                'metric': this.metric
            };
            this.provider_services.updateBoardLayout(post_data).subscribe(data => {
                this.editLayoutbyId(data);
            },
                error => {
                });
        }
        this.actionparam = 'view';

    }
    getDisplayboards() {
        this.api_loading = true;
        this.board_list = [];
        this.provider_services.getDisplayboards()
            .subscribe(
                data => {
                    this.board_list = data;

                    console.log( this.board_list);
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.shared_functions.apiErrorAutoHide(this, error);
                }
            );
    }
    editlayout(id) {
        this.actionparam = 'edit';
        this.editLayoutbyId(id);
    }
    // deleteDisplayboardLayout(layout_id) {
    //     this.provider_services.deleteBoardLayout(layout_id)
    //         .subscribe(
    //             data => {
    //             },
    //             error => {
    //             }
    //         );
    // }
    resetApiErrors() {
    }
    handlestatus( ) {
        this.layout = '1x1';
        // this.metric = ["position" : '0_0']
        this.statussel = true;
        this.statussel1 = false;
        this.statusse2 = false;
        this.statussel3 = false;
    }
    chooselayout11(id, ldata) {
        console.log( this.metric);
        console.log(this.id);
        this.metric.push({'position' : ldata, 'sbId' : id});
    }
    chooselayout12(id, ldata) {
        console.log( this.metric);
        console.log(this.id);
        this.metric.push({'position' : ldata, 'sbId' : id});
        console.log( this.metric);
    }
    chooselayout21(id, ldata) {
        console.log( this.metric);
        console.log(this.id);
        this.metric.push({'position' : ldata, 'sbId' : id});
        console.log( this.metric);
    }
    chooselayout22(id, ldata) {
        console.log( this.metric);
        console.log(this.id);
        this.metric.push({'position' : ldata, 'sbId' : id});
        console.log( this.metric);
    }
    handlestatus1() {
        this.layout = '1x2';
        this.statussel1 = true;
        this.statussel = false;
        this.statusse2 = false;
        this.statussel3 = false;
    }
    handlestatus2() {
        this.layout = '2x1';
        this.statussel1 = false;
        this.statussel = false;
        this.statusse2 = true;
        this.statussel3 = false;
    }
    handlestatus3() {
        this.layout = '2x2';
        this.statussel1 = false;
        this.statussel = false;
        this.statusse2 = false;
        this.statussel3 = true;
    }
}
