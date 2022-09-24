import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IProfitCenter } from "../interface/IProfitCenter";


export interface  IProfitCenterOps {
    getProfitCenterMaster(props: IPurchaseRequisitionsProps): Promise< IProfitCenter[]>;
}

export default function ProfitCenterOps() {
    const spCrudOps = SPCRUDOPS();

    const getProfitCenterMaster = async (props: IPurchaseRequisitionsProps): Promise< IProfitCenter[]> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("ProfitCenterMaster"
                , "Id,Title,ProfitCenterName,BusinessAreaName/BusinessAreaName,BusinessAreaName/Id,CompanyCode/CompanyCode,CompanyCode/Id"
                , "BusinessAreaName,CompanyCode"
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                //, props).then(results  => {
                    let brr: Array< IProfitCenter> = new Array< IProfitCenter>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            ProfitCenterName:item.ProfitCenterName,
                            BusinessAreaNameId: item.BusinessAreaName.Id,
                            BusinessAreaName:item.BusinessAreaName.BusinessAreaName,
                            CompanyCode: item.CompanyCode.CompanyCode,
                            CompanyCodeId: item.CompanyCode.Id
                            
                        });
                    });
                    return brr;
                });
        //});
    };

    return {
        getProfitCenterMaster
       
    };
}