import { IPurchaseRequisitionsProps } from '../../../webparts/purchaseRequisitions/components/IPurchaseRequisitionsProps';
import { IList, Web } from "@pnp/sp/presets/all";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ConsoleListener, Logger, LogLevel } from "@pnp/logging";

export interface ISPCRUDOPS {
    getData(listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string
        , orderby: { column: string, isAscending: boolean}, props: IPurchaseRequisitionsProps): Promise<any>;
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

export default async function SPCRUDOPS(): Promise<ISPCRUDOPS> {
    const getData = async (listName: string, columnsToRetrieve: string, columnsToExpand: string, filters: string, orderby: {column: string, isAscending: boolean}, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const items: any[] = await web.lists.getByTitle(listName).items.select(columnsToRetrieve).expand(columnsToExpand).filter(filters).orderBy(orderby.column, orderby.isAscending).getAll();
        return items;
    };

    const insertData = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.add(data).then(result => {
            return result;
        });
    };

    const updateData = async (listName: string, itemId: number, data: any, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).update(data).then(result => {
            return result;
        });
    };

    const deleteData = async (listName: string, itemId: number, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        return await web.lists.getByTitle(listName).items.getById(itemId).delete().then(result => {
            return result;
        });
    };

    const getListInfo = async (listName: string, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName);
        const listInfo = await list.select("Id,Title")();

        return listInfo;
    };
   
    const getListData = async (listName: string, columnsToRetrieve: string, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        const list = await web.lists.getByTitle(listName).items.select(columnsToRetrieve);
        //const listInfo = await list.select("Id,Title")();

        return list;
    };

    const batchInsert = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();

        for (let d = 0; d < data.length; d++) {
            await list.items.inBatch(batch).add(data[d], entityTypeFullName).then(b => {
                console.log(b);
            });
        }

        return await batch.execute();
    };

    const batchUpdate = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();

        for (let d = 0; d < data.length; d++) {
            await list.items.getById(data[d].Id).inBatch(batch).update(data[d], entityTypeFullName).then(b => {
                console.log(b);
            });
        }

        return await batch.execute();
    };

    const batchDelete = async (listName: string, data: any, props: IPurchaseRequisitionsProps) => {
        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let list = web.lists.getByTitle(listName);
        const entityTypeFullName = await list.getListItemEntityTypeFullName();
        let batch = web.createBatch();

        for (let d = 0; d < data.length; d++) {
            await list.items.getById(data[d].Id).inBatch(batch).delete().then(b => {
                console.log(b);
            });
        }

        return await batch.execute();
    };

    const uploadFile = async (folderServerRelativeUrl: string, file: File, props: IPurchaseRequisitionsProps) => {
        Logger.subscribe(new ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;

        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);
        let ticks = ((new Date().getTime() * 10000) + 621355968000000000);
        return await web.getFolderByServerRelativeUrl(folderServerRelativeUrl).files.addChunked(ticks.toString() + "_" + file.name, file, data => {
            Logger.log({ data: data, level: LogLevel.Verbose, message: "progress" });
        }, true);
    };

    const deleteFile = async (fileServerRelativeUrl: string, props: IPurchaseRequisitionsProps) => {
        Logger.subscribe(new ConsoleListener());
        Logger.activeLogLevel = LogLevel.Verbose;

        let web = Web(props.currentSPContext.pageContext.web.absoluteUrl);

        return await web.getFileByServerRelativeUrl(fileServerRelativeUrl).delete().then(result => {
            return result;
        });
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