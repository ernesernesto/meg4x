import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "../GameManager"

@ccclass('InfoUI')
export class InfoUI extends Component {
    gameManager: GameManager = null!;

    @property(Node)
    notifNode: Node = null!;

    @property(Label)
    heroCountLabel: Label = null!;

    @property(Button)
    buttonSignPost: Button = null!;

    init(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.buttonSignPost.node.on(Button.EventType.CLICK, this.onMouseUp, this);
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

    onMouseUp(button: Button) {
        this.gameManager.toggleInfoPanel();
    }

}
