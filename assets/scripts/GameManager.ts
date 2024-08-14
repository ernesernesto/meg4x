import { _decorator, Component, Node, warn, JsonAsset, resources, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

import { CurrencyUI } from "./ui/CurrencyUI";
import { TowerUI } from "./ui/TowerUI";
import { InfoUI } from "./ui/InfoUI";
import { HirePanelUI } from "./ui/HirePanelUI";
import { InfoPanelUI } from "./ui/InfoPanelUI";

enum GameState {
    Gameplay,
    HirePanel,
    InfoPanel,
};

export interface CharacterSpriteData {
    hero: Object,
    rank: SpriteFrame,
    type: SpriteFrame,
    character: SpriteFrame,
};

@ccclass('GameManager')
export class GameManager extends Component {
    @property(HirePanelUI)
    public hirePanelUI: HirePanelUI = null!;

    @property(InfoPanelUI)
    public infoPanelUI: InfoPanelUI = null!;

    @property(TowerUI)
    public towerUI: TowerUI = null!;

    @property(InfoUI)
    public infoUI: InfoUI = null!;

    @property(CurrencyUI)
    public currencyUI: CurrencyUI = null!;

    gameState: GameState = GameState.Gameplay;

    public buildings: Array<Object> = null!;
    public heroes: Array<Object> = null!;

    public heroesSpriteDict: Object = null!;
    public heroesUIDict: Object = null!;

    public currency: number;

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
                    this.currency = data.json.state.currency;
                }
            }
        });

        resources.loadDir('heroes/ui', SpriteFrame, (err, sprites) => {
            this.heroesUIDict = Object.fromEntries(sprites.map(sprite => [sprite.name, sprite]));
        });

        resources.loadDir('heroes/sprite', SpriteFrame, (err, sprites) => {
            this.heroesSpriteDict = Object.fromEntries(sprites.map(sprite => [sprite.name, sprite]));
        });

        this.infoUI.updateHeroCount(0);
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
        let valid = (this.gameState === GameState.Gameplay) || (this.gameState === GameState.InfoPanel);
        if (valid) {
            if (this.gameState === GameState.Gameplay) {
                this.gameState = GameState.InfoPanel;

                if (!this.infoPanelUI.initialized) {
                    this.infoPanelUI.init(this);
                }
                this.infoPanelUI.node.active = true;
            }
            else if (this.gameState === GameState.InfoPanel) {
                this.gameState = GameState.Gameplay;
                this.infoPanelUI.node.active = false;
            }
        }
    }

    hireHero(hero: Object) {
        // TODO tween currency
        this.currency -= hero.cost;

        let spriteData = this.getHeroSprites(hero);
        this.hirePanelUI.hiredCharacterSlots[0].setSprite(spriteData);
    }

    getHeroSprites(hero: Object): CharacterSpriteData {
        let rankId = `${hero.rank}_highlight`;
        let rank = this.heroesUIDict[rankId];
        let typeId = `att_${hero.type}`;
        let type = this.heroesUIDict[typeId];
        let character = this.heroesSpriteDict[hero.id];

        return { hero, rank, type, character };
    }
}
