interface InitProperties {
    numberOfRows?: number;
    rowHeight?: number;
    numberOfColumns?: number;
    columnWidth?: number;
}

export class WhatsThisSheet{

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
                let cellElement = this.buildCell(columnWidth);
                rowElement.appendChild(cellElement);
            }
            tableElement.appendChild(rowElement);
        }
        divElement.appendChild(tableElement);
        console.log("initialization completed");
    }

    private buildCell(columnWidth: number) : Element{
        let cellElement = document.createElement("td");
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
            "click",
            (ev)=>{
                showCellElement.style.display = "None";
                editCellElement.style.display = "block";
                editCellElement.focus();
            }
        );
        editCellElement.addEventListener(
            "blur",
            (ev)=>{
                showCellElement.style.display = "block";
                editCellElement.style.display = "none";
            }
        );
        cellElement.appendChild(showCellElement);
        cellElement.appendChild(editCellElement);
        return cellElement;

    }
}