/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector2 } from "./utils/Vector2";
import { Size } from "./utils/Size";
import { HtmlTemplate } from "./Types";
import { searchPropWithName } from "./Helpers";
import { logger } from "./utils/Logger";

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

    findHeaderName(): any {
        const objectClass = searchPropWithName(this.objectDefinition, "Class");
        const objectClassIdentifier = objectClass?.value.split(".").pop();
        let memberName: any = null;
        let memberParent: any = null;
        let delegateName: any = null;
        let delegateReference: any = null;
        let timelineName: any = null;
        let proxyFactoryFunctionName: any = null;
        let proxyFactoryClass: any = null;
        let templateType: any = null;
        let templateBlueprint: any = null;
        let componentName: any = null;
        let functionReference: any = null;

        if (objectClassIdentifier !== null) {
            switch (objectClassIdentifier) {
                default:
                    logger.w(
                        "Missing headerName for objectClassIdentifier",
                        "UnrealNode.ts:findHeaderName()",
                        objectClassIdentifier
                    );
                    break;
                case "K2Node_Message":
                    return "Message";
                case "K2Node_AssignDelegate":
                    return "Assign Delegate";
                case "K2Node_LatentGameplayTaskCall":
                    return "Latent Task";
                case "K2Node_CallArrayFunction":
                    return "Array Function";
                case "K2Node_AIMoveTo":
                    return "Move To";
                case "K2Node_BreakStruct":
                    return "Break Struct";
                case "K2Node_MakeArray":
                    return "Make Array";
                case "K2Node_GetDataTableRow":
                    return "Get Data Table Row";
                case "K2Node_CallMaterialParameterCollectionFunction":
                    return "Set Parameter Value";
                case "K2Node_CommutativeAssociativeBinaryOperator":
                    return "Associative Binary Operator";
                case "K2Node_PlayMontage":
                    return "Play Montage";
                case "K2Node_ExecutionSequence":
                    return "Sequence";
                case "K2Node_Timeline":
                    timelineName = searchPropWithName(this.props, "TimelineName");
                    if (timelineName === null) {
                        logger.e("Missing timelineName", "UnrealNode.ts:findHeaderName()", this.props);
                        return "Timeline";
                    }
                    return timelineName.value;
                case "K2Node_Select":
                    return "Select";
                case "K2Node_GetClassDefaults":
                    return "Get Class Defaults";
                case "K2Node_LatentOnlineCall":
                    proxyFactoryFunctionName = searchPropWithName(this.props, "ProxyFactoryFunctionName");
                    if (proxyFactoryFunctionName === null) {
                        logger.e("Missing proxyFactoryFunctionName", "UnrealNode.ts:findHeaderName()", this.props);
                        return "Async Task: Missing Function";
                    }
                    proxyFactoryClass = searchPropWithName(this.props, "ProxyFactoryClass");
                    if (proxyFactoryClass === null) {
                        logger.e("Missing proxyFactoryClass", "UnrealNode.ts:findHeaderName()", this.props);
                        return "Async Task: Missing Class";
                    }
                    return `Async Task: ${this.transformInternalName(proxyFactoryFunctionName.value)}`;
                case "K2Node_AddComponent":
                    templateType = searchPropWithName(this.props, "TemplateType");
                    templateBlueprint = searchPropWithName(this.props, "TemplateBlueprint");
                    componentName = "";
                    if (templateType !== null) {
                        componentName = templateType.value;
                        const lastIndexOfDot = componentName.lastIndexOf(".");
                        if (lastIndexOfDot !== -1) {
                            componentName = componentName.substring(lastIndexOfDot + 1).replace("'", "");
                        }
                    } else if (templateBlueprint !== null) {
                        componentName = templateBlueprint.value;
                        const lastIndexOfDot = componentName.lastIndexOf(".");
                        if (lastIndexOfDot !== -1) {
                            componentName = componentName.substring(lastIndexOfDot + 1).replace("\"", "");
                        }
                    }
                    return `Add Component ${this.transformInternalName(componentName.replace("Component", "").replace(
                        "\"",
                        ""
                    ))}`;
                case "K2Node_CallFunction":
                    functionReference = searchPropWithName(this.props, "FunctionReference");
                    if (functionReference === null) {
                        logger.e("Missing functionReference", "UnrealNode.ts:findHeaderName()", this.props);
                        return "Function Call: Missing Function";
                    }
                    memberParent = searchPropWithName(functionReference.value, "MemberParent");
                    memberName = searchPropWithName(functionReference.value, "MemberName");
                    if (memberParent !== null && memberName !== null) {
                        if (memberParent.value.indexOf("KismetMathLibrary") !== -1) {
                            if (memberName.value.indexOf("Make") !== -1) {
                                return "Make Struct";
                            }
                            if (memberName.value.indexOf("Break") !== -1) {
                                return "Break Struct";
                            }
                        }
                    }
                    return this.transformInternalName(memberName.value);
                case "K2Node_CallDelegate":
                    delegateReference = searchPropWithName(this.props, "DelegateReference");
                    if (delegateReference === null) {
                        logger.e("Missing delegateReference", "UnrealNode.ts:findHeaderName()", this.props);
                        return "Delegate Call: Missing Delegate";
                    }
                    memberName = searchPropWithName(delegateReference.value, "MemberName");
                    if (memberName === null) {
                        logger.e("Missing memberName", "UnrealNode.ts:findHeaderName()", delegateReference.value);
                        return "Delegate Call: Missing Member";
                    }
                    memberParent = searchPropWithName(delegateReference.value, "MemberParent");
                    if (memberParent === null) {
                        logger.e("Missing memberParent", "UnrealNode.ts:findHeaderName()", delegateReference.value);
                        return "Delegate Call: Missing Parent";
                    }
                    if (memberParent.value.indexOf("KismetSystemLibrary") !== -1) {
                        return "Message";
                    }
                    return `Call ${this.transformInternalName(memberName.value)}`;
                case "K2Node_MacroInstance":
                    return this.getMacroInstanceHeaderName();
                case "K2Node_Tunnel": {
                    const canHaveOutputs = searchPropWithName(this.props, "bCanHaveOutputs");
                    if (canHaveOutputs !== null) {
                        return "Inputs";
                    }
                    return "Outputs";
                }
                case "K2Node_FunctionEntry": {
                    return this.getFunctionEntryHeaderName();
                }
                case "K2Node_FunctionResult": {
                    return "Return Node";
                }
                case "K2Node_DynamicCast": {
                    const targetType = searchPropWithName(this.props, "TargetType");
                    if (targetType === null) {
                        logger.e("Missing targetType", "UnrealNode.ts:findHeaderName()", this.props);
                        return "Bad cast node";
                    }
                    const castType = targetType.value.split(".").pop();
                    if (castType === null) {
                        logger.e("Missing castType", "UnrealNode.ts:findHeaderName()", targetType.value);
                        return "Bad cast node";
                    }
                    return `Cast To ${castType.replace("\"", "")}`;
                }
                case "K2Node_SpawnActorFromClass": {
                    for (let i = 0; i < this.pins.length; i++) {
                        const pinName = searchPropWithName(this.pins[i].props, "PinName");
                        const defaultObject = searchPropWithName(this.pins[i].props, "DefaultObject");
                        if (pinName === null || defaultObject === null) {
                            continue;
                        }

                        if (pinName.value !== "Class") {
                            continue;
                        }

                        let spawnActorClass = defaultObject.value;
                        if (spawnActorClass !== null && spawnActorClass.indexOf(".") !== -1) {
                            spawnActorClass = defaultObject.value.split(".").pop();
                        }
                        if (spawnActorClass === null) {
                            logger.e("Missing spawnActorClass", "UnrealNode.ts:findHeaderName()", defaultObject.value);
                            return "Spawn Actor";
                        }
                        spawnActorClass = spawnActorClass.replace("\"", "");

                        return `SpawnActor ${spawnActorClass}`;
                    }
                    return "SpawnActor NONE";
                }
                case "K2Node_SwitchEnum": {
                    const enumeration: any = searchPropWithName(this.props, "Enum");
                    if (enumeration === null) {
                        return "Switch on ENUM";
                    }
                    return "Switch on";
                }
                case "K2Node_SwitchName": {
                    return "Switch on Name";
                }
                case "K2Node_SwitchInteger": {
                    return "Switch on Int";
                }
                case "K2Node_SwitchString": {
                    return "Switch on String";
                }
                case "K2Node_CreateWidget": {
                    for (let i = 0; i < this.pins.length; i++) {
                        const pinName = searchPropWithName(this.pins[i].props, "PinName");
                        const defaultObject = searchPropWithName(this.pins[i].props, "DefaultObject");
                        if (pinName === null || defaultObject === null) {
                            continue;
                        }

                        if (pinName.value !== "Class") {
                            continue;
                        }

                        let createWidgetClass = defaultObject.value;
                        if (createWidgetClass !== null && createWidgetClass.indexOf(".") !== -1) {
                            createWidgetClass = defaultObject.value.split(".").pop();
                        }
                        if (createWidgetClass === null) {
                            logger.e(
                                "Missing createWidgetClass",
                                "UnrealNode.ts:findHeaderName()",
                                defaultObject.value
                            );
                            return "Create Widget";
                        }
                        createWidgetClass = createWidgetClass.replace("\"", "");

                        return `Create ${createWidgetClass}`;
                    }

                    return "Create Widget";
                }
                case "K2Node_DelegateReference":
                    delegateReference = searchPropWithName(this.props, "DelegateReference");
                    delegateName = searchPropWithName(delegateReference.value, "MemberName");
                    return "Call " + delegateName.value;
                case "K2Node_AddDelegate":
                    delegateReference = searchPropWithName(this.props, "DelegateReference");
                    delegateName = searchPropWithName(delegateReference.value, "MemberName");
                    return "Bind Event to " + delegateName.value;
                case "K2Node_RemoveDelegate":
                    delegateReference = searchPropWithName(this.props, "DelegateReference");
                    delegateName = searchPropWithName(delegateReference.value, "MemberName");
                    return "Unbind Event from " + delegateName.value;
                case "K2Node_ClearDelegate":
                    delegateReference = searchPropWithName(this.props, "DelegateReference");
                    delegateName = searchPropWithName(delegateReference.value, "MemberName");
                    return "Unbind all Events from " + delegateName.value;
            }
        }
        logger.warn("Missing headerName", "UnrealNode.ts:findHeaderName()", objectClassIdentifier);
        return "Unknown";
    }
    

    private getMacroInstanceHeaderName(): string {
        const macroGraphReference = searchPropWithName(this.props, "MacroGraphReference");
        if (macroGraphReference === null) {
            logger.e("Missing macroGraphReference", "UnrealNode.ts:findHeaderName()", this.props);
            return "Macro";
        }
        const macroGraph = searchPropWithName(macroGraphReference.value, "MacroGraph");
        if (macroGraph === null) {
            logger.e("Missing macroGraph", "UnrealNode.ts:findHeaderName()", macroGraphReference.value);
            return "Macro";
        }
        let macroName = macroGraph.value;
        if (macroGraph.value === null) {
            return "Macro";
        }

        macroName = macroName.split(".").pop().replace("'", "").replace("\"", "");
        if (macroGraph.value.indexOf("EdGraph'") === 0) {
            macroName = macroGraph.value.substring(8);
            if (macroName.substring(0, 1) === "\"") {
                macroName = macroName.substring(1, macroName.length - 2);
            } else {
                macroName = macroName.substring(0, macroName.length - 1);
            }
            if (macroName.indexOf(".") !== -1) {
                macroName = macroName.split(".").pop().replace("'", "").replace("\"", "");
            }
        }

        switch (macroName) {
            default:
                if (macroGraph.value.indexOf("/Engine/") !== -1 || macroGraph.value.indexOf("/Script/Engine.") !== -1) {
                    logger.e("Missing macroName", "UnrealNode.ts:findHeaderName()", macroName, macroGraph);
                }
                return macroName;
            case "StandardMacros:FlipFlop":
            case "StandardMacros:Gate":
            case "StandardMacros:IsValid":
            case "StandardMacros:ForEachLoop":
            case "StandardMacros:ForEachLoopWithBreak":
            case "StandardMacros:ForLoopWithBreak":
            case "StandardMacros:ForLoop":
            case "StandardMacros:WhileLoop":
            case "StandardMacros:Do N":
            case "StandardMacros:DoOnce":
            case "ActorMacros:Switch Has Authority":
                return macroName.split(":").pop();
        }
    }

    private getFunctionEntryHeaderName(): string {
        // TODO
        return "?!?!?!";
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

    transformInternalName(internalName) {
        if (internalName === null) return null;
        let name = internalName;
        name = name.replace(/_/g, " ");
        name = name.replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, "$1$4 $2$3$5");
        if (name.indexOf("K2") === 0) {
            name = name.replace(/ /g, "").substring(2);
        }
        return name.trim();
    }
}
