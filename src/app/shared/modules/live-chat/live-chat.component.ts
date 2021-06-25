import { ViewChild, OnInit, OnDestroy, ElementRef, Component, AfterViewInit, Renderer2, RendererFactory2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwilioService } from '../../services/twilio-service';
import { Location } from '@angular/common';
import { interval as observableInterval, Subscription } from 'rxjs';
import { MeetService } from '../../services/meet-service';
import { SnackbarService } from '../../services/snackbar.service';
import { SubSink } from 'subsink';
import { TeleBookingService } from '../../services/tele-bookings-service';
import * as Video from 'twilio-video';
import { RequestDialogComponent } from '../../../business/shared/meeting-room/request-dialog/request-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaService } from '../../services/media-service';
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
    btnClicked = false;
    reqDialogRef: any;
    media: any;

    audioTrack;
    videoTrack;
    previewTracks = [];
    previewTracksClone = [];
    constructor(
        private location: Location,
        private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        private meetService: MeetService,
        public rendererFactory: RendererFactory2,
        private snackbarService: SnackbarService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private teleService: TeleBookingService,
        private dialog: MatDialog,
        private mediaService: MediaService
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
                this.twilioService.preview= true;
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
         * Method for Preview Camera before entering to the meeting room
        */
     getAudioStatus() {
        const _this = this;
        return new Promise((resolve, reject) => {
            Video.createLocalAudioTrack().then(track => {
                console.log(track);
                _this.addPreviewTrackToDom(track);
                _this.audioTrack = track;
                _this.twilioService.microphone = true;
                _this.previewTracks.push(track);
                resolve(true);
            }).catch(error => {
                console.log("No Audio");
                console.log(error);
                _this.twilioService.microphone = false;
                resolve(false);
            });
        });
    }
    getVideoStatus() {
        const _this = this;
        return new Promise((resolve, reject) => {
            Video.createLocalVideoTrack().then(track => {
                _this.addPreviewTrackToDom(track);
                _this.videoTrack = track;
                _this.twilioService.video = true;
                _this.previewTracks.push(track);
                resolve(true);
            }).catch(error => {
                console.log("No Video");
                console.log(error);
                _this.twilioService.video = false;
                resolve(false);
            });
        });
    }
    removePreviewTrackToDom(track, type) {
        const _this = this;
        if (_this.previewContainer) {
            track.stop();
            const localElement = _this.previewContainer.nativeElement;
            if (localElement.getElementsByTagName(type)[0]) {
                localElement.getElementsByTagName(type)[0].remove();
            }
        }
        _this.previewTracks.slice(track, 1);
    }
    addPreviewTrackToDom(previewTrack) {
        const _this = this;
        const element = previewTrack.attach();
        _this.renderer.addClass(element, 'rem-video');
        _this.renderer.appendChild(_this.previewContainer.nativeElement, element);
    }
    generateType(media) {
        let mode = '';
        return new Promise((resolve, reject) => {
            if (media['audioDevices'].length === 0 && media['videoDevices'].length === 0) {
                mode = 'sys-both';
                resolve(mode);
            } else if (media['audioDevices'].length === 0 && media['videoDevices'].length !== 0) {
                mode = 'sys-mic';
                resolve(mode);
            } else if (media['audioDevices'].length !== 0 && media['videoDevices'].length === 0) {
                mode = 'sys-cam';
                resolve(mode);
            } else {
                this.getVideoStatus().then(
                    (videoStatus) => {
                        this.getAudioStatus().then(
                            (audioStatus) => {
                                if (!audioStatus && !videoStatus) {
                                    mode = 'b-both';
                                    resolve(mode);
                                } else if (audioStatus && !videoStatus) {
                                    mode = 'b-cam';
                                    resolve(mode);
                                } else if (!audioStatus && videoStatus) {
                                    mode = 'b-mic';
                                } else {
                                    resolve('none');
                                }
                            }
                        )
                    }
                )

            }
        });

    }

    /**
     * Method for Preview Camera before entering to the meeting room
    */
    previewMedia(media) {
        const _this = this;
        _this.twilioService.video = false;
        _this.twilioService.microphone = false;
        if (media['videoDevices'].length > 0) {
            _this.twilioService.selectedVideoId = media['videoDevices'][0];
            _this.twilioService.video = true;
        };
    }
    openRequestDialog(mode) {
        this.reqDialogRef = this.dialog.open(RequestDialogComponent, {
            width: '100%',
            panelClass: ['commonpopupmainclass', 'popup-class'],
            disableClose: true,
            autoFocus: true,
            data: {
                mode: mode
            }
        });
        this.reqDialogRef.afterClosed().subscribe(result => {
            if (result === 'success') {
            }
        });
    }
    /**
     * Calls after the view initialization
     */
    ngAfterViewInit() {
        const _this = this;
        // this.twilioService.previewContainer = this.previewContainer;
        // this.twilioService.previewMedia();

        this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
            this.isProviderReady();
        });
        this.cd.detectChanges();
        this.mediaService.getMediaDevices().then(
            (media: any) => {
                this.media = media;
                
                if (media['videoDevices'].length > 0) {
                    this.twilioService.camDeviceCount = media['videoDevices'].length;

                    this.twilioService.cam1Device = media['videoDevices'][0].deviceId;
                    _this.twilioService.selectedVideoId = media['videoDevices'][0].deviceId;
                    if (media['videoDevices'].length > 1) {
                        this.twilioService.cam2Device = media['videoDevices'][1].deviceId;
                    }
                }
                console.log("System Media Devices");
                console.log(media);
                _this.generateType(media).then(
                    (mode) => {
                        console.log(mode);
                        if (mode !== 'none') {
                            this.openRequestDialog(mode);
                        }
                    }
                )
            }
        ).catch(error => {
            this.openRequestDialog('both');
        });
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
                if (data) {
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
        if (_this.source && _this.source == 'room') {
            setTimeout(() => {
                _this.location.back();
            }, 3000);
        } else {
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
        this.btnClicked = true;
        this.twilioService.localVideo = this.localVideo;
        this.twilioService.remoteVideo = this.remoteVideo;
        this.connect(this.meetObj);
    }
    unmuteVideo() {
        const _this = this;
        console.log("unmuteVideo");
        // this.twilioService.unmuteVideo();
        this.getVideoStatus().then(
            (videoStatus) => {
                if (!videoStatus) {
                    this.openRequestDialog('b-cam');
                } else {
                    _this.twilioService.video = true;
                }
            }
        );
    }

    muteVideo() {
        // this.twilioService.muteVideo();
        console.log("muteVideo");
        console.log(this.videoTrack);
        this.removePreviewTrackToDom(this.videoTrack, 'video');
        this.previewTracks.splice(this.previewTracks.indexOf(this.videoTrack), 1);
        // this.videoTrack.unpublishTracks();
        // this.videoTrack.stop();
        this.twilioService.video = false;

    }
    muteAudio() {
        // this.twilioService.muteAudio();
        console.log("muteAudio");
        console.log(this.audioTrack);
        this.removePreviewTrackToDom(this.audioTrack, 'audio');
        this.previewTracks.splice(this.previewTracks.indexOf(this.audioTrack), 1);
        // this.audioTrack.unpublishTracks();
        // this.audioTrack.stop();
        this.twilioService.microphone = false;
    }
    unmuteAudio() {
        const _this = this;
        console.log("unmuteAudio");
        // this.twilioService.unmuteAudio();
        _this.getAudioStatus().then(
            (audioStatus) => {
                if (!audioStatus) {
                    _this.twilioService.microphone = false;
                    _this.openRequestDialog('b-mic');
                } else {
                    _this.twilioService.microphone = true;
                }
            }
        );
    }
    /**
     * called when the page destroyed
     */
    ngOnDestroy() {
        if (this.cronHandle) {
            this.cronHandle.unsubscribe();
        }
        this.subs.unsubscribe();
        this.previewTracks.forEach(track=>{
            this.removePreviewTrackToDom(track, track.kind);
        })
        // if (this.twilioService.previewTracks) {
        //     this.disconnect();
        // }
    }
}

