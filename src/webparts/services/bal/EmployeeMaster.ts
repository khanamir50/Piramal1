import { IPurchaseRequisitionsProps } from '../../purchaseRequisitions/components/IPurchaseRequisitionsProps';
import SPCRUDOPS from '../../services/dal/spcrudops';
import { IEmployeeMaster } from "../interface/IEmployeeMaster";


export interface IEmployeeMasterOps {
    // getEmployeeMaster(brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster>;
    getEmployeeMaster(props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster>;
    getEmployeeMasterId(strFilter: string, sorting: any, props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster[]>;
}

export default function EmployeeOps() {
    const spCrudOps = SPCRUDOPS();

    // const getEmployeeMaster = async (brrId: string | number, props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster> => {
        const getEmployeeMaster = async (props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster[]> => {
        //return ApprovalMatrixOps().getAllApprovalMatrix(props).then(async appMatrixColl => {
            return await (await spCrudOps).getData("EmployeeMaster"
                , "Id,Title,Username/Id,Username/Title,EmployeeID,EmployeeName,EmployeeEmail,EmployeeCode,Department,SubDepartment,Designation,ReportingManager/Id,ReportingManager/Title"
                , "Username,ReportingManager"
                , "EmployeeFlag eq 'Active'"
                , { column: 'Id', isAscending: false }, props).then(results => {
                    let brr: Array<IEmployeeMaster> = new Array<IEmployeeMaster>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            UsernameId: item.Username.Id,
                            EmployeeID:item.EmployeeID,
                            EmployeeName: item.EmployeeName,
                            EmployeeEmail: item.EmployeeEmail,
                            EmployeeCode: item.EmployeeCode,
                            Department: item.Department,
                            SubDepartment: item.SubDepartment,
                            Designation: item.Designation,
                            ReportingManager: item.ReportingManager.Title,
                            ReportingManagerId: item.ReportingManager.Id
                        });
                    });
                    return brr;
                });
        //});
    };

    
    const getEmployeeMasterId = async (empId: number, props: IPurchaseRequisitionsProps): Promise<IEmployeeMaster> => {
                return await (await spCrudOps).getData("EmployeeMaster"
                , "Id,Title,Username/Id,Username/Title,EmployeeID,EmployeeName,EmployeeEmail,EmployeeCode,Department,SubDepartment,Designation,ReportingManager/Id,ReportingManager/Title"
                , "Username,ReportingManager"
                , "UsernameId eq '"+empId+"' and EmployeeFlag eq 'Active'"
                , { column: 'Id', isAscending: false }, props).then(results => {
                    let brr: Array<IEmployeeMaster> = new Array<IEmployeeMaster>();
                    results.map(item => {
                        
                        brr.push({
                            Id: item.Id,
                            Title: item.Title,
                            UsernameId: item.Username.Id,
                            EmployeeID:item.EmployeeID,
                            EmployeeName: item.EmployeeName,
                            EmployeeEmail: item.EmployeeEmail,
                            EmployeeCode: item.EmployeeCode,
                            Department: item.Department,
                            SubDepartment: item.SubDepartment,
                            Designation: item.Designation,
                            ReportingManager: item.ReportingManager.Title,
                            ReportingManagerId: item.ReportingManager.Id
                            
                        });
                    });
                    return brr[0];
                }); 
    };


    return {
        getEmployeeMaster
       , getEmployeeMasterId
    };
}