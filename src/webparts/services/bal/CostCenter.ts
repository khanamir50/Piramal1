import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { ICostCenter } from "../interface/ICostCenter";


export interface  ICostCenterOps {
    getCostCenter( props: IPurchaseRequisitionsProps): Promise< ICostCenter>;
}

export default function CostCenterOps() {
    const spCrudOps = SPCRUDOPS();

    const getCostCenter = async (props: IPurchaseRequisitionsProps): Promise< ICostCenter[]> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("CostCenterMaster"
                , "Id,Title,CostCenter,CostCenterName,CONCATENATE,BusinessAreaName/BusinessAreaName,BusinessAreaName/Id,ProfitCenterName/ProfitCenterName,ProfitCenterName/Id,CompanyCode/CompanyCode,CompanyCode/Id"
                , "BusinessAreaName,ProfitCenterName,CompanyCode"
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                    let brr: Array< ICostCenter> = new Array< ICostCenter>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            CostCenter: item.CostCenter,
                            CostCenterName: item.CostCenterName,
                            CONCATENATE:item.CONCATENATE,
                            BusinessAreaNameId:item.BusinessAreaNameId,
                            ProfitCenterNameId:item.ProfitCenterNameId,
                            CompanyCodeId:item.CompanyCodeId

                        });
                    });
                    return brr;
                });
        //});
    };

    return {
        getCostCenter
       
    };
}