import { _decorator, Component, Node, Vec3, UITransform, tween, Label, Prefab, instantiate, Input, Button, ScrollView } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "../GameManager"
import { InfoCharacterUI } from "./InfoCharacterUI"

@ccclass('InfoPanelUI')
export class InfoPanelUI extends Component {
    gameManager: GameManager = null!;

    tweenDuration: number;

    @property(Button)
    buttonClose: Button = null!;

    @property(Prefab)
    infoCharacterPrefab: Prefab = null!;

    @property(Node)
    infoCharacterArea: Node = null!;

    @property(ScrollView)
    infoScrollView: ScrollView = null!;

    public infoCharacters: InfoCharacterUI[] = [];

    init(gameManager: GameManager,) {
        this.gameManager = gameManager;

        this.buttonClose.node.on(Button.EventType.CLICK, this.onClosePressed, this);
    }

    addSpawnedHeroes(gameManager: GameManager, heroId: string) {
        const node = instantiate(this.infoCharacterPrefab);
        this.infoCharacterArea.addChild(node);

        let infoCharacterUI = node.getComponent(InfoCharacterUI);
        infoCharacterUI.init(gameManager, heroId);

        this.infoCharacters.push(infoCharacterUI);

        this.infoScrollView.content.getComponent(UITransform).height = (infoCharacterUI.node.getComponent(UITransform).height * (this.infoCharacters.length + 1));
    }

    show() {
        let currentPanelY = this.backgroundNode.position.y;
        let targetTmp = this.initialPanelY - currentPanelY;
        let targetY = currentPanelY + (this.panelTransform.height - targetTmp);

        tween(this.backgroundNode.position)
            .to(this.tweenDuration, new Vec3(0, targetY, 0), {
                onUpdate: (target: Vec3, _: number) => {
                    this.backgroundNode.position = target;
                }
            }).start();
    }

    hide() {
        let currentPanelY = this.backgroundNode.position.y;
        let targetTmp = this.visiblePanelY - currentPanelY;
        let targetY = currentPanelY - (this.panelTransform.height - targetTmp);


        tween(this.backgroundNode.position)
            .to(this.tweenDuration, new Vec3(0, targetY, 0), {
                onUpdate: (target: Vec3, _: number) => {
                    this.backgroundNode.position = target;
                }
            }).start();
    }

    onClosePressed(button: Button) {
        this.gameManager.toggleInfoPanel();
    }
}
