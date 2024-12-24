import { DataModel } from './datamodel.js'; 
import { ViewPort } from './viewport.js'; 

export interface InitProperties {
    numberOfRows?: number;
    rowHeight?: number;
    numberOfColumns?: number;
    columnWidth?: number;
}

export class WhatsThisSheet{

    dataModel: DataModel
    viewPorts : Array<ViewPort>

    constructor(divElement: HTMLElement, properties: InitProperties = {}) {
        this.dataModel = new DataModel();
        this.viewPorts = new Array();
        const viewPort = new ViewPort(this.dataModel, divElement, properties);
        this.viewPorts.push(viewPort);
        this.dataModel.addViewport(viewPort)
        console.log("initialization completed");
    }

}




