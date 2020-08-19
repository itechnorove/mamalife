import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BewegProfilPage } from '../beweg-profil/beweg-profil';
import { BewegAlltagPage } from '../beweg-alltag/beweg-alltag';
import { BewegAusdauerPage } from '../beweg-ausdauer/beweg-ausdauer';
import { BewegKraftPage } from '../beweg-kraft/beweg-kraft';

@Component({
  selector: 'page-bewegung',
  templateUrl: 'bewegung.html'
})
export class BewegungPage {

  bewegpages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.bewegpages = [
      { title: 'Mein Bewegungs-Profil', component: BewegProfilPage },
      { title: 'Alltagsbewegung', component: BewegAlltagPage },
      { title: 'Ausdauertraining', component: BewegAusdauerPage },
      { title: 'Kräftigung', component: BewegKraftPage }
    ];  
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BewegungPage');
  }
  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }

  openPage(page) {
    // show loading spinner
    // let loader = this.loadingCtrl.create({
    //   duration: 1000,
    //   // dismissOnPageChange: true
    // });
    // loader.present();

    // close the menu when clicking a link from the menu
    // this.menu.close();

    // navigate to the new page if it is not the current page
    //this.nav.setRoot(page.component);
    // this.navCtrl.push(page.component).then(
    this.navCtrl.push(page.component).then(
        (success) => {
        // console.log("navigation.push: " + JSON.stringify(success))
      },
      (error) => {
        // console.log("navigation.push: " + JSON.stringify(error))
      }
    );
  }


  infoPage() {
    this.alertCtrl.create({
      title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
      subTitle: '\
                  Bewegung schützt nicht nur vor Krebs, sondern kann bei manchen Krebsarten auch die Wahrscheinlichkeit eines Rückfalls verringern. In jedem Fall trägt körperliche Bewegung aber zur Verbesserung Ihrer Leistungsfähigkeit und Lebensqualität bei.<br><br> \
                  Und mit körperlicher Bewegung ist nicht unbedingt Sport gemeint – sondern eine gemäßigtes Training, wie zum Beispiel flottes Spazierengehen. \
                ',
      message: '',
      buttons: [{
          text: "Weiter",
          handler: () => {
            this.alertCtrl.create({
              title: '<div style="width: 100% !important; zoom: 2.0 !important; margin-left: 24px !important;">ⓘ<div>',
              subTitle: '\
                          Bei mammaLIFE unterscheiden wir zwischen Alltagsbewegung (das, was Sie ohnehin tun), Ausdauertraining und Kräftigungstraining.<br><br> \
                          Ideal ist es, wenn Sie alle drei Bewegungsformen kombinieren. Tipps und Hilfsmittel erhalten Sie unter den jeweiligen Menüpunkten. \
                        ',
              message: '',
              buttons: [{ text: 'Okay', role: 'cancel' }]
            }).present();        
          }
        }]
    }).present();
  }



}
