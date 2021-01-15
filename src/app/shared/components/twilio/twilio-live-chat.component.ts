import { ViewChild, OnInit, OnDestroy, ElementRef, Component, AfterViewInit, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwilioService } from '../../services/twilio-service';
// import { projectConstantsLocal } from '../../constants/project-constants';
import { SharedServices } from '../../services/shared-services';
import { Location } from '@angular/common';
// import { ServiceMeta } from '../../services/service-meta';
// import { projectConstantsLocal } from '../../constants/project-constants';
@Component({
    selector: 'app-live-chat',
    templateUrl: './twilio-live-chat.component.html',
    styleUrls: ['./twilio-live-chat.component.css']
})
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
    api_loading = true;
    private renderer: Renderer2;
    uuid: any;
    result;
    type: any;
    constructor(
        private location: Location,
        private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        private shared_services: SharedServices,
        public rendererFactory: RendererFactory2
        // private baCustomPreLoader: BaCustomPreLoader
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        console.log(this.renderer);
        window.addEventListener('unload', () => {
            this.disconnect();
        });
        this.activateroute.queryParams.subscribe(params => {
        this.uuid = params.uu_id;
        this.type = params.type;
        console.log(this.uuid);
        console.log(this.type);
    });
    }
    ngAfterViewInit() {
        this.twilioService.previewContainer = this.previewContainer;
        this.twilioService.previewMedia();
    }
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
    switchCamera() {
        if (this.twilioService.cameraMode === 'user') {
            this.twilioService.switchCamera('environment');
        } else {
            this.twilioService.switchCamera('user');
        }
    }
    joinVideo(){
        console.log(this.type)
        if(this.type === 'provider'){
            this.shared_services.getApptMeetingDetailsProvider(this.uuid)
      .subscribe(data => {
         this.result = data;
         if(this.result === null){
            //  this.joinVideo();
         }
        console.log(data)
        this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
        } else{
            this.shared_services.getVideoCall(this.uuid)
            .subscribe(data => {
               this.result = data;
               if(this.result === null){
                  //  this.joinVideo();
               }
              console.log(data)
              this.api_loading = false;
            },
              () => {
                this.api_loading = false;
              });
        }
        
    }
    // joinRoom() {
    //     this.activateroute.params.subscribe(params => {
    //         const videoId = params.id;
    //         this.sharedServices.getJaldeeVideoAccessToken(videoId).subscribe(
    //             (tokenObj: any) => {
    //                 console.log(tokenObj);
    //                 // this.access_token = tokenObj.token;
    //                 this.twilioService.localVideo = this.localVideo;
    //                 this.twilioService.remoteVideo = this.remoteVideo;
    //                 this.connect(tokenObj);
    //             }
    //         );
    //     });
    // }
    ngOnDestroy() { this.disconnect(); }
}
