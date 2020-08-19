import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
//import { MediaPlugin } from '@ionic-native';
import { PlanerPage } from '../planer/planer';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

declare var cordova: any;

@Component({
  selector: 'page-meditation-play',
  templateUrl: 'meditation-play.html'
})
export class MeditationPlayPage {

  public filesPath: any;
  public audioTitle: any;
  public audioFilename: any;
  public timeDrag: boolean = false;
  // public file: MediaPlugin;

  private maxduration_displayed: number = 0;

  private singleton: SingletonService;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    this.audioTitle = navParams.get("audioTitle");
    this.audioFilename = navParams.get("audioFilename");
    
    this.singleton = AppModule.injector.get(SingletonService);

    // if (typeof cordova == "undefined")
    //   this.filesPath = "http://localhost/files/";
    // else 
      this.filesPath = this.singleton.fileDir + "files";

    this.singleton.debugLog("this.filesPath:" +  this.filesPath);



  }

  ionViewDidLoad() {

    // console.log('ionViewDidLoad MeditationPlayPage with params:' + this.audioParam);

    /*
    // const onStatusUpdate = (status) => console.log(status);
    this.file = new MediaPlugin(this.filesPath + this.audioParam + '.mp3', onStatusUpdate);
    this.file.init.then(() => {
      // console.log('Playback Finished');
      this.file.release(); //destroy instance
    }, (err) => {
      // console.log('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
      // console.log('file: ' + this.filesPath + this.audioParam + '.mp3');
    });

    this.file.play();

    // get current playback position
    this.file.getCurrentPosition().then((position) => {
      // console.log('position: ' + position);
    });

    // get file duration
    // console.log('duration' + file.getDuration());
    */

  }

  ionViewDidEnter() {
    // im iOS Home Menu kann man ca. 2 Sekunden nachdem man zurück auf die Seite ist nicht auswählen
    if (this.singleton.OS === "ios") {
      let loader = this.loadingCtrl.create({
        duration: this.singleton.iOS_page_change_delay,
        // dismissOnPageChange: true
      });
      loader.present();
    }

    // var tracktime = <HTMLDivElement>document.getElementsByClassName('tracktime')[0];
    // var video = <HTMLVideoElement>document.getElementById("myVideo");
    // tracktime.innerHTML = "00:00 / " + this.timeFormat(video.duration);
    // if (this.maxduration_displayed > 0) {
    //   if (this.audioParam === "Body Scan 23 Min.") this.maxduration_displayed = 23 * 60 + 8;  // 1388
    //   if (this.audioParam === "Body Scan 34 Min.") this.maxduration_displayed = 34 * 60 + 10; // 2050
    //   tracktime.innerHTML = "00:00 / " + this.timeFormat(this.maxduration_displayed);
    // }

  }

  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }

  updateTime() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var timeBar = <HTMLDivElement>document.getElementsByClassName('timeBar')[0];
    var maxduration = video.duration; 
    var currentPos = video.currentTime;

    var tracktime = <HTMLDivElement>document.getElementsByClassName('tracktime')[0];
    tracktime.style.display = "block";
      
      // wrong mp3 max duration fix:
      
      // if (this.maxduration_displayed > 0) {
      //   if (this.audioParam === "Body Scan 23 Min.") this.maxduration_displayed = 23 * 60 + 8;  // 1388
      //   if (this.audioParam === "Body Scan 34 Min.") this.maxduration_displayed = 34 * 60 + 10; // 2050
      //   tracktime.innerHTML = "00:00 / " + this.timeFormat(this.maxduration_displayed);
      // }

      if (this.maxduration_displayed > 0)
          maxduration = this.maxduration_displayed;

    tracktime.innerHTML = this.timeFormat(currentPos); // + " / " + this.timeFormat(maxduration);

    var perc = 100 * currentPos / maxduration;
    // console.log(">>>>>>>>>> " + currentPos + " - " + video.duration + " : " + perc);
    timeBar.style.width = perc + '%';

    // var trackduration = <HTMLDivElement>document.getElementsByClassName('trackduration')[0];
    // trackduration.style.display = "block";
    // trackduration.innerHTML = "&nbsp;/&nbsp;" + this.timeFormat(maxduration);

  }
  
	timeFormat(seconds){
		var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
		var s = Math.floor(seconds-(parseInt(m.toString())*60))<10 ? "0"+Math.floor(seconds-(parseInt(m.toString())*60)) : Math.floor(seconds-(parseInt(m.toString())*60));
		return m+":"+s;
	};

  videoPlayPause() {

    this.singleton.debugLog("this.filesPath:" + this.filesPath);

    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var playButton = <HTMLDivElement>document.getElementsByClassName("btnPlay")[0];
    var iconplay = <HTMLDivElement>document.getElementById("playicon");

    if (video.paused || video.ended) {
      playButton.classList.add('paused');
      if (iconplay.classList.contains('icon-play')) {
        iconplay.classList.add('icon-pause');
        iconplay.classList.remove('icon-play');
      }
      video.play();
    }
    else {
      playButton.classList.remove('paused');
      if (iconplay.classList.contains('icon-pause')) {
        iconplay.classList.remove('icon-pause');
        iconplay.classList.add('icon-play');
      }
      video.pause();
    }
  }

  videoRewind(){
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    video.currentTime -= 10;
      // wrong mp3 max duration fix:
      if (this.maxduration_displayed > 0) 
        if (video.currentTime > this.maxduration_displayed) 
          video.currentTime = this.maxduration_displayed - 10;
  }

  videoFastForward(){
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    video.currentTime += 10;
  }

  videoFullscreen() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");

    // if (video.webkitEnterFullscreen != null) {
    //   video.webkitEnterFullscreen();
    // }
    // else 
    if (video.webkitRequestFullScreen != null) {
      video.webkitRequestFullScreen();
    }
    else {
      this.singleton.debugLog('Your browsers doesn\'t support fullscreen');
    }
  }

  videoEnded() {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    // go to Planer on end of Activity
    if (video.ended){
      var iconplay = <HTMLDivElement>document.getElementById("playicon");
      if (iconplay.classList.contains('icon-pause')) {
        iconplay.classList.remove('icon-pause');
        iconplay.classList.add('icon-play');
      }

        // wrong mp3 max duration fix:
        if (this.maxduration_displayed > 0) {
          var tracktime = <HTMLDivElement>document.getElementsByClassName('tracktime')[0];
          tracktime.innerHTML = this.timeFormat(this.maxduration_displayed); // + " / " + this.timeFormat(this.maxduration_displayed);
        }
          
      let alert = this.alertCtrl.create({
        title: 'Neue Aktivität planen?',
        message: 'Wollen Sie gleich eine neue Aktivität planen?',
        buttons: [{
          text: "Ja",
          handler: () => { this.navCtrl.push(PlanerPage); }
        }, {
          text: "Nein",
          role: 'cancel'
        }]
      })
      alert.present();
    }
  }

	//VIDEO PROGRESS BAR
	//when video timebar clicked
	// var timeDrag = false;	/* check for drag event */

	progressbarMousedown(e) {
    this.timeDrag = true;
    this.updatebar(e.pageX);
	}
	// $(document).on('mouseup', function(e) {
  //   if (this.timeDrag) {
  //     this.timeDrag = false;
  //     this.updatebar(e.pageX);
	// 	}
	// }
	// $(document).on('mousemove', function(e) {
  //   if (this.timeDrag) {
  //     this.updatebar(e.pageX);
	// 	}
	// }

	updatebar(x) {
    var video = <HTMLVideoElement>document.getElementById("myVideo");
    var progress = <HTMLDivElement>document.getElementsByClassName('progress')[0];

		//calculate drag position
		//and update video currenttime
		//as well as progress bar
    var maxduration = video.duration; 
    
    // wrong mp3 max duration fix
    if (this.maxduration_displayed > 0)
      maxduration = this.maxduration_displayed;

		var position = x - progress.offsetLeft;
		var percentage = 100 * position / progress.clientWidth;
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		// $('.timeBar').css('width',percentage+'%');
		// video.currentTime = maxduration * percentage / 100;
		// video.currentTime = parseInt(maxduration * percentage / 100);
    video.currentTime = Math.floor(maxduration * percentage / 100);    
    
    this.videoPlayPause();
    this.videoPlayPause();
    
	};

  deleteItem() {
    this.alertCtrl.create({
      title: 'Audio Datei löschen',
      message: '"' + this.audioTitle + '"',
      buttons: [{
        text: "Löschen", handler: () => {
          this.singleton.deleteAudioFile("files/meditation",this.audioFilename).then(
            (ans) => {
              this.singleton.deleteAudioFile("files/meditation",this.audioFilename+".complete")
              .then( () => {this.singleton.checkAudioFiles();});
              this.navCtrl.pop();
              this.singleton.debugLog('File removed:' + this.audioFilename + '\n' + JSON.stringify(ans))
            }
          ).catch(
            (err) => {
              this.singleton.debugLog('File remove error:' + this.audioFilename + '\n' + JSON.stringify(err))
            }
          );
        }
      }, { text: "Abbrechen", role: 'cancel' }]
    }).present();
  }




}
