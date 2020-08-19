import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { File } from '@ionic-native/file';
import { LocalNotifications } from '@ionic-native/local-notifications';


import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TransferPage } from '../pages/transfer/transfer';

// import { ErinnerungenPage } from '../pages/erinnerungen/erinnerungen';
import { SingletonService } from "../services/singleton/singleton";
import { AppModule } from "../app/app.module";
import { Device } from '@ionic-native/device/ngx';

declare var cordova: any;

@Component({
  templateUrl: 'app.html',
  providers: [ StatusBar, SplashScreen, File, LocalNotifications ]
})
export class MyApp {
  rootPage: any ;//= LoginPage; // = HomePage;

  public OS: string;
  public appFileDir: string;
  public configFileName: string;
  public fileContent: string = "";

  public remainingNotifications: number;

  private singleton: SingletonService;

  constructor(public platform: Platform, 
              public alertCtrl: AlertController,
              public StatusBar: StatusBar,
              public SplashScreen: SplashScreen,
              public LocalNotifications: LocalNotifications,
              public File: File) {
    if (typeof cordova !== "undefined") {
      platform.ready().then(() => {

        StatusBar.styleDefault();

        if (platform.is('android')) {
          this.preparationAndroid();
        } else if (platform.is('ios')) {
          this.preparationIOS();
        }

        SplashScreen.hide();
        this.fireLocalNotification();

      });
    } else { // running in browser
      this.rootPage = TransferPage; // TransferPage; // HomePage; // LoginPage;
    }

    if (platform) {
      // request read access to the external storage if we don't have it
      cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function (status) {
          if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
              console.log("External storage use is authorized");
          } else {
              cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (result) {
                  console.log("Authorization request for external storage use was " + (result === cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
              }, function (error) {
                  console.error(error);
              });
          }
      }, function (error) {
          console.error("The following error occurred: " + error);
      });
  }
    
  }


  preparationAndroid() {
    this.OS = "android";
    this.configFileName = "config.ini";

    this.appFileDir = cordova.file.externalApplicationStorageDirectory; 
    
    this.checkConfigFile();
  }

  preparationIOS() {
    this.OS = "ios";
    this.configFileName = "config.ini";
    this.appFileDir = cordova.file.dataDirectory;
    this.checkConfigFile();
  }


  fireLocalNotification()  {

    this.LocalNotifications.on("click", (notification, state) => {

          let text = notification.text;
          if (notification.title == "Geplante Aktivität") {
            text = "<b>" + notification.text.replace(/\n/g, "</b><br>");
          }

            let notificationAlert = this.alertCtrl.create({
              title: notification.title,
              subTitle: text,
              buttons: [{
                text: "Zur App",
                handler: () => { this.rootPage = HomePage; }
              }]
            });
            notificationAlert.present().then(() => {
              // alert(notification.text);
            });

    });

  }



  checkConfigFile() {

    this.File.checkDir(this.appFileDir, "files").then(
      () => {
        console.log('>>>>>>>>>> directory ok, checking config file')
        this.File.checkFile(this.appFileDir + "files/", this.configFileName)
          .then((response) => {
              console.log('>>>>>>>>>> config file existing: ' + JSON.stringify(response));
              this.checkStatus();
          })
          .catch((response) => {
            console.log('>>>>>>>>>> no config file: ' + JSON.stringify(response));
            // encryption removed due to file opening bug
            // this.File.writeFile(this.appFileDir + "files/", this.configFileName, btoa("status=0\n")).then(
            this.File.writeFile(this.appFileDir + "files/", this.configFileName, "status=0\n").then(
              (response) => {
                console.log('>>>>>>>>>> config file created: ' + JSON.stringify(response));
                this.checkStatus();
              }, (err) => {
                console.log('>>>>>>>>>> config file creation error: ' + JSON.stringify(err));
              });
            });
    }).catch((err) => {
      console.log('>>>>>>>>>> directory error:'+JSON.stringify(err)+"\nthis.appFileDir:"+this.appFileDir);
      this.File.createDir(this.appFileDir, "files", false).then(
        (res) => { 
          console.log (">>>>>>>>>> directory created:"+JSON.stringify(res));
          this.checkConfigFile();
        }
      ).catch(
        (err) => { console.log (">>>>>>>>>> directory creation error:"+JSON.stringify(err));}
      );
    });
  }

  checkStatus() {
    console.log (">>>>>>>>>> checking status");
    this.File.readAsText(this.appFileDir + "files/", this.configFileName)
      .then(content => {
        console.log (">>>>>>>>>> config file:"+content);

        // this.fileContent = atob(content.toString());
        this.fileContent = content.toString();
        console.log (">>>>>>>>>> config this.fileContent:"+this.fileContent);
        let status = -1
        status = parseInt(this.fileContent.substr(this.fileContent.indexOf("status=") + 7, 1));
        console.log (">>>>>>>>>> config file status:"+status);
        
        // status depends on app version and the state of download/unzip. it is set in transfer.ts 
        switch(status) { 
          case 0: { // first run  (config file created)
              this.rootPage = LoginPage
             break; 
          } 
          case 1: { // logged in  (persönlicher Zugang)
              this.rootPage = TransferPage
             break; 
          } 
          case 2: { // downloaded (+ unzipped in v1.06)
              this.cleanupForOndemand();
             break; 
          } 
          case 3: { // unzipped (up-to-date in v1.1.20)
              this.cleanupForOndemand();
             break; 
          } 
          case 4: { // on demand, > v1.2.0
              this.rootPage = HomePage 
             break; 
          } 
          case 5: { // keine ahnung warum status=5, aber okay: convert config file/remove encryption 
            console.log('>>>>>>>>>> config file status 5 <<<<<<<<<<<<');
            this.decryptConfigFile()
             break; 
          } 
          default: { // sicherheitshalber auch als default: convert config file/remove encryption 
            console.log('>>>>>>>>>> config file status default <<<<<<<<<<<<');
            this.decryptConfigFile()
             break; 
          } 
       }         

      })
      .catch(err => {
        console.log (">>>>>>>>>> read config file error:"+JSON.stringify(err));
      });
      console.log (">>>>>>>>>> read config file end");

      // check if any page was loaded
      setTimeout( (rp:any = this.rootPage) => {
        console.log (">>>>>>>>>> read config file REPEAT CHECK:"+this.rootPage);
        if (this.rootPage){
          console.log (">>>>>>>>>> read config file REPEAT END");
        }else{
          console.log (">>>>>>>>>> read config file REPEATING");
        
          let alert = this.alertCtrl.create({
            title: 'Fehler',
            subTitle: 'Es ist ein unerwarteter Fehler aufgetreten, bitte die Applikation schließen und neu starten.',
            buttons: [{
              text: "Okay",
              handler: () => {
                // window.close();
                this.platform.exitApp();
              },
              }]
      });
          alert.present();
          //actual repeat:
          // this.checkStatus();
        }
      }, 5000);

  }

  decryptConfigFile () {
    this.File.writeFile(this.appFileDir + "files/", this.configFileName, atob(this.fileContent), {replace: true})
    .then(
      (response) => {
        console.log('>>>>>>>>>> config file CONVERTED: ' + JSON.stringify(response));
        this.checkStatus();
      }, (err) => {
        console.log('>>>>>>>>>> config file CONVERSION error: ' + JSON.stringify(err));
    });
  }

  cleanupForOndemand(){
    this.removeOldFiles();
    this.rootPage = TransferPage;
  }

  removeOldFiles () {
    if (this.OS === "android") {
      // Android: mammaLIFE_v1.0:
      this.File.removeFile(cordova.file.externalApplicationStorageDirectory + "files/",'mammalife-files.zip');
      this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/meditation');
      this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/pdfs');
      this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/yoga');
      // Android: mammaLIFE_v1.06: (so wird die größe inkl. Dateien beim app manager angezeigt)
      this.File.removeFile(cordova.file.applicationStorageDirectory + "files/",'mammalife-files.zip');
      this.File.removeRecursively(cordova.file.applicationStorageDirectory,'files/meditation');
      this.File.removeRecursively(cordova.file.applicationStorageDirectory,'files/pdfs');
      this.File.removeRecursively(cordova.file.applicationStorageDirectory,'files/yoga');
    }
    if (this.OS === "ios") {
      // iOS: mammaLIFE
      this.File.removeFile(cordova.file.dataDirectory + "files/",'mammalife-files.zip');
      this.File.removeRecursively(cordova.file.dataDirectory,'files/meditation');
      this.File.removeRecursively(cordova.file.dataDirectory,'files/pdfs');
      this.File.removeRecursively(cordova.file.dataDirectory,'files/yoga');
    }
  }

}
