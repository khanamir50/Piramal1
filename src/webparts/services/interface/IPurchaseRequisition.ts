import { StringLocale } from "yup/lib/locale";

export interface IPurchaseRequisition {
    Id: number;
    Title: string;
    EmployeeID: number;
    RequestHeader: string;
    RequestDescription: string;
    RequestType: string;
    RequestDate: any;
    ModifiedOn: number;
    RequestFor: string;
    CompanyNameId: number;
    CompanyName: string;
    VendorName: string;
    VendorNameId: number;
    VendorAddress: string;
    VendorStateOrSite:string;
    DeliveryLocation:string;
    VendorEstimateNoOrProformaInvoiceNo:string;
    InitiatedBy:string;
    InitiatedById:number;
    RequestorStatus:string;
    ApproverStatus:string;
    NextRole:any;
    NextRoleId:any;
    NextApprovalLevel:any;
    NextApprovalLevelId:any;
    NextApprovers:any;
    NextApproversId:any;
    ApprovalHistory:any;
    //VendorState:string;
}