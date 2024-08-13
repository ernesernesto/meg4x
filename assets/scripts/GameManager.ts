import { _decorator, Component, Node, warn, UITransform, Widget, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { CurrencyUI } from "./ui/CurrencyUI";
import { TowerUI } from "./ui/TowerUI";
import { InfoUI } from "./ui/InfoUI";

enum GameState {
    Gameplay,
    HirePanel,
    InfoPanel,
};

@ccclass('GameManager')
export class GameManager extends Component {
    @property(CurrencyUI)
    public currencyUI: CurrencyUI = null!;

    @property(TowerUI)
    public towerUI: TowerUI = null!;

    @property(InfoUI)
    public infoUI: InfoUI = null!;

    @property(Node)
    public panelNode: Node = null!;
    initialPanelY: Vec3;
    visiblePanelY: Vec3;

    gameState: GameState = GameState.Gameplay;

    onLoad() {
        this.towerUI.init(this);
        this.infoUI.init(this);

        let panelTransform = this.panelNode.getComponent(UITransform);
        this.initialPanelY = this.panelNode.position.y;
        this.visiblePanelY = this.initialPanelY + panelTransform.height;
    }

    openHirePanel() {
        let currentPanelY = this.panelNode.position.y;
        let panelTransform = this.panelNode.getComponent(UITransform);
        let targetY = this.panelNode.position.y;
        let valid = (this.gameState === GameState.Gameplay) || (this.gameState === GameState.HirePanel);
        if (this.gameState === GameState.Gameplay) {
            let targetTmp = this.initialPanelY - currentPanelY;
            targetY += (panelTransform.height - targetTmp);

            this.gameState = GameState.HirePanel;
        }
        else if (this.gameState === GameState.HirePanel) {
            let targetTmp = this.visiblePanelY - currentPanelY;
            targetY -= (panelTransform.height - targetTmp);

            this.gameState = GameState.Gameplay;
        }

        if (valid) {
            let tweenDuration: number = 0.25;                                    // Duration of tween
            tween(this.panelNode.position)
                .to(tweenDuration, new Vec3(0, targetY, 0), {
                    onUpdate: (target: Vec3, _: number) => {
                        this.panelNode.position = target;
                    }
                }).start();
        }
    }

    openInfoPanel() {
        console.log("Trying to open info panel");

        if (this.gameState === GameState.Gameplay) {
        }
    }
}
