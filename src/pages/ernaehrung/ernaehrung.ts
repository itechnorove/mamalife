import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ErnaeAllgemeinesPage } from '../ernae-allgemeines/ernae-allgemeines';
import { ErnaeNwlindernPage } from '../ernae-nwlindern/ernae-nwlindern';
import { ErnaeBeiBrustkrebsPage } from '../ernae-bei-brustkrebs/ernae-bei-brustkrebs';
// import { ErnaeRezeptePage } from '../ernae-rezepte/ernae-rezepte';

@Component({
  selector: 'page-ernaehrung',
  templateUrl: 'ernaehrung.html'
})
export class ErnaehrungPage {

  ernaepages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.ernaepages = [
      { title: 'Allgemeines', component: ErnaeAllgemeinesPage },
      { title: 'Ernährung bei Brustkrebs', component: ErnaeBeiBrustkrebsPage },
      { title: 'Nebenwirkungen lindern', component: ErnaeNwlindernPage },
      // { title: 'Rezepte', component: ErnaeRezeptePage }
    ];      

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ErnaehrungPage');
  }
  ionViewWillLeave() {
		// let loader = this.loadingCtrl.create({
		// 	duration: 1000,
		// 	// dismissOnPageChange: true
		// });
		// loader.present();
  }

  openPage(page) {
    // // show loading spinner
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
      subTitle:  'Eine heilende Krebs-Ernährung gibt es nicht.<br> \
                  Wohl aber kann eine gesunde und genussvolle Ernährung das Risiko an Krebs zu erkranken vermindern bzw. nach einer Erkrankung das Risiko eines Rückfalls reduzieren.<br> \
                  Zudem können die Selbstheilungskräfte im Körper aktiviert und das Immunsystem unterstützt werden.<br> \
                  <br> \
                  <b>Hinweis:</b><br> \
                  Während oder unmittelbar nach einer Chemotherapie können Wechselwirkungen mit bestimmten Lebensmitteln auftreten. Bitte sprechen Sie Ihre Ernährung mit Ihrem behandelnden Arzt ab. \
              ',
      message: '',
      buttons: [{ text: 'Okay', role: 'cancel' }]
    }).present();
  }


}
