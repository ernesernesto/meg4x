import { _decorator, Component, Node, Label, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelFloating')
export class LabelFloating extends Component {
    @property(Label)
    label: Label = null!;

    init(startPos: Vec3, targetPos: Vec3, duration: number, text: string) {
        this.node.position = startPos;
        this.label.string = text;

        tween(this.node)
            .to(duration, { position: targetPos })
            .destroySelf()
            .start();
    }
}
