import { ViewPort } from './viewport.js'; 

export class DataModelCell {
    value: string;
    displayValue: string;

    constructor(value: string){
        this.value = value;
        this.displayValue = value;
    }

    public setValue(value: string){
        this.value = value;
        this.displayValue = value;
    }

    public getValue(): string{
        return this.value;
    }

}

export class DataModel {


    data_by_column: Map<number, Map<number, DataModelCell>>;
    data_by_row: Map<number, Map<number, DataModelCell>>;
    viewports: Array<ViewPort>;

    constructor(){
        this.data_by_column = new Map();
        this.data_by_row = new Map();
        this.viewports = new Array();
    }

    public addViewport(viewPort: ViewPort) {
        this.viewports.push(viewPort);
    }


    public getCell(columnIndex: number, rowIndex: number): DataModelCell | undefined {
        return this.data_by_column.get(columnIndex)?.get(rowIndex)
    }
    
    public setCellFromUserInput(columnIndex: number, rowIndex: number, value: string): DataModelCell | null{
        let cell = null;
        if(value == null || value == "") {
            //remove the cell
            if(this.data_by_column.get(columnIndex)?.get(rowIndex) != undefined) {
                this.data_by_column.get(columnIndex)?.delete(rowIndex);
                if(this.data_by_column.get(columnIndex)?.keys.length == 0) {
                    this.data_by_column.delete(columnIndex);
                }
                this.data_by_row.get(rowIndex)?.delete(columnIndex);
                if(this.data_by_row.get(rowIndex)?.keys.length == 0) {
                    this.data_by_row.delete(rowIndex);
                }
            }
        } else {
            // add a cell
            cell = new DataModelCell(value);
            if(this.data_by_column.get(columnIndex) == undefined) {
                this.data_by_column.set(columnIndex, new Map())
            }
            this.data_by_column.get(columnIndex)?.set(rowIndex, cell);
            if(this.data_by_row.get(rowIndex) == undefined) {
                this.data_by_row.set(rowIndex, new Map());
            }
            this.data_by_row.get(rowIndex)?.set(columnIndex, cell);
        }
        for(let viewport of this.viewports) {
            viewport.updateFromDataModel(columnIndex, rowIndex, cell!.displayValue)
        }
        return cell;
    }
}