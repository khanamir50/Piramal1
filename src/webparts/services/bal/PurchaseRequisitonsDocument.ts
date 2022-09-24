import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../dal/spcrudops';
import { IPurchaseRequisitionDocument } from "../interface/IPurchaseRequisitionDocument";


export interface IPurchaseRequisitionDocumentOps {
    getPurchaseRequisitionDocument(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IPurchaseRequisitionDocument[]>;
}

export default function PurchaseRequisitionDocumentOps() {
    const spCrudOps = SPCRUDOPS();

    const getPurchaseRequisitionDocument = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IPurchaseRequisitionDocument[]> => {
        return await (await spCrudOps).getData("PurchaseRequisitionsDocument"
            , "Id,Title,PRID/Id,FileLeafRef,File/ServerRelativeUrl,File_x0020_Type"
            , "PRID,File"
            , "PRID/Id eq " + brrId + ""
            , { column: 'Id', isAscending: false }, props).then(results => {
                let brr: Array<IPurchaseRequisitionDocument> = new Array<IPurchaseRequisitionDocument>();
                results.map(item => {
                    brr.push({
                        Id: item.Id,
                        Title: item.Title,
                        //PRIDId: item.PRIDId,
                        //PRID: item.PRIDId,
                        //UniqueId: item.UniqueId,
                        FileLeafRef: item.FileLeafRef,
                        ServerRelativeUrl: item.File.ServerRelativeUrl,
                        File_x0020_Type: item.File_x0020_Type,
                        isChecked: false
                    });
                });
                return brr;
            });
    };

    return {
        getPurchaseRequisitionDocument
    };
}