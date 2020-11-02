import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
import * as twilio from 'twilio-video';
@Injectable()
export class TwilioService {
    remoteVideo: ElementRef;
    localVideo: ElementRef;
    previewContainer: ElementRef;
    previewing: boolean;
    // msgSubject = new BehaviorSubject('');
    roomObj: any;
    microphone = true;
    video = true;
    preview = true;
    roomParticipants;
    participantsCount = 0;
    showParticipant = false;
    previewTrack;
    frontCamTrack;
    backCamTrack;
    camDeviceCount = 0;
    private renderer: Renderer2;
    cameraMode: string;
    previewTracks: any;
    constructor(
        public rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    enableVideo() {
        this.roomObj.localParticipant.videoTracks.forEach(function (videoTrack) {
            videoTrack.track.enable();
        });
        this.video = true;
    }
    disableVideo() {
        this.roomObj.localParticipant.videoTracks.forEach(function (videoTrack) {
            videoTrack.track.disable();
        });
        this.video = false;
    }
    mute() {
        this.roomObj.localParticipant.audioTracks.forEach(function (audioTrack) {
            audioTrack.track.disable();
        });
        this.microphone = false;
    }
    unmute() {
        this.roomObj.localParticipant.audioTracks.forEach(function (audioTrack) {
            audioTrack.track.enable();
        });
        this.microphone = true;
    }
    switchCamera(cameraMode) {
        // Capture the back facing camera.
        twilio.createLocalVideoTrack({
            facingMode: cameraMode
        }).then(localTracks => {
            if (cameraMode === 'user') {
                this.frontCamTrack = localTracks;
                this.backCamTrack.stop();
                this.roomObj.localParticipant.unpublishTrack(this.backCamTrack);
                this.roomObj.localParticipant.publishTrack(this.frontCamTrack);
            } else {
                this.backCamTrack = localTracks;
                this.frontCamTrack.stop();
                this.roomObj.localParticipant.unpublishTrack(this.frontCamTrack);
                this.roomObj.localParticipant.publishTrack(this.backCamTrack);
            }
            this.cameraMode = cameraMode;
        });
    }
    previewMedia() {
        this.camDeviceCount = 0;
        twilio.createLocalTracks({
        }).then(
        localTracks => {
            this.previewTracks = localTracks;
            localTracks.forEach(localTrack => {
                if (localTrack.kind === 'video') {
                    this.camDeviceCount++;
                    console.log(this.camDeviceCount);
                    if (this.camDeviceCount === 1) {
                        this.previewTrack = localTrack;
                        this.renderer.appendChild(this.previewContainer.nativeElement, localTrack.attach());
                    }
                }
            });
        }
        );
        // twilio.createLocalVideoTrack({
        // }).then(localTracks => {
        //     this.previewTrack = localTracks;
        //     this.renderer.appendChild(this.previewContainer.nativeElement, localTracks.attach());
        // });
    }
    connectToRoom(accessToken, options): void {
        console.log(accessToken);
        console.log(options);
        if (this.previewTracks) {
            this.previewTracks.forEach(localTrack => {
                localTrack.stop();
            });
        }
        twilio.createLocalTracks({
            audio: true,
            video: { width: 640, facingMode: this.cameraMode }
        }).then(localTracks => {
            options['tracks'] = localTracks;
            this.frontCamTrack = localTracks;
            return twilio.connect(accessToken, options);
        }).then((room: any) => {
            this.preview = false;
            this.roomObj = room;
            // navigator.mediaDevices.enumerateDevices().then(this.gotDevices);
            console.log('Connected to Room: ' + room.name);
            console.log('Successfully joined a Room:' + room);
            if (!this.previewing && options['video']) {
                this.startLocalVideo();
                this.previewing = true;
            }
            this.roomParticipants = room.participants;
            this.participantsCount = room.participants.size;
            console.log(this.roomParticipants);
            room.participants.forEach(participant => {
                this.showParticipant = true;
                console.log('Participant # ' + participant + ':' + room.participants.size);
                this.attachParticipantTracks(participant, room);
            });
            room.on('participantDisconnected', (participant) => {
                console.log('participantDisconnected: ' + room.participants.size);
                this.detachTracks(participant, room);
            });
            room.on('participantConnected', (participant) => {
                console.log('Participant connected Event');
                this.roomParticipants = room.participants;
                this.attachParticipantTracks(participant, room);
                participant.on('trackPublished', track => {
                    const element = track.attach();
                    this.renderer.data.id = track.sid;
                    this.renderer.addClass(element, 'rem-video');
                    this.renderer.appendChild(this.remoteVideo.nativeElement, element);
                });
            });
            // When a Participant adds a Track, attach it to the DOM.
            room.on('trackPublished', (track, participant) => {
                console.log('Track Published');
                this.attachTracks([track], room);
            });
            // When a Participant removes a Track, detach it from the DOM.
            room.on('trackRemoved', (track, participant) => {
                console.log('Track Removed');
                this.detachTracks([track], room);
            });
            room.once('disconnected', (room1) => {
                console.log('Disconnected');
                room1.localParticipant.tracks.forEach(track => {
                    track.track.stop();
                    const attachedElements = track.track.detach();
                    attachedElements.forEach(attachelement => attachelement.remove());
                    room1.localParticipant.videoTracks.forEach(video => {
                        const trackConst = [video][0].track;
                        trackConst.stop(); // <- error
                        trackConst.detach().forEach(trackelement => trackelement.remove());
                        room1.localParticipant.unpublishTrack(trackConst);
                    });
                    const element = this.remoteVideo.nativeElement;
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                    const localElement = this.localVideo.nativeElement;
                    while (localElement.firstChild) {
                        localElement.removeChild(localElement.firstChild);
                    }
                    // this.router.navigate(['thanks']);
                });
            });
        }, (error: any) => {
            console.log(error);
            alert(error.message);
        });
    }

    attachParticipantTracks(participant, room): void {
        console.log('Attaching participants');
        participant.tracks.forEach(part => {
            this.trackPublished(part, room);
        });
    }
    trackPublished(publication, room) {
        console.log('Track Published');
        if (publication.isSubscribed) {
            this.attachTracks(publication.track, room);
        }
        if (!publication.isSubscribed) {
            publication.on('subscribed', track => {
                this.attachTracks(track, room);
            });
        }
    }
    attachTracks(tracks, room) {
        console.log('Attach Tracks');
        console.log(room.participants.size);
        this.participantsCount = room.participants.size;
        const element = tracks.attach();
        this.renderer.data.id = tracks.sid;
        // this.renderer.setStyle(element, 'height', 'auto');
        this.renderer.addClass(element, 'rem-video');
        this.renderer.appendChild(this.remoteVideo.nativeElement, element);
    }
    startLocalVideo(): void {
        console.log('Start Local Video');
        this.roomObj.localParticipant.videoTracks.forEach(publication => {
            console.log(publication);
            const element = publication.track.attach();
            this.renderer.data.id = publication.track.sid;
            // this.renderer.setStyle(element, 'height', 'auto');
            this.renderer.addClass(element, 'rem-video');
            this.renderer.appendChild(this.localVideo.nativeElement, element);
        });
    }
    detachTracks(tracks, room): void {
        console.log('Detach Tracks');
        console.log(room.participants.size);
        this.participantsCount = room.participants.size;
        tracks.tracks.forEach(track => {
            const element = this.remoteVideo.nativeElement;
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
    }
}
