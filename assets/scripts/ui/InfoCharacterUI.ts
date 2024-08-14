import { _decorator, Component, Node, Sprite, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InfoCharacterUI')
export class InfoCharacterUI extends Component {
    @property(Sprite)
    rank: Sprite = null!;

    @property(Sprite)
    type: Sprite = null!;

    @property(Sprite)
    character: Sprite = null!;

    @property(Label)
    labelName: Label = null!;

    @property(Label)
    labelDescription: Label = null!;

    @property(Label)
    labelRank: Label = null!;

    @property(Label)
    labelCost: Label = null!;

    @property(Label)
    labelType: Label = null!;

    @property(Label)
    labelSummonCooldown: Label = null!;

    init(gameManager: GameManager, heroId: string) {
        let hero = gameManager.heroesDict[heroId];
        let data = gameManager.getHeroSprites(heroId);

        this.rank.spriteFrame = data.rank;
        this.type.spriteFrame = data.type;
        this.character.spriteFrame = data.character;

        this.labelName.string = hero.name;
        this.labelDescription.string = hero.description;
        this.labelRank.string = `Type: ${hero.rank}`;
        this.labelCost.string = `Cost: ${hero.cost}`;
        this.labelType.string = `Type: ${hero.type}`;
        this.labelSummonCooldown.string = `Summon Time: ${hero.summonCooldown}s`;
    }
}

