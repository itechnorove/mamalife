import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { SplashScreen } from "@ionic-native/splash-screen/ngx";

import { File } from '@ionic-native/file';
import { LocalNotifications } from '@ionic-native/local-notifications';


import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TransferPage } from '../pages/transfer/transfer';

// import { ErinnerungenPage } from '../pages/erinnerungen/erinnerungen';
import { SingletonService } from "../services/singleton/singleton";
import { AppModule } from "../app/app.module";


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
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.

        // this.singleton = AppModule.injector.get(SingletonService);
        // this.fileName = this.singleton.configFileName;
        // this.fileDir = this.singleton.fileDir;

        StatusBar.styleDefault();

        if (platform.is('android')) {
          this.preparationAndroid();
        } else if (platform.is('ios')) {
          this.preparationIOS();
        }

        // SplashScreen.hide();
        if (SplashScreen) {
          setTimeout(() => {
            SplashScreen.hide();
          }, 333);
         }

        this.fireLocalNotification();

      });
    } else { // running in browser
      this.rootPage = TransferPage; // TransferPage; // HomePage; // LoginPage;
    }
    
  }

  preparationAndroid() {
    this.OS = "android";
    this.configFileName = "config.ini";
    
    // so wird die größe inkl. Dateien beim app manager angezeigt, aber die pdfs können nicht mehr geöffnet werden:
    // this.appFileDir = cordova.file.applicationStorageDirectory;

    this.appFileDir = cordova.file.externalApplicationStorageDirectory; // mammaLIFE_v1.0 
    
    // this.testFilePermissions();
    this.checkConfigFile();
  }

  preparationIOS() {
    this.OS = "ios";
    this.configFileName = "config.ini";
    this.appFileDir = cordova.file.dataDirectory;
    // this.checkDirectories();
    this.checkConfigFile();
  }


    // LocalNotifications.getScheduledIds().then(
    //   (scheduledID) => {
    //     let sAlert: String =  "scheduledIDs:\n";
    //     scheduledID.sort((a,b) => {return a - b;}).forEach(
    //       (sID) => {
    //         sAlert += sID + ", ";
    //     });
    //     alert(sAlert);
    //   });


  fireLocalNotification()  {

    this.LocalNotifications.on("click", (notification, state) => {

      // console.log("triggered notification no. " + notification.id + ", status: " + state );

        // this.navCtrl.push(ErinnerungenPage).then( () => {    // no navCtrl in app.compontent.ts => "no known provider for t"


          // setTimeout(function() {
          let text = notification.text;
          if (notification.title == "Geplante Aktivität") {
            text = "<b>" + notification.text.replace(/\n/g, "</b><br>");
          }

            // let text = notification.text.split('\n').join('<br>')

            let notificationAlert = this.alertCtrl.create({
              title: notification.title,
              subTitle: text,
              buttons: [{
                text: "Zur App",
                handler: () => { this.rootPage = HomePage; }
              // }, {
              //   text: "Schließen",
              //   handler: () => { this.platform.exitApp(); }
              }]
            });
            notificationAlert.present().then(() => {
              // alert(notification.text);
            });


          // }, 1000)


        // });

    });



    // LocalNotifications.on("trigger", (notification, state) => {
    //   console.log("triggered notification no. " + notification.id + ", status: " + state );
    // });


    // LocalNotifications.on("trigger", (notification, state) => {

    //   ///////////////////////////////////////////////////////////////////////////////
    //   // only works if application is running at least in background (not reliable) 

    //   // if (notification.id != 82) return;

    //   // // create new notification
    //   // let erinnerungText = this.erinnerung_texte[Math.round(Math.random() * (19 - 0) + 0)].text;
    //   // this.schedule(notification.id+1);
    //   // LocalNotifications.clear(notification.id);
    //   // LocalNotifications.cancel(notification.id);
    //   // LocalNotifications.update({
    //   //   id: notification.id,
    //   //   text: erinnerungText,
    //   // });

    //   // // after some time update notification's title
    //   // let ntext = this.erinnerung_texte[Math.round(Math.random() * (19 - 0) + 0)].text;
    //   // let thiss = this;
    //   // setTimeout(function (me=thiss, newtext=ntext) {
    //   //   LocalNotifications.update({
    //   //     id: 82,
    //   //     text: newtext
    //   //   });
    //   //   me.schedule();
    //   // }, 3000);

    // });

    // this.checkRemainingNotifications();

  }

  // checkRemainingNotifications() {
  //   let remainingNotifications:number = 0;
  //   LocalNotifications.getScheduledIds().then(
  //     (allIDs) => {
  //       allIDs.forEach(
  //         (aID) => {
  //           if (aID < 100000 ) {
  //             remainingNotifications++;
  //           }
  //         }
  //       );
  //     }
  //   ).then(() => {
  //     if (remainingNotifications < this.ep.maximumNumberOfNotifications / 2 ) {

  //       // clear remaining notifications
  //       LocalNotifications.getAllIds().then(
  //         (allIDs) => {
  //           allIDs.forEach(
  //             (aID) => {
  //               if (aID < 100000 ) {
  //                 LocalNotifications.cancel(aID);
  //               }
  //             }
  //           );
  //         }
  //       );

  //       // create bulk of new notifications
  //       this.ep.readConfigFileOptions();
  //       this.ep.schedule();

  //     }
  //   });
  // }


  checkDirectories(){

    console.log("------------------------- start directories check -------------------------");

    var direcotryList:string[] = [
                                    cordova.file.applicationStorageDirectory,
                                    cordova.file.applicationDirectory,
                                    cordova.file.documentsDirectory,
                                    cordova.file.dataDirectory,
                                    cordova.file.syncedDataDirectory,
                                    cordova.file.cacheDirectory,
                                    cordova.file.tempDirectory
                                  ]; 
    // direcotryList.push('c');
    // console.log(direcotryList) // [a,b,c]  
    for (let dirs of direcotryList) {
      console.log(dirs);
      this.File.checkDir(dirs, ".")
      .then(
        (res) => {
                    // console.log("OK:"+JSON.stringify(res));
                    this.File.listDir(dirs,".").then(
                        (res) => { console.log("OK:"+JSON.stringify(res))}
                      ).catch(
                        (err) => { console.log("ERROR:"+JSON.stringify(err))}
                      );
                  }
      ).catch(
        (err) => {
                    console.log("ERROR"+JSON.stringify(err));
                  }
      );
    }
    
    console.log("------------------------- end directories check -------------------------");

  }

  testFilePermissions() {

    // test write for file permissions

    this.File.checkFile(this.appFileDir + "files/", "test.txt")
    .then((response) => {
        console.log('>>>>>>>>>> test file existing: ' + JSON.stringify(response));
        this.File.removeFile(this.appFileDir + "files/", "test.txt").then(
          (response) => {
            console.log('>>>>>>>>>> test file removed: ' + JSON.stringify(response));
            this.testFilePermissions();
          }, (err) => {
            console.log('>>>>>>>>>> test file remove error: ' + JSON.stringify(err));
            this.testFilePermissions();
          });
    })
    .catch((response) => {
      console.log('>>>>>>>>>> no test file: ' + JSON.stringify(response));
      this.File.createFile(this.appFileDir + "files/", "test.txt", true).then(
        (response) => {
          console.log('>>>>>>>>>> test file created: ' + JSON.stringify(response));
          this.checkConfigFile();
        }, (err) => {
          console.log('>>>>>>>>>> test file creation error: ' + JSON.stringify(err));
          let alert = this.alertCtrl.create({
            title: 'Dateizugriff',
            subTitle: 'Zum download und abspielen der Übungen wird der Zugriff auf das Handy benötigt.',
            buttons: [{
              text: "Okay",
              handler: () => {
                this.testFilePermissions();
              },
              }]
          });
          alert.present();
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
        
        // if (status === 0) { this.rootPage = LoginPage };      // first run  (config file created)
        // if (status === 1) { this.rootPage = TransferPage };   // logged in  (persönlicher Zugang)
        // // if (status === 2) { this.redownload(); };          // downloaded (+ unzipped in v1.0) ( was used in v1.1.20 )
        // if (status === 2) { this.cleanupForOndemand(); };     // downloaded (+ unzipped in v1.06)
        // if (status === 3) { this.cleanupForOndemand(); };     // unzipped   (up-to-date in v1.1.20)
        // if (status === 4) { this.rootPage = HomePage };       // on demand, > v1.2.0


        // status is set in transfer.ts 
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
          case 3: { // unzipped   (up-to-date in v1.1.20)
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

  redownload () {

    // this.removeOldFiles().then(() => { console.log('>>>>>>>>>>>>>>>>>>>> THEN <<<<<<<<<<<<<<<<<<<<'); this.rootPage = TransferPage; });
    this.rootPage = TransferPage;
    
    this.removeOldFiles();
    
    let alert = this.alertCtrl.create({
      title: 'Neue Dateien!',
      // subTitle: 'Die neue "Metta Meditation" ist dazugekommen, alle Dateien werden nochmal heruntergeladen.\n\nBisherige Dateien werden dabei ersetzt.',
      // allgemein gültige Meldung:
      subTitle: 'Es sind neue Audio/PDF Dateien vorhanden und werden heruntergeladen.\n\nDie bisherigen Dateien werden dabei ersetzt.',
      buttons: [{
        text: "Okay",
        handler: () => {},
        }]
    });
    alert.present();

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


  // removeOldFiles() {
  //   // return new Promise ( function(resolve,reject) {
  //   this.File.removeFile(this.appFileDir + "files/",'mammalife-files.zip');

  //   this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/meditation')
  //     .then((response) => {
  //         console.log('directory meditation removed: ' + JSON.stringify(response));
  //           this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/pdfs')
  //           .then((response) => {
  //               console.log('directory pdfs removed: ' + JSON.stringify(response));
  //               this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files/yoga')
  //               .then((response) => {
  //                   console.log('directory yoga removed: ' + JSON.stringify(response));
  //                   // resolve("Stuff worked!");
  //               },(err) => { 
  //                   console.log('directory yoga remove error: ' + JSON.stringify(err)); 
  //               });
  //           },(err) => {
  //               console.log('directory pdfs remove error: ' + JSON.stringify(err)); 
  //           });
  //     },(err) => { 
  //         console.log('directory meditation remove error: ' + JSON.stringify(err)); 
  //     });
  //   // });
  // }



}





    // let alert2 = this.alertCtrl.create({
    //   title: 'App deinstallieren',
    //   subTitle: 'Um alle bisherigen Dateien zu entfernen deinstallieren Sie bitte hierzu die APP und installieren Sie sie wieder neu. Der Zugangscode lautet "mammalife-aktiv".',
    //   buttons: [{
    //     text: "Okay",
    //     handler: () => {

    //     }
    //   }]
    // });
    // alert2.present();

          
    

    // old folder: /storage/emulated/0/Android/data/mammalife.viterio.de.mammalife/files/yoga/images/Weg Face Down Becken.jpg
    
    // new folder: file:///data/data/mammalife.de.viterio.mammalife/files/
    //             data/data/mammalife.de.viterio.mammalife/files/yoga/images/Hüfte versetzen 

    
    // this.File.removeRecursively(cordova.file.applicationDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.applicationDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory applicationDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.applicationStorageDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.applicationStorageDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory applicationStorageDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.cacheDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.cacheDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory cacheDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.dataDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.dataDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory dataDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );
    
    // this.File.removeRecursively(cordova.file.externalRootDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalRootDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalRootDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

// --v
    // this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalApplicationStorageDirectory removed: ' + JSON.stringify(response));
    //                 this.rootPage = TransferPage; }, 
    // (err) => { console.log('directory externalApplicationStorageDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.externalCacheDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalCacheDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalCacheDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.externalDataDirectory,'files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalDataDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalDataDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );



    // this.File.removeRecursively(cordova.file.applicationDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.applicationDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory applicationDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.applicationStorageDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.applicationStorageDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory applicationStorageDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.cacheDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.cacheDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory cacheDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.dataDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.dataDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory dataDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );
    
    // this.File.removeRecursively(cordova.file.externalRootDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalRootDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalRootDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.externalApplicationStorageDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalApplicationStorageDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalApplicationStorageDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.externalCacheDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalCacheDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalCacheDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );

    // this.File.removeRecursively(cordova.file.externalDataDirectory,'../files').then( // () => this.rootPage = TransferPage);
    // (response) => { console.log('directory cordova.file.externalDataDirectory removed: ' + JSON.stringify(response)); }, 
    // (err) => { console.log('directory externalDataDirectory remove error: ' + JSON.stringify(err)); }).catch( () => {} );



