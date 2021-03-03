import { ViewChild, OnInit, OnDestroy, ElementRef, Component, AfterViewInit, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwilioService } from '../../services/twilio-service';
import { Location } from '@angular/common';
import { interval as observableInterval, Subscription } from 'rxjs';
import { MeetService } from '../../services/meet-service';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
    selector: 'app-live-chat',
    templateUrl: './twilio-live-chat.component.html',
    styleUrls: ['./twilio-live-chat.component.css']
})
/**
 * Class for Meeting Room for a consumer
 */
export class LiveChatComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;
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
    constructor(
        private location: Location,
        private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        private meetService: MeetService,
        public rendererFactory: RendererFactory2,
        private snackbarService: SnackbarService,
        private router: Router
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.renderer = rendererFactory.createRenderer(null, null);
        console.log(this.renderer);
        window.addEventListener('unload', () => {
            this.disconnect();
        });
        this.activateroute.params.subscribe(
            (params) => {
                this.uuid = params['id'];
                this.type = this.uuid.substring((this.uuid.lastIndexOf('_') + 1), this.uuid.length);
            }
        );
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
    }
    /**
     * Method which marks the consumer readiness and returns the token 
     * to connect to the meeting room if provider is ready
     */
    isProviderReady() {
        const _this = this;
        _this.meetService.isProviderReady(_this.uuid)
            .subscribe(data => {
               if(data){
                   console.log(data);
                   _this.meetObj = data;
                   _this.loading = false;
                   _this.providerReady = true;
                   _this.status = 'Ready..'
                if (_this.cronHandle) {
                    _this.cronHandle.unsubscribe();  
                }                               
               } else {
                    _this.loading = false;
                    _this.providerReady = false;
                    _this.meetObj = null;
                    _this.status = 'Waiting for the provider...'
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
        if (this.twilioService.previewTracks) {
            this.twilioService.previewTracks.forEach(localTrack => {
                localTrack.stop();
            });
        }
        if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
            this.twilioService.roomObj.disconnect();
            this.twilioService.roomObj = null;
            this.location.back();
        } else {
            this.location.back();
        }
    }
    /**
     * Method to start the video
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
     * Method to switch from and back cameras
     */
    switchCamera() {
        if (this.twilioService.cameraMode === 'user') {
            this.twilioService.switchCamera('environment');
        } else {
            this.twilioService.switchCamera('user');
        }
    }
    /**
     * Method to enter to a room. which will invoke the connect method
     */
    joinRoom() {
        console.log(this.meetObj);
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
        this.disconnect(); 
    }
}
