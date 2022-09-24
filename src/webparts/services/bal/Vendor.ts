import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IVendor } from "../interface/IVendor";


export interface IVendorOps {
    // getVendorMaster(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IVendor>;
    getVendorMaster( props: IPurchaseRequisitionsProps): Promise<IVendor>;
    getVendorMasterById(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IVendor>;
}

export default function VendorOps() {
    const spCrudOps = SPCRUDOPS();

    // const getVendorMaster = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IVendor> => {
        const getVendorMaster = async ( props: IPurchaseRequisitionsProps): Promise<IVendor[]> => {
            return await (await spCrudOps).getData("VendorMaster"
                , "Id,Title,VendorName,VendorCode,CompanyCode,VendorAddress1,VendorAddress2,VendorAddress3,PinNo,City,StateName,StateCode,VendorAccountGroup"
                , ""
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                    const brrVendor: Array<IVendor> = new Array<IVendor>();
                    results.map(item => {
                        
                        brrVendor.push({
                            Id: item.Id,
                            Title: item.Title,
                            VendorName: item.VendorName,
                            VendorCode: item.VendorCode,
                            CompanyCode: item.CompanyCode,
                            VendorAddress1: item.VendorAddress1,
                            VendorAddress2: item.VendorAddress2,
                            VendorAddress3: item.VendorAddress3,
                            PinNo: item.PinNo,
                            City: item.City,
                            StateName: item.StateName,
                            StateCode: item.StateCode,
                            VendorAccountGroup: item.VendorAccountGroup
                        });
                    });
                    return brrVendor;
                });
        //});
    };

    const getVendorMasterById = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IVendor> => {
        return await (await spCrudOps).getData("VendorMaster"
            , "Id,Title,VendorName,VendorCode,CompanyCode,VendorAddress1,VendorAddress2,VendorAddress3,PinNo,City,StateName,StateCode,VendorAccountGroup"
            , ""
            , "Id eq '"+brrId+"'"
            , { column: 'Id', isAscending: false }, props).then(results => {
                const brrVendorID: Array<IVendor> = new Array<IVendor>();
                results.map(item => {
                    
                    brrVendorID.push({
                        Id: item.Id,
                        Title: item.Title,
                        VendorName: item.VendorName,
                        VendorCode: item.VendorCode,
                        CompanyCode: item.CompanyCode,
                        VendorAddress1: item.VendorAddress1,
                        VendorAddress2: item.VendorAddress2,
                        VendorAddress3: item.VendorAddress3,
                        PinNo: item.PinNo,
                        City: item.City,
                        StateName: item.StateName,
                        StateCode: item.StateCode,
                        VendorAccountGroup: item.VendorAccountGroup
                    });
                });
                return brrVendorID[0];
            });
    //});
    };

    return {
        getVendorMaster
    , getVendorMasterById
    };
}