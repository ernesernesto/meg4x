import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChooseCharacterUI')
export class ChooseCharacterUI extends Component {
    @property(Sprite)
    rank: Sprite = null!;

    @property(Sprite)
    type: Sprite = null!;

    @property(Sprite)
    character: Sprite = null!;

    init(heroesSpriteDict: Object, heroesUIDict: Object, hero: Object) {
        let rankId = `${hero.rank}_highlight`;
        let rankSprite = heroesUIDict[rankId];
        let typeId = `att_${hero.type}`;
        let typeSprite = heroesUIDict[typeId];
        let characterSprite = heroesSpriteDict[hero.id];

        this.rank.spriteFrame = rankSprite;
        this.type.spriteFrame = typeSprite;
        this.character.spriteFrame = characterSprite;
    }
}
