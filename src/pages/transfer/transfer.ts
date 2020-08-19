import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { Zip } from '@ionic-native/zip';
// import { Diagnostic } from '@ionic-native/diagnostic';

import { HomePage } from '../home/home';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

declare var cordova: any;

@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
  // providers: [ File, Transfer, Zip ]
})
export class TransferPage {

  public downloadURL: string; 
  public downloadFile: string = 'mammalife-pdfs.zip';
  public OS: string = "";
  public fileDir: string;
  public configFileDir: string;
  public configFileName: string;
  public progress: number = 0;
  private downloadStatus: string = "";
  public downloadPackageSize: number = 2; //400; //Mb
  public freeDiskSpaceNeeded: number = this.downloadPackageSize * 2; //Mb

  public freeSpacePhone: number = 0;
  public freeSpaceSDCard: number = 0;

  public installTarget: string = "Telephone";

  private singleton: SingletonService;
  private freeLicence: boolean = true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private ngZone: NgZone, 
              public platform: Platform, 
              public alertCtrl: AlertController, 
              public zip: Zip,
              public transfer: Transfer,
              public file: File,
              // public diagnostic: Diagnostic
            ) {             
    platform.ready().then(() => {
        this.singleton = AppModule.injector.get(SingletonService);
        // this.singleton.debugLog('< TransferPage');
        this.OS = this.singleton.OS;
        this.configFileName = this.singleton.configFileName;
        this.configFileDir = this.singleton.configFileDir;
        this.fileDir = this.singleton.fileDir;
        this.singleton.readConfigFileOptions().then(() => {
          if ( this.singleton.configFileOptions.find( function(element) {return element.option == "licence"} ).value == "full") this.freeLicence = false;
        });
        this.singleton.debugLog("configFile:" + this.configFileDir + "/" + this.configFileName);
        this.downloadURL = this.singleton.downloadURL;
      //no quitting app with back button
      platform.registerBackButtonAction(() => { if (this.navCtrl.canGoBack) this.navCtrl.pop().catch((err) => {/*// console.log(err)*/ }); });
      // platform.registerBackButtonAction(() => { if (this.navCtrl.getActive().component.name == "TransferPage") return; });

      // this.downloadStatus = "";
    });
  }

  ionViewDidLoad() {
    // this.singleton.debugLog('ionViewDidLoad TransferPage');
    if (typeof cordova !== "undefined") this.readFreeDiskSpace();
    // document.getElementById("SDCard_option").classList.add("item-disabled");
  }

  readFreeDiskSpace() {

    this.file.getFreeDiskSpace().then(
      (response) => {
        let freeBytes = response.valueOf();
        if (this.OS === "android") this.freeSpacePhone = Math.round(freeBytes / 1024 );
        if (this.OS === "ios") this.freeSpacePhone = Math.round(freeBytes / 1024 / 1024 );
        (err) => {
          console.log("free disk space error " + err)
        }
      });


      // if (this.OS === "android") {
      //   this.diagnostic.getExternalSdCardDetails().then(
      //   (response) => {
      //     this.singleton.debugLog("this.diagnostic.getExternalSdCardDetails: " + JSON.stringify(response));
      //     // var SDCardInfo = JSON.parse(JSON.stringify(response));
      //     // this.freeSpaceSDCard = SDCardInfo.freeSpace / 1024;
      //     this.freeSpaceSDCard = 
      //     Math.round(
      //         parseInt(JSON.stringify(response).split('freeSpace":')[1].split(",")[0])
      //       / 1024 / 1024);
      //   });
      // }

      // let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
      // let errorCallback = (e) => console.error(e);
      // this.diagnostic.isCameraAvailable().then(successCallback).catch(errorCallback);
      // this.diagnostic.isBluetoothAvailable().then(successCallback, errorCallback);
      
  }

  removeOldFiles () {
    if (this.OS === "android") {
      // Android: mammaLIFE_v1.0:
      this.file.removeFile(cordova.file.externalApplicationStorageDirectory + "files/",'mammalife-files.zip');
      this.file.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/meditation');
      this.file.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/pdfs');
      this.file.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/yoga');
      // Android: mammaLIFE_v1.06: (so wird die größe inkl. Dateien beim app manager angezeigt)
      this.file.removeFile(cordova.file.applicationStorageDirectory + "files/",'mammalife-files.zip');
      this.file.removeRecursively(cordova.file.applicationStorageDirectory,'files/meditation');
      this.file.removeRecursively(cordova.file.applicationStorageDirectory,'files/pdfs');
      this.file.removeRecursively(cordova.file.applicationStorageDirectory,'files/yoga');
    }
    if (this.OS === "ios") {
      // iOS: mammaLIFE
      this.file.removeFile(cordova.file.dataDirectory + "files/",'mammalife-files.zip');
      this.file.removeRecursively(cordova.file.dataDirectory,'files/meditation');
      this.file.removeRecursively(cordova.file.dataDirectory,'files/pdfs');
      this.file.removeRecursively(cordova.file.dataDirectory,'files/yoga');
    }
  }


  freeLicenceProceed() {
    this.singleton.writeConfigFileOption("status","4").then(
      () => this.navCtrl.setRoot(HomePage)
    );
  }


  retryCheckFreeDiskSpace() { // <- on button press
      // document.getElementById("SDCard_option").classList.add("item-disabled");
      this.file.getFreeDiskSpace().then(
        (response) => {
          let freeBytes = response.valueOf();
          if (this.OS === "android") this.freeSpacePhone = Math.round(freeBytes / 1024 );
          if (this.OS === "ios") this.freeSpacePhone = Math.round(freeBytes / 1024 / 1024 );

        }).catch( (err) => console.log("free disk space error " + err)
        ).then( () => this.checkFreeDiskSpace() );
  }

  checkFreeDiskSpace() {

    // only one download
    if (this.downloadStatus.length > 0) return;
    
    // browser, show progressbar
    if (this.OS === "browser") {
      this.downloadStatus = "Browser, test, show progressbar ...";
      setTimeout( () => {this.progress = 25;}, 1000);
      setTimeout( () => {this.progress = 50;}, 2000);
      setTimeout( () => {this.progress = 75;}, 3000);
      setTimeout( () => {this.progress = 100;}, 4000);
      setTimeout( () => {this.navCtrl.setRoot(HomePage)}, 5000);
      this.download();
      return;
    } 
    
    // // remove old files 
    // this.removeOldFiles().then( () => {

      /////////////////////////////////////////////
      // check installation target selection

      // if (this.installTarget === "") {
      //   this.fileDir = "";
      //   this.alertCtrl.create({
      //     title: 'Es ist ein Fehler aufgetreten!',
      //     message: 'Bitte ein Ziel für die Installation auswählen.',
      //     buttons: ['Okay']
      //   }).present();    
      // }

      // if (this.installTarget === "Telephone") {
        if (this.freeSpacePhone < this.freeDiskSpaceNeeded) {
          // console.log("free disk space: " + Math.round(response / 1024) + " Mb")
        let alert = this.alertCtrl.create({
          title: 'Nicht genügend Speicherplatz!',
          message: 'Es werden mindestens ' + this.freeDiskSpaceNeeded + 'MB freier Speicherplatz benötigt, um die Dateien zu entpacken.<br>Es sind leider nur ' + 
                                            this.freeSpacePhone + 'MB verfügbar.',
          buttons: [{
            text: "Erneut versuchen",
            handler: () => { 
              this.removeOldFiles();
              setTimeout(() => {this.retryCheckFreeDiskSpace()}, 2000); 
            }
          // }, {
          //   text: "Bisherige Dateien löschen und erneut versuchen",
          //   handler: () => { this.removeOldFiles(); }
          }, {
            text: "Abbrechen",
            role: 'cancel'
          }]
        })
        alert.present();
      } else {
        this.download();
      }
      // }

      // if (this.installTarget === "SDCard") {
      //   this.fileDir = this.singleton.installationDirAndroidSDCard;
      //   if (this.freeSpaceSDCard < (this.freeDiskSpaceNeeded)) {
      //     // console.log("free disk space: " + Math.round(response / 1024) + " Mb")
      //     let alert = this.alertCtrl.create({
      //       title: 'Nicht genügend Speicherplatz!',
      //       message: 'Es werden mindestens ' + this.freeDiskSpaceNeeded + 'MB freier Speicherplatz benötigt, um die Dateien zu entpacken.<br>Es sind leider nur ' + 
      //                                          this.freeSpaceSDCard + 'MB verfügbar.',
      //       buttons: [{
      //         text: "Erneut versuchen",
      //         handler: () => { this.checkFreeDiskSpace(); }
      //       }, {
      //         text: "Abbrechen",
      //         role: 'cancel'
      //       }]
      //     })
      //     alert.present();
      //   } else {
      //     this.download();
      //   }
      // }
  
    // });    

  }
  
  downloadFailed() {
    this.progress = 0;
    this.downloadStatus = "";
    let alert = this.alertCtrl.create({
      title: 'Keine Verbindung!',
      message: 'Bitte die Internet Einstellungen überprüfen.',
      buttons: [{
        text: "Erneut versuchen",
        handler: () => { this.download(); }
      }, {
        text: "Abbrechen",
        role: 'cancel'
      }]
    })
    alert.present();
  }

  download() {
    const fileTransfer = this.transfer.create();

    fileTransfer.download(
      this.downloadURL + this.downloadFile,
      this.fileDir + 'files/' + this.downloadFile,
      true
    ).then(
      (entry) => {
        // console.log(' » download complete: ' + entry.toURL());
        //this.loaderStop();
        this.unzip();
      }, 
      (error) => {
        // console.log(' » download error: ' + JSON.stringify(error));
        //todo: errorcodes
        // code 3 -> Network unreachable, connect failed: EHOSTUNREACH (No route to host)
        if (error.code === 3) {
          this.downloadFailed();
        }
        //this.loaderStop();
      });
    fileTransfer.onProgress(this.onDownloadProgress);
  }
  onDownloadProgress = (progressEvent: ProgressEvent): void => {
    this.downloadStatus = "Dateien werden heruntergeladen ...";
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      }
    });
  }

  unzip() {
    this.progress = 0;
    //this.loaderStart();
    // console.log('unzipping');
    this.zip.unzip(this.fileDir + 'files/' + this.downloadFile,
      this.fileDir + 'files/',
      (progressEvent) => { this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100); this.onZipProgress(progressEvent) })
      .then((result) => {
        if (result === 0) {
          // console.log('unzip finished');
          this.downloadStatus = "";
          //this.loaderStop();
          this.file.removeFile(this.fileDir + "files/", this.downloadFile)
            .then(
            (response) => {
              this.singleton.writeConfigFileOption("status","4");
              this.singleton.writeConfigFileOption("fileDir",this.fileDir);
              // console.log('zip file removed: ' + JSON.stringify(response));
              this.navCtrl.setRoot(HomePage);
            }, (err) => {
              // console.log('zip file remove error: ' + JSON.stringify(err));
            });
        }
        if (result === -1) {
          // console.log('unzip failed');
          //this.loaderStop();
        }
      });
  }
  onZipProgress = (progressEvent: ProgressEvent): void => {
    this.downloadStatus = "Dateien werden entpackt ...";
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      }
    });
  }

  // writeFile(filecontent) {
  //   this.file.removeFile(this.configFileDir + "files/", this.configFileName)
  //     .then(() => this.file.writeFile(this.configFileDir + "files/", this.configFileName, filecontent).then(
  //       (response) => {
  //         // console.log('config file updated: ' + JSON.stringify(response));
  //       }, (err) => {
  //         // console.log('config file error: ' + JSON.stringify(err));
  //       }));
  // }



}
