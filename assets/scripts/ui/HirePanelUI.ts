import { _decorator, Component, Node, Vec3, UITransform, tween, Label, Prefab, instantiate, Input } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from "../GameManager"
import { ChooseCharacterUI } from "./ChooseCharacterUI"
import { HiredCharacterUI } from "./HiredCharacterUI"

@ccclass('HirePanelUI')
export class HirePanelUI extends Component {
    @property(Label)
    labelTitle: Label = null!;

    @property(Label)
    labelDescription: Label = null!;

    @property(Node)
    hiredCharacterArea: Node = null!;

    @property(Node)
    chooseCharacterArea: Node = null!;

    @property(Prefab)
    hiredCharacterPrefab: Prefab = null!;

    @property(Prefab)
    chooseCharacterPrefab: Prefab = null!;

    @property(Node)
    backgroundNode: Node = null!;

    @property(Node)
    buttonNode: Node = null!;

    public initialized: boolean;

    gameManager: GameManager = null!;

    initialPanelY: number;
    visiblePanelY: number;

    panelTransform: UITransform;
    tweenDuration: number;

    init(gameManager: GameManager,) {
        // Note only now handle building 0 since buildings.json only have 1 data
        let buildings = gameManager.buildings;
        let building = buildings[0];

        let heroes = gameManager.heroes;

        this.gameManager = gameManager;

        this.labelTitle.string = building.name;
        this.labelDescription.string = building.description;

        for (let i = 0; i < building.settings.hireSlots; ++i) {
            const node = instantiate(this.hiredCharacterPrefab);
            this.hiredCharacterArea.addChild(node);

            let hiredCharacterUI = node.getComponent(HiredCharacterUI);
            hiredCharacterUI.init();
        }

        for (let i = 0; i < heroes.length; ++i) {
            const node = instantiate(this.chooseCharacterPrefab);
            this.chooseCharacterArea.addChild(node);

            let hero = gameManager.heroes[i];
            let chooseCharacterUI = node.getComponent(ChooseCharacterUI);
            chooseCharacterUI.init(this.gameManager.heroesSpriteDict, this.gameManager.heroesUIDict, hero);
        }

        this.panelTransform = this.backgroundNode.getComponent(UITransform);
        this.initialPanelY = this.backgroundNode.position.y;
        this.visiblePanelY = this.initialPanelY + this.panelTransform.height;

        this.tweenDuration = 0.25;

        this.backgroundNode.on(Input.EventType.MOUSE_UP, this.onClickBackground, this);
        this.buttonNode.on(Input.EventType.MOUSE_UP, this.onHirePressed, this);

        this.initialized = true;
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

    onClickBackground(event: EventMouse) {
        if (event.getButton() === 0) {
            this.gameManager.toggleHirePanel();
        }
    }

    onHirePressed(event: EventMouse) {
        if (event.getButton() === 0) {
            this.gameManager.toggleHirePanel();
            console.log("hire pressed");
        }
    }
}
