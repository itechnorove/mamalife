import { Injectable } from '@angular/core';
import { AlertController, Platform, LoadingController, PopoverController } from 'ionic-angular';

import { File, FileWriter } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { Zip } from '@ionic-native/zip';

import { HomePage } from '../../pages/home/home';
// import { PopoverPage } from '../../pages/popover/popover';
import { DomSanitizer } from '@angular/platform-browser';

// import { FileOpener } from '@ionic-native/file-opener';
// import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';


declare var cordova: any;

@Injectable()

export class SingletonService {

    public OS: string;
    public configFileDir: string;
    public configFileName: string;
    public fileDir: string;
    public installationDirAndroidTelephone : string ;
    public installationDirAndroidSDCard : string ;
    public installationDiriOS : string ;

    public configFileOptions: Array<{ option: string, value: string }>;
    public bewProfil: string;
    public bewAlltag: string;

    public meditationList: Array<{  header: string, 
                                    listname: string, 
                                    title: string, 
                                    filename: string, 
                                    path: string, 
                                    licence: string, 
                                    status: string }>;
    public yogaList: Array<{    title: string, 
                                text: string, 
                                duration: string, 
                                filename: string, 
                                path: string, 
                                licence: string, 
                                status: string }>;

    // public downloadURL: string = 'https://test.viterio.de/pubservice/userfile/getstatic/';
    public downloadURL: string = 'https://viterio2.de/appData/mammalife/';
    // public downloadFile: string = 'mammalife-files.zip';
    private progress: string = "";

    // im iOS Home Menu kann man ca. 2 Sekunden nachdem man zurück auf die Seite ist nicht auswählen
    public iOS_page_change_delay: number = 1234; // 1500 (ms)

    public debugCounterActivate: number = 9; // 9
    public debugLogs: string = "";
    public debugLevel: number = 0;
    public debugConsoleLog: boolean = false;

    public pdfMessage: boolean = true;

    constructor(
        public platform: Platform,
        public File: File,
        public alertCtrl: AlertController,
        public transfer: Transfer,
        public zip: Zip,
        public loadingCtrl: LoadingController,
        public popoverCtrl: PopoverController,
        private _sanitizer: DomSanitizer
        // private fileOpener: FileOpener,
        // public document: DocumentViewer,
    ) {

        //////////////////////////////
        // init
        
        this.debugLogs = "";
        this.configFileOptions = [];
        // this.readConfigFileOptions();
        // this.debugLog(">>> $ingleton start ");


        ////////////////////
        // general
        this.configFileName = "config.ini";


        ////////////////////
        // Browser
        if (typeof cordova === "undefined") {
            this.debugLog("$ingleton > browser");
            this.OS = "browser";
            this.configFileDir = "http://localhost/";
            this.configFileDir = "http://localhost:8888/";
            this.fileDir = this.configFileDir;
        } 
        else platform.ready().then(() => {

            ////////////////////
            // Android
                if (this.platform.is('android')) {
                    this.debugLog("$ingleton > OS:android");
                    this.OS = "android";
                    // cordova.file.dataDirectory || cordova.file.externalDataDirectory
                
                    // so wird die größe inkl. Dateien beim app manager angezeigt, aber die pdfs können nicht mehr geöffnet werden:
                    // this.configFileDir = cordova.file.applicationStorageDirectory;

                    this.configFileDir = cordova.file.externalApplicationStorageDirectory; // mammaLIFE_v1.0
                    this.fileDir = this.configFileDir;

                    // this.installationDirAndroidTelephone = cordova.file.applicationStorageDirectory;
                    // this.installationDirAndroidSDCard = cordova.file.externalApplicationStorageDirectory;
                    // manually set SDCard folder, only for specific android versions :(
                    // this.installationDirAndroidSDCard = "file:///storage/extSdCard/Android/data/de.viterio.mammalife/"; 
                }

            ////////////////////
            // iOS
                if (this.platform.is('ios')) {
                    this.debugLog("$ingleton > OS:ios");
                    this.OS = "ios";
                    this.configFileDir = cordova.file.dataDirectory;
                    this.fileDir = this.configFileDir;

                    // console.log (">>>>> cordova.file.applicationStorageDirectory: " + cordova.file.applicationStorageDirectory);
                    // console.log (">>>>> cordova.file.applicationDirectory: " + cordova.file.applicationDirectory);
                    // console.log (">>>>> cordova.file.documentsDirectory: " + cordova.file.documentsDirectory);
                    // console.log (">>>>> cordova.file.dataDirectory: " + cordova.file.dataDirectory);
                    // console.log (">>>>> cordova.file.syncedDataDirectory: " + cordova.file.syncedDataDirectory);

                    // this.installationDiriOS = cordova.file.dataDirectory;

                }


            // cordova.file.applicationDirectory                = file:///android_asset/
            // cordova.file.applicationStorageDirectory         = file:///data/data/de.viterio.mammalife/
            // cordova.file.dataDirectory                       = file:///data/data/de.viterio.mammalife/files/
            // cordova.file.cacheDirectory                      = file:///data/data/de.viterio.mammalife/cache/

            // cordova.file.externalApplicationStorageDirectory = file:///storage/emulated/0/Android/data/de.viterio.mammalife/
            // cordova.file.externalDataDirectory               = file:///storage/emulated/0/Android/data/de.viterio.mammalife/files/
            // cordova.file.externalCacheDirectory              = file:///storage/emulated/0/Android/data/de.viterio.mammalife/cache/
            // cordova.file.externalRootDirectory               = file:///storage/emulated/0/

            // PROBLEM!!!!! real extSDCard directory            = file:///storage/extSdCard/

            // iOS / BlackBerry
            // cordova.file.tempDirectory                       = ...
            // cordova.file.syncedDataDirectory                 = ...


            this.initAudios(); // <- cordova <- mobile phones 

        }); // platform.ready
        
        this.initAudios(); // <- Browser

    }



    //////////////////////////////////////////////////////////////////////
    // audio files
    
    // // progress bar
    // getProgressBar(percentaje){
    //     let html: string = '<progress value="' + percentaje + '" max="100"></progress>';
    //     return this._sanitizer.bypassSecurityTrustHtml(html);
    // }
    // presentLoading(){
    //     let loader = this.loadingCtrl.create({
    //     // spinner: 'hide',
    //     });
    //     loader.present();

    //     let counter: number = 0;
    //     let interval = setInterval(() => {
    //         loader.data.content = this.getProgressBar(counter);
    //         counter++;
    //         if (counter == 100) {
    //             loader.dismiss();
    //             clearInterval(interval);
    //         }
    //     }, 10);
    // }

    // delete file
    deleteAudioFile(path, file) : Promise<any> {
        return new Promise( (resolve,reject) => {
            this.File.removeFile(this.fileDir + path, file)
            .then( (ans) => { resolve(ans); })
            .catch((err) => { reject(err); });
        });
    }

    // load Files
    downloadAudioFile(title, file, path) : Promise<any> {
        return new Promise( (resolve, reject) => {

            let downloadDialog = this.alertCtrl.create({
                title: 'Audiodatei herunterladen',
                message: '"' + title + '"',
                buttons: [
                    {
                        text: "Download", 
                        handler: (data) => {

                            // first check if enough disk space ?
                            
                            this.progress = "0";
                            // loading spinner
                            let loader = this.loadingCtrl.create({
                                content: "0 %" // '"' + title + '" wird heruntergeladen...'
                                    //    + '<ion-input name="progress" [(ngModel)]="progress" placeholder="00"></ion-input>%' // this.progress
                            });
                            loader.present();

                            // popover
                            // let popover = this.popoverCtrl.create(PopoverPage);
                            // popover.present();

                            // this.presentLoading();

                            const fileTransfer = this.transfer.create();
                    
                            fileTransfer.download(  this.downloadURL + file,
                                                    this.fileDir + path + file,
                                                    true
                            ).then(
                            (entry) => {
                                loader.dismiss();
                                // popover.dismiss();
                                // console.log(' » download complete: ' + entry.toURL());
                                //this.loaderStop();
                                // this.unzip();
                                this.File.createFile(this.fileDir+path,file+".complete",true).then().catch();
                                resolve("Download completed:"+JSON.stringify(entry));
                            }, 
                            (error) => {
                                loader.dismiss();
                                // popover.dismiss();
                                reject(Error("Download ERROR:"+JSON.stringify(error)));
                                // console.log(' » download error: ' + JSON.stringify(error));
                                //todo: errorcodes
                                // code 3 -> Network unreachable, connect failed: EHOSTUNREACH (No route to host)
                                if (error.code === 3) {
                                    this.alertCtrl.create({
                                        title:   'Keine Verbindung',
                                        message: 'Bitte die Internet Einstellungen überprüfen.',
                                        buttons: [{text: "Okay", role: 'cancel'}]
                                    }).present();
                                }
                                //this.loaderStop();
                            });
                            fileTransfer.onProgress(this.onDownloadProgress);

                            // if ( true ) {
                            //   resolve("Stuff worked!");
                            // }
                            // else {
                            //   reject(Error("It broke"));
                            // }

                        }
                    },{
                        text: "Abbrechen", role: 'cancel' 
                    }
                ]            });
            downloadDialog.present();
            
            // downloadDialog.dismiss();

          });
    }
    onDownloadProgress = (progressEvent: ProgressEvent): void => {
        // this.downloadStatus = "Dateien werden heruntergeladen ...";
        // this.ngZone.run(() => {
        //   if (progressEvent.lengthComputable) {
        //     this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        //   }
        // });
        let percentage = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        this.progress = percentage.toString();
        this.debugLog(percentage);
        this.setLoadingText(this.progress+" %");
    }
    setLoadingText(text:string) {
        const elem = document.querySelector(
              "div.loading-wrapper div.loading-content");
        if(elem) elem.innerHTML = text;
    }

    // unzip file
    unzip(title, file, path) : Promise<any> {
        return new Promise( (resolve, reject) => {
            // this.progress = 0;
            //this.loaderStart();
            // console.log('unzipping');
            let loader = this.loadingCtrl.create({
                content: '"' + title + '" wird entpackt...' + '<ion-input disabled [(ngModel)]="progress" placeholder="X"></ion-input>' // this.progress
            });
            loader.present();

            this.zip.unzip( this.fileDir + path + file, 
                            this.fileDir + path,
            //   (progressEvent) => { this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100); this.onZipProgress(progressEvent) }
            ).then((result) => {
                if (result === 0) {
                    // console.log('unzip finished');
                    // this.downloadStatus = "";
                    //this.loaderStop();
                    this.File.removeFile( this.fileDir + path, 
                                          file 
                    ).then(
                        (response) => {
                            this.File.createFile(this.fileDir+path,file+".complete",true).then().catch();
                            loader.dismiss();
                            resolve("Unzip completed:"+JSON.stringify(response));
                            //   this.singleton.writeConfigFileOption("status","3");
                            //   this.singleton.writeConfigFileOption("fileDir",this.fileDir);
                            // console.log('zip file removed: ' + JSON.stringify(response));
                        }, (err) => {
                            // console.log('zip file remove error: ' + JSON.stringify(err));
                            this.debugLog("Fehler beim entfernen der Datei:"+JSON.stringify(err));
                            reject(Error("Download ERROR:"+JSON.stringify(err)));
                        });
                        // this.navCtrl.setRoot(HomePage);
                }
                if (result === -1) {
                    this.debugLog("Fehler beim entpacken der Datei:"+JSON.stringify(result));
                    reject(Error("Download ERROR:"+JSON.stringify(result)));
                    // console.log('unzip failed');
                    //this.loaderStop();
                }
            }).catch( (err) => {reject(Error("Download ERROR:"+JSON.stringify(err)));} );
        });
    }
    //   onZipProgress = (progressEvent: ProgressEvent): void => {
    //     this.downloadStatus = "Dateien werden entpackt ...";
    //     this.ngZone.run(() => {
    //       if (progressEvent.lengthComputable) {
    //         this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    //       }
    //     });
    //   }
    
    // check files
    checkAudioFiles() {
        this.meditationList.forEach(
            element => {
                this.File.checkFile(this.fileDir + element.path, element.filename+".complete")
                .then( () => {
                    element.status = "+";
                    // this.debugLog(element.filename + ": " + element.status);
                }).catch( () => {
                    element.status = "-";
                    // this.debugLog(element.filename + ": " + element.status);
                });
        });
        this.yogaList.forEach(
            element => {
                this.File.checkFile(this.fileDir + element.path, element.filename+".zip"+".complete")
                .then( () => {
                    element.status = "+";
                    // this.debugLog(element.filename+".mp3" + ": " + element.status);
                }).catch( () => {
                    element.status = "-";
                    // this.debugLog(element.filename+".mp3" + ": " + element.status);
                });
        });
    }

