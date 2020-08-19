import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { YogaPlayPage } from '../yoga-play/yoga-play';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

@Component({
  selector: 'page-yoga',
  templateUrl: 'yoga.html'
})
export class YogaPage {

  public myDate: Date = new Date();
  public isOpen: boolean = false;
	private singleton: SingletonService;
  private freeLicence: boolean = true;
  private pages: Array<{  title: string, 
                          text: string, 
                          duration: string, 
                          filename: string, 
                          path: string, 
                          licence: string, 
                          status: string }>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController ) 
  {
    this.singleton = AppModule.injector.get(SingletonService);
    this.pages = this.singleton.yogaList;
    this.singleton.readConfigFileOptions().then(() => {
      if ( this.singleton.configFileOptions.find( function(element) {return element.option == "licence"} ).value == "full") this.freeLicence = false;
    });
  }

  ionViewDidLoad() {
    this.singleton.debugLog('ionViewDidLoad YogaPage');
    this.singleton.checkAudioFiles();
    // document.getElementById("inactive").classList.add("item-disabled");
  }
  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }

  play(item) {
    
    // if (item.title==="Yoga 3") return;

    if (item.status != "+") {

      this.singleton.downloadAudioFile(item.title,item.filename+'.zip',item.path).then( (ans) => {
        this.singleton.debugLog("Datei erfolgreich geladen:"+ans);
        this.singleton.unzip(item.title,item.filename+'.zip',item.path).then( () => {
          item.status="+";
        }).catch( (err) => { this.singleton.debugLog("Fehler beim entpacken der Datei:" + err); } );
      }).catch( (err) => {
        this.singleton.debugLog("Fehler beim laden der Datei:" + err); 
      });
      
    }

    if (item.status === "+") {      
      this.navCtrl.push(YogaPlayPage, {
        audioTitle: item.title,
        audioFilename: item.filename
      });
    }

  }


  infoPage() {
    this.alertCtrl.create({
      title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
      subTitle: '\
                  Durch Operation, Chemotherapie oder Bestrahlung ist der Körper oft in Mitleidenschaft gezogen. Vielleicht fühlen Sie sich durch die Therapie geschwächt, Ihre Bewegungsfähigkeit ist eingeschränkt – oder Sie fühlen sich einfach nur „schlapp“.<br><br> \
                  Mit einfachen Yoga-Übungen können Sie wieder Kraft und Flexibilität aufbauen und Ihr Geist kann entspannen. TriYoga® ist ein sanfter Weg, sich in seiner Lebendigkeit und Körperlichkeit neu kennen zu lernen und für sich selbst zu sorgen. \
                ',
      message: '',
      buttons: [{
          text: "Weiter",
          handler: () => {
            this.alertCtrl.create({
              title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
              subTitle: '\
                          Die TriYoga®-Übungen in dieser App sind Teil des mammaLIFE-Programms und sind speziell auf die Bedürfnisse von Frauen mit Brustkrebs abgestimmt.<br><br> \
                          Trotzdem ist es wichtig, dass Sie nur das tun, wozu Sie heute in der Lage sind, und alles unterlassen, was Ihnen jetzt nicht angemessen erscheint. Auch hier geht es nicht darum, etwas Bestimmtes zu erreichen, sondern liebevoll in Kontakt mit Ihrem Körper zu kommen. \
                        ',
              message: '',
              buttons: [{ text: 'Okay', role: 'cancel' }]
            }).present();        
          }
        }]
    }).present();
  }


}
