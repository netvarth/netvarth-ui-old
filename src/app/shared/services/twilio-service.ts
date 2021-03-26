import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import * as Video from 'twilio-video';
@Injectable()
export class TwilioService {
    remoteVideo: ElementRef;
    localVideo: ElementRef;
    previewContainer: ElementRef;
    previewing: boolean;
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

    constructor(public rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    /**
     * Function to returns all the available video inputs also set two camera devices into variables cam1Device and cam2Device
     * @returns videoDevices - video devices available in the system
     */
    loadDevices() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            let counter = 0;
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const videoDevices = [];
                let count = devices.length;

                if (count > 0) {
                    devices.forEach(device => {
                        if (device.kind === 'videoinput') {
                            if (counter === 0) {
                                _this.cam1Device = device.deviceId;
                                _this.selectedVideoId = device.deviceId;
                            }
                            if (counter === 1) {
                                _this.cam2Device = device.deviceId;
                            }
                            videoDevices.push(device);
                            counter++;
                        }
                        count--;
                        if (count === 0) {
                            resolve(videoDevices);
                        }
                    });
                } else {
                    reject([]);
                }
            });
        })
    }
    /**
     * Method for Preview Camera before entering to the meeting room
    */
    previewMedia() {
        const _this = this;
        _this.loadDevices().then(
            (videoDevices: any) => {
                _this.camDeviceCount = videoDevices.length;
                if (_this.camDeviceCount > 0) {
                    _this.selectedVideoId = _this.cam1Device;
                    Video.createLocalTracks({
                        audio:true,
                        video: { deviceId: _this.selectedVideoId }
                    }).then(localTracks => {
                        _this.previewTracks = localTracks;
                        localTracks.forEach(localTrack => {
                            _this.addPreviewTrackToDom(localTrack);
                        })
                    });
                }
            }
        );
    }
    
    addPreviewTrackToDom (previewTrack) {
        const _this = this;
        const element = previewTrack.attach();
        _this.renderer.addClass(element, 'rem-video');
        _this.renderer.appendChild(_this.previewContainer.nativeElement, element);
    }

    enableVideo() {
        this.activeRoom.localParticipant.videoTracks.forEach(function (videoTrack) {
            videoTrack.track.enable();
        });
        this.video = true;
    }
    disableVideo() {
        this.activeRoom.localParticipant.videoTracks.forEach(function (videoTrack) {
            videoTrack.track.disable();
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
        console.log(mode);
        if (_this.selectedVideoId === _this.cam1Device) {
            _this.selectedVideoId = _this.cam2Device;
        } else {
            _this.selectedVideoId = _this.cam1Device;
        }
        const localParticipant = _this.activeRoom.localParticipant;
          const tracks = Array.from(localParticipant.videoTracks.values()).map(
            function(trackPublication) {
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
          }).then(function(localVideoTrack) {
            localParticipant.publishTrack(localVideoTrack);
            console.log(localParticipant.identity + ' added track: ' + localVideoTrack.kind);
            _this.attachTracks([localVideoTrack], _this.localVideo.nativeElement, _this.activeRoom);
          });
    }

    connectToRoom(accessToken, options): void {
        const _this = this;
        if (_this.previewTracks) {
            options['tracks'] = _this.previewTracks;
        }
        Video.connect(accessToken, options).then(
            (room: any) => {
                _this.preview = false;
                _this.activeRoom = room;
                if (!_this.previewing && options['video']) {
                    if (!_this.localVideo.nativeElement.querySelector('video')) {
                        console.log("in connect method");
                         _this.attachParticipantTracks(room.localParticipant, _this.localVideo.nativeElement, room);
                    }
                    _this.previewing = true;
                }
                _this.roomJoined(room);
            }
        );
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
                // this.renderer.setStyle(element, 'height', 'auto');
                _this.renderer.addClass(element, 'rem-video');
                _this.renderer.appendChild(container, element);
            }
        });        
    }


    // Attach the Participant's Tracks to the DOM.
    attachParticipantTracks(participant, container,room) {
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
        room.participants.forEach( (participant) => {
            console.log("Already in Room: '" + participant.identity + "'");           
            _this.attachParticipantTracks(participant, _this.remoteVideo.nativeElement, room);
            _this.participantsCount = room.participants.size;
            console.log('first:' + this.participantsCount);
        });

        // When a Participant joins the Room, log the event.
        room.on('participantConnected', function (participant) {
            console.log("Joining: '" + participant.identity + "'");
            _this.participantsCount = room.participants.size;
            console.log("connected:"+ room.participants.size);
        });

        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackSubscribed', function (track, trackPublication, participant) {
            console.log(participant.identity + ' added track: ' + track.kind);
            // var previewContainer = document.getElementById('remoteVideo');
            _this.attachTracks([track], _this.remoteVideo.nativeElement, room);
        });

        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackUnsubscribed', function (track, trackPublication, participant) {
            console.log(participant.identity + ' removed track: ' + track.kind);
            _this.detachTracks([track]);
        });

        // When a Participant leaves the Room, detach its Tracks.
        room.on('participantDisconnected', function (participant) {            
            console.log("Participant '" + participant.identity + "' left the room");
            _this.detachParticipantTracks(participant, room, _this);
            _this.participantsCount = room.participants.size;
            console.log("disConnected:"+ room.participants.size);
        });

        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', function () {
            console.log('Left');
            room.localParticipant.tracks.forEach(publication => {
                const attachedElements = publication.track.detach();
                attachedElements.forEach(element => element.remove());
              });
              const localElement = _this.localVideo.nativeElement;
              while (localElement.firstChild) {
                  localElement.removeChild(localElement.firstChild);
              }
              const remoteElement = _this.remoteVideo.nativeElement;
              while (remoteElement.firstChild) {
                  remoteElement.removeChild(remoteElement.firstChild);
              }
            // if (_this.previewTracks) {
            //     _this.previewTracks.forEach(function (track) {
            //         track.stop();
            //     });
            // }                        
            // _this.detachParticipantTracks(room.localParticipant, room, _this);
            _this.participantsCount = room.participants.size;
            // if(room.participants && room.participants.size > 0) {
            //     room.participants.forEach(_this.detachParticipantTracks);
            // }
            _this.disconnect();
        });
    }
    disconnect() {
        if (this.activeRoom && this.activeRoom !== null) {
            this.activeRoom.disconnect();
            this.activeRoom = null;
        }
    }
}
