import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IDOAMatrix } from "../interface/IDOAMatrix";


export interface IDOAMatrixOps {
    getAllDOAMatrix(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IDOAMatrix>;
    getDOAMatrix(columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IPurchaseRequisitionsProps)
}

export default function DOAMatrixOps() {
    const spCrudOps = SPCRUDOPS();

    const getAllDOAMatrix = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IDOAMatrix[]> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("DOAMatrix"
            , "Id,Title,AmountGreaterThan,AmountLessThan,Approver/Id,Approver/Title,Status,RequestType,Level/Level,Level/Id,Designation/Designation,Designation/Id"
            , "Approver,Level,Designation"
            , "Status eq 'Active'"
            , { column: 'Id', isAscending: false }, props).then(results => {
                    let brr: Array<IDOAMatrix> = new Array<IDOAMatrix>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            AmountGreaterThan: item.AmountGreaterThan,
                            AmountLessThan: item.AmountLessThan,
                            Approver:item.Approver.Title,
                            ApproverId:item.Approver.Id,
                            Status:item.Status,
                            RequestType:item.RequestType,
                            Level:item.Level.Level,
                            LevelId:item.Level.Id,
                            Designation:item.Designation.Designation,
                            DesignationId:item.Designation.Id

                            
                        });
                    });
                    return brr;
                });
        //});
    };

    const getDOAMatrix = async (columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IPurchaseRequisitionsProps): Promise<IDOAMatrix[]> => {
        return await (await spCrudOps).getData("DOAMatrix", columnsToRetrieve, columnsToExpand, filters
            , orderby, props).then(results => {
                let output: Array<IDOAMatrix> = new Array<IDOAMatrix>();
                results.map(item => {
                    output.push({
                            Id: item.Id,
                            Title: item.Title,
                            AmountGreaterThan: item.AmountGreaterThan,
                            AmountLessThan: item.AmountLessThan,
                            Approver:item.Approver.Title,
                            ApproverId:item.Approver.Id,
                            Status:item.Status,
                            RequestType:item.RequestType,
                            Level:item.Level.Level,
                            LevelId:item.Level.Id,
                            Designation:item.Designation.Designation,
                            DesignationId:item.Designation.Id
                    });
                });
                return output;
            });
    };

    return {
        getAllDOAMatrix
        ,getDOAMatrix
       
    };
}