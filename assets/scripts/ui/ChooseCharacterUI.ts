import { _decorator, Component, Node, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

import { HirePanelUI } from "./HirePanelUI"

@ccclass('ChooseCharacterUI')
export class ChooseCharacterUI extends Component {
    @property(Sprite)
    border: Sprite = null!;

    @property(Sprite)
    rank: Sprite = null!;

    @property(Sprite)
    type: Sprite = null!;

    @property(Sprite)
    character: Sprite = null!;

    hirePanelUI: HirePanelUI = null!;
    index: number;

    init(hirePanelUI: HirePanelUI, data: CharacterSpriteData, index: number) {
        this.hirePanelUI = hirePanelUI;
        this.index = index;

        this.rank.spriteFrame = data.rank;
        this.type.spriteFrame = data.type;
        this.character.spriteFrame = data.character;

        this.setSelected(false);

        this.node.on(Node.EventType.MOUSE_DOWN, (_) => {
            this.hirePanelUI.setSelectedHero(index);
        }, this);
    }

    setSelected(selected: boolean) {
        this.border.color = selected ? Color.RED : Color.WHITE;
    }
}
