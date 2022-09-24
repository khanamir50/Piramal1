import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IPurchaseRequisition } from "../interface/IPurchaseRequisition";


export interface IPurchaseRequisitionsOps {
    getPurchaseRequisition(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IPurchaseRequisition>;
    getPurchaseRequisitions(strFilter: string, sorting: any, props: IPurchaseRequisitionsProps): Promise<IPurchaseRequisition[]>;
}

export default function PurchaseRequisitionOps() {
    const spCrudOps = SPCRUDOPS();

    // const getEmployeeMaster = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster> => {
        const getPurchaseRequisition = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IPurchaseRequisition> => {
                return await (await spCrudOps).getData("PurchaseRequisitions"
                    , "Id,Title,EmployeeID,RequestDescription,RequestType,RequestDate,RequestHeader,RequestFor,CompanyName/CompanyName,VendorName/VendorName,VendorAddress,NextRole/Designation,NextRoleId,NextApprovalLevel/Level,NextApprovalLevelId"
                    + ",VendorStateOrSite,DeliveryLocation,VendorEstimateNoOrProformaInvoic,InitiatedBy/Title,InitiatedById,RequestorStatus,ApproverStatus,Modified,NextApprovers/Title,NextApproversId,ApprovalHistory"
                    , "CompanyName,VendorName,InitiatedBy,NextRole,NextApprovalLevel,NextApprovers"
                    , "Id eq " + brrId + ""
                    , { column: 'Id', isAscending: false }, props).then(results => {
                        let brr: Array<IPurchaseRequisition> = new Array<IPurchaseRequisition>();
                        results.map(item => {
                            
                            brr.push({
                                Id: item.ID,
                                Title: item.Title,
                                EmployeeID: item.EmployeeID,
                                RequestHeader: item.RequestHeader,
                                RequestDescription: item.RequestDescription,
                                RequestType: item.RequestType,
                                RequestDate: item.RequestDate,
                                RequestFor: item.RequestFor,
                                CompanyName: item.CompanyName !== undefined ? item.CompanyName.CompanyName : '',
                                CompanyNameId: item.CompanyNameId,
                                VendorName: item.VendorName !== undefined ? item.VendorName.VendorName : '',
                                VendorNameId: item.VendorNameId,
                                VendorAddress: item.VendorAddress,
                                VendorStateOrSite:item.VendorStateOrSite,
                                DeliveryLocation:item.DeliveryLocation,
                                ModifiedOn:item.Modified,
                                VendorEstimateNoOrProformaInvoiceNo:item.VendorEstimateNoOrProformaInvoic,
                                InitiatedBy:item.InitiatedBy.Title,
                                InitiatedById:item.InitiatedById,
                                RequestorStatus:item.RequestorStatus,
                                ApproverStatus:item.ApproverStatus,
                                NextRole: item.NextRole !== undefined ? item.NextRole.Designation : '',
                                NextRoleId:item.NextRoleId,
                                NextApprovalLevel: item.NextRole !== undefined ? item.NextApprovalLevel.Level : '',
                                NextApprovalLevelId:item.NextApprovalLevelId,
                                NextApprovers:item.NextRole !== undefined ? item.NextApprovers.Title : '',
                                NextApproversId:item.NextApproversId,
                                ApprovalHistory:item.ApprovalHistory
                                //VendorState:item.
                            });
                        });
                        return brr[0];
                    });
        };
    
        const getPurchaseRequisitions = async (strFilter: string, sorting: any, props: IPurchaseRequisitionsProps): Promise<IPurchaseRequisition[]> => {
                return await (await spCrudOps).getData("PurchaseRequisitions"
                , "Id,Title,EmployeeID,RequestDescription,RequestType,RequestDate,RequestHeader,RequestFor,CompanyName/CompanyName,VendorName/VendorName,VendorAddress,NextRole/Designation,NextRoleId,NextApprovalLevel/Level,NextApprovalLevelId"
                + ",VendorStateOrSite,DeliveryLocation,VendorEstimateNoOrProformaInvoic,InitiatedBy/Title,InitiatedById,RequestorStatus,ApproverStatus,Modified,NextApprovers/Title,NextApproversId,ApprovalHistory"
                , "CompanyName,VendorName,InitiatedBy,NextRole,NextApprovalLevel,NextApprovers"
                    , strFilter, sorting, props).then(results => {
                        let PRColl: Array<IPurchaseRequisition> = new Array<IPurchaseRequisition>();
                        results.map(item => {
                            
                            PRColl.push({
                                Id: item.ID,
                                Title: item.Title,
                                EmployeeID: item.EmployeeID,
                                RequestHeader: item.RequestHeader,
                                RequestDescription: item.RequestDescription,
                                RequestType: item.RequestType,
                                RequestDate: item.RequestDate,
                                RequestFor: item.RequestFor,
                                CompanyName: item.CompanyName !== undefined ? item.CompanyName.CompanyName : '',
                                CompanyNameId: item.CompanyNameId,
                                VendorName: item.VendorName !== undefined ? item.VendorName.VendorName : '',
                                VendorNameId: item.VendorNameId,
                                VendorAddress: item.VendorAddress,
                                VendorStateOrSite:item.VendorStateOrSite,
                                DeliveryLocation:item.DeliveryLocation,
                                ModifiedOn:item.Modified,
                                VendorEstimateNoOrProformaInvoiceNo:item.VendorEstimateNoOrProformaInvoic,
                                InitiatedBy:item.InitiatedBy.Title,
                                InitiatedById:item.InitiatedById,
                                RequestorStatus:item.RequestorStatus,
                                ApproverStatus:item.ApproverStatus,
                                NextRole: item.NextRole !== undefined ? item.NextRole.Designation : '',
                                NextRoleId:item.NextRoleId,
                                NextApprovalLevel: item.NextRole !== undefined ? item.NextApprovalLevel.Level : '',
                                NextApprovalLevelId:item.NextApprovalLevelId,
                                NextApprovers:item.NextRole !== undefined ? item.NextApprovers.Title : '',
                                NextApproversId:item.NextApproversId,
                                ApprovalHistory:item.ApprovalHistory
                            });
                        });
    
                        return PRColl;
                    });
        };


    return {
        getPurchaseRequisition
       , getPurchaseRequisitions
    };
}