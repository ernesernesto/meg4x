import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HiredCharacterUI')
export class HiredCharacterUI extends Component {

    @property(Sprite)
    rank: Sprite = null!;

    @property(Sprite)
    type: Sprite = null!;

    @property(Sprite)
    character: Sprite = null!;

    @property(Sprite)
    progressBar: Sprite = null!;

    init() {
        this.rank.node.active = false;
        this.type.node.active = false;
        this.character.node.active = false;
        this.progressBar.node.active = false;
        this.progressBar.node.scale.x = 0.0;
    }

    setSprite() {
    }
}
