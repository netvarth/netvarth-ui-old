import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../../shared/services/shared-services';

@Component({
    selector: 'app-consumer-livetrack',
    templateUrl: './livetrack.component.html'
})
export class ConsumerLiveTrackComponent implements OnInit {

    uuid: any;
    accountId: any;
    trackTimeChange = false;
    trackMode = false;
    trackUuid;
    liveTrack = false;
    source: any = [];
    travelMode = 'DRIVING';
    notifyTime = 'ONEHOUR';
    notifyAutomatic = true;
    shareLoc = false;
    lat_lng = {
        latitude: 0,
        longitude: 0
    };
    driving = true;
    walking: boolean;
    bicycling: boolean;
    liveTrackMessage;
    track_loading: boolean;
    api_error: any;
    api_loading: boolean;
    constructor(public router: Router,
        public route: ActivatedRoute,
        public shared_functions: SharedFunctions,
        private shared_services: SharedServices) {
        this.route.params.subscribe(
            params => {
                this.uuid = params.id;
            });
        this.route.queryParams.subscribe(
            params => {
                this.accountId = params.account_id;
            });
    }

    breadcrumbs;
    breadcrumb_moreoptions: any = [];
    activeWt: any;

    ngOnInit() {
        this.breadcrumbs = [
            {
                title: 'Checkin',
                url: ''
            },
            {
                title: 'Payment'
            }
        ];
        this.shared_services.getCheckinByConsumerUUID(this.uuid, this.accountId).subscribe(
            (wailist: any) => {
                this.activeWt = wailist;
                console.log(this.activeWt);
            },
            () => {
            }
        );
    }

    getTravelMod(event) {
        this.trackMode = false;
        this.travelMode = event;
        if (event === 'DRIVING') {
            this.driving = true;
            this.walking = false;
            this.bicycling = false;
        } else if (event === 'WALKING') {
            this.walking = true;
            this.driving = false;
            this.bicycling = false;
        } else {
            this.walking = false;
            this.driving = false;
            this.bicycling = true;
        }
        this.saveLiveTrackTravelModeInfo().then(
            data => {
                this.api_loading = true;
                this.liveTrackMessage = this.shared_functions.getLiveTrackStatusMessage(data, this.activeWt.providerAccount.businessName, this.travelMode);
            },
            error => {
                this.api_error = this.shared_functions.getProjectErrorMesssages(error);
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
            });
    }
    getNotifyTime(time) {
        this.notifyTime = time;
    }
    saveLiveTrackTravelModeInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const passdata = {
                'travelMode': _this.travelMode
            };
            _this.shared_services.updateTravelMode(_this.trackUuid, _this.accountId, passdata)
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    saveLiveTrackInfo() {
        this.track_loading = true;
        const _this = this;
        return new Promise(function (resolve, reject) {
            const post_Data = {
                'jaldeeGeoLocation': {
                    'latitude': _this.lat_lng.latitude,
                    'longitude': _this.lat_lng.longitude
                },
                'travelMode': _this.travelMode,
                'waitlistPhoneNumber': _this.activeWt.waitlistingFor[0].phoneNo,
                'jaldeeStartTimeMod': _this.notifyTime,
                'shareLocStatus': _this.shareLoc
            };
            _this.shared_services.addLiveTrackDetails(_this.trackUuid, _this.accountId, post_Data)
                .subscribe(
                    data => {
                        resolve(data);

                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    saveLiveTrackDetails() {
        this.track_loading = true;
        this.updateLiveTrackInfo().then(
            data => {
                this.trackClose('livetrack');
                this.track_loading = false;
            },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
            });
    }
    trackClose(status) {
        if (status === 'livetrack') {
            if (this.shareLoc) {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('TRACKINGCANCELENABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
            } else {
                this.shared_functions.openSnackBar(this.shared_functions.getProjectMesssages('TRACKINGCANCELDISABLED').replace('[provider_name]', this.activeWt.providerAccount.businessName));
            }
            this.router.navigate(['/']);
        }
    }
    updateLiveTrackInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            const post_Data = {
                'jaldeeGeoLocation': {
                    'latitude': _this.lat_lng.latitude,
                    'longitude': _this.lat_lng.longitude
                },
                'travelMode': _this.travelMode,
                'waitlistPhoneNumber': _this.activeWt.waitlistingFor[0].phoneNo,
                'jaldeeStartTimeMod': _this.notifyTime,
                'shareLocStatus': _this.shareLoc
            };
            _this.shared_services.updateLiveTrackDetails(_this.trackUuid, _this.accountId, post_Data)
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
}
