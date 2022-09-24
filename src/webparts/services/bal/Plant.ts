import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IPlant } from "../interface/IPlant";


export interface IPlantOps {
    getPlantMaster( props: IPurchaseRequisitionsProps): Promise<IPlant>;
}

export default function PlantOps() {
    const spCrudOps = SPCRUDOPS();

    const getPlantMaster = async (props: IPurchaseRequisitionsProps): Promise< IPlant[]> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("BusinessAreaMaster"
                , "Id,Title,BusinessAreaName,CompanyCode/CompanyCode,CompanyCode/Id"
                , "CompanyCode"
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                //, props).then(results  => {
                    let brr: Array< IPlant> = new Array< IPlant>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            Plant: item.BusinessAreaName
                            // ProfitCenterName:item.ProfitCenterName,
                            // BusinessAreaNameId: item.BusinessAreaName.Id,
                            // BusinessAreaName:item.BusinessAreaName.BusinessAreaName,
                            // CompanyCode: item.CompanyCode.CompanyCode,
                            // CompanyCodeId: item.CompanyCode.Id
                            
                        });
                    });
                    return brr;
                });
        //});
    };

    return {
        getPlantMaster
       
    };
}