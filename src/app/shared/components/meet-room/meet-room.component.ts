import { AfterViewInit, ChangeDetectorRef, ElementRef, OnInit, Renderer2, RendererFactory2, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TwilioService } from "../../services/twilio-service";
import { interval as observableInterval } from 'rxjs';
import { MeetService } from "../../services/meet-service";
import { Title } from "@angular/platform-browser";
import { SnackbarService } from "../../services/snackbar.service";
import { SubSink } from "subsink";
import { MatDialog } from "@angular/material/dialog";
import { AddInboxMessagesComponent } from "../add-inbox-messages/add-inbox-messages.component";
import { Location } from "@angular/common";
import { WordProcessor } from "../../services/word-processor.service";
import { MediaService } from "../../services/media-service";
import * as Video from 'twilio-video';
import { RequestDialogComponent } from "../../../business/shared/meeting-room/request-dialog/request-dialog.component";
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
    customer_label;
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;
    chatDialog: any;
    Id: any;
    checkId: any;
    custId: any;
    showRecording: boolean;
    reqDialogRef: any;
    media: any;

    audioTrack;
    videoTrack;
    previewTracks = [];
    previewTracksClone = [];
    constructor(private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        public rendererFactory: RendererFactory2,
        private meetService: MeetService,
        private titleService: Title,
        private snackbarService: SnackbarService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private activated_route: ActivatedRoute,
        private location: Location,
        public wordProcessor: WordProcessor,
        private mediaService: MediaService
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.titleService.setTitle('Jaldee Business - Video');
        this.renderer = rendererFactory.createRenderer(null, null);
        console.log(this.renderer);
        this.subs.sink = this.activateroute.params.subscribe(
            (params) => {
                this.uuid = params['id'];
                this.type = this.uuid.substring((this.uuid.lastIndexOf('_') + 1), this.uuid.length);
                this.twilioService.preview= true;
            }
        )
        this.activated_route.params.subscribe(params => {
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

    /**
     * Init method
     */
    ngOnInit(): void {
        this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
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
        if (this.checkId === true) {
            this.showRecording = true;
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
                        _this.status = 'Ready..';
                        _this.subs.unsubscribe();
                    } else {
                        _this.loading = false;
                        _this.consumerReady = false;
                        _this.meetObj = null;
                        _this.status = 'Waiting for ' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1);
                    }
                }, error => {
                    _this.loading = false;
                    _this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                    _this.subs.unsubscribe();
                    _this.disconnect();

                });

        }
        else {
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
                        _this.status = 'Waiting for ' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1);
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
        const _this = this;
        console.log("ngAfterViewInit");
        this.cd.detectChanges();
        this.subs.sink = observableInterval(this.refreshTime * 500).subscribe(() => {
            this.isConsumerReady();
        });
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
     * invokes when the page destroys
     */
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    /**
     * Method to exit from a meeting
     */
    disconnect() {
        this.twilioService.disconnect();
        console.log(this.custId);
        this.previewTracks.forEach(track=>{
            this.removePreviewTrackToDom(track, track.kind);
        })

        if (this.checkId === true) {
            this.location.back();
        }
        else {
            this.router.navigate(['/']);
        }

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
        this.chatDialog.afterClosed().subscribe(result => {
            if (result === 'success') {
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
        }, [this.audioTrack,this.videoTrack]);
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
        this.twilioService.video = false;

    }
    muteAudio() {
        console.log("muteAudio");
        console.log(this.audioTrack);
        this.removePreviewTrackToDom(this.audioTrack, 'audio');
        this.previewTracks.splice(this.previewTracks.indexOf(this.audioTrack), 1);
        this.twilioService.microphone = false;
    }
    unmuteAudio() {
        const _this = this;
        console.log("unmuteAudio");
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
}
