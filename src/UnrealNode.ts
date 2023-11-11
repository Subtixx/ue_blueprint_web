import { Vector2 } from "./utils/Vector2";
import { Size } from "./utils/Size";
import { HtmlTemplate } from "./Types";
import { searchPropWithName } from "./Helpers";

export class UnrealNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public objectDefinition: any[];
    protected _position: Vector2;
    protected _size: Size;
    public guid: string;
    public comment: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public pins: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public props: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public userDefinedPins: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public nodes: any;
    public deltaPosition: Vector2;
    public isBelow413Version: boolean;
    public containsVisualNodes: boolean;

    public text: string;

    constructor() {
        this.objectDefinition = [];
        this._position = new Vector2(0, 0);
        this._size = new Size(0, 0);
        this.guid = "";
        this.comment = "";
        this.pins = [];
        this.props = [];
        this.userDefinedPins = [];
        this.nodes = [];
        this.deltaPosition = new Vector2(0, 0);
        this.isBelow413Version = false;
        this.containsVisualNodes = false;
        this.text = "";
    }

    findHeaderSubname(): string {
        return "";
    }

    generateHTMLBody(): HtmlTemplate | HtmlTemplate[] {
        const result: HtmlTemplate[] = [
            {
                tag: "div",
                classes: ["body"],
                childs: [
                    {
                        tag: "div",
                        classes: ["left-col"],
                        childs: this.generateHTMLPinsInput()
                    },
                    {
                        tag: "div",
                        classes: ["right-col"],
                        childs: this.generateHTMLPinsOutput()
                    }
                ]
            }
        ];

        if (this.hasAdvancedPinDisplay()) {
            if (this.isAdvancedPinDisplayExpanded()) {
                result.push({
                    tag: "div",
                    classes: ["less"],
                    childs: [
                        {
                            tag: "span"
                        }
                    ]
                });
            } else {
                result.push({
                    tag: "div",
                    classes: ["more"],
                    childs: [
                        {
                            tag: "span"
                        }
                    ]
                });
            }
        }
        return result;
    }

    generateHTMLPinDelegate(): HtmlTemplate[] {
        const result: HtmlTemplate[] = [];
        for (let i = 0; i < this.pins.length; i++) {
            if (this.pins[i].isDelegateOutput()) {
                const generatedHtml: HtmlTemplate | null = this.pins[i].generateHTML(true, this);
                if (generatedHtml !== null) {
                    result.push(generatedHtml);
                }
            }
        }
        return result;
    }

    generateHTMLPinsInput(): HtmlTemplate[] {
        const isExpanded = this.isAdvancedPinDisplayExpanded();
        const result: HtmlTemplate[] = [];
        for (let i = 0; i < this.pins.length; i++) {
            if (this.pins[i].isInput()) {
                const generatedHtml: HtmlTemplate | null = this.pins[i].generateHTML(isExpanded, this);
                if (generatedHtml !== null) {
                    result.push(generatedHtml);
                }
            }
        }
        return result;
    }

    generateHTMLPinsOutput(): HtmlTemplate[] {
        const isExpanded = this.isAdvancedPinDisplayExpanded();
        const result: HtmlTemplate[] = [];
        for (let i = 0; i < this.pins.length; i++) {
            if (this.pins[i].isOutput() && !this.pins[i].isDelegateOutput()) {
                const generatedHtml: HtmlTemplate | null = this.pins[i].generateHTML(isExpanded, this);
                if (generatedHtml !== null) {
                    result.push(generatedHtml);
                }
            }
        }
        return result;
    }

    hasAdvancedPinDisplay(): boolean {
        return searchPropWithName(this.props, "AdvancedPinDisplay") !== null;
    }

    isAdvancedPinDisplayExpanded(): boolean {
        const advancedPinDisplayProperty = searchPropWithName(this.props, "AdvancedPinDisplay");
        return advancedPinDisplayProperty && advancedPinDisplayProperty.value === "Shown";
    }

    isValid(): boolean {
        return !(this.pins.length == 0 && this.nodes.length == 0 && this.props.length == 0 && this.text == "");
    }
}
