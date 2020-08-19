import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Injector } from '@angular/core';
// import { Diagnostic } from '@ionic-native/diagnostic';

import { BrowserModule } from '@angular/platform-browser';

import { SingletonService } from '../services/singleton/singleton';
import { HomePage } from '../pages/home/home';
import { MeditationPage } from '../pages/meditation/meditation';
import { TransferPage } from '../pages/transfer/transfer';
import { LoginPage } from '../pages/login/login';
import { MeditationPlayPage } from '../pages/meditation-play/meditation-play';
import { YogaPage } from '../pages/yoga/yoga';
import { SettingsPage } from '../pages/settings/settings';
import { ImpressumPage } from '../pages/impressum/impressum';
import { ErinnerungenPage } from '../pages/erinnerungen/erinnerungen';
import { PlanerPage } from '../pages/planer/planer';
import { YogaPlayPage } from '../pages/yoga-play/yoga-play';
import { BewegungPage } from '../pages/bewegung/bewegung';
import { ErnaehrungPage } from '../pages/ernaehrung/ernaehrung';
import { ErnaeAllgemeinesPage } from '../pages/ernae-allgemeines/ernae-allgemeines';
import { ErnaeNwlindernPage } from '../pages/ernae-nwlindern/ernae-nwlindern';
import { ErnaeRezeptePage } from '../pages/ernae-rezepte/ernae-rezepte';
import { ErnaeBeiBrustkrebsPage } from '../pages/ernae-bei-brustkrebs/ernae-bei-brustkrebs';
import { BewegProfilPage } from '../pages/beweg-profil/beweg-profil';
import { BewegAlltagPage } from '../pages/beweg-alltag/beweg-alltag';
import { BewegAusdauerPage } from '../pages/beweg-ausdauer/beweg-ausdauer';
import { BewegKraftPage } from '../pages/beweg-kraft/beweg-kraft';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { Zip } from '@ionic-native/zip';
import { Insomnia } from '@ionic-native/insomnia';

import { enableProdMode } from '@angular/core';
enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    BewegKraftPage,
    BewegAusdauerPage,
    BewegAlltagPage,
    BewegProfilPage,
    ErnaeBeiBrustkrebsPage,
    ErnaeRezeptePage,
    ErnaeNwlindernPage,
    ErnaeAllgemeinesPage,
    ErnaehrungPage,
    BewegungPage,
    YogaPlayPage,
    PlanerPage,
    ErinnerungenPage,
    ImpressumPage,
    SettingsPage,
    YogaPage,
    MeditationPlayPage,
    LoginPage,
    TransferPage,
    MeditationPage,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      pageTransition: 'ios-transition'
    }),
    BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BewegKraftPage,
    BewegAusdauerPage,
    BewegAlltagPage,
    BewegProfilPage,
    ErnaeBeiBrustkrebsPage,
    ErnaeRezeptePage,
    ErnaeNwlindernPage,
    ErnaeAllgemeinesPage,
    ErnaehrungPage,
    BewegungPage,
    YogaPlayPage,
    PlanerPage,
    ErinnerungenPage,
    ImpressumPage,
    SettingsPage,
    YogaPage,
    MeditationPlayPage,
    LoginPage,
    TransferPage,
    MeditationPage,
    HomePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SingletonService,
    File,
    Transfer,
    Zip,
    Insomnia
    // Diagnostic
  ]
})
export class AppModule {
  // Allows for retrieving singletons using 'AppModule.injector.get(MyService)' later in the code
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
