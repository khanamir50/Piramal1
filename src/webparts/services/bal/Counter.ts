import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../dal/spcrudops';
import { ICounter } from "../interface/ICounter";


export interface IPlantOps {
    getCounterMaster( props: IPurchaseRequisitionsProps): Promise<ICounter>;
}

export default function CounterOps() {
    const spCrudOps = SPCRUDOPS();

    const getCounterMaster = async (props: IPurchaseRequisitionsProps): Promise< ICounter> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("CounterMaster"
                , "Id,Title"
                , ""
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                //, props).then(results  => {
                    let brr: Array< ICounter> = new Array< ICounter>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                        });
                    });
                    return brr[0];
                });
        //});
    };

    return {
        getCounterMaster
       
    };
}