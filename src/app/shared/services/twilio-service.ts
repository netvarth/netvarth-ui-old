import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import * as Video from 'twilio-video';
import { MediaService } from './media-service';
@Injectable({
    providedIn: 'any'
})
export class TwilioService {
    remoteVideo: ElementRef;
    localVideo: ElementRef;
    previewContainer: ElementRef;
    microphone = true;
    video = true;
    preview = true;
    roomParticipants;
    participantsCount = 0;
    showParticipant = false;
    previewTrack;
    camDeviceCount = 0;
    private renderer: Renderer2;
    cameraMode: string;
    previewTracks;
    cam1Device: string;
    selectedVideoId: string;
    cam2Device: string;
    activeRoom;
    previewTracksClone;
    btnClicked = false;
    loading = false;
    constructor(public rendererFactory: RendererFactory2, public mediaService: MediaService) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    /**
     * Function to returns all the available video inputs also set two camera devices into variables cam1Device and cam2Device
     * @returns videoDevices - video devices available in the system
     */
    // loadDevices() {
    //     const _this = this;
    //     return new Promise(function (resolve, reject) {
    //         let counter = 0;
    //         navigator.mediaDevices.enumerateDevices().then(devices => {
    //             const videoDevices = [];
    //             let count = devices.length;
    //             if (count > 0) {
    //                 devices.forEach(device => {
    //                     if (device.kind === 'videoinput') {
    //                         if (counter === 0) {
    //                             _this.cam1Device = device.deviceId;
    //                             _this.selectedVideoId = device.deviceId;
    //                         }
    //                         if (counter === 1) {
    //                             _this.cam2Device = device.deviceId;
    //                         }
    //                         videoDevices.push(device);
    //                         counter++;
    //                     }
    //                     count--;
    //                     if (count === 0) {
    //                         resolve(videoDevices);
    //                     }
    //                 });
    //             } else {
    //                 reject([]);
    //             }
    //         });
    //     })
    // }
    /**
     * Method for Preview Camera before entering to the meeting room
    */
    // previewMedia() {
    //     this.preview = true;
    //     const _this = this;
    //     _this.video = false;
    //     _this.microphone =false;
    //     _this.loadDevices().then(
    //         (videoDevices: any) => {
    //             _this.camDeviceCount = videoDevices.length;
    //             if (_this.camDeviceCount > 0) {
    //                 _this.selectedVideoId = _this.cam1Device;
    //                 _this.video= true;                    
    //                 Video.createLocalTracks({
    //                     audio: true,
    //                     video: { deviceId: _this.selectedVideoId }
    //                 }).then(localTracks => {
    //                     _this.previewTracks = localTracks;
    //                     _this.previewTracksClone = localTracks.slice();
    //                     localTracks.forEach(localTrack => {
    //                         if (localTrack.kind === 'audio'){
    //                             this.microphone= true;
    //                         }
    //                         _this.addPreviewTrackToDom(localTrack);
    //                     })
    //                 }, (error)=> {

                        

    //                 });
    //             }
    //         }
    //     );
    // }

    unmuteVideo() {
        const _this = this;
        _this.previewTracks.forEach(localTrack => {
            if(localTrack.kind === 'video') {
                 _this.previewTracksClone.push(localTrack);
                _this.addPreviewTrackToDom(localTrack);
            }
            
        });
        this.video = true;
    }
    muteVideo() {
        const _this = this;
        _this.previewTracks.forEach(localTrack => {
            if(localTrack.kind === 'video') {
                _this.previewTracksClone.splice(this.previewTracksClone.indexOf(localTrack), 1);
                _this.removePreviewTrackToDom(localTrack);
            }
        });
        this.video = false;
    }
    removePreviewTrackToDom(localTrack) {
        const _this=this;
        if (_this.previewContainer) {
            const localElement = _this.previewContainer.nativeElement;
            while (localElement.firstChild) {
                localElement.removeChild(localElement.firstChild);
            }
        }
       
    }
    muteAudio() {
        const _this = this;
        _this.previewTracks.forEach(localTrack => {
            if(localTrack.kind === 'audio') {
                _this.previewTracksClone.splice(this.previewTracksClone.indexOf(localTrack), 1);
            }
        });
        this.microphone = false;
    }
    unmuteAudio() {
        const _this = this;
        _this.previewTracks.forEach(localTrack => {
            if(localTrack.kind === 'audio') {
                 _this.previewTracksClone.push(localTrack);
            }
        });
        this.microphone = true;
    }
    addPreviewTrackToDom(previewTrack) {
        const _this = this;
        const element = previewTrack.attach();
        _this.renderer.addClass(element, 'rem-video');
        _this.renderer.appendChild(_this.previewContainer.nativeElement, element);
    }

    enableVideo() {
        const _this= this;
        Video.createLocalVideoTrack({
            deviceId: { exact: _this.selectedVideoId }
        }).then(function (localVideoTrack) {
            _this.activeRoom.localParticipant.publishTrack(localVideoTrack);
            console.log(_this.activeRoom.localParticipant.identity + ' added track: ' + localVideoTrack.kind);
            _this.attachTracks([localVideoTrack], _this.localVideo.nativeElement, _this.activeRoom);
        });
        this.video = true;
    }
    disableVideo() {
        const _this = this;
        _this.activeRoom.localParticipant.videoTracks.forEach(publication => {
            publication.track.stop();
            publication.unpublish();
            if (_this.localVideo) {
                const localElement = _this.localVideo.nativeElement;
                while (localElement.firstChild) {
                    localElement.removeChild(localElement.firstChild);
                }
            }
        });
        this.video = false;
    }
    mute() {
        this.activeRoom.localParticipant.audioTracks.forEach(function (audioTrack) {
            audioTrack.track.disable();
        });
        this.microphone = false;
    }
    unmute() {
        this.activeRoom.localParticipant.audioTracks.forEach(function (audioTrack) {
            audioTrack.track.enable();
        });
        this.microphone = true;
    }
    switchCamera(mode?) {
        const _this = this;
        if (_this.selectedVideoId === _this.cam1Device) {
            _this.selectedVideoId = _this.cam2Device;
        } else {
            _this.selectedVideoId = _this.cam1Device;
        }
        const localParticipant = _this.activeRoom.localParticipant;
        const tracks = Array.from(localParticipant.videoTracks.values()).map(
            function (trackPublication) {
                return trackPublication['track'];
            }
        );
        localParticipant.unpublishTracks(tracks);
        console.log(localParticipant.identity + ' removed track: ' + tracks[0].kind);
        _this.detachTracks(tracks);
        _this.stopTracks(tracks);
        const videoid = _this.selectedVideoId;
        Video.createLocalVideoTrack({
            deviceId: { exact: videoid }
        }).then(function (localVideoTrack) {
            localParticipant.publishTrack(localVideoTrack);
            console.log(localParticipant.identity + ' added track: ' + localVideoTrack.kind);
            _this.attachTracks([localVideoTrack], _this.localVideo.nativeElement, _this.activeRoom);
        });
    }

    connectToRoom(accessToken, options, tracks?) {
        // return new Promise(function (resolve, reject) {
        const _this = this;
        console.log("In Connect Room");
        console.log(tracks);
        if(tracks) {
            _this.previewTracks = tracks;
            _this.previewTracksClone = tracks.slice();
        }
        if (_this.previewTracks) {
            options['tracks'] = _this.previewTracks;
        }      
        console.log(_this.previewTracks);
        Video.connect(accessToken, options).then(
            (room: any) => {
                _this.preview = false;
                this.loading= false;
                _this.activeRoom = room;
                if (options['video']) {
                    if (!_this.localVideo.nativeElement.querySelector('video')) {
                        console.log("in connect method");
                        _this.attachParticipantTracks(room.localParticipant, _this.localVideo.nativeElement, room);
                    }
                }
                this.btnClicked = false;
                _this.roomJoined(room);
            }, (error) => {
                // reject(error);
            }
        );
        // });
    }
    // Attach the Tracks to the DOM.
    attachTracks(tracks, container, room) {
        const _this = this;
        console.log("attachTracks");
        tracks.forEach(function (track) {
            if (track) {
                console.log(track);
                const element = track.attach();
                _this.renderer.data.id = track.sid;
                _this.renderer.addClass(element, 'rem-video');
                _this.renderer.appendChild(container, element);
            }
        });
    }


    // Attach the Participant's Tracks to the DOM.
    attachParticipantTracks(participant, container, room) {
        const _this = this;
        var tracks = Array.from(participant.tracks.values()).map(function (trackPublication) {
            return trackPublication['track'];
        });
        console.log("attachParticipantTracks");
        _this.attachTracks(tracks, container, room);
    }

    // Detach the Tracks from the DOM.
    detachTracks(tracks) {
        console.log("detachTracks");
        tracks.forEach(function (track) {
            if (track) {
                track.detach().forEach(function (detachedElement) {
                    detachedElement.remove();
                });
            }
        });
    }

    // Detach the Participant's Tracks from the DOM.
    detachParticipantTracks(participant, room, _this) {
        console.log("detachParticipantTracks");
        var tracks = Array.from(participant.tracks.values()).map(function (trackPublication) {
            return trackPublication['track'];
        });
        _this.detachTracks(tracks, room);
    }

    // 
    stopTracks(tracks) {
        console.log("stopTracks");
        tracks.forEach(function (track) {
            if (track) { track.stop(); }
        })
    }
    // Successfully connected!
    roomJoined(room) {
        const _this = this;
        // Attach the Tracks of the Room's Participants.
        if (!_this.video) {
            _this.disableVideo();
        }
        if (!_this.microphone) {
            _this.mute();
        }
        room.participants.forEach((participant) => {
            console.log("Already in Room: '" + participant.identity + "'");
            _this.attachParticipantTracks(participant, _this.remoteVideo.nativeElement, room);
            _this.participantsCount = room.participants.size;
            console.log('first:' + this.participantsCount);
        });

        // When a Participant joins the Room, log the event.
        room.on('participantConnected', function (participant) {
            console.log("Joining: '" + participant.identity + "'");
            _this.participantsCount = room.participants.size;
            console.log("connected:" + room.participants.size);
        });

        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackSubscribed', function (track, trackPublication, participant) {
            console.log(participant.identity + ' added track: ' + track.kind);
            // var previewContainer = document.getElementById('remoteVideo');
            _this.attachTracks([track], _this.remoteVideo.nativeElement, room);
            console.log('tracksubscribed');
            if(track.kind === 'video') {
                _this.removeRemoteParticipantDetails(_this.remoteVideo.nativeElement);
            } 
        });

        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackUnsubscribed', function (track, trackPublication, participant) {
            console.log(participant.identity + ' removed track: ' + track.kind);
            _this.detachTracks([track]);
            console.log('trackUnsubscribed');
            if(track.kind === 'video') {
                _this.addRemoteParticipantDetails(_this.remoteVideo.nativeElement, participant);
            }
        });

        // When a Participant leaves the Room, detach its Tracks.
        room.on('participantDisconnected', function (participant) {
            console.log("Participant '" + participant.identity + "' left the room");
            _this.detachParticipantTracks(participant, room, _this);
            _this.participantsCount = room.participants.size;
            console.log("disConnected:" + room.participants.size);
            _this.removeRemoteParticipantDetails(_this.remoteVideo.nativeElement);
        });

        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', function () {
            console.log('Left');

            room.localParticipant.tracks.forEach(publication => {
                publication.track.stop();
                publication.unpublish();
                const attachedElements = publication.track.detach();
                attachedElements.forEach(element => element.remove());
            });
            if (_this.localVideo) {
                const localElement = _this.localVideo.nativeElement;
                while (localElement.firstChild) {
                    localElement.removeChild(localElement.firstChild);
                }
            }
            if (_this.remoteVideo) {
                const remoteElement = _this.remoteVideo.nativeElement;
                while (remoteElement.firstChild) {
                    remoteElement.removeChild(remoteElement.firstChild);
                }
            }
            _this.participantsCount = room.participants.size;
            _this.disconnect();
        });
    }
    removeRemoteParticipantDetails(container) {
        const div = document.getElementById('remoteImg');
        if(div) {
            this.renderer.removeChild(container, div);
        }
    }
    addRemoteParticipantDetails(container, participant) {
        const div = document.createElement('div');
        div.setAttribute('id','remoteImg');
        const div1 = document.createElement('div');
        div1.setAttribute('class', 'avatar-img');
        div.appendChild(div1);
        
        const div2 = document.createElement('div');
        div2.setAttribute('class', 'avatar-text');

        const contentDiv = document.createTextNode(participant.identity);
        div2.appendChild(contentDiv);
        div.appendChild(div2);
        // const image = document.createElement('image');
        // image.setAttribute('class', '');
        // image.setAttribute('alt', participant.identity);
        // div1.appendChild(image);
        
        this.renderer.appendChild(container, div);
    }
    disconnect() {
        const _this = this;
        if (_this.previewTracks) {
            _this.previewTracks.forEach(localTrack => {
                localTrack.stop();
            });
        }
        _this.previewTracks = null;
        if (_this.activeRoom && _this.activeRoom.localParticipant && _this.activeRoom.localParticipant.localTracks) {
            _this.activeRoom.localParticipant.localTracks.forEach(localTrack => {
                localTrack.stop();
            });
        }
        if (_this.activeRoom && _this.activeRoom !== null) {
            _this.activeRoom.disconnect();
            _this.activeRoom = null;
            _this.cam1Device = null;
            _this.cam2Device = null;
            _this.selectedVideoId = null;    
        }
        _this.video = true;
        _this.microphone = true;
        if (_this.remoteVideo) {
            _this.removeRemoteParticipantDetails(_this.remoteVideo.nativeElement);
        } 
    }
}
