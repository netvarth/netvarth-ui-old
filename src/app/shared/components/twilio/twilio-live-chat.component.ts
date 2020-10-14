import { ViewChild, OnInit, OnDestroy, ElementRef, Component, AfterViewInit } from '@angular/core';
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
    @ViewChild('localVideo', { static: false }) localVideo: ElementRef;
    @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;
    room_name;
    access_token;
    app_id;
    screenWidth: number;
    screenHeight: number;
    videoId: any;
    constructor(
        private location: Location,
        private activateroute: ActivatedRoute,
        private sharedServices: SharedServices,
        public twilioService: TwilioService
        // private baCustomPreLoader: BaCustomPreLoader
    ) {
        if (navigator.getUserMedia) {
            console.log(navigator);
            navigator.getUserMedia({ audio: false, video: true }, function (stream) {
            }, function (error) {
                console.log(error.name + ': ' + error.message);
            });
            // navigator.getUserMedia({ audio: false, video: true  }, function (stream) {
            // }, function (error) {
            //     console.log(error.name + ': ' + error.message);
            // });
        } else if (navigator.vendor.match(/[Aa]+pple/g) && navigator.vendor.match(/[Aa]+pple/g).length > 0) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function () { })
                .catch(function (error) {
                    console.log(error.name + ': ' + error.message);
                });
        }
        window.addEventListener('unload', () => {
            this.disconnect();
        });
    }
    ngAfterViewInit() {
        console.log(this.localVideo);
        console.log(this.remoteVideo);
        this.activateroute.params.subscribe(params => {
            const videoId = params.id;
            this.sharedServices.getJaldeeVideoAccessToken(videoId).subscribe(
                (tokenObj: any) => {
                    console.log(tokenObj);
                    // this.access_token = tokenObj.token;
                    this.twilioService.localVideo = this.localVideo;
                    this.twilioService.remoteVideo = this.remoteVideo;
                    this.connect(tokenObj);
                }
            );
        });
    }
    ngOnInit() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }
    disconnect() {
        if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
            this.twilioService.roomObj.disconnect();
            this.twilioService.roomObj = null;
        }
        this.location.back();
    }
    connect(tokenObj) {
        console.log(tokenObj.tokenId);
        this.twilioService.connectToRoom(tokenObj.tokenId, {
            name: tokenObj.roomName,
            audio: true,
            video: { height: '100%', frameRate: 24, width: '100%' },
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
    ngOnDestroy() { this.disconnect(); }
}
