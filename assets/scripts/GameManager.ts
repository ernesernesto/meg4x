import { _decorator, Component, Node, warn, JsonAsset, resources, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import { CurrencyUI } from "./ui/CurrencyUI";
import { TowerUI } from "./ui/TowerUI";
import { InfoUI } from "./ui/InfoUI";
import { HirePanelUI } from "./ui/HirePanelUI";

enum GameState {
    Gameplay,
    HirePanel,
    InfoPanel,
};

@ccclass('GameManager')
export class GameManager extends Component {
    @property(HirePanelUI)
    public hirePanelUI: HirePanelUI = null!;

    @property(TowerUI)
    public towerUI: TowerUI = null!;

    @property(InfoUI)
    public infoUI: InfoUI = null!;

    @property(CurrencyUI)
    public currencyUI: CurrencyUI = null!;

    @property(Node)
    public panelNode: Node = null!;

    gameState: GameState = GameState.Gameplay;

    public buildings: Array<Object> = null!;
    public heroes: Array<Object> = null!;

    public heroesSpriteDict: Object = null!;
    public heroesUIDict: Object = null!;

    onLoad() {
        this.towerUI.init(this);
        this.infoUI.init(this);

        resources.loadDir('settings', JsonAsset, (err, jsonAssets) => {
            for (let data of jsonAssets) {
                if (data.name === "buildings") {
                    this.buildings = data.json.buildings;
                }
                else if (data.name === "heroes") {
                    this.heroes = data.json.heroes;
                }
                else if (data.name === "initial_state") {
                    let test = "";
                }
            }
        });

        resources.loadDir('heroes/ui', SpriteFrame, (err, sprites) => {
            this.heroesUIDict = Object.fromEntries(sprites.map(sprite => [sprite.name, sprite]));
        });

        resources.loadDir('heroes/sprite', SpriteFrame, (err, sprites) => {
            this.heroesSpriteDict = Object.fromEntries(sprites.map(sprite => [sprite.name, sprite]));
        });
    }

    start() {
    }

    loadHeroes(data: json) {
        for (let entry of data.heroes) {
            console.log(entry.id);
            console.log(entry.name);
            console.log(entry.description);
        }
    }

    toggleHirePanel() {
        let valid = (this.gameState === GameState.Gameplay) || (this.gameState === GameState.HirePanel);
        if (valid) {
            if (this.gameState === GameState.Gameplay) {
                this.gameState = GameState.HirePanel;

                if (!this.hirePanelUI.initialized) {
                    this.hirePanelUI.init(this);
                }
                this.hirePanelUI.show();
            }
            else if (this.gameState === GameState.HirePanel) {
                this.gameState = GameState.Gameplay;
                this.hirePanelUI.hide();
            }
        }
    }

    toggleInfoPanel() {
    }
}
