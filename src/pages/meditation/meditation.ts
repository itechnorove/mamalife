import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { MeditationPlayPage } from '../meditation-play/meditation-play';

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

@Component({
  selector: 'page-meditation',
  templateUrl: 'meditation.html'
})
export class MeditationPage {

	private singleton: SingletonService;
  private freeLicence: boolean = true;
  private pages: Array<{  header: string, 
                          title: string, 
                          filename: string, 
                          path: string, 
                          licence: string, 
                          status: string }>;

  constructor(  public navCtrl: NavController, 
                public navParams: NavParams, 
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController )
  {
    this.singleton = AppModule.injector.get(SingletonService);
    this.pages = this.singleton.meditationList;
  }

  ionViewDidLoad() {
    this.singleton.debugLog('ionViewDidLoad MeditationPage');
    this.singleton.readConfigFileOptions().then(() => {
      if ( this.singleton.configFileOptions.find( function(element) {return element.option == "licence"} ).value == "full") this.freeLicence = false;
    });
    this.singleton.checkAudioFiles();
  }
  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }

  play(item) {
    
    if (item.status != "+") {
      // // show loading spinner
      // let loader = this.loadingCtrl.create({
      //   content: item.title + ' wird geladen...'
      // });
      // loader.present();
      
      // loader.onDidDismiss( () => { item.status="+"; } );

      // setInterval( () => {loader.dismiss();} , 3000);
      this.singleton.downloadAudioFile(item.title,item.filename,item.path).then( (ans) => {
        // loader.dismiss();
        this.singleton.debugLog("Datei erfolgreich heruntergeladen:"+ans);
        item.status="+";
      }).catch( (err) => {
        // loader.dismiss();
        this.singleton.debugLog("Fehler beim herunterladen der Datei:" + err); 
      });


    }

    if (item.status === "+") {      
      this.navCtrl.push(MeditationPlayPage, {
        audioTitle: item.title,
        audioFilename: item.filename
      });
    }

  }

  infoPage() {
    this.alertCtrl.create({
      title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
      subTitle: '\
                  Achtsamkeitsmeditation kann helfen, klarer und weniger bewertend zu sehen und Orientierung in sich selbst zu finden.<br><br> \
                  Achtsamkeit bedeutet, den gegenwärtigen Augenblick bewusst wahrzunehmen und zu akzeptieren – so wie er ist.<br><br> \
                  Etliche klinische Studien zeigen die positiven Auswirkungen von Achtsamkeitsmeditation bei Krebserkrankungen. Vor Allem im Umgang mit Stress, aber auch mit Ängsten und Sorgen ist Achtsamkeitstraining eine effektive Maßnahme, um mehr innere Ruhe und Gelassenheit zu entwickeln. \
                      ',
      message: '',
      buttons: [{
          text: "Weiter",
          handler: () => {
            this.alertCtrl.create({
              title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
              subTitle: '\
                          Die gute Nachricht: Achtsamkeit lässt sich trainieren. Am besten regelmäßig. Beginnen Sie zum Beispiel mit nur 5 Minuten am Tag und steigern Sie die Meditationsdauer, wann immer Ihnen danach zu Mute ist.<br><br> \
                          <b>Tipp:</b><br>Es gibt nichts zu erreichen und alles darf sein! Sie müssen sich in der Meditation weder besonders gut entspannen können, noch besonders konzentriert sein. Nehmen Sie Moment für Moment war, was geschieht – ohne an Ihrem Erleben etwas ändern zu wollen. Vielleicht gelingt es Ihnen auch, immer wieder eine freundliche und geduldige Haltung sich selbst gegenüber einzunehmen. \
                                      ',
              message: '',
              buttons: [{ text: 'Okay', role: 'cancel' }]
            }).present();        
          }
        }]
    }).present();
  }



  /*openPage(page) {
    // close the menu when clicking a link from the menu
    //this.menu.close();
    // navigate to the new page if it is not the current page
    //this.nav.setRoot(page.component);
    this.navCtrl.push(page.component).then(
      (success) => {
        // console.log("navigation.push: " + JSON.stringify(success))
      },
      (error) => {
        // console.log("navigation.push: " + JSON.stringify(error))
      }
    );
  }*/

}
