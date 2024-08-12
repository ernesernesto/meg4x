import { _decorator, Component, Node, warn } from 'cc';
const { ccclass, property } = _decorator;

import { CurrencyUI } from "./ui/CurrencyUI";
import { TowerUI } from "./ui/TowerUI";
import { InfoUI } from "./ui/InfoUI";

@ccclass('GameManager')
export class GameManager extends Component {
    @property(CurrencyUI)
    public currencyUI: CurrencyUI = null!;

    @property(TowerUI)
    public towerUI: TowerUI = null!;

    @property(InfoUI)
    public infoUI: InfoUI = null!;

    onLoad() {
        this.towerUI.init(this);
        this.infoUI.init(this);
    }

    openHirePanel() {
        console.log("Trying to open hire panel");
    }

    openInfoPanel() {
        console.log("Trying to open info panel");
    }
}
