import { InitProperties } from './whats-this-sheet.js';
import { DataModel, DataModelCell } from './datamodel.js'; 

/**
 * The viewport is responsible to manage the binding/unbinding the visual-cells with the datamodel's cell.
 * The bining happens in the following scenarios:
 * - the viewport moves. All cells binded must be unbinded and the new cells binded.
 * - a new value is set in a viewport-cell which was empty. The datamodel-cell is ceated and binded to the viewport-cell which created it.
 * - the future possibility to programmatically set a datamodel-cell. The viewport must check if the cell is in its range and bind it to the 
 *   right viewport-cell if it is the case.
 * The unbinding happens in the following scenarios:
 * - the viewport moves. All cells binded must be unbinded and the new cells binded.
 * - a value is erased by empty in the viewport-cell. The datamodel-cell must be deleted and unbinded
 * - the future possibility to programmatically set a datamodel-cell to empty.
 */
export class ViewPort {

    size = {
        width:0,
        height:0,
    }

    dataModel: DataModel
    cells: Array<Array<ViewPortCell>>

    constructor(dataModel: DataModel, divElement: HTMLElement, properties: InitProperties = {}) {
        this.size.height = properties?.numberOfRows ?? 5;
        const rowHeight = properties?.rowHeight ?? 20;
        this.size.width = properties?.numberOfColumns ?? 5;
        const columnWidth = properties.columnWidth ?? 40;
        this.cells = Array(this.size.width).fill(Array(this.size.height).fill(null))
        let tableElement: HTMLTableElement = document.createElement("table");
        tableElement.style.borderCollapse = "collapse";
        tableElement.style.borderSpacing = "0"; 
        for(let i=0; i<this.size.height ; i++){
            let rowElement = document.createElement("tr");
            rowElement.style.height = rowHeight.toString();
            for(let j=0; j<this.size.width; j++){
                let cellElement = new ViewPortCell(this, columnWidth, i, j);
                rowElement.appendChild(cellElement.cellHTMLElement);
                this.cells[j][i] =  cellElement;
            }
            tableElement.appendChild(rowElement);
        }
        divElement.appendChild(tableElement);
        this.dataModel = dataModel;
        console.log("initialization completed");
        
    }

    public updateFromDataModel(columnIndex: number, rowIndex: number, displayValue: string | null) {
        if(this.isInViewPortRange(columnIndex, rowIndex)){
            this.cells[columnIndex][rowIndex].setDisplayValueFromDataModel(displayValue);
        }
    }

    public setCellFromUserInput(viewPortColumnIndex: number, viewPortRowIndex: number, userInput: string) {
        //the method bellow will update the data-model and return the updated/created/deleted-null cell
        // internally, this method will in turn invokes the "updateFromDataModel" from the viewPort object.
        this.dataModel.setCellFromUserInput(viewPortColumnIndex, viewPortRowIndex, userInput);
    }

    private isInViewPortRange(columnIndex: number, rowIndex: number): boolean {
        return true;
    }
}

export class ViewPortCell {

    private viewPort: ViewPort
    private rowIndex: number
    private columnIndex: number
    public readonly cellHTMLElement: Element
    private readonly editCellElement: Element
    private readonly showCellElement: Element

    constructor(viewPort: ViewPort, columnWidth: number, rowIndex: number, columnIndex: number) {
        this.viewPort = viewPort;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        const cellElement = document.createElement("td");
        cellElement.style.width = columnWidth.toString();
        cellElement.style.border = "1px solid";
        const showCellElement = document.createElement("span");
        showCellElement.style.width = "100%";
        showCellElement.style.height = "100%";
        const editCellElement = document.createElement("input");
        editCellElement.style.width = "100%";
        editCellElement.style.height = "100%";
        showCellElement.style.display = "block";
        editCellElement.style.padding = "0px";
        editCellElement.style.border = "0px";
        editCellElement.style.display = "none";
        showCellElement.addEventListener(
            "dblclick",
            (event)=>{
                showCellElement.style.display = "none";
                editCellElement.style.display = "block";
                editCellElement.focus();
            }
        )
        editCellElement.addEventListener(
            "blur",
            (event)=>{
                this.viewPort.setCellFromUserInput(this.columnIndex, this.rowIndex, editCellElement.value)
                showCellElement.style.display = "block";
                editCellElement.style.display = "none";
            }
        );
        cellElement.appendChild(showCellElement);
        cellElement.appendChild(editCellElement);
        this.cellHTMLElement = cellElement;
        this.showCellElement = showCellElement;
        this.editCellElement = editCellElement;
    }

    /**
     * Used by the data-model to update the view-port's cell. 
     * 
     * There is no need to update the data-model (this would be an endless loop)
     * @param value The real value to set (may ne a formula or anything typed by the user)
     * @param displayValue The resulting display (value from the data-model, formula's result, error etc...)
     */
    public setDisplayValueFromDataModel(displayValue: string | null){ 
        //this.editCellElement.setAttribute('value', datamodelCell.value);
        if(displayValue){
            this.showCellElement.innerHTML = displayValue;
        } else {
            this.showCellElement.innerHTML = "";
        }
        
    }
}