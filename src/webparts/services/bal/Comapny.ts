import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { ICompany } from "../interface/ICompany";


export interface ICompanyOps {
    // getVendorMaster(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<ICompany>;
    getComapnyMaster( props: IPurchaseRequisitionsProps): Promise<ICompany>;
}

export default function CompanyOps() {
    const spCrudOps = SPCRUDOPS();

    // const getVendorMaster = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<ICompany> => {
        const getComapnyMaster = async ( props: IPurchaseRequisitionsProps): Promise<ICompany[]> => {
            return await (await spCrudOps).getData("CompanyMaster"
                , "Id,Title,CompanyName,CompanyCode"
                , ""
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                    let brr: Array<ICompany> = new Array<ICompany>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            CompanyName: item.CompanyName,
                            CompanyCode: item.CompanyCode,
                            
                        });
                    });
                    return brr;
                }
                );
        //});
    };



    return {
        getComapnyMaster
    };
}