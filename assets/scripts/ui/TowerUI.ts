import { _decorator, Component, Node, input, Input, EventMouse, EventTouch, warn, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "../GameManager"

@ccclass('TowerUI')
export class TowerUI extends Component {

    @property(Sprite)
    summonIndicator: Sprite = null!;

    gameManager: GameManager = null!;

    init(gameManager: GameManager) {
        this.gameManager = gameManager;

        this.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    showSummonIndicator(enable: boolean) {
        this.summonIndicator.node.active = enable;
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.gameManager.toggleHirePanel();
        }
    }
}
