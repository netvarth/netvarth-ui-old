import { AfterViewInit, ChangeDetectorRef, ElementRef, OnInit, Renderer2, RendererFactory2, ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { TwilioService } from "../../../shared/services/twilio-service";
import { interval as observableInterval } from 'rxjs';
import { MeetService } from "../../../shared/services/meet-service";
import { Title } from "@angular/platform-browser";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { SubSink } from "subsink";
import { MatDialog } from "@angular/material/dialog";
import { AddInboxMessagesComponent } from "../../../shared/components/add-inbox-messages/add-inbox-messages.component";
import { TeleBookingService } from "../../../shared/services/tele-bookings-service";
import { MediaService } from "../../../shared/services/media-service";
import { RequestDialogComponent } from "./request-dialog/request-dialog.component";
import * as Video from 'twilio-video';
import { SharedServices } from "../../../shared/services/shared-services";
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
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
    recordingFlag: boolean = true;
    loading = true;
    booking;
    consumerReady = false;
    subs = new SubSink();
    btnClicked = false;
    @ViewChild('localVideo') localVideo: ElementRef;
    @ViewChild('previewContainer') previewContainer: ElementRef;
    @ViewChild('remoteVideo') remoteVideo: ElementRef;
    chatDialog: any;
    reqDialogRef: any;
    media: any;
    audioTrack;
    videoTrack;
    previewTracks = [];
    previewTracksClone = [];
    videocredits: any;
    videocreditShow = true;

    constructor(private activateroute: ActivatedRoute,
        public twilioService: TwilioService,
        public rendererFactory: RendererFactory2,
        private meetService: MeetService,
        private titleService: Title,
        private snackbarService: SnackbarService,
        private router: Router,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private teleService: TeleBookingService,
        private mediaService: MediaService,
        private provider_services: ProviderServices,
        private sharedServices: SharedServices) {
        const _this = this;
        _this.twilioService.loading = false;
        _this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        _this.titleService.setTitle('Jaldee Business - Video');
        _this.renderer = rendererFactory.createRenderer(null, null);
        console.log(_this.renderer);
        _this.subs.sink = _this.activateroute.params.subscribe(
            (params) => {
                _this.uuid = params['id'];
                _this.type = _this.uuid.substring((_this.uuid.lastIndexOf('_') + 1), _this.uuid.length);
                _this.getTeleBooking(_this.uuid, _this.type);
                _this.twilioService.preview = true;
            }
        )
        _this.getRecordingStatus().then(
            (recordStatus: boolean) => {
                _this.recordingFlag = recordStatus;
            }
        );
    }
    updateRecordingFlag(event) {
        this.isConsumerReady();
    }

    getTeleBooking(uuid, type) {
        const _this = this;
        // return new Promise(function (resolve, reject) {
        if (type === 'appt') {
            _this.teleService.getTeleBookingFromAppt(uuid, 'provider').then(
                (booking: any) => {
                    _this.booking = booking;
                }, (error) => {
                    console.log(error);
                }
            )
        } else {
            _this.teleService.getTeleBookingFromCheckIn(uuid, 'provider').then(
                (booking: any) => {
                    _this.booking = booking;
                }, (error) => {
                    console.log(error);
                }
            )
        }
        // });
    }
    getRecordingStatus() {
        const _this = this;
        return new Promise((resolve, reject) => {
            _this.subs.sink = _this.meetService.getJaldeeVideoSettings().subscribe(
                (data: any) => {
                    resolve(data.videoRecording);
                }, (error) => {
                    reject(error);
                });
        });
    }

    /**
     * Init method
     */
    ngOnInit(): void {
        this.getJaldeeVideoCredits();
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
        const _this = this;
        const post_data = {
            uuid: _this.uuid,
            recordingFlag: _this.recordingFlag,

        };

        _this.subs.sink = _this.meetService.isConsumerReady(post_data)
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
                    _this.status = 'Waiting for "' + this.booking.bookingFor + '" to start';
                }
            }, error => {
                _this.loading = false;
                _this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                _this.subs.unsubscribe();
                _this.disconnect();

            });
    }
    getJaldeeVideoCredits() {
        this.provider_services.getJaldeeVideoRecording()
        .subscribe(
          (data) => {
            console.log(data)
           this.videocredits = data;
          }
        );
    }

    /**
     * executes after the view initialization
     */
    ngAfterViewInit() {
        const _this = this;
        console.log("ngAfterViewInit");
        _this.cd.detectChanges();
        _this.subs.sink = observableInterval(_this.refreshTime * 500).subscribe(() => {
            _this.isConsumerReady();
        });
        // this.twilioService.previewContainer = this.previewContainer;
        // this.twilioService.previewMedia();
        _this.mediaService.getMediaDevices().then(
            (media: any) => {
                _this.media = media;
                if (media['videoDevices'].length > 0) {
                    _this.twilioService.camDeviceCount = media['videoDevices'].length;

                    _this.twilioService.cam1Device = media['videoDevices'][0].deviceId;
                    _this.twilioService.selectedVideoId = media['videoDevices'][0].deviceId;
                    if (media['videoDevices'].length > 1) {
                        _this.twilioService.cam2Device = media['videoDevices'][1].deviceId;
                    }
                }
                console.log("System Media Devices");
                console.log(media);
                _this.generateType(media).then(
                    (mode) => {
                        console.log(mode);
                        if (mode !== 'none') {
                            _this.openRequestDialog(mode);
                        }
                    }
                )
            }
        ).catch(error => {
            _this.sharedServices.callHealth(error.stack).subscribe();
            console.log("error"+error);
            _this.openRequestDialog('b-both');
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
        const _this = this;
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
                _this.getVideoStatus().then(
                    (videoStatus) => {
                        console.log(videoStatus);
                        _this.getAudioStatus().then(
                            (audioStatus) => {
                                console.log(audioStatus);
                                if (!audioStatus && !videoStatus) {
                                    mode = 'b-both';
                                    resolve(mode);
                                } else if (audioStatus && !videoStatus) {
                                    mode = 'b-cam';
                                    resolve(mode);
                                } else if (!audioStatus && videoStatus) {
                                    mode = 'b-mic';
                                    resolve(mode);
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
     * invokes when the page destroys
     */
    ngOnDestroy() {
        const _this = this;
        _this.subs.unsubscribe();
        _this.previewTracks.forEach(track => {
            _this.removePreviewTrackToDom(track, track.kind);
        })
    }
    /**
     * Method to exit from a meeting
     */
    disconnect() {
        const _this = this;
        _this.twilioService.loading = true;
        _this.btnClicked = true;
        _this.twilioService.disconnect();

        _this.previewTracks.forEach(track => {
            _this.removePreviewTrackToDom(track, track.kind);
        })

        let type = _this.type;
        if (_this.type === 'wl') {
            type = 'checkin'
        }
        const navigationExtras: NavigationExtras = {
            queryParams: {
                waiting_id: _this.uuid,
                type: type
            }
        };
        _this.router.navigate(['provider', 'telehealth'], navigationExtras);
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
        if (_this.type === 'appt') {
            pass_ob['appt'] = _this.type;
        } else if (_this.type === 'orders') {
            pass_ob['orders'] = _this.type;
        }
        _this.chatDialog = this.dialog.open(AddInboxMessagesComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class'],
            disableClose: true,
            autoFocus: true,
            data: pass_ob
        });
        _this.chatDialog.afterClosed().subscribe(result => {
            if (result === 'reloadlist') {
            }
        });
    }
    /**
     * Method to connect to a room
     */
    joinRoom() {
        const _this = this;
        _this.videocreditShow = false;
        _this.btnClicked = true;
        _this.loading = true;
        if (_this.consumerReady) {
            _this.twilioService.localVideo = _this.localVideo;
            _this.twilioService.remoteVideo = _this.remoteVideo;
            _this.twilioService.loading = true;
            _this.connect(_this.meetObj);
        }
    }
    /**
     * inner method to connect to the room
     * @param tokenObj Token object which hold the key and room name
     */
    connect(tokenObj) {
        const _this =this;

        console.log("Token Id:" + tokenObj.tokenId);
        _this.twilioService.connectToRoom(tokenObj.tokenId, {
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
        }, [_this.audioTrack, _this.videoTrack])
        // .then(
        //     () => {

        //     }
        // ).catch((error)=> {
        //     _this.btnClicked= false;
        //     _this.loading = false;
        //     _this.twilioService.loading = false;
        //     // console.log(error);
        // }
        // );
    }
    unmuteVideo() {
        const _this = this;
        _this.btnClicked = true;
        console.log("unmuteVideo");
        // this.twilioService.unmuteVideo();
        _this.getVideoStatus().then(
            (videoStatus) => {                
                if (!videoStatus) {
                    _this.openRequestDialog('b-cam');
                } else {
                    _this.twilioService.video = true;
                }     
                _this.btnClicked = false;           
            }
        );
    }

    muteVideo() {
        // this.twilioService.muteVideo();
        this.btnClicked = true;
        console.log("muteVideo");
        console.log(this.videoTrack);
        this.removePreviewTrackToDom(this.videoTrack, 'video');
        this.previewTracks.splice(this.previewTracks.indexOf(this.videoTrack), 1);
        this.twilioService.video = false;
        this.btnClicked = false;
    }
    muteAudio() {
        this.btnClicked = true;
        console.log("muteAudio");
        console.log(this.audioTrack);
        this.removePreviewTrackToDom(this.audioTrack, 'audio');
        this.previewTracks.splice(this.previewTracks.indexOf(this.audioTrack), 1);
        this.twilioService.microphone = false;
        this.btnClicked = false;
    }
    unmuteAudio() {
        const _this = this;
        _this.btnClicked = true;
        console.log("unmuteAudio");
        _this.getAudioStatus().then(
            (audioStatus) => {                
                if (!audioStatus) {
                    _this.twilioService.microphone = false;
                    _this.openRequestDialog('b-mic');
                } else {
                    _this.twilioService.microphone = true;
                }
                _this.btnClicked = false;
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
