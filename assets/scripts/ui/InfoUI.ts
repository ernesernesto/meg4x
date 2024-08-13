import { _decorator, Component, Node, input, Input, EventMouse, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "../GameManager"

@ccclass('InfoUI')
export class InfoUI extends Component {
    gameManager: GameManager = null!;

    init(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.gameManager.toggleInfoPanel();
        }
    }
}