    // initialize
    initAudios() {

        this.meditationList = [
            {
                header:   "Body Scan:",
                listname: "Kurz, 23 Minuten",
                title:    "Body Scan 23 Min.",
                filename: "Body_Scan_23_Min.mp3", 
                path:     "files/meditation/",
                licence:  "free",
                status:   "0" 
            },
            {
                header:   "",
                listname: "Lang, 34 Minuten",
                title:    "Body Scan 34 Min.",
                filename: "Body_Scan_34_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "Sitzmeditation:",
                listname: "5 Minuten",
                title:    "Sitzmeditation 5 Min.",
                filename: "Sitzmeditation_5_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "free",
                status:   "0" 
            },
            {
                header:   "",
                listname: "15 Minuten",
                title:    "Sitzmeditation 15 Min.",
                filename: "Sitzmeditation_15_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "free",
                status:   "0" 
            },
            {
                header:   "",
                listname: "25 Minuten",
                title:    "Sitzmeditation 25 Min.",
                filename: "Sitzmeditation_25_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "free",
                status:   "0" 
            },
            {
                header:   "",
                listname: "35 Minuten",
                title:    "Sitzmeditation 35 Min.",
                filename: "Sitzmeditation_35_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "Stille Meditation:",
                listname: "2 Minuten",
                title:    "Stille Meditation 2 Min.",
                filename: "Stille_Meditation_2_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "",
                listname: "5 Minuten",
                title:    "Stille Meditation 5 Min.",
                filename: "Stille_Meditation_5_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "",
                listname: "15 Minuten",
                title:    "Stille Meditation 5 Min.",
                filename: "Stille_Meditation_15_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "",
                listname: "25 Minuten",
                title:    "Stille Meditation 25 Min.",
                filename: "Stille_Meditation_25_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "Weitere:",
                listname: "Heilmeditation 11 Min.",
                title:    "Heilmeditation 11 Min.",
                filename: "Heilmeditation_11_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "",
                listname: "Gefühle willkommen heißen 12 Min.",
                title:    "Gefühle 12 Min.",
                filename: "Gefuehle_willkommen_heissen_12_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
            {
                header:   "",
                listname: "Metta Meditation 15 Min.",
                title:    "Metta Meditation 15 Min.",
                filename: "Metta_Meditation_15_Min.mp3", 
                path:     "files/meditation/", 
                licence:  "full",
                status:   "0" 
            },
        ];

        this.yogaList = [
            { 
                title:    "Yoga 1",
                text:     "Rückenlage: Leg Stretch & Bridge Rolls & Hip Side Stretch",
                duration: "Dauer: 49 Minuten",
                filename: "Block1", 
                path:     "files/yoga/", 
                licence:  "free",
                status:   "0" 
            },
            { 
                title:    "Yoga 2",
                text:     "Cat Rolls & Cat Bow 1 & Cat Bow 2",
                duration: "Dauer: 23 Minuten",
                filename: "Block2", 
                path:     "files/yoga/", 
                licence:  "free",
                status:   "0" 
            },
            { 
                title:    "Yoga 3",
                // text:     "noch nicht verfügbar", 
                text:     "Rückenlage: Reclined Tree & Spider & Hip Side Stretch", 
                duration: "Dauer: 34 Minuten",
                filename: "Block3", 
                path:     "files/yoga/", 
                licence:  "full",
                status:   "0" 
            },
            { 
                title:    "Yoga 4",
                text:     "Cat Rolls & Cat Bow 2 & Cobra 1 & Cobra Boat & Cobra 2 Lift & Spider & Hip Side Stretch",
                duration: "Dauer: 42 Minuten",
                filename: "Block4", 
                path:     "files/yoga/", 
                licence:  "full",
                status:   "0" 
            },
            { 
                title:    "Yoga 5",
                text:     "Rückenlage: Bridge Rolls & Hip Side Stretch & Reclined Butterfly",
                duration: "Dauer: 27 Minuten",
                filename: "Block5", 
                path:     "files/yoga/", 
                licence:  "full",
                status:   "0" 
            }
        ];

    }



    //////////////////////////////////////////////////////////////////////
    // pdf 
    
    openPDFfile(pdfFileName: string) {

        if (this.pdfMessage && this.OS === "ios") {
            let alert = this.alertCtrl.create({
              title: 'PDF öffnen',
              message: 'Falls kein Acrobat Reader installiert ist, kann man PDFs auch mit iBooks öffnen.',
              buttons: 
                [{
                    text: "Nicht mehr anzeigen",
                    handler: () => {
                        this.pdfMessage = false;
                        // this.configFileOptions.push({ option: "batteryMessageErinnerungen", value: "false" });
                        this.readConfigFileOptions().then(() => { 
                            this.writeConfigFileOption("pdfMessage", "false");
                        });
                        this.doOpenPDFfile(pdfFileName)
                    }
                }, 
                {
                    text: "Okay",
                    handler: () => {
                        this.doOpenPDFfile(pdfFileName)
                    }
                }]
            })
            alert.present().then(
            //   () =>  { this.doOpenPDFfile(pdfFileName) }
            );
        } else { // pdfMessage Off
            this.doOpenPDFfile(pdfFileName);
        };

    }

    doOpenPDFfile(pdfFileName: string) {
          
        let fileLocation = "";
        // if (configFileName == "Krafttraining.pdf") {
        //     fileLocation = 'assets/pdfs/' + configFileName;
        // } else if (configFileName == "Borg-Skala.pdf") {
        //     fileLocation = 'cdvfile://localhost/persistent/files/pdfs/' + configFileName;
        // } else if (configFileName == "Zusammenfassung_edit.pdf") {
        //     fileLocation = '/sdcard/Download/Borg-Skala.pdf';
        // } else {
        //    fileLocation = this.fileDir + 'files/pdfs/' + pdfFileName;
        // }

        // fileLocation = "assets/pdfs/" + pdfFileName;
        // this.File.copyFile( fileLocation,                pdfFileName,
        //                     this.fileDir + "files/pdfs", pdfFileName).then(
        //     () => {

        //             this.debugLog("# PDF: " + fileLocation);
                    fileLocation = this.fileDir + 'files/pdfs/' + pdfFileName;
                    this.debugLog("# PDF: " + fileLocation);
                    

                    if (this.OS === "browser") {
                        window.open(fileLocation, '_system');            
                        // return;
                    } else {
                        // geht nur dann, wenn externer pdf viewer nicht auf private app content/folder zugreifen muss (externalApplicationStorageDirectory)
                        // cordova.plugins.fileOpener2.open(
                        cordova.plugins.fileOpener2.showOpenWithDialog(
                            fileLocation, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/test.pdf
                            'application/pdf',
                            {
                                error: function (e) {
                                    this.debugLog('fileOpener2 Error status: ' + e.status + ' - message: ' + e.message + '\n' + JSON.stringify(e));
                                },
                                success: function (r) {
                                    this.debugLog('fileOpener2 success: ' + JSON.stringify(r));
                                }
                            }
                        );
                    }
                    // geht nicht
                    // const options: DocumentViewerOptions = { title: 'My PDF' }
                    // this.document.viewDocument(fileLocation, 'application/pdf', options)

                    // geht nicht
                    // this.fileOpener.open(fileLocation, 'application/pdf')
                    // .then(() => this.debugLog('File is opened'))
                    // .catch(e => this.debugLog('Error openening file', e));        

        //         }
        // ).catch((e)=>{this.debugLog("FileCopy Error:"+JSON.stringify(e));});


    }




    //////////////////////////////////////////////////////////////////////
    // config file options
    
    getOption(opt): string {
        // return this.configFileOptions.find(item => item.option === opt).value;
        if (opt==="bewProfil")
            return this.bewProfil; // this.configFileOptions.filter(item => item.option === opt)[0].value;
        if (opt==="bewAlltag")
            return this.bewAlltag; 
    }

    // getOption(opt): string {
    //     let returnValue = "";
    //     for (var iO = 0; iO <= this.configFileOptions.length; iO++) {
    //         if (this.configFileOptions[iO]) {
    //             if (this.configFileOptions[iO].option == opt) {
    //                 returnValue = this.configFileOptions[iO].value;
    //             }

    //         }
    //     }
    //     return returnValue;
    // }

    setOption() {

    }


    readConfigFileOptions() : Promise<void> {

        return new Promise<void>((resolve, reject) => {
            
        if (typeof cordova == "undefined") { this.readConfigFileOptionsBrowser(); return; }
        
        this.debugLog("$ readConfigFileOptions start");
        this.File.readAsText(this.configFileDir + "files/", this.configFileName)
            .then(content => {
                this.configFileOptions = [];
                // let plainFileContent = atob(content.toString());
                let plainFileContent = content.toString();
                // this.debugLog("$ plainFileContent:\n" + plainFileContent);
                var options = plainFileContent.split("\n");
                for (var iO = 0; iO <= options.length; iO++) {
                    if (options[iO]) {
                        let optionDelimiter = options[iO].indexOf("=");
                        if (optionDelimiter > -1) {
                            let currentOption = options[iO].substring(0, optionDelimiter);
                            let currentValue = options[iO].substring(optionDelimiter + 1, options[iO].length);
                            this.debugLog(currentOption + "=" + currentValue);
                            try {
                                this.configFileOptions.push({
                                    option: currentOption,
                                    value: currentValue
                                });
                                if (currentOption === "fileDir") { 
                                    this.fileDir = currentValue;
                                }
                                if (currentOption === "bewProfil") { 
                                    this.bewProfil = currentValue;
                                }
                                if (currentOption === "bewAlltag") { 
                                    this.bewAlltag = currentValue;
                                }
                            } catch (err) {
                                this.debugLog("$ readConfigFileOptions this.configFileOptions.push Error:\n" + err);
                            }
                        }
                    }
                }
                resolve();
                // return new Promise(function (resolve, reject) {
                //     return resolve();
                // });
            }).catch(err => {
                this.debugLog("$ readConfigFileOptions Error File.readAsText:\n" + JSON.stringify(err, Object.getOwnPropertyNames(err)));
                reject();
            });
        });
    }

    // readConfigFileOption(optionToRead): Promise<string> {
    //     if (typeof cordova == "undefined") { return Promise.reject("1,NaN;22,501;333,522;4444,833;55555,4944;666666,56055;NaN,667166;NaN,NaN;NaN,NaN;NaN,NaN;NaN,NaN;NaN,NaN;"); }
    //     if (typeof optionToRead == "undefined") {
    //         this.debugLog("$ readConfigFileOption option undefined");
    //         return Promise.reject("option undefined");
    //     }
    //     this.debugLog("$ readConfigFileOption start");
    //     return new Promise<string>(function (resolve, reject) {
    //         this.File.readAsText(this.configFileDir + "files/", this.configFileName)
    //             .then(content => {
    //                 let returnValue = "";
    //                 this.configFileOptions = [];
    //                 let plainFileContent = atob(content.toString());
    //                 this.debugLog("$ plainFileContent:\n" + plainFileContent);
    //                 var options = plainFileContent.split("\n");
    //                 for (var iO = 0; iO <= options.length; iO++) {
    //                     if (options[iO]) {
    //                         let optionDelimiter = options[iO].indexOf("=");
    //                         if (optionDelimiter > -1) {
    //                             let currentOption = options[iO].substring(0, optionDelimiter);
    //                             let currentValue = options[iO].substring(optionDelimiter + 1, options[iO].length);
    //                             this.debugLog("$ option: " + currentOption + ", value: " + currentValue);
    //                             if (optionToRead === currentOption) {
    //                                 returnValue = currentValue;
    //                             }
    //                         }
    //                     }
    //                 }
    //                 this.debugLog("$ return value: " + returnValue);
    //                 resolve(returnValue);
    //             }).catch(
    //             (err) => {
    //                 this.debugLog("$ readConfigFileOption error: " + err);
    //                 reject(err);
    //             }
    //             );
    //     });
    // }

    writeConfigFileOption(optionToWrite, valueToWrite): Promise<any> {
        return new Promise((resolve,reject) => {

            this.debugLog("$ writeConfigFileOption start");
            if (typeof cordova == "undefined") { this.writeConfigFileOptionBrowser(optionToWrite, valueToWrite); resolve("writeConfigFileOption Browser"); }
                        
            // this.configFileOptions = [];
            this.readConfigFileOptions().then(() => {

                let fileContent = "";
                // all current options
                this.configFileOptions.forEach(element => {
                // this.asyncForEach(this.configFileOptions, element => {
                        this.debugLog("$ element.option:" + element.option + "=" + element.value);
                        if (optionToWrite != element.option) // skip new option 
                            fileContent = fileContent + element.option + '=' + element.value + '\n';
                    });
                    // .then( () => {
                            // new option
                            fileContent = fileContent + optionToWrite + '=' + valueToWrite;
                            this.debugLog("$ writeConfigFileOption fileContent:\n" + fileContent);
                            // this.writeFile(this.configFileName, btoa(fileContent)).then(
                            this.writeFile(this.configFileName, fileContent).then(
                                (res) => resolve("successfully written to file: " + res)
                        );
                    // });
            });

        });

    }
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    writeFile(configFileName, filecontent): Promise <any> {
        return new Promise((resolve,reject) => {
            this.File.removeFile(this.configFileDir + "files/", configFileName).then(
                () => this.File.writeFile(this.configFileDir + "files/", configFileName, filecontent).then(
                    (response) => {
                        // this.debugLog('config file updated: ' + JSON.stringify(response));
                        resolve(response);
                    }, (err) => {
                        // this.debugLog('config file error: ' + JSON.stringify(err));
                        reject(err);
                    }
                )
            );
            
        });
    }



    //////////////////////////////////////////////////////////////////////
    // debug/test functions
    //////////////////////////////////////////////////////////////////////

    writeConfigFileOptionBrowser(optionToWrite, valueToWrite) {
        this.configFileOptions.push({
            option: optionToWrite,
            value: valueToWrite
        });
        this.debugLog("$ new option: " + optionToWrite + '=' + valueToWrite);
    }
    readConfigFileOptionsBrowser() {
        let outputText = "";
        this.configFileOptions.forEach(element => {
            outputText = outputText + element + '\n';
        });
        this.debugLog("$ current options:\n" + outputText);
    }


    async getOption2(opt): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            // this.asyncForEach(this.configFileOptions, element => {
            this.configFileOptions.forEach(element => {
                if (element) {
                    if (element.option === opt) {
                        resolve(element.value);
                    }
                }
                // }).then(() => {
                //     resolve(element.value);
            });
        });
    }


    dateChecker (){
        this.alertCtrl.create({
            title: 'Date Checker:',
            inputs: [
                {
                    name: 'dateInput',
                    placeholder: '03-03-2018',
                    type: 'date'
                },
            ],
            buttons: [
                {
                    text: 'go',
                    handler: data => {
                        let zeitpunkt = new Date(data.dateInput);
                        // check DST (Daylight Saving Time) (Sommer-/Winterzeit)
                        var jan = new Date(zeitpunkt.getFullYear(), 0, 1);
                        var jul = new Date(zeitpunkt.getFullYear(), 6, 1);
                        var stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
                        var unterschied =  zeitpunkt.getTimezoneOffset() - stdTimezoneOffset;
                        // this.debugLog("Datum: " + zeitpunkt + " Unterschied:" + unterschied);
                        if ( unterschied === 0 ) {
                            alert( "Winterzeit. " + "Datum: " + zeitpunkt + " Unterschied:" + unterschied);
                        } else {
                            alert("Sommerzeit. " + "Datum: " + zeitpunkt + " Unterschied:" + unterschied);
                        }
                    }
                },
            ]            
        }).present();
    }


    listDir (path) : JSON {
        return (<any>window).resolveLocalFileSystemURL(path,
          function (fileSystem) : JSON {
            var reader = fileSystem.createReader();
            return reader.readEntries(
              function (entries) : JSON {
                alert( entries.map( (a) => "\n"+a["name"]) );
                return entries;
              },
              function (err) : JSON {
                alert(JSON.stringify(err));
                return err;
              }
            );
          }, function (err) : JSON {
            alert(JSON.stringify(err));
            return err;
        });
    }
      
    readConfigFile() {
        this.File.readAsText(this.configFileDir + "files/", this.configFileName)
            .then(content => {
                // this.alertCtrl.create({
                //     title: 'Config File:',
                //     message: atob(content.toString().replace(/\\n/gi, "<br>"))
                // }).present();
                // alert(atob(content.toString()));
                alert(content.toString());
            })
            .catch(err => {
                // this.debugLog(JSON.stringify(err));
            });
    }

    checkNotifications() {

        cordova.plugins.notification.local.getIds().then(
            (allID) => {
                let sAlert: String = "\nIDs:\n";
                allID.sort((a, b) => { return a - b; }).forEach(
                    (tID) => {
                    sAlert += tID + ", ";
                    });
                alert(sAlert);
        });

        // cordova.plugins.notification.local.getScheduledIds().then(
        //     (scheduledID) => {
        //     let sAlert: String = "scheduledIDs:\n";
        //     scheduledID.sort((a, b) => { return a - b; }).forEach(
        //         (sID) => {
        //         sAlert += sID + ", ";
        //         });
        //     alert(sAlert);
        // });

        // cordova.plugins.notification.local.getTriggeredIds().then(
        //     (triggeredID) => {
        //     let sAlert: String = "\ntriggeredIDs:\n";
        //     triggeredID.sort((a, b) => { return a - b; }).forEach(
        //         (tID) => {
        //         sAlert += tID + ", ";
        //         });
        //     alert(sAlert);
        // });
        
    }      

    debugMenu() {
        this.alertCtrl.create({
            title: 'Debug Menu',
            // subTitle: 'Menu',
            // message: this.readConfigFile(),
            // inputs: [
            //     {
            //         name: 'answerValue',
            //         placeholder: 'hier eingeben'
            //     }
            // ],
            buttons: [
                {
                    text: 'Audio Checker',
                    handler: (data) => {
                        this.checkAudioFiles();
                        setTimeout( () => {
                            this.debugLog(JSON.stringify(this.meditationList));
                            this.debugLog(JSON.stringify(this.yogaList));
                        }, 2000)
                    }
                },
                {
                    text: 'Notification Checker',
                    handler: (data) => {
                        this.alertCtrl.create({
                            title: 'Notifications',
                            buttons: [
                                {
                                    text: "check notifications", 
                                    handler: (data) => {
                                        cordova.plugins.notification.local.isPresent(0, function (present) {
                                            console.log(present ? " >>> present" : " >>> not found");
                                        });
                                        cordova.plugins.notification.local.get(0, function (notifications) {
                                            console.log("get 0\n" + JSON.stringify(notifications));
                                        });
                                        // cordova.plugins.notification.local.get(0,1,2, function (notifications) {
                                        //     console.log("get 0,1,2\n" + notifications);
                                        // });
                                        cordova.plugins.notification.local.getAll(function (notifications) {
                                            console.log("getAll\n" + JSON.stringify(notifications));
                                            let sAlert: String = "IDs: ";
                                            notifications.forEach((not) => {
                                                    sAlert += not.id + ", ";
                                                });
                                            alert(JSON.stringify(sAlert));  
                                            alert(JSON.stringify(notifications));
                                        });
                                        // cordova.plugins.notification.local.getAllIds(function (ids) {
                                        //     // getIds() as alias can also be used!
                                        //     console.log("getAllIds\n" + ids);
                                        //     console.log("this.getIds\n" + this.getIds() );
                                        // });
                                    }
                                },
                                {
                                    text: 'Test sofort',
                                    handler: (data) => {
                                        cordova.plugins.notification.local.schedule({
                                            title: 'Mit Frage',
                                            text: 'Was ist die Antwort?',
                                            attachments: ['assets/images/mammaLife_Logo.png'],
                                            actions: [
                                                { id: 'yes', title: 'Ja' },
                                                { id: 'no',  title: 'Nein' }
                                            ]
                                        });
                                    }
                                },
                                {
                                    text: 'Test 1 Min.',
                                    handler: (data) => {
                                        cordova.plugins.notification.local.schedule({
                                            title: 'Testnotification',
                                            text: 'funktioniert =)',
                                            foreground: true,
                                            trigger: { in: 1, unit: 'minute' }
                                        });
                                    }
                                },
                                {
                                    text: 'Test 2 Stück',
                                    handler: (data) => {
                                        cordova.plugins.notification.local.schedule({
                                            id: 1,
                                            title: 'Testnotification 1',
                                            text: 'funktioniert =)',
                                            foreground: true,
                                            trigger: { in: 1, unit: 'minute' }
                                        });
                                        cordova.plugins.notification.local.schedule({
                                            id: 2,
                                            title: 'Testnotification 2',
                                            text: 'funktioniert =)',
                                            foreground: true,
                                            trigger: { in: 2, unit: 'minute' }
                                        });
                                    }
                                },
                                // {
                                //     text: 'Clear All',
                                //     handler: (data) => {
                                //         cordova.plugins.notification.local.clearAll();
                                //     }
                                // },
                                {
                                    text: 'Cancel 1',
                                    handler: (data) => {
                                        cordova.plugins.notification.local.cancel(1);
                                    }
                                },
                                {
                                    text: 'Cancel All',
                                    handler: (data) => {
                                        cordova.plugins.notification.local.cancelAll();
                                    }
                                },
                            ]
                        }).present();
                    }
                },
                {
                    text: 'Date Checker',
                    handler: (data) => {
                        this.dateChecker();
                    }
                },
                {
                    text: 'config file',
                    handler: (data) => {
                        this.alertCtrl.create({
                            title: 'set config file status to',
                            buttons: [
                                {
                                    text: 'first run - 0',
                                    handler: (data) => { this.writeFile(this.configFileName, 'status=0\n'); }
                                },{
                                    text: 'logged in - 1',
                                    handler: (data) => { this.writeFile(this.configFileName, 'status=1\n'); }
                                },{
                                    text: 'v1.0 down+unzip - 2',
                                    handler: (data) => { this.writeFile(this.configFileName, 'status=2\n'); }
                                },{
                                    text: ' v1.06 down+unzip - 3',
                                    handler: (data) => { this.writeFile(this.configFileName, 'status=3\n'); }
                                },{
                                },{
                                    text: 'view config file',
                                    handler: (data) => { this.readConfigFile() }
                                },{
                                    text: "remove config file", 
                                    handler: (data) => { this.File.removeFile(this.configFileDir + "files/",  this.configFileName); }
                                },{
                                },{
                                    text: "Abbrechen", role: 'cancel' 
                                }
                            ]
                        }).present();
                    }
                },
                {
                    text: 'license',
                    handler: (data) => {
                        this.alertCtrl.create({
                            title: 'set license to',
                            buttons: [
                                {
                                    text: 'license = free',
                                    handler: (data) => { this.writeFile(this.configFileName, 'license=free\nstatus=4\n'); }
                                },{
                                    text: 'license = full',
                                    handler: (data) => { this.writeFile(this.configFileName, 'license=full\nstatus=4\n'); }
                                },{
                                    text: "Abbrechen", role: 'cancel' 
                                }
                            ]
                        }).present();
                    }
                },
                // {
                //     text: 'view debug log',
                //     handler: (data) => {
                //         alert(this.debugLogs);
                //     }
                // },
                {
                    text: 'debugging',
                    handler: (data) => {
                        this.alertCtrl.create({
                            title: 'debugging',
                            buttons: [
                                {
                                    text: 'console.log on/off',
                                    handler: (data) => {
                                        this.alertCtrl.create({
                                            title: 'console.log',
                                            buttons: [
                                                {
                                                    text: "On", handler: () => {
                                                        this.debugConsoleLog = true;
                                                    }
                                                }, 
                                                {
                                                    text: "Off", handler: () => {
                                                        this.debugConsoleLog = false;
                                                    }
                                                }, 
                                            ]
                                        }).present();
                                    }
                                },
                                {
                                    text: 'clear debug logs',
                                    handler: (data) => {
                                        // this.alertCtrl.create({
                                        //     title: 'Really clear debug logs?',
                                        //     buttons: [{
                                        //         text: "Okay", handler: () => {
                                                    this.debugLogs = "";
                                        //         }
                                        //     }, { text: "Abbrechen", role: 'cancel' }]
                                        // }).present();
                                    }
                                },
                            ]
                        }).present();
                    }
                },
                {
                    text: 'list files',
                    handler: (data) => {
                        this.debugLog(this.listDir(this.fileDir + "/files/meditation"));
                    }
                },                              
                // {
                //     text: 'readConfigFileOptions()',
                //     handler: (data) => {
                //         this.readConfigFileOptions();
                //     }
                // },
                // {
                //     text: 'readConfigFileOption("bewAlltag")',
                //     handler: (data) => {
                //         this.readConfigFileOption("bewAlltag");
                //     }
                // },
                // {
                //     text: 'open test PDF',
                //     handler: (data) => {
                //         this.openPDFfile("test.pdf");
                //     }
                // },
                // {
                //     text: 'Abbrechen',
                //     role: 'cancel',
                // }
            ]
        }).present();
        // .then(() => {
        //     const firstInput: any = document.querySelector('ion-alert input');
        //     firstInput.focus();
        //     return;
        // });
    }
    debugLog(msg) {
        // if (this.debugLevel > 0) {
            if (this.debugConsoleLog) console.log(msg);
            this.debugLogs += msg + '\n';
        // }
    }

}