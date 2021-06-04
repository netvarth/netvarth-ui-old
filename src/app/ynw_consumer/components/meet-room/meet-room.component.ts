import { AfterViewInit, ChangeDetectorRef, ElementRef, OnInit, Renderer2, RendererFactory2, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { TwilioService } from "../../../shared/services/twilio-service";
import { MeetService } from "../../../shared/services/meet-service";
import { Title } from "@angular/platform-browser";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { SubSink } from "subsink";
import { MatDialog } from "@angular/material/dialog";
import { AddInboxMessagesComponent } from "../../../shared/components/add-inbox-messages/add-inbox-messages.component";
// import { TeleBookingService } from "../../../shared/services/tele-bookings-service";
import { interval as observableInterval } from 'rxjs';

@Component({
    selector: 'app-meet-room',
    templateUrl: './meet-room.component.html',
    styleUrls: ['./meet-room.component.css']
})
/**
 * Class for a provider to join a meeting
 */
export class MeetRoomComponent implements OnInit, AfterViewInit {
    uuid: any;
    type;
    screenWidth: number;
    screenHeight: number;
    cameraMode = 'user';
    refreshTime = 10;
    private renderer: Renderer2;
    status = '';
    meetObj;
    recordingFlag: boolean = true;
    loading = true;
    booking;
    consumerReady = false;
    subs = new SubSink();
    btnClicked = false;
    linkStatus: any;
    meetingStatus: string;
    showRejoinBt: boolean;
    showEndBt: boolean;
    btndisabled = true;
    showStartBt: boolean;
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;
    chatDialog: any;
    Id: any;
    checkId: any;
    custId: any;
    constructor(private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        public rendererFactory: RendererFactory2,
        private meetService: MeetService,
        private titleService: Title,
        private snackbarService: SnackbarService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        // private teleService: TeleBookingService,
        private activated_route: ActivatedRoute,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.titleService.setTitle('Jaldee Business - Video');
        this.renderer = rendererFactory.createRenderer(null, null);
        console.log(this.renderer);
        this.subs.sink = this.activateroute.params.subscribe(
            (params) => {
                this.uuid = params['id'];
                this.type = this.uuid.substring((this.uuid.lastIndexOf('_') + 1), this.uuid.length);
                // this.getTeleBooking(this.uuid, this.type);
            }
        )
        // this.getRecordingStatus().then(
        //     (recordStatus: boolean) => {
        //         this.recordingFlag = recordStatus;
        //     }
        // );
        this.activated_route.params.subscribe(params => {
            // this.custId = params.custId;
            this.Id = params.id;
            console.log(this.Id)
           this.checkId = this.Id.startsWith("p");
            console.log(this.checkId)

        })
        this.activated_route.queryParams.subscribe(qparams => {
            this.custId = qparams.custId;
            console.log(this.custId);
        })
    }
    updateRecordingFlag(event) {
        this.isConsumerReady();
    }

    // getTeleBooking(uuid, type) {
    //     const _this = this;
    //     // return new Promise(function (resolve, reject) {
    //     if (type === 'appt') {
    //         _this.teleService.getTeleBookingFromAppt(uuid, 'provider').then(
    //             (booking: any) => {
    //                 _this.booking = booking;
    //             }, (error) => {
    //                 console.log(error);
    //             }
    //         )
    //     } else {
    //         _this.teleService.getTeleBookingFromCheckIn(uuid, 'provider').then(
    //             (booking: any) => {
    //                 _this.booking = booking;
    //             }, (error) => {
    //                 console.log(error);
    //             }
    //         )
    //     }
    //     // });
    // }
    // getRecordingStatus() {
    //     return new Promise((resolve, reject) => {
    //         this.subs.sink = this.meetService.getJaldeeVideoSettings().subscribe(
    //             (data: any) => {
    //                 resolve(data.videoRecording);
    //             }, (error) => {
    //                 reject(error);
    //             });
    //     });
    // }

    /**
     * Init method
     */
    ngOnInit(): void {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        const isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
    }
    /**
     * function which marks the provider readiness and returns a token to connect
     * to the room when the consumer is ready
     */
    isConsumerReady() {
        if(this.checkId === true){
            const _this = this;
            const post_data = {
                id: this.Id,
                recordingFlag: 'true',
    
            };
            _this.subs.sink = _this.meetService.isConsumerReadyMeet(post_data)
                .subscribe((data: any) => {
                    if (data) {
                        _this.loading = false;
                        _this.meetObj = data;
                        _this.consumerReady = true;
                        _this.recordingFlag = data.recordingFlag;
                        // console.log(this.meetObj);
                        _this.status = 'Ready..';
                        _this.subs.unsubscribe();
                    } else {
                        _this.loading = false;
                        _this.consumerReady = false;
                        _this.meetObj = null;
                        // _this.status = 'Waiting for the consumer...'
                        _this.status = 'Waiting for Consumer';
                    }
                }, error => {
                    _this.loading = false;
                    _this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                    _this.subs.unsubscribe();
                    _this.disconnect();
    
                });
        
    }
    else{
        const _this = this;
        const post_data = {
            id: this.Id,
        };
        _this.subs.sink = _this.meetService.isConsumerReadyMeet(post_data)
            .subscribe((data: any) => {
                if (data) {
                    _this.loading = false;
                    _this.meetObj = data;
                    _this.consumerReady = true;
                    _this.recordingFlag = data.recordingFlag;
                    // console.log(this.meetObj);
                    _this.status = 'Ready..';
                    _this.subs.unsubscribe();
                } else {
                    _this.loading = false;
                    _this.consumerReady = false;
                    _this.meetObj = null;
                    // _this.status = 'Waiting for the consumer...'
                    _this.status = 'Waiting for "' + this.booking.bookingFor + '" to start';
                }
            }, error => {
                _this.loading = false;
                _this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                _this.subs.unsubscribe();
                _this.disconnect();

            });
    }
       
    }

    /**
     * executes after the view initialization
     */
    ngAfterViewInit() {
        console.log("ngAfterViewInit");
        this.cd.detectChanges();
        // this.isConsumerReady();
        this.subs.sink = observableInterval(this.refreshTime * 500).subscribe(() => {
            this.isLinkExpired();
            this.getMeetingStatus();
            this.isConsumerReady();
        });
        this.twilioService.previewContainer = this.previewContainer;
        this.twilioService.previewMedia();
    }
    /**
     * invokes when the page destroys
     */
    ngOnDestroy() {
        // if (this.cronHandle) {
        //     this.cronHandle.unsubscribe();
        // }
        this.subs.unsubscribe();
    }
    /**
     * Method to exit from a meeting
     */
    disconnect() {
        this.twilioService.disconnect();
        console.log(this.custId)
        // let type = this.type;
        // if (this.type === 'wl') {
        //     type = 'checkin'
        // }
        const navigationExtras: NavigationExtras = {
            queryParams: {
                type: 'video',
                id: this.Id
            }
        };
        // this.location.back();
        this.router.navigate(['provider', 'customers' , this.custId], navigationExtras);
    }

    /**
     * 
     */
    openChat() {
        const _this = this;
        const pass_ob = {};
        pass_ob['source'] = 'consumer-waitlist';
        pass_ob['user_id'] = _this.booking.id;
        pass_ob['name'] = _this.booking.businessName;
        pass_ob['typeOfMsg'] = 'single';
        pass_ob['uuid'] = _this.booking.id;
        if (this.type === 'appt') {
            pass_ob['appt'] = _this.type;
        } else if (this.type === 'orders') {
            pass_ob['orders'] = this.type;
        }
        this.chatDialog = this.dialog.open(AddInboxMessagesComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class'],
            disableClose: true,
            autoFocus: true,
            data: pass_ob
        });
        this.chatDialog.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    }
    /**
     * Method to connect to a room
     */
    joinRoom() {
        this.btnClicked = true;
        if (this.consumerReady) {
            this.twilioService.localVideo = this.localVideo;
            this.twilioService.remoteVideo = this.remoteVideo;
            this.connect(this.meetObj);
        }
    }
    /**
     * inner method to connect to the room
     * @param tokenObj Token object which hold the key and room name
     */
    connect(tokenObj) {
        console.log("Token Id:" + tokenObj.tokenId);
        // this.twilioService.cameraMode = 'user';
        this.twilioService.connectToRoom(tokenObj.tokenId, {
            name: tokenObj.roomName,
            audio: true,
            video: { height: '100%', frameRate: 24, width: '100%', facingMode: 'user' },
            bandwidthProfile: {
                video: {
                    mode: 'collaboration',
                    maxTracks: 10,
                    dominantSpeakerPriority: 'standard',
                    renderDimensions: {
                        high: { height: 1080, width: 1980 },
                        standard: { height: 720, width: 1280 },
                        low: { height: 176, width: 144 }
                    }
                }
            },
            dominantSpeaker: true,
            maxAudioBitrate: 16000,
            preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
            networkQuality: { local: 1, remote: 1 }
        });
    }
    unmuteVideo() {
        this.twilioService.unmuteVideo();
    }

    muteVideo() {
        this.twilioService.muteVideo();
    }
    muteAudio() {
        this.twilioService.muteAudio();
    }
    unmuteAudio() {
        this.twilioService.unmuteAudio();
    }
    /**
     * Mute Local Audio
     */
    mute() {
        this.twilioService.mute();
    }
    /**
     * Unmute Local Audio
     */
    unmute() {
        this.twilioService.unmute();
    }
    /**
     * Stop Local Video
     */
    stopVideo() {
        this.twilioService.disableVideo();
    }
    /**
     * Start Local Video
     */
    startVideo() {
        this.twilioService.enableVideo();
    }
    /**
     * Method to switch both from and back cameras
     */
    switchCamera() {
        this.twilioService.switchCamera();
    }
    isLinkExpired(){
        this.meetService.linkExpired(this.Id).subscribe(
            (data: any) => {
                this.linkStatus = data.linkStatus;
                if(this.linkStatus === 'ENABLED'){
                    this.showStartBt = true;
                }
                else{
                    this.showStartBt = false; 
                }
            }
        ); 
      }
      getMeetingStatus(){
        this.meetService.getStats(this.Id).subscribe(
            (data: any) => {
                this.meetingStatus = data.meetingStatus;
                if(this.meetingStatus === 'REQUESTED'){
                    this.showStartBt = true;
                    this.showRejoinBt = false;
                    this.showEndBt = false;
                    this.btndisabled = false;
                }
                else if(this.meetingStatus === 'INTERRUPTED'){
                    this.showStartBt = false; 
                    this.showRejoinBt = true;
                    this.showEndBt = false;
                    this.btndisabled = false;
                }
                else if(this.meetingStatus === 'STARTED'){
                    this.showStartBt = true; 
                    this.showRejoinBt = false;
                    this.showEndBt = false;
                    this.btndisabled = false;
                }
                else{
                    this.showStartBt = false; 
                    this.showRejoinBt = false;
                    this.showEndBt = true;
                    this.btndisabled = true;
                }
            }
        ); 
      }
}
