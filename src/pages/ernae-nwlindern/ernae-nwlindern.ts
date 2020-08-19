import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Content, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-ernae-nwlindern',
  templateUrl: 'ernae-nwlindern.html',
})
export class ErnaeNwlindernPage {

  @ViewChild(Content) content: Content;

  private items: Array<{ title: String, content1: String, headline1: String, content2: String, headline2: String}> = [];
  private last_item: number = -1;
  // private items_length = 10;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController
            ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ErnaeNwlindernPage');
    // for (var iW = 1; iW <= this.items_length; iW++) {this.items.push({ Schritte: iW.toString(), Ziel: iW.toString() }); }
    this.items = [
      //text: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
      //max sichtbare breite variabel je nach breite der buchstaben :/
      { title: 'Appetitlosigkeit', headline1: '', content1: 'Bitterstoffe wie Artischocken, Löwenzahn, Mariendistel, gut gewürzte Speisen, frisch zubereitetes Essen, dessen Düfte den Appetit steigern', headline2: '', content2: '' },
      { title: 'Blähungen', headline1: '', content1: 'Preiselbeeren; Heidelbeeren, Kümmel-, Fenchel-, Anistee; Preiselbeer-und Blaubeersaft, Kümmel (muss kurz aufgekocht werden)', headline2: 'blähend sind:', content2: 'frisches Obst (Birnen, Rhabarber), rohes Gemüse; Kohlsorten wie Grünkohl, Weißkohl, Rotkohl; Hülsenfrüchte, (geschalt versuchen); Pilze; Paprika; Spargel; Schwarzwurzeln; Rettich, Rosen- und Blumenkohl, Kohlrabi, Broccoli sind in kleinen Mengen vertraglich, frisches Brot; Vollkornbrot; Eiernudeln, Milchprodukte: Milchzucker, kohlensäure- und koffeinhaltige Getränke wie Mineralwasser, Brausen, Bitter Lemon, Schweppes, Bier, Prosecco, Sekt, Nüsse; Knoblauch; Zwiebeln; Zuckeraustauschstoffe; Eier; Lebensmittel mit Ei z. B. Mayonnaise' },
      { title: 'Brechreiz', headline1: '', content1: 'Bitterstoffe', headline2: '', content2: '' },
      { title: 'Darmkrämpfe', headline1: '', content1: 'besser keine Ballaststoffe, besser geeignet: Leinsamen, Hanfsamen mit genügend Flüssigkeit, Haferschleim, Gemüsemolke oder Kurmolke', headline2: '', content2: '' },
      { title: 'Depression', headline1: '', content1: 'Johanniskrauttee', headline2: '', content2: '' },
      { title: 'Durchfall', headline1: '', content1: 'ballaststoffarme Speisen im Akutfall, Bananen, Reis, geriebenen Apfel oder Möhren, Heidelbeeren, gekochte Möhren, geriebene rohe Möhren, gekochte Kartoffeln viel Trinken evtl. mit etwas Salz, Sesamstangen, Haferschleimsuppe, Leinsamensuppe, Reissuppe, schwarzer Tee, Heidelbeersaft', headline2: '', content2: '' },
      { title: 'Ekel vor Speisen', headline1: '', content1: 'Bitterstoffe wie Artischocken, Löwenzahn, Mariendistel', headline2: '', content2: '' },
      { title: 'Hitzewallungen', headline1: '', content1: 'Salbeitee', headline2: '', content2: '' },
      { title: 'Kau- und Schluckbeschwerden', headline1: '', content1: 'Cremesuppen, breiige Speisen wie Kartoffelpüree, Shakes, Quarkspeisen', headline2: '', content2: '' },
      { title: 'Lymphunterstützung', headline1: '', content1: 'Itires Tropfen', headline2: '', content2: '' },
      { title: 'Müdigkeit', headline1: '', content1: 'viel Trinken, wenn möglich Sport. Rosmarin erhöht den Blutdruck. Löwenzahn stoffwechselfördernd', headline2: '', content2: '' },
      { title: 'Mundschleimhaut, Speiseröhre', headline1: 'Entzündungen der Mundschleimhaut, Speiseröhre.', content1: 'Nicht zu heiße Speisen, keine zu stark gewürzten Speisen. Kein zu saures Obst, Gemüse oder Salat.', headline2: '', content2: 'Gut verträglich sind Breie, Kartoffelpüree, Haferschleimsuppe, Reisschleimsuppe, Leinsamentrunk, Apfelmus, Kamillentee, Leinsamentee' },
      { title: 'Muskelabbau', headline1: '', content1: 'ausreichend Eiweiß aus Nüssen, Hülsenfrüchten, Fisch, Ziegen- und Schafprodukte', headline2: '', content2: '' },
      { title: 'Niere', headline1: '', content1: 'Goldrutentee, Birkentee', headline2: '', content2: '' },
      { title: 'Schlafstörungen', headline1: '', content1: 'Baldriantee, Passionsblumentee, Hopfenblütentee, Lavendeltee, Johanniskrauttee', headline2: '', content2: '' },
      { title: 'Trockener Mund', headline1: '', content1: 'den Mund immer wieder mit Pfefferminztee oder Zitronenwasser ausspülen, Sauermilch, Kefir, Cremespeisen, Sahne', headline2: '', content2: '' },
      { title: 'Übelkeit', headline1: '', content1: 'Artischocken, Ingwer, viel Trinken in kleinen Schlücken verteilt über den Tag (Pfefferminz-, Ingwer-, Fencheltee mit etwas Salz, Wasser ohne Kohlensäure)', headline2: '', content2: '' },
      { title: 'Verstopfung', headline1: '', content1: 'ballaststoffreiche Ernährung, viel Trinken, viel Bewegen, 2 Gläser lauwarmes Wasser nach dem Aufstehen, viel Gemüse möglichst als	Rohkost oder Salat, 1-2 TL Obstessig am Morgen, ballaststoffreiches Getreide in der Vollkornvariante, Trockenobst: Pflaumen oder Feigen, bei Weizenkleie und Flohsamen auf ausreichend Flüssigkeit achten, sonst stopfend, Zuckeraustauschstoffe; scharf gebratene und gewürzte Speisen; scharfe Gewurze wie Chili, schwarzer Pfeffer, Paprika', headline2: '', content2: '' },
    ];    
  }

  toggleStyle(nr) {
    this.toggleStyleOnlyOneVisible(nr);
    // this.content.scrollTo(0, document.getElementById("div" + nr).offsetTop - 120 , 1000)
  }
  toggleStyleOnlyOneVisible(nr) {
    if (this.last_item != -1) {
      document.getElementById("div" + this.last_item).classList.add("hiddenelement");
      document.getElementById("arrow-up" + this.last_item).classList.add("hiddenelement");
      document.getElementById("arrow-down" + this.last_item).classList.remove("hiddenelement");
    }
    if (this.last_item == nr) {
      this.last_item = -1;
    } else {
      this.last_item = nr;
      this.toggleStyleIndividually(nr);
    }
  }
  toggleStyleIndividually(nr) {
    document.getElementById("div" + nr).classList.toggle("hiddenelement");
    document.getElementById("arrow-up" + nr).classList.toggle("hiddenelement");
    document.getElementById("arrow-down" + nr).classList.toggle("hiddenelement");
    // window.scrollTo(document.getElementById("div" + nr).getBoundingClientRect().bottom, 1000);
    this.content.scrollTo(0, document.getElementById("div" + nr).offsetTop - 120 , 1000)
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
