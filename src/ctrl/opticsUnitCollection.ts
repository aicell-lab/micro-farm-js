import { OpticsUnit } from "../entity/opticsUnit";
import { SelectBox } from "../entity/selectBox";

export class OpticsUnitCollection {
    private opticsUnits: OpticsUnit[];
    constructor(opticUnits: OpticsUnit[]) {
        this.opticsUnits = opticUnits;
    }
    public getOpticsUnits(): OpticsUnit[] {
        return this.opticsUnits;
    }
    public getOpticsUnitBySelectBox(selectBox: SelectBox): OpticsUnit | undefined {
        return this.opticsUnits.find(unit => unit.selectBox === selectBox);
    }
}
