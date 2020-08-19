import { Component } from '@angular/core';
import { NavController, Platform, AlertController, LoadingController } from 'ionic-angular';

import { File } from '@ionic-native/file';

import { TransferPage } from '../transfer/transfer';
import { HomePage } from "../home/home";

import { SingletonService } from "../../services/singleton/singleton";
import { AppModule } from "../../app/app.module";

// declare var cordova: any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ File ]
})
export class LoginPage {

  public showLogin: boolean = false;
  public accesscode: string = '';
  public password: string = '';
  public name: string = '';
  public readyToLogin: boolean;
  public configFileDir: string;
  public configFileName: string;

  private singleton: SingletonService;
  private OS: string = "";

  constructor(public navCtrl: NavController, 
              public platform: Platform, 
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController,
              public File: File) {

    this.readyToLogin = false;

    platform.ready().then(() => {

      this.singleton = AppModule.injector.get(SingletonService);
      this.configFileName = this.singleton.configFileName;
      this.configFileDir = this.singleton.configFileDir;

      this.readyToLogin = true;
      //this.checkConfigFile();
/*      this.secureStorage = new SecureStorage();
      this.secureStorage.create('mamalife').then(
        () => {
          // console.log('Storage is ready!');

          this.secureStorage.get('loginInfo')
            .then(

            data => {
              this.navCtrl.setRoot(TabsPage, null, { animate: true });
              // console.log('data was ' + data);
              let {u, p} = JSON.parse(data);
              this.email = u;
              this.password = p;
              this.doLogin();
            },
            error => {
              // do nothing - nothing stored yet
            }
            );

          this.readyToLogin = true;

        },
        // error => console.log(error)
      );
*/
    });

  }

  ionViewDidLoad() {
    // this.singleton.debugLog('ionViewDidLoad LoginPage');
    setTimeout( () => { 
      this.OS = this.singleton.OS;
      this.showLogin = true; 
    }, 1000);
  }
  
  doFreeVersion () {
    if (this.singleton.OS !== "browser") 
      this.singleton.writeConfigFileOption("status","4").then(
        () => this.singleton.writeConfigFileOption("licence","free").then(
            () => this.navCtrl.setRoot(TransferPage)
        )
      )
  }

  doLogin() {
    if (this.showLogin) {

      if (this.accesscode === '') { // || this.password === '') {
        let alert = this.alertCtrl.create({
          title: 'Es ist ein Fehler aufgetreten!',
          subTitle: 'Bitte Zugangsdaten eingeben.',
          buttons: ['Okay']
        });
        alert.present();
        return;
      }

      /*the following code checkes whether the entered userid and password are matching*/
      if (this.accesscode == "mammalife-aktiv") { // && this.password == "b") {
        if (this.singleton.OS !== "browser") this.singleton.writeConfigFileOption("status","1").then(
          () => this.singleton.writeConfigFileOption("licence","full").then(
            () => this.navCtrl.setRoot(TransferPage)
          )
        );
      } else if (this.accesscode == "mammalife-debug") { 
        this.navCtrl.setRoot(HomePage);
      } else {
        //Dialogs.alert("Bad login. Use 'password' for password.", "Bad Login");
        let alert = this.alertCtrl.create({
          title: 'Es ist ein Fehler aufgetreten!',
          subTitle: 'Die eingegebenen Zugangsdaten sind leider ungültig.',
          buttons: ['Okay']
        });
        alert.present();

      }

      /*this.auth.login('basic', {'email':this.email, 'password':this.password}).then(() => {
        // console.log('ok i guess?');
        loader.dismissAll();
        this.navCtrl.setRoot(HomePage);        
      }, (err) => {
        loader.dismissAll();
        // console.log(err.message);
 
        let errors = '';
        if(err.message === 'UNPROCESSABLE ENTITY') errors += 'Email isn\'t valid.<br/>';
        if(err.message === 'UNAUTHORIZED') errors += 'Password is required.<br/>';
 
        let alert = this.alertCtrl.create({
          title:'Login Error', 
          subTitle:errors,
          buttons:['Okay']
        });
        alert.present();
      });*/

    } else {
      this.showLogin = true;
    }
  }


  // doRegister() {
  //   //this.navCtrl.setRoot(TabsPage, null, { animate: true });
  //   if (!this.showLogin) {
  //     // console.log('process register');

  //     // do our own initial validation
  //     if (this.name === '' || this.email === '' || this.password === '') {
  //       let alert = this.alertCtrl.create({
  //         title: 'Register Error',
  //         subTitle: 'All fields are required',
  //         buttons: ['Okay']
  //       });
  //       alert.present();
  //       return;
  //     }

  //     /*
  //           let details: UserDetails = {'email':this.email, 'password':this.password, 'name':this.name};
  //           // console.log(details);
            
  //           let loader = this.loadingCtrl.create({
  //             content: "Registering your account..."
  //           });
  //           loader.present();
      
  //           this.auth.signup(details).then(() => {
  //             // console.log('ok signup');
  //             this.auth.login('basic', {'email':details.email, 'password':details.password}).then(() => {
  //               loader.dismissAll();
  //               this.navCtrl.setRoot(HomePage);
  //             });
      
  //           }, (err:IDetailedError<string[]>) => {
  //             loader.dismissAll();
  //             let errors = '';
  //             for(let e of err.details) {
  //               // console.log(e);
  //               if(e === 'required_email') errors += 'Email is required.<br/>';
  //               if(e === 'required_password') errors += 'Password is required.<br/>';
  //               if(e === 'conflict_email') errors += 'A user with this email already exists.<br/>';
  //               //don't need to worry about conflict_username
  //               if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
  //             }
  //             let alert = this.alertCtrl.create({
  //               title:'Register Error', 
  //               subTitle:errors,
  //               buttons:['Okay']
  //             });
  //             alert.present();
  //           });
  //     */
  //   } else {
  //     this.showLogin = false;
  //   }

  // }



  // private debugCounter: number = 0;
  // debugStart(){
  //   this.debugCounter++;
  //   if ( this.debugCounter === 11 ){
  //     this.navCtrl.setRoot(HomePage);
  //   } 
  // }


  
}
