import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CurrencyUI')
export class CurrencyUI extends Component {
    @property(Label)
    public labelCurrency: Label = null!;

}
