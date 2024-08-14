import { _decorator, Component, Node, Vec3, UITransform, tween, Label, Prefab, instantiate, Input, Button, Color, ScrollView } from 'cc';
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

    @property(Prefab)
    hiredCharacterPrefab: Prefab = null!;

    @property(Prefab)
    chooseCharacterPrefab: Prefab = null!;

    @property(Node)
    backgroundNode: Node = null!;

    @property(ScrollView)
    hireScrollView: ScrollView = null!;

    @property(Button)
    buttonHire: Button = null!;

    @property(Label)
    labelHire: Label = null!;

    @property(Label)
    labelPrice: Label = null!;

    public initialized: boolean;

    gameManager: GameManager = null!;

    public hiredCharacterSlots: HiredCharacterUI[] = [];
    chooseCharacterUIs: ChooseCharacterUI[] = [];

    selectedHeroIndex: number = -1;

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

            this.hiredCharacterSlots.push(hiredCharacterUI);
        }

        let node: Node;
        for (let i = 0; i < heroes.length; ++i) {
            node = instantiate(this.chooseCharacterPrefab);
            this.hireScrollView.content.addChild(node);

            let chooseCharacterUI = node.getComponent(ChooseCharacterUI);
            chooseCharacterUI.init(this, this.gameManager, i);

            this.chooseCharacterUIs.push(chooseCharacterUI);
        }

        this.hireScrollView.content.getComponent(UITransform).width = (node.getComponent(UITransform).width * heroes.length);
        this.hireScrollView.scrollToLeft();

        this.panelTransform = this.backgroundNode.getComponent(UITransform);
        this.initialPanelY = this.backgroundNode.position.y;
        this.visiblePanelY = this.initialPanelY + this.panelTransform.height;

        this.tweenDuration = 0.25;

        this.backgroundNode.on(Input.EventType.MOUSE_UP, this.onClickBackground, this);
        this.buttonHire.node.on(Input.EventType.MOUSE_UP, this.onHirePressed, this);

        this.enableButton(false);

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
            this.gameManager.hireHero(this.selectedHeroIndex);
        }
    }

    enableButton(enable: boolean) {
        this.buttonHire.interactable = enable;

        let colorHex = enable ? '#ffffffff' : '#ffffff80'
        let color: Color = new Color().fromHEX(colorHex);
        this.labelHire.color = color;
        this.labelPrice.color = color;
    }

    setSelectedHero(index: number) {
        if (this.selectedHeroIndex !== -1) {
            this.chooseCharacterUIs[this.selectedHeroIndex].setSelected(false);
        }

        this.selectedHeroIndex = index;
        this.chooseCharacterUIs[this.selectedHeroIndex].setSelected(true);

        let hero = this.gameManager.heroes[this.selectedHeroIndex];
        let valid = this.canBuy(hero) && (this.gameManager.summoningCharacters.length < this.chooseCharacterUIs.length);
        if (valid) {
            this.enableButton(true);
            this.labelPrice.string = hero.cost;
            this.labelPrice.color = Color.GREEN;
        }
        else {
            this.enableButton(false);
            this.labelPrice.string = hero.cost;
            this.labelPrice.color = Color.RED;
        }
    }

    canBuy(hero: object): boolean {
        return this.gameManager.currency >= hero.cost
    }
}
