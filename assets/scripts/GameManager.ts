import { _decorator, Component, Node, warn, JsonAsset, resources, SpriteFrame, instantiate, Vec3, Prefab, Canvas } from 'cc';
const { ccclass, property } = _decorator;

import { CurrencyUI } from "./ui/CurrencyUI";
import { TowerUI } from "./ui/TowerUI";
import { InfoUI } from "./ui/InfoUI";
import { HirePanelUI } from "./ui/HirePanelUI";
import { InfoPanelUI } from "./ui/InfoPanelUI";
import { LabelFloating } from "./ui/LabelFloating";

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

export interface CharacterSummoningData {
    heroId: string,
    summonCooldown: number,
    summonDt: number,
};

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Canvas)
    public canvas: Canvas = null!;

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

    @property(Prefab)
    floatingTextPrefab: Prefab = null!;

    gameState: GameState = GameState.Gameplay;

    public buildings: Array<Object> = null!;
    public heroes: Array<Object> = null!;

    public heroesDict: Object = null!;
    public heroesSpriteDict: Object = null!;
    public heroesUIDict: Object = null!;

    public currency: number = 0;

    public summoningCharacters: CharacterSummoningData[] = [];

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
                    this.heroesDict = Object.fromEntries(data.json.heroes.map(hero => [hero.id, hero]));
                    this.infoUI.updateHeroCount(0);
                }
                else if (data.name === "initial_state") {
                    this.currency = data.json.state.currency;
                    this.updateCurrency(0);
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

    update(dt: number) {
        let dirty = false;
        for (let index = 0; index < this.summoningCharacters.length; ++index) {
            let summoningData = this.summoningCharacters[index];
            summoningData.summonDt += dt;

            if (this.gameState === GameState.HirePanel) {
                this.hirePanelUI.hiredCharacterSlots[index].updateProgressBar(summoningData);
            }

            if (summoningData.summonDt >= summoningData.summonCooldown) {
                this.summoningCharacters.splice(index, 1);
                this.infoPanelUI.addSpawnedHeroes(this, summoningData.heroId);
                dirty = true;
            }
        }

        if (dirty) {
            this.hirePanelUI.refresh(this.summoningCharacters);

            let count = this.infoPanelUI.infoCharacters.length;
            this.infoUI.updateHeroCount(count);

            if (this.summoningCharacters.length === 0) {
                this.towerUI.showSummonIndicator(false);
            }
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

                this.towerUI.showSummonIndicator(false);
            }
            else if (this.gameState === GameState.HirePanel) {
                this.gameState = GameState.Gameplay;
                this.hirePanelUI.hide();

                if (this.summoningCharacters.length != 0) {
                    this.towerUI.showSummonIndicator(true);
                }
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

    hireHero(index: number) {
        let hero = this.heroes[index];
        let node = instantiate(this.floatingTextPrefab);
        let labelFloating = node.getComponent(LabelFloating);
        this.canvas.node.addChild(node);

        let position = this.currencyUI.node.position;
        let startPos = new Vec3(position.x - 50.0, position.y - 100.0, position.z);
        let endPos = new Vec3(position.x - 50.0, position.y - 25.0, position.z);
        labelFloating.init(startPos, endPos, 0.5, -hero.cost);

        this.updateCurrency(hero.cost)

        let summoningIndex = this.summoningCharacters.length;

        let spriteData = this.getHeroSprites(hero.id);
        this.hirePanelUI.hiredCharacterSlots[summoningIndex].setSprite(spriteData);

        let summoningData = this.getSummoningData(hero.id);
        this.summoningCharacters.push(summoningData);
    }

    getHeroSprites(heroId: string): CharacterSpriteData {
        let hero = this.heroesDict[heroId];
        let rankId = `${hero.rank}_highlight`;
        let rank = this.heroesUIDict[rankId];
        let typeId = `att_${hero.type}`;
        let type = this.heroesUIDict[typeId];
        let character = this.heroesSpriteDict[heroId];

        return { hero, rank, type, character };
    }

    getSummoningData(heroId: string): CharacterSummoningData {
        let hero = this.heroesDict[heroId];
        let summonCooldown = hero.summonCooldown;
        let summonDt = 0.0;

        return { heroId, summonCooldown, summonDt };
    }

    updateCurrency(cost: number) {
        this.currency -= cost;
        this.currencyUI.updateValue(this.currency);
    }
}
