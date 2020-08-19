import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, AlertController, Platform } from 'ionic-angular';

import { MeditationPage } from '../meditation/meditation';
import { YogaPage } from '../yoga/yoga';
import { ErinnerungenPage } from '../erinnerungen/erinnerungen';
import { PlanerPage } from '../planer/planer';
// import { SettingsPage } from '../settings/settings';
import { ImpressumPage } from '../impressum/impressum';
import { BewegungPage } from '../bewegung/bewegung';
import { ErnaehrungPage } from '../ernaehrung/ernaehrung';
import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

import { Insomnia } from '@ionic-native/insomnia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private freeLicence: boolean = true;

  pages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    private insomnia: Insomnia
  ) {

    this.singleton = AppModule.injector.get(SingletonService);
    this.singleton.readConfigFileOptions().then(() => {
      if ( this.singleton.configFileOptions.find( function(element) {return element.option == "licence"} ).value == "full") this.freeLicence = false;
    });

    this.pages = [
      { title: 'Meditation', component: MeditationPage },
      { title: 'Yoga', component: YogaPage },
      { title: 'Ernährung', component: ErnaehrungPage },
      { title: 'Bewegung', component: BewegungPage },
      { title: 'Planer', component: PlanerPage },
      { title: 'Achtsamkeits-Erinnerungen', component: ErinnerungenPage },
      // { title: 'Einstellungen', component: SettingsPage },
      { title: 'Impressum', component: ImpressumPage }
    ];

  }

  ionViewDidLoad() {
    this.singleton.debugLog('ionViewDidLoad HomePage');
    this.singleton.readConfigFileOptions().then(() => {
      if ( this.singleton.configFileOptions.find( function(element) {return element.option == "licence"} ).value == "full") this.freeLicence = false;
    });
  }

  ionViewDidEnter() {
    this.platform.registerBackButtonAction(() => {
        this.platform.exitApp();
    });

    this.insomnia.keepAwake().then(
      () => this.singleton.debugLog('insomina on: success'),
      () => this.singleton.debugLog('insomina on: error')
    );
  
    // this.insomnia.allowSleepAgain().then(
    //   () => console.log('success'),
    //   () => console.log('error')
    // );

    // im iOS Home Menu kann man ca. 2 Sekunden nachdem man zurück auf die Seite ist nicht auswählen
    if (this.singleton.OS === "ios") {
      let loader = this.loadingCtrl.create({
        duration: this.singleton.iOS_page_change_delay,
        // dismissOnPageChange: true
      });
      loader.present();
    }

  }

  ionViewWillLeave() {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();
      });
  }

  openPage(page) {
    // // show loading spinner
    // let loader = this.loadingCtrl.create({
    //   duration: 1000,
    //   // dismissOnPageChange: true
    // });
    // loader.present();

    // close the menu when clicking a link from the menu
    this.menu.close();

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
  }


  infoPage() {
    // this.alertCtrl.create({
    //   title: '<div class="customAlertTitle" id="customAlertTitle" style="width=100%; text-align:center;">ⓘ</div>',
    //   subTitle: '\
    //               Eine Krebserkrankung ist ein vielschichtiges Geschehen. Fest steht jedoch, dass Sie selbst eine ganze Menge zu einem gesunden und zufriedenen Leben beitragen können.<br><br> \
    //               Beispielsweise kann regelmäßige körperliche Bewegung die Wahrscheinlichkeit eines Rückfalls nach einer Brustkrebserkrankung deutlich reduzieren.<br><br> \
    //               Aber auch eine gesunde, genussvolle Ernährung oder eine achtsame, liebevolle Haltung zu sich selbst können sich günstig auf Ihre Gesundheit auswirken. \
    //             ',
    //   message: '',
    //   buttons: [{
    //       text: "Weiter",
    //       handler: () => {
            this.alertCtrl.create({
              title: '<table width=100%><tr style="text-align: center !important;"><td style="text-align: center !important;">ⓘ</td></tr></table>',
              subTitle: '\
                          <a href="http://www.mammalife.de" target="_blank">mammaLIFE</a> ist ein ganzheitliches Nachsorge-Programm für Frauen nach einer Brustkrebserkrankung. Mit dieser App erhalten Sie ganz einfache und praktische Unterstützung, die wichtigsten Elemente des Programms eigenständig umzusetzen.<br><br> \
                          Auch bei anderen (Krebs-)Erkrankungen empfehlen sich die meisten der hier aufgeführten Maßnahmen. Bitte sprechen Sie diese im Einzelfall mit Ihrem behandelnden Arzt ab. <br><br> \
                          Weitere Informationen unter <a href="http://www.mammalife.de" target="_blank">www.mammalife.de</a>\
                        ',
              message: '',
              buttons: [{ text: 'Okay', role: 'cancel' }]
            }).present();
    //       }
    //     }]
    // }).present();
  }



  private singleton: SingletonService;
  private debugCounter: number = 0;
  debug() {
    this.debugCounter++;
    if (this.debugCounter >= this.singleton.debugCounterActivate) this.singleton.debugMenu();
  }

}
