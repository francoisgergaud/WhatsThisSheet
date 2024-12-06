interface InitProperties {
    numberOfRows?: number;
    rowHeight?: number;
    numberOfColumns?: number;
    columnWidth?: number;
}

export class WhatsThisSheet{

    dataModel: DataModel

    constructor(divElement: HTMLElement, properties: InitProperties = {}) {
        const numberOfRows = properties?.numberOfRows ?? 5;
        const rowHeight = properties?.rowHeight ?? 20;
        const numberOfColumns = properties?.numberOfColumns ?? 5;
        const columnWidth = properties.columnWidth ?? 40;
        let tableElement: HTMLTableElement = document.createElement("table");
        tableElement.style.borderCollapse = "collapse";
        tableElement.style.borderSpacing = "0"; 
        for(let i=0; i<numberOfRows; i++){
            let rowElement = document.createElement("tr");
            rowElement.style.height = rowHeight.toString();
            for(let j=0; j<numberOfColumns; j++){
                let cellElement = this.buildCell(columnWidth, i, j);
                rowElement.appendChild(cellElement);
            }
            tableElement.appendChild(rowElement);
        }
        divElement.appendChild(tableElement);
        this.dataModel = new DataModel();
        console.log("initialization completed");
    }

    private buildCell(columnWidth: number, rowIndex: number, columnIndex: number) : Element{
        let cellElement = document.createElement("td");
        cellElement.setAttribute("rowIndex", rowIndex.toString() );
        cellElement.setAttribute("columnIndex", columnIndex.toString());
        cellElement.style.width = columnWidth.toString();
        cellElement.style.border = "1px solid";
        let showCellElement = document.createElement("span");
        showCellElement.style.width = "100%";
        showCellElement.style.height = "100%";
        let editCellElement = document.createElement("input");
        editCellElement.style.width = "100%";
        editCellElement.style.height = "100%";
        
        showCellElement.style.display = "block";
        editCellElement.style.padding = "0px";
        editCellElement.style.border = "0px";
        editCellElement.style.display = "none";
        showCellElement.addEventListener(
            "dblclick",
            (ev)=>{
                showCellElement.style.display = "None";
                editCellElement.style.display = "block";
                editCellElement.focus();
            }
        );
        editCellElement.addEventListener(
            "blur",
            (ev)=>{
                let rowIndex = parseInt(cellElement.getAttribute("rowIndex")!, 10)
                let columnIndex = parseInt(cellElement.getAttribute("columnIndex")!, 10)
                this.dataModel.setCell(columnIndex, rowIndex, editCellElement.value)
                showCellElement.style.display = "block";
                editCellElement.style.display = "none";
            }
        );
        cellElement.appendChild(showCellElement);
        cellElement.appendChild(editCellElement);
        return cellElement;

    }
}

class Cell {
    value: string;

    constructor(value: string){
        this.value = value;
    }

    public setValue(value: string){
        this.value = value;
    }

    public getValue(): string{
        return this.value;
    }
}

class DataModel {

    data_by_column: Map<number, Map<number, Cell>>;
    data_by_row: Map<number, Map<number, Cell>>;

    constructor(){
        this.data_by_column = new Map();
        this.data_by_row = new Map();
    }


    public getCell(columnIndex: number, rowIndex: number): Cell | undefined {
        return this.data_by_column.get(columnIndex)?.get(rowIndex)
    }
    
    public setCell(columnIndex: number, rowIndex: number, value: string){
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
            let cell = new Cell(value);
            if(this.data_by_column.get(columnIndex) == undefined) {
                this.data_by_column.set(columnIndex, new Map())
            }
            this.data_by_column.get(columnIndex)?.set(rowIndex, cell);
            if(this.data_by_row.get(rowIndex) == undefined) {
                this.data_by_row.set(rowIndex, new Map());
            }
            this.data_by_row.get(rowIndex)?.set(columnIndex, cell);
        }
    }
}