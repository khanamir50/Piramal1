import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IGST } from "../interface/IGST";


export interface IGSTOps {
    getGST( props: IPurchaseRequisitionsProps): Promise<IGST>;
    getGSTId( brrId: string | number,props: IPurchaseRequisitionsProps): Promise<IGST>;
}

export default function GSTOps() {
    const spCrudOps = SPCRUDOPS();

    const getGST = async (props: IPurchaseRequisitionsProps): Promise<IGST[]> => {
            return await (await spCrudOps).getData("GstMaster"
                , "Id,Title,GSTName,GST"
                , ""
                , ""
                , { column: 'Id', isAscending: false }, props).then(results => {
                
                    let brr: Array<IGST> = new Array<IGST>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            GSTName: item.GSTName,
                            GST: item.GST,

                        });
                    });
                    return brr;
                });
        //});
    };

    const getGSTId = async (brrId: string | number,props: IPurchaseRequisitionsProps): Promise<IGST> => {
        return await (await spCrudOps).getData("GstMaster"
            , "Id,Title,GST,GSTName"
            , ""
            , "GST eq "+ brrId + ""
            , { column: 'Id', isAscending: false }, props).then(results => {
            
                let brr: Array<IGST> = new Array<IGST>();
                results.map(item => {
                    
                    brr.push({
                        Id: item.Id,
                        Title: item.Title,
                        GSTName: item.GSTName,
                        GST: item.GST,

                    });
                });
                return brr[0];
            });
    //});
};
    return {
        getGST,
        getGSTId
       
    };
}