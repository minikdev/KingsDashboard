import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.scss'],
})
export class ModelPageComponent implements OnInit {
  @Input() squad: any;
  @Input() allTypes: any;
  @Input() king: string;

  constructor(
    public modalCtrl: ModalController,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      squad: this.squad,
      vampires: this.allTypes[0],
      wizards: this.allTypes[1],
      peasants: this.allTypes[2],
      deaths: this.allTypes[3],
      draftsSquad: this.allTypes[4],
      king: this.king,
      serialKillers: this.allTypes[5],
    });
  }

  remove(item: string) {
    this.squad = this.squad.filter((value) => value !== item);
    for (let i = 0; i < this.allTypes.length; i++) {
      this.allTypes[i] = this.allTypes[i].filter((value) => value !== item);
    }
    if (this.king === item) {
      this.king = undefined;
    }
  }

  kill(item: string) {
    this.allTypes[3].push(item);
    this.presentAlert(item + ' is dead now!');
  }

  async presentAlert(messagee: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert!',
      message: messagee,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
