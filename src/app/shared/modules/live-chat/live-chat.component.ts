import { ViewChild, OnInit, OnDestroy, ElementRef, Component, AfterViewInit, Renderer2, RendererFactory2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwilioService } from '../../services/twilio-service';
import { Location } from '@angular/common';
import { interval as observableInterval, Subscription } from 'rxjs';
import { MeetService } from '../../services/meet-service';
import { SnackbarService } from '../../services/snackbar.service';
import { SubSink } from 'subsink';
import { TeleBookingService } from '../../services/tele-bookings-service';
@Component({
    selector: 'app-live-chat',
    templateUrl: './live-chat.component.html',
    styleUrls: ['./live-chat.component.css']
})
/**
 * Class for Meeting Room for a consumer
 */
export class LiveChatComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('localVideo') localVideo: ElementRef;  // To show the local participant video
    @ViewChild('previewContainer') previewContainer: ElementRef; 
    @ViewChild('remoteVideo') remoteVideo: ElementRef; // To show the remote participant video
    room_name;
    access_token;
    app_id;
    screenWidth: number;
    screenHeight: number;
    videoId: any;
    cameraMode = 'user';
    loading = true;
    providerReady = false;
    cronHandle: Subscription;
    private renderer: Renderer2;
    uuid: any;
    result;
    meetObj;
    type: any;
    status: string;
    refreshTime = 10;
    booking;
    subs = new SubSink();
    source;
    account;
    recordingFlag = false;
    constructor(
        private location: Location,
        private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        private meetService: MeetService,
        public rendererFactory: RendererFactory2,
        private snackbarService: SnackbarService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private teleService: TeleBookingService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.renderer = rendererFactory.createRenderer(null, null);
        console.log(this.renderer);
        // window.addEventListener('unload', () => {
        //     this.disconnect();
        // });
        this.subs.sink = this.activateroute.queryParams.subscribe(
            (qParams) => {
                if (qParams['src']) {
                    this.source = qParams['src'];
                }
                if (qParams['account']) {
                    this.account = qParams['account'];
                }
            } 
        )
        this.subs.sink = this.activateroute.params.subscribe(
            (params) => {
                this.uuid = params['id'];
                this.type = this.uuid.substring((this.uuid.lastIndexOf('_') + 1), this.uuid.length);
                this.getTeleBooking(this.uuid, this.type, this.account);                       
            }
        );
    }
    
    getTeleBooking(uuid, type, account?) {
        const _this = this;
        // return new Promise(function (resolve, reject) {
        if (type === 'appt') {
            _this.teleService.getTeleBookingFromAppt(uuid, 'consumer', account).then(
                (booking: any) => {
                    _this.booking = booking;
                }, (error) => {
                    console.log(error);
                }
            )
        } else {
            _this.teleService.getTeleBookingFromCheckIn(uuid, 'consumer', account).then(
                (booking: any) => {
                    _this.booking = booking;
                }, (error) => {
                    console.log(error);
                }
            )
        }
        // });
    }

    /**
     * Calls after the view initialization
     */
    ngAfterViewInit() {
        this.twilioService.previewContainer = this.previewContainer;
        this.twilioService.previewMedia();

        this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
            this.isProviderReady();
        });
        this.cd.detectChanges();
    }
    /**
     * Method which marks the consumer readiness and returns the token 
     * to connect to the meeting room if provider is ready
     */
    isProviderReady() {
        const _this = this;
        const post_data = {
            uuid: _this.uuid,
         };
        _this.subs.sink = _this.meetService.isProviderReady(post_data)
            .subscribe(data => {
               if(data){
                   _this.meetObj = data;
                   _this.loading = false;
                   _this.providerReady = true;
                   _this.recordingFlag = _this.meetObj.recordingFlag;
                //    'Ready..'
                   _this.status = 'Ready..'
                if (_this.cronHandle) {
                    _this.cronHandle.unsubscribe();  
                }                               
               } else {
                    _this.loading = false;
                    _this.providerReady = false;
                    _this.meetObj = null;
                    if (this.booking.userName) {
                        _this.status = 'Waiting for "' + this.booking.userName + '" to start';
                    } else {
                        _this.status = 'Waiting for "' + this.booking.businessName + '" to start'
                    }
                    
               }
        }, error => {
            _this.loading = false;
            _this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
            _this.cronHandle.unsubscribe();
            setTimeout(() => {
                _this.location.back();
            }, 3000);
        });
    }
    /**
     * Init method
     */
    ngOnInit() {
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
     * Method to exit from the video call
     */
    disconnect() {
        const _this = this;
        _this.twilioService.disconnect();
        if(_this.source && _this.source=='room') {
            setTimeout(() => {
                _this.location.back();
            }, 3000);
        } else{
            _this.router.navigate(['consumer']);
        }        
    }
    /**
     * Method to start the video
     */
    connect(tokenObj) {
        // console.log(tokenObj.tokenId);
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
     * Method to switch from and back cameras
     */
    switchCamera() {
        this.twilioService.switchCamera();
    }
    /**
     * Method to enter to a room. which will invoke the connect method
     */
    joinRoom() {
        // console.log(this.meetObj);
        this.twilioService.localVideo = this.localVideo;
        this.twilioService.remoteVideo = this.remoteVideo;
        this.connect(this.meetObj);
    }
    /**
     * called when the page destroyed
     */
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
        this.subs.unsubscribe();
        // if (this.twilioService.previewTracks) {
        //     this.disconnect();
        // }
    }
}

