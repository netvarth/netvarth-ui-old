import { AfterViewInit, ElementRef, OnInit, Renderer2, RendererFactory2, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TwilioService } from "../../../shared/services/twilio-service";
import { Location } from '@angular/common';
import { interval as observableInterval, Subscription } from 'rxjs';
import { MeetService } from "../../../shared/services/meet-service";
import { Title } from "@angular/platform-browser";
import { SnackbarService } from "../../../shared/services/snackbar.service";
@Component({
    selector: 'app-meeting-room',
    templateUrl: './meeting-room.component.html',
    styleUrls: ['./meeting-room.component.css']
})
/**
 * Class for a provider to join a meeting
 */
export class MeetingRoomComponent implements OnInit, AfterViewInit {
    uuid: any;
    type;
    screenWidth: number;
    screenHeight: number;
    cameraMode = 'user';
    refreshTime = 10;
    private renderer: Renderer2;
    status = '';
    meetObj;
    loading = true;
    consumerReady = false;
    cronHandle: Subscription;
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;
    constructor(private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        public rendererFactory: RendererFactory2,
        private _location: Location,
        private meetService: MeetService,
        private titleService: Title,
        private snackbarService: SnackbarService,
        private router: Router
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.titleService.setTitle('Jaldee Business - Video');
        this.renderer = rendererFactory.createRenderer(null, null);
        console.log(this.renderer);
        this.activateroute.params.subscribe(
            (params) => {
                this.uuid = params['id'];
                this.type = this.uuid.substring((this.uuid.lastIndexOf('_') + 1), this.uuid.length);
            }
        )
    }

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

        this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
            this.isConsumerReady();
        });

        // this.sharedServices.getApptMeetingDetailsProvider(this.uuid).subscribe(
        //     (tokenObj: any) => {
        //         console.log(tokenObj);
        //         // this.access_token = tokenObj.token;
        //         this.twilioService.localVideo = this.localVideo;
        //         this.twilioService.remoteVideo = this.remoteVideo;
        //         this.connect(tokenObj);
        //     }
        // );
    }
    /**
     * function which marks the provider readiness and returns a token to connect
     * to the room when the consumer is ready
     */
    isConsumerReady() {
        const _this = this;
        _this.meetService.isConsumerReady(_this.uuid)
            .subscribe(data => {
            //    this.result = data;
            //    console.log(this.result)            
               if(data){
                   _this.loading = false;
                   _this.meetObj = data;
                   _this.consumerReady = true;
                   console.log(this.meetObj);
                   _this.status = 'Ready..'
                if (_this.cronHandle) {
                    _this.cronHandle.unsubscribe();  
                }                               
               } else {
                   _this.loading = false;
                    _this.consumerReady = false;
                    _this.meetObj = null;
                    _this.status = 'Waiting for the consumer...'
               }
        },  error => {
            _this.loading = false;
            _this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
            _this.cronHandle.unsubscribe();
            setTimeout(() => {
                _this._location.back();
            }, 3000);
        });
    }

    /**
     * executes after the view initialization
     */
    ngAfterViewInit() {
        this.twilioService.previewContainer = this.previewContainer;
        this.twilioService.previewMedia();  
    }
    /**
     * invokes when the page destroys
     */
    ngOnDestroy() { 
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
        this.disconnect(); 
    }
    /**
     * Method to exit from a meeting
     */
    disconnect() {
        // if (this.twilioService.previewTracks) {
        //     this.twilioService.previewTracks.forEach(localTrack => {
        //         localTrack.stop();
        //     });
        // }
        // if (this.twilioService.activeRoom && this.twilioService.activeRoom !== null) {
        //     this.twilioService.activeRoom.disconnect();
        //     this.twilioService.activeRoom = null;
        //     this._location.back();
        // } else {
            this.twilioService.disconnect();
            this._location.back();
        // }
    }

    /**
     * Method to connect to a room
     */
    joinRoom() {
        if (this.consumerReady) {
            console.log(this.meetObj);
            this.twilioService.localVideo = this.localVideo;
            this.twilioService.remoteVideo = this.remoteVideo;
            this.connect(this.meetObj);

        }
        // this.activateroute.params.subscribe(params => {
        //     const videoId = params.id;
        // this.sharedServices.getJaldeeVideoAccessToken(videoId).subscribe(
        //     (tokenObj: any) => {
        //         console.log(tokenObj);
        //         // this.access_token = tokenObj.token;
        //         this.twilioService.localVideo = this.localVideo;
        //         this.twilioService.remoteVideo = this.remoteVideo;
        //         this.connect(tokenObj);
        //     }
        // );
        // });
    }
    /**
     * inner method to connect to the room
     * @param tokenObj Token object which hold the key and room name
     */
    connect(tokenObj) {
        console.log(tokenObj.tokenId);
        this.twilioService.cameraMode = 'user';
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
        if (this.twilioService.cameraMode === 'user') {
            this.twilioService.switchCamera('environment');
        } else {
            this.twilioService.switchCamera('user');
        }
    }
}
