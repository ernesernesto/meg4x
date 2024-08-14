import { _decorator, Component, Node, Input, EventMouse, Label } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "../GameManager"

@ccclass('InfoUI')
export class InfoUI extends Component {
    gameManager: GameManager = null!;

    @property(Node)
    notifNode: Node = null!;

    @property(Label)
    heroCountLabel: Label = null!;


    init(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.gameManager.toggleInfoPanel();
        }
    }

    updateHeroCount(count: number) {
        if (count > 0) {
            this.notifNode.active = true;
            this.heroCountLabel.string = count.toString();
        }
        else {
            this.notifNode.active = false;
        }
    }
}
