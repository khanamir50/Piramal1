import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import useSPCRUDOPS, { ISPCRUDOPS } from '../../services/dal/spcrudops';
import SPCRUDOPS from '../../services/dal/spcrudops';


export interface ISPCRUD {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IPurchaseRequisitionsProps): Promise<any>;
    insertData(listName: string, data: any, props: IPurchaseRequisitionsProps): Promise<any>;
    updateData(listName: string, itemId: number, data: any, props: IPurchaseRequisitionsProps): Promise<any>;
    deleteData(listName: string, itemId: number, props: IPurchaseRequisitionsProps): Promise<any>;
    getListInfo(listName: string, props: IPurchaseRequisitionsProps): Promise<any>;
    getListData(listName: string, columnsToRetrieve: string, props: IPurchaseRequisitionsProps): Promise<any>;
    batchInsert(listName: string, data: any, props: IPurchaseRequisitionsProps): Promise<any>;
    batchUpdate(listName: string, data: any, props: IPurchaseRequisitionsProps): Promise<any>;
    batchDelete(listName: string, data: any, props: IPurchaseRequisitionsProps): Promise<any>;
    uploadFile(folderServerRelativeUrl: string, file: File, props: IPurchaseRequisitionsProps): Promise<any>;
    deleteFile(fileServerRelativeUrl: string, props: IPurchaseRequisitionsProps): Promise<any>;
}

export default async function SPCRUD(): Promise<ISPCRUD> {
    const spCrudOps = SPCRUDOPS();

    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean }, props: IPurchaseRequisitionsProps) => {
        const items: any[] = await (await spCrudOps).getData(listName, columnsToRetrieve, columnsToExpand, filters, orderby, props);
        return items;
    };

    const insertData = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).insertData(listName, data, props);
        return result;
    };

    const updateData = async (listName: string, itemId: number, data: any, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).updateData(listName, itemId, data, props);
        return result;
    };

    const deleteData = async (listName: string, itemId: number, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).deleteData(listName, itemId, props);
        return result;
    };

    const getListInfo = async (listName: string, props: IPurchaseRequisitionsProps) => {
        const list: any = await (await spCrudOps).getListInfo(listName, props);
        return list;
    };

    const getListData = async (listName: string, columnsToRetrieve: string, props: IPurchaseRequisitionsProps) => {
        const list: any = await (await spCrudOps).getListData(listName, columnsToRetrieve, props);
        return list;
    };

    const batchInsert = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).batchInsert(listName, data, props);
        return result;
    };

    const batchUpdate = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).batchUpdate(listName, data, props);
        return result;
    };

    const batchDelete = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).batchDelete(listName, data, props);
        return result;
    };
    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).uploadFile(folderServerRelativeUrl, file, props);
        return result;
    };
    const deleteFile = async (fileServerRelativeUrl: string, props: IPurchaseRequisitionsProps) => {
        const result: any = await (await spCrudOps).deleteFile(fileServerRelativeUrl, props);
        return result;
    };

    return {
        getData,
        insertData,
        updateData,
        deleteData,
        getListInfo,
        getListData,
        batchInsert,
        batchUpdate,
        batchDelete,
        uploadFile,
        deleteFile
    };
}