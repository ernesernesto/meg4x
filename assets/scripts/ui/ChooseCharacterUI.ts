import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import { HirePanelUI } from "./HirePanelUI"

@ccclass('ChooseCharacterUI')
export class ChooseCharacterUI extends Component {
    @property(Sprite)
    rank: Sprite = null!;

    @property(Sprite)
    type: Sprite = null!;

    @property(Sprite)
    character: Sprite = null!;

    hirePanelUI: HirePanelUI = null!;

    init(hirePanelUI: HirePanelUI, data: CharacterSpriteData) {
        this.hirePanelUI = hirePanelUI;

        this.rank.spriteFrame = data.rank;
        this.type.spriteFrame = data.type;
        this.character.spriteFrame = data.character;

        this.node.on(Node.EventType.MOUSE_DOWN, (event) => {
            hirePanelUI.setSelectedHero(data.hero);
        }, this);
    }
}
