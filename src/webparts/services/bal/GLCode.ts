import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IGLCode } from "../interface/IGLCode";


export interface IGLCodeOps {
    getGLCOde(props: IPurchaseRequisitionsProps): Promise<IGLCode[]>;
}

export default function GLCodeOps() {
    const spCrudOps = SPCRUDOPS();

    const getGLCOde = async (props: IPurchaseRequisitionsProps): Promise<IGLCode[]> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("GLCodeMaster"
                , "Id,Title,Account_No,GL_Account_Description,CONCATENATE"
                , ""
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                    let brr: Array<IGLCode> = new Array<IGLCode>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            AccountNo: item.Account_No,
                            GLCodeDescription: item.GL_Account_Description,
                            CONCATENATE: item.CONCATENATE
                            
                        });
                    });
                    return brr;
                });
        //});
    };

    return {
        getGLCOde
       
    };
}