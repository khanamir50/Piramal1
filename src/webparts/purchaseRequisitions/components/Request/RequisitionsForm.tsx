import * as React from 'react';
import styles from '../PurchaseRequisitions.module.scss';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { IPurchaseRequisitionsProps } from '../IPurchaseRequisitionsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import USESPCRUD, { ISPCRUD } from '../../../services/bal/spcrud';
import EmployeeOps from '../../../services/bal/EmployeeMaster';
import { IEmployeeMaster } from '../../../services/interface/IEmployeeMaster';
import { PRItems } from '../../../services/interface/IPRItems';
import VendorOps from '../../../services/bal/Vendor';
import { IVendor } from '../../../services/interface/IVendor';
import GSTOps from '../../../services/bal/GST';
import { IGST } from '../../../services/interface/IGST';
import GLCodeOps from '../../../services/bal/GLCode';
import { IGLCode } from '../../../services/interface/IGLCode';
import CounterOps from '../../../services/bal/Counter';
import { ICounter } from '../../../services/interface/ICounter';
import ProfitCenterOps from '../../../services/bal/ProfitCenter';
import { IProfitCenter } from '../../../services/interface/IProfitCenter';
import PlantOps from '../../../services/bal/Plant';
import { IPlant } from '../../../services/interface/IPlant';
import CostCenterOps from '../../../services/bal/CostCenter';
import { ICostCenter } from '../../../services/interface/ICostCenter';
import CompanyOps from '../../../services/bal/Comapny';
import { ICompany } from '../../../services/interface/ICompany';
import { Formik, FormikProps, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
// import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import {
    Stack, IStackTokens, ITag, TagPicker, IBasePickerSuggestionsProps, IBasePicker, IInputProps, Checkbox, TextField
    , DetailsList, IColumn, FontIcon, SelectionMode, DetailsListLayoutMode, IDetailsHeaderProps, DetailsHeader, ConstrainMode
    , PrimaryButton, ICheckboxProps, MessageBar, MessageBarType, DefaultButton
} from '@fluentui/react';
import { BaseButton, Button, IPersonaProps } from 'office-ui-fabric-react';
import { Label } from '@fluentui/react/lib/Label';
import { Link } from 'react-router-dom';
import { Items } from '@pnp/sp/items';

export const RequisitionsForm: React.FunctionComponent<IPurchaseRequisitionsProps> = (props: IPurchaseRequisitionsProps) => {
    const [spCrud, setSPCRUD] = React.useState<ISPCRUD>();
    const [EmployeeColl, setEmployeeMaster] = React.useState<IEmployeeMaster[]>([]);
    const [PRItemColl, setPRItem] = React.useState<PRItems[]>([]);
    const [VendorColl, setVendor] = React.useState<IVendor[]>([]);
    const [CompanyColl, setCompany] = React.useState<ICompany[]>([]);
    const [GLCodeColl, setGLCode] = React.useState<IGLCode[]>([]);
    const [ProfitCenterColl, setProfitCenter] = React.useState<IProfitCenter[]>([]);
    const [PlantColl, setPlant] = React.useState<IPlant[]>([]);
    const [GSTColl, setGST] = React.useState<IGST[]>([]);
    const [CostCenterColl, setCostcenter] = React.useState<ICostCenter[]>([]);
    const [employeeDetail, setEmployeeDetail] = React.useState<IEmployeeMaster>();
    const [Counter, setCounter] = React.useState<ICounter>();
    const [selectedVendorId, setSelectedVendorId] = React.useState<string>();
    const [selectedGSTId, setSelectedGSTId] = React.useState<string>();
    //const [PRItemColl, setSelectedPRItem] = React.useState<string>();
    const [success, setSuccess] = React.useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
    const [selectedCompId, setSelectedCompId] = React.useState<string>();
    const [VendorDetail, setVendorDetail] = React.useState<IVendor>();
    const [GSTIdDetail, setGSTId] = React.useState<IGST>();
    //const [GSTIdDetail, setGSTId] = React.useState<number>();
    const [GStDetail, setGstAmount] = React.useState<number>();
    const [TotalAmount, setTotalAmount] = React.useState<number>();
    const [CalcuatedVal, setCalcuatedVal] = React.useState<PRItems[]>([]);
    const [user, setUser] = React.useState<IPersonaProps[]>();
    //const [soCheckedOrderValueColl, setSoCheckedOrderValueColl] = React.useState<Array<any>>(new Array<any>());

    let spCrudObj: ISPCRUD;
    //get Data from Employee Master
    const getEmployee = async () => {
        return await EmployeeOps().getEmployeeMaster(props).then(results => {
            setEmployeeMaster(results);
            return results;
        });
    };


    //get Data from Vendor Master
    const getVendor = async () => {
        return await VendorOps().getVendorMaster(props).then(results => {
            setVendor(results);
            return results;
        });
    };

    //get Data from Vendor Master
    const getProfitCenterMaster = async () => {
        return await ProfitCenterOps().getProfitCenterMaster(props).then(results => {
            setProfitCenter(results);
            return results;
        });
    };

    //get Data from Business Area Master
    const getPlantMaster = async () => {
        return await PlantOps().getPlantMaster(props).then(results => {
            setPlant(results);
            return results;
        });
    };

    //get Data from Company Master
    const getComapny = async () => {
        return await CompanyOps().getComapnyMaster(props).then(results => {
            setCompany(results);
            return results;
        });
    };
    const getCounter = async () =>{
        return await CounterOps().getCounterMaster(props).then(results => {
            let dtt = new Date();
            let mm = dtt.getMonth();
            //let yyyy:number;
            let yyyy = dtt.getFullYear();
            //yyyy=parseInt(yyyy);
            //let yy = parseInt(yyyy) + 1; 
            //let c = yyyy.substr(2, yyyy.length);
            let month = new Array();
            month[0] = "Jan";
            month[1] = "Feb";
            month[2] = "Mar";
            month[3] = "Apr";
            month[4] = "May";
            month[5] = "Jun";
            month[6] = "Jul";
            month[7] = "Aug";
            month[8] = "Sep";
            month[9] = "Oct";
            month[10] = "Nov";
            month[11] = "Dec";
            let mName = month[mm];
            
            //if()
            let Counter = results.Title;
            let ReqNo = 'CPD' + '/' + yyyy + '/' + Counter;
            let CountRequest: any = {
                Title:ReqNo,
                Id:results.Id
            }
            setCounter(CountRequest);
            return results;
        });
    }

    //get Data from GL Code Master
    const getCostcenter = async () => {
        return await CostCenterOps().getCostCenter(props).then(results => {
            setCostcenter(results);
            return results;
        });
    };

    //get Data from GL Code Master
    const getGLCode = async () => {
        return await GLCodeOps().getGLCOde(props).then(results => {
            setGLCode(results);
            return results;
        });
    };

    //get Data from GST Master
    const getGST = async () => {
        return await GSTOps().getGST(props).then(results => {
            setGST(results);
            return results;
        });
    };

    const getEmployeeById = async () => {
        return await EmployeeOps().getEmployeeMasterId(props.currentSPContext.pageContext.legacyPageContext.userId, props).then(results => {
            setEmployeeDetail(results);
            return results;
        });
    };

    const getVendorById = async (VendorId) => {
        return await VendorOps().getVendorMasterById(VendorId, props).then(results => {
            setVendorDetail(results);
            return results;
        });
    };

    const getGSTId =  async(GSTId) => {
        return GSTOps().getGSTId(GSTId, props).then(results => {
            setGSTId(results);
            return results;
        });
    };

    const onVendorChange = async (event: any) => {
        if (event) {
            setSelectedVendorId(event.target.value);
            await getVendorById(event.target.value);
            //console.log(event.target.value);
        }
    }

    const onGSTChange = async (event: any, formValues: any) => {
        //const onGSTChange = async(event:any,formValues: any) =>
        //{
        let PRIcalc: PRItems[];
        //let PRIcalc: Array<number> = new Array<number>();
            //setCalcuatedVal()
        if (event) {
            setSelectedGSTId(event.target.value);
            let gSt = event.target.value;
            let Amt = formValues.Amount;
            let quantity = formValues.Quanity;
            let gstVal = event.target.value / 100;
            let gstcalAmt = gstVal * Amt;
            
            let TotAmt = quantity * Amt * gstcalAmt;
            
            setGstAmount(gstcalAmt);
            setTotalAmount(TotAmt);
            
            // let GSTAmount:number;
            // let TotalAmount:number;
            // PRIcalc.push({
            //     GSTAmount:gstcalAmt,
            //     TotalAmount:TotAmt
            // });
            // setCalcuatedVal(PRIcalc);

            return gstcalAmt;


        }
    }

    const _getPeoplePickerItems = (item: IPersonaProps[]) => {
        setUser(item);
    };

    const onAddNewRow = async (formValues: any,GSTAmount,TotalAmount) => {
        let prItemColl: PRItems[];
        //await getGSTId(formValues.GSTId);
        await GSTOps().getGSTId(formValues.GSTId, props).then(GSTresults => {
            setGSTId(GSTresults);
            //return GSTresults;
        
            //let GLCodeTxt: IGLCode = GLCodeColl.filter((val) => val.Id === formValues.GLCodeId)[0];
        let GLCode: IGLCode = GLCodeColl.filter((val) => val.Id === parseInt(formValues.GLCodeId))[0];
        let CostCenter: ICostCenter = CostCenterColl.filter((val) => val.Id === parseInt(formValues.CostCenterId))[0];
        let ProfitC: IProfitCenter = ProfitCenterColl.filter((val) => val.Id === parseInt(formValues.ProfitCId))[0];
        let Plant: IPlant = PlantColl.filter((val) => val.Id === parseInt(formValues.PlantId))[0];

        setPRItem(previous => { prItemColl = previous; return prItemColl });
        let counter=0;
        if(prItemColl.length===0)
        {
            counter=1;
        }
        else{
            counter=prItemColl.length + 1;
        }
        prItemColl.push({
            Id: counter,
            Title: formValues.ItemName,
            ItemName: formValues.ItemName,
            GLCodeId: formValues.GLCodeId,
            GLCode: GLCode.GLCodeDescription,
            CostCenter: CostCenter.CostCenter,
            CostCenterId: formValues.CostCenterId,
            ProfitCenter: ProfitC.ProfitCenterName,
            ProfitCenterId: formValues.ProfitCId,
            PlantId: formValues.PlantId,
            Plant: Plant.Plant,
            Quantity: formValues.Quanity,
            Amount: formValues.Amount,
            GST: formValues.GSTId,
            GSTId: GSTresults.Id,
            GSTAmount: GSTAmount,
            TotalAmount: TotalAmount
        });

        setPRItem(prItemColl);
        formValues.ItemName='';
        formValues.Quanity='';
        formValues.Amount='';
        formValues.GSTId='Select';
        formValues.CostCenterId=0;
        formValues.GLCodeId=0;
        formValues.ProfitCId=0;
        formValues.PlantId=0;
        GSTAmount='';
        //GStDetail='';
        TotalAmount='';
        setGstAmount(null)
        //TotalAmount('');
        setCalcuatedVal(null);
        setTotalAmount(null);
        //setGLCode(null);
        //await getGLCode();
        });

    }
    function handleItemDelete(i)
    {
        let prItemColl: PRItems[];

        setPRItem(previous => { prItemColl = previous; return prItemColl });
        let t = prItemColl.indexOf(i);
        prItemColl.splice(t, 1);

        setPRItem(prItemColl);

    }


    React.useEffect(() => {
        //alert(props.currentSPContext.pageContext.legacyPageContext.userId);getPlantMaster
        getEmployee().then(empResults => {
            console.log(EmployeeColl);
        }, error => {
            console.log(error);
        });

        getVendor().then(VendorResult => {
            console.log(VendorColl);
        }, error => {
            console.log(error);
        });

        getComapny().then(CompResult => {
            console.log(CompanyColl);
        }, error => {
            console.log(error);
        });

        getCounter().then(CompResult => {
            console.log(CompanyColl);
        }, error => {
            console.log(error);
        });

        getEmployeeById().then(empResult => {
            console.log(employeeDetail);
        }, error => {
            console.log(error);
        });

        getGLCode().then(GLResult => {
            console.log(GLCodeColl);
        }, error => {
            console.log(error);
        });

        getProfitCenterMaster().then(GLResult => {
            console.log(ProfitCenterColl);
        }, error => {
            console.log(error);
        });

        getPlantMaster().then(PlantResult => {
            console.log(PlantColl);
        }, error => {
            console.log(error);
        });

        getCostcenter().then(GLResult => {
            console.log(CostCenterColl);
        }, error => {
            console.log(error);
        });


        getGST().then(GstResult => {
            console.log(GSTColl);
        }, error => {
            console.log(error);
        });
    }, []);


    const validate = yup.object().shape({
        vendorId: yup.string().required("Please select vendor!")
    });

    const initialvalues = {
        vendorId: '',
        condition: 'Draft',
        attachPlan:'',
        isDraft: false

    };

    function getFieldProps(formik: FormikProps<any>, field: string) {
        return { ...formik.getFieldProps(field), errorMessage: formik.errors[field] as string };
    }

    async function onRequestInitiate(formValues: any) {

        setIsSubmitted(true);
        spCrudObj = await USESPCRUD();
        setSPCRUD(spCrudObj);
        await CounterOps().getCounterMaster(props).then(async (CountResult) => {
            let dtt = new Date();
            let mm = dtt.getMonth();
            //let yyyy:number;
            let yyyy = dtt.getFullYear();
            //yyyy=parseInt(yyyy);
            //let yy = parseInt(yyyy) + 1; 
            //let c = yyyy.substr(2, yyyy.length);
            let month = new Array();
            month[0] = "Jan";
            month[1] = "Feb";
            month[2] = "Mar";
            month[3] = "Apr";
            month[4] = "May";
            month[5] = "Jun";
            month[6] = "Jul";
            month[7] = "Aug";
            month[8] = "Sep";
            month[9] = "Oct";
            month[10] = "Nov";
            month[11] = "Dec";
            let mName = month[mm];
            
            //if()
            let Counter = CountResult.Title;
            let ReqNo = 'CPD' + '/' + yyyy + '/' + Counter;
            await EmployeeOps().getEmployeeMasterId(props.currentSPContext.pageContext.legacyPageContext.userId, props).then(async (empResult) => {
                //let PRRequest=any;
                //let PRRequest:Array<any> = new Array<any>();
                    let ReportingManagerStatus='';
                    if(formValues.condition==="Submitted")
                    {
                        ReportingManagerStatus="Pending";
                    }
                    else{
                        ReportingManagerStatus="";
                    }
                    let PRRequest: any = {
                        'EmployeeID': employeeDetail.EmployeeID
                        , 'RequestHeader': formValues.Requestheader
                        , 'RequestDescription': formValues.ReqDesc
                        , 'RequestType': formValues.ReqType
                        , 'RequestDate': formValues.ReqDate
                        , 'RequestFor': formValues.ReqFor
                        , 'OnBehalfId': user[0].id
                        , 'Title': ReqNo
                        , 'CompanyNameId': parseInt(formValues.CompNameId)
                        , 'VendorNameId': selectedVendorId
                        , 'VendorAddress': VendorDetail.VendorAddress1
                        , 'VendorStateOrSite': formValues.StateName
                        , 'DeliveryLocation': formValues.DelLoc
                        , 'VendorEstimateNoOrProformaInvoic': formValues.VenEstNo
                        , 'RequestorStatus':formValues.condition
                        , 'ReportingManagerStatus':ReportingManagerStatus
                        , 'InitiatedById': props.currentSPContext.pageContext.legacyPageContext.userId
                        , 'ReportingManagerId':employeeDetail.ReportingManagerId
                        , 'ApprovalHistory': 'Pending at '+employeeDetail.ReportingManager +' for proccessing on '+ new Date().toLocaleString('en-US') +'\n Purchase Requisition Request has been initiated by ' + props.currentSPContext.pageContext.legacyPageContext.userDisplayName + ' on ' + new Date().toLocaleString('en-US') + '\n\n'
                        //"WorkflowHistory": "Pending at "+txtDEO +" for proccessing on "+ workflowDt+"<br/>Vendor Invoice has been initiated by "+_spPageContextInfo.userDisplayName+ " on " + workflowDt +".<br/>"
        
                    };
                
                
    
                console.log(formValues);
                console.log(PRRequest);
                //return false;
    
                await spCrudObj.insertData("PurchaseRequisitions", PRRequest, props).then(async (brrInsertResult) => {
                    console.log(brrInsertResult);
                    let brPRItemColl = [];
                    let index=0;
                    for (let n = 0; n < PRItemColl.length; n++) {
                        let PRItem: any = {
                            ItemName: PRItemColl[n].ItemName
                            , Title : ReqNo
                            , RequestIDId: brrInsertResult.data.Id
                            , GLCodeId: PRItemColl[n].GLCodeId
                            , CostCenterId: PRItemColl[n].CostCenterId
                            , Quantity: ''+PRItemColl[n].Quantity
                            , Amount: ''+PRItemColl[n].Amount
                            , ProfitCenterId:PRItemColl[n].ProfitCenterId
                            , PlantId:PRItemColl[n].PlantId
                            //, GST: PRItemColl[n].GST
                            , GSTId: PRItemColl[n].GSTId
                            , GSTAmount: ''+PRItemColl[n].GSTAmount
                            , TotalAmount: ''+PRItemColl[n].TotalAmount
                        };
                        index++;
                        await spCrudObj.insertData("PRItems", PRItem, props).then(async (brPRItemInsertResult) => {
                            console.log(brPRItemInsertResult);
                            if(PRItemColl.length===index)
                            {
                                let CounterNew=parseFloat(Counter) + 1;
                                let CountRequest: any = {
                                    'Title':''+CounterNew
                                }
                                await spCrudObj.updateData("CounterMaster", CountResult.Id ,CountRequest, props).then(async (brPRItemInsertResult) => {
                                    let f = 0;
                                        if (formValues.attachPlan.length > 0) {
                                            await uploadPRDoc(f);
                                        }
                                        async function uploadPRDoc(fileNo: number) {
                                            const file = formValues.attachPlan[fileNo];
                                            const brPlanFile = await spCrudObj.uploadFile(props.currentSPContext.pageContext.legacyPageContext.siteServerRelativeUrl + "/PRPO/PurchaseRequisitionsDocument/", file, props);
                                            const item = await brPlanFile.file.getItem();
                                            await item.update({ PRIDId: parseInt(brrInsertResult.data.Id) }).then(async (brPlanDocResult) => {
                                                    f++;
                                                    if (f <= (formValues.attachPlan.length - 1)) {
                                                        await uploadPRDoc(f);
                                                    }
                                                },
                                                error => {
                                                    console.log(error);
                                                });
                                                // else {
                                                //     commuteProcess();
                                                // }
                                            //});
                                        }
                                    alert('Added !! PR No is '+ReqNo+'');
                                    window.location.reload();
                                }
                                ,error => {
                                    console.log(error);
                                });
                                
                            }
                            
                            setSuccess(true);
                            
                        },error => {
                            console.log(error);
                        });
                    }
                    
                    
                }, error => {
                    console.log(error);
                });
    
    
            });
        })
        

    }
    
    function renderPRItems() {
        PRItemColl.map((PRItemObj) => {
            <div className="row grid-style rowItem document-content" >
                <div className="col-xs-1 col-sm-1 col-md-1">
                    {PRItemObj.ItemName}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">
                    {PRItemObj.GLCode}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">//ProfitCenter
                    {PRItemObj.CostCenter}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">//ProfitCenter
                    {PRItemObj.ProfitCenter}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">//ProfitCenter
                    {PRItemObj.Plant}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">
                    {PRItemObj.Quantity}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">
                    {PRItemObj.Amount}
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1">
                    {PRItemObj.GST}
                </div>
                <div className="col-xs-2 col-sm-2 col-md-1">
                    {PRItemObj.GSTAmount}
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2">
                    {PRItemObj.TotalAmount}
                </div>
                <div className="col-xs-2 col-sm-2 col-md-2">
                    <button onClick={handleItemDelete.bind(PRItemObj)}>Delete</button>
                </div>
            </div>
        })
    }

    return (
        <Formik initialValues={initialvalues}
            validationSchema={validate}
            onSubmit={(values, helpers) => { }}>{
                formik => (
                    <div className='py-2'>
                       <h1 className={styles.heading}>Initiate Request</h1> 
                        <div className="row">
                            <h2 className={styles.subheading}> Requester Details </h2>
                             
                                <div className="col-md-6">
                                    <div><label className='fw-bold'>Requester Name :-</label> </div>

                                    <label id='lblRequesterN' >{employeeDetail !== undefined ? employeeDetail.EmployeeName : ''}</label>
                                </div>
                                <div className="col-md-6">
                                    <div><label className='fw-bold'>Department :-</label></div>
                                    <label id='lblDepartment' >{employeeDetail !== undefined ? employeeDetail.Department : ''}</label>
                                </div>
                            
                            
                            <div className="col-md-6">
                                <div><label className='fw-bold'>Employee ID :-</label></div>
                                <label id='lblEmployeeID' >{employeeDetail !== undefined ? employeeDetail.EmployeeID : ''}</label>
                            </div>
                            <div className="col-md-6">
                                <div><label className='fw-bold'>Manager :-</label></div>
                                <label id='lblManager' >{employeeDetail !== undefined ? employeeDetail.ReportingManager : ''}</label>
                            </div>
                        </div>
                        <div>
                            <h2 className={styles.subheading + ' ' + styles.mrb}>PR Request Deatils</h2>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div>Request Header :-</div>
                                    <div>
                                        <input type='text' id='txtReqHeader' className={styles.inputwidthreq} {...getFieldProps(formik, 'Requestheader')}></input>
                                    </div>

                                </div>
                                <div className='col-md-6'>
                                    <div>Request Description :-</div>
                                    <div>
                                        <textarea id='txtReqDesc' className={styles.inputwidthreq} {...getFieldProps(formik, 'ReqDesc')}></textarea>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                <div>Request Type :-</div>
                            <div>
                                <select id='ddlRequestType' className={styles.inputwidthreq} {...getFieldProps(formik, 'ReqType')}>
                                    <option >Select</option>
                                    <option value="Media Bills">Media Bills</option>
                                    <option value="Non Media Bills">Non Media Bills</option>
                                </select>
                            </div>
                                </div>
                                <div className='col-md-6'>
                                    <div>Request Date :-</div>
                                        <div>
                                            <input id='dtreqDt' type='date' className={styles.inputwidthreq} {...getFieldProps(formik, 'ReqDate')}></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Request for :-</div>
                                        <div>
                                            <select id='ddlRequestFor' className={styles.inputwidthreq} {...getFieldProps(formik, 'ReqFor')}>
                                                <option >Select</option>
                                                <option id='Self'>Self</option>
                                                <option id='Vendor'>Vendor</option>
                                                <option id='Others'>Others</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        {/* <div>On Behalf :-</div> */}
                                        <div>
                                            {/* <input id='txtonBehalf' type='text' {...getFieldProps(formik, 'OnBehalf')}></input> */}
                                            <PeoplePicker
                                                    context={props.currentSPContext}
                                                    personSelectionLimit={1}
                                                    titleText="On Behalf"
                                                    onChange={_getPeoplePickerItems}
                                                    principalTypes={[PrincipalType.User]}
                                                    ensureUser={true}
                                                    resolveDelay={1000}
                                                    
                                                     /> 
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Request Number :-</div>
                                        <div>
                                            <label id='txtReqNo' >{Counter !== undefined ? Counter.Title : ''}</label>
                                            {/* <input id='txtReqNo' type='text' readOnly ></input> */}
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Company Name :-</div>
                                        <div>
                                            <select id='ddlCompN' value={selectedCompId} className={styles.inputwidthreq} {...getFieldProps(formik, 'CompNameId')}>
                                                <option value="">Select</option>
                                                {CompanyColl.map((comp) => <option key={comp.Id} value={comp.Id}>{comp.CompanyName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                    <div>Vendor Name :-</div>
                                        <div>
                                            <select id='ddlVendor' name='ddlVendor' className={styles.inputwidthreq} value={selectedVendorId}
                                                {...getFieldProps(formik, 'vendorId')} onChange={async (e) => {
                                                    formik.setFieldValue('vendorId', e.target.value);
                                                    await onVendorChange(e);
                                                    formik.handleChange("ddlVendor");
                                                }}>
                                                <option value="">Select</option>
                                                {VendorColl.map((Vend) => <option key={Vend.Id} value={Vend.Id}>{Vend.VendorName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Vendor State/Site :-</div>
                                        <div>
                                            {/* <input id='txtVendorState' type='text'>{VendorDetail !== undefined && VendorDetail[0] !== undefined? VendorDetail.StateName : ''}</input> */}
                                            <label id='txtVendorState'>{VendorDetail !== undefined ? VendorDetail.StateName : ''}</label>

                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Vendor Address :-</div>
                                        <div>
                                            {/* <textarea id='txtvendorAdd'></textarea> */}
                                            <label id='txtvendorAdd'>{VendorDetail !== undefined ? VendorDetail.VendorAddress1 : ''}</label>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Delivery Location :-</div>
                                        <div>
                                            <input id='txtDeliverLoc' type='text' className={styles.inputwidthreq} {...getFieldProps(formik, 'DelLoc')}></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Vendor Estimate No :-</div>
                                        <div>
                                            <input id='txtVendorEstNo' type='text' className={styles.inputwidthreq} {...getFieldProps(formik, 'VenEstNo')}></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>

                                        <div className='form-group row'>
                                            <Label  htmlFor={'attachPlan'}>Attach Documents: </Label>
                                            <div >
                                                <input type="file" id="attachPlan" name='attachPlan' onBlur={formik.handleBlur} multiple
                                                    onChange={({ currentTarget }) => {
                                                        const files = currentTarget.files;
                                                        if (files.length > 0) {
                                                            formik.setFieldValue("attachPlan", files);
                                                        }
                                                        else {
                                                            formik.setFieldValue("attachPlan", '');
                                                        }
                                                    }} />
                                                {formik.errors.attachPlan ? (
                                                    <div style={{
                                                        paddingTop: 5,
                                                        color: "#B2484D",
                                                        fontSize: ".75rem",
                                                        fontFamily: "Segoe UI"
                                                    }}>
                                                        {JSON.stringify(formik.errors.attachPlan).replace(/"/g, '')}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                    </div>
                            </div>    
                        </div>
                        <div className='table-responsive'>
                            <table className={styles.tblrequest + ' ' + styles.tablebordered}>
                              <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>GL Code</th>
                                    <th>Cost Center</th>
                                    <th>Profit Center</th>
                                    <th>Plant</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                    <th>GST %</th>
                                    <th>GST Amount</th>
                                    <th>Total Amount</th>
                                    <th>Action</th>
                                </tr>
                              </thead>
                               <tbody>
                              {
                                            PRItemColl.map((PRItemObj) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {PRItemObj.ItemName}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.GLCode}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.CostCenter}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.ProfitCenter}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.Plant}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.Quantity}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.Amount}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.GST}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.GSTAmount}
                                                        </td>
                                                        <td>
                                                            {PRItemObj.TotalAmount}
                                                        </td>
                                                        <td>
                                                            <button onClick={handleItemDelete.bind(PRItemObj.Id)} className={styles.btndefault}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td>
                                            <input id='txtPRItemName' type='text' className={styles.inputwidth} {...getFieldProps(formik, 'ItemName')}></input>
                                            </td>
                                            <td>
                                            <select id='ddlGLCode'  {...getFieldProps(formik, 'GLCodeId')}>
                                                <option value="">Select</option>
                                                {GLCodeColl.map((GL) => <option key={GL.Id} value={GL.Id}>{GL.GLCodeDescription}</option>)}
                                            </select>
                                            </td>
                                            <td>
                                            <select id='ddlCostCenter' value={selectedCompId} {...getFieldProps(formik, 'CostCenterId')}>
                                                <option value="">Select</option>
                                                {CostCenterColl.map((CostC) => <option key={CostC.Id} value={CostC.Id}>{CostC.CostCenter}</option>)}
                                            </select>
                                            </td>
                                            <td>
                                            <select id='ddlProfit' value={selectedCompId} {...getFieldProps(formik, 'ProfitCId')}>
                                            <option value="">Select</option>
                                            {ProfitCenterColl.map((ProfitCenter) => <option key={ProfitCenter.Id} value={ProfitCenter.Id}>{ProfitCenter.ProfitCenterName}</option>)}
                                        </select>
                                            </td>
                                            <td>
                                            <select id='ddlPlant' value={selectedCompId} {...getFieldProps(formik, 'PlantId')}>
                                            <option value="">Select</option>
                                            {PlantColl.map((Plant) => <option key={Plant.Id} value={Plant.Id}>{Plant.Plant}</option>)}
                                        </select>
                                            </td>
                                            <td>
                                            <input id='txtQuantity' type='number' className={styles.inputwidth} {...getFieldProps(formik, 'Quanity')}></input>
                                            </td>
                                            <td>
                                            <input id='txtAmount' type='number' className={styles.inputwidth} {...getFieldProps(formik, 'Amount')} ></input>
                                            </td>
                                            <td>
                                            <select id='ddlGST'  {...getFieldProps(formik, 'GSTId')} onChange={async (e) => {
                                                formik.setFieldValue('GSTId', e.target.value);
                                                await onGSTChange(e, formik.values);
                                                formik.handleChange("ddlGST");
                                            }} >
                                                <option value="">Select</option>
                                                {GSTColl.map((GST) => <option key={GST.GST} value={GST.GST}>{GST.GST}</option>)}
                                            </select>
                                            </td>
                                            <td>
                                            <label id='txtGSTAMount' {...getFieldProps(formik, 'GSTAmt')}>{GStDetail !== undefined ? GStDetail : ''}</label>
                                            </td>
                                            <td>
                                            <label id='txtTotAMount' {...getFieldProps(formik, 'TotalAmt')}>{TotalAmount !== undefined ? TotalAmount : ''}</label>
                                            </td>
                                            <td className='d-flex'>
                                            <PrimaryButton type='submit' className={styles.btnprimary} text="Add" onClick={async () => {
                                                formik.setFieldValue("condition", "Draft");
                                                formik.values.condition = "Draft";
                                                formik.values.isDraft = true;
                                                await formik.validateForm().then(async (frmResult) => {
                                                    if (Object.keys(frmResult).length <= 0) {
                                                        await onAddNewRow(formik.values,GStDetail,TotalAmount);
                                                    }
                                                });
                                            }}></PrimaryButton>
                                            {/* <PrimaryButton type='submit' className={styles.btnprimary} text="Remove" ></PrimaryButton> */}
                                            </td>
                                        </tr>
                        </tbody>
                             
                            </table>
                            
                        </div>
                        <div style={{ marginTop: '50px' }}>
                            <Stack horizontal wrap tokens={{ childrenGap: 10, maxWidth: '100%', padding: '0px' }} style={{ width: '100%' }}>
                                <Stack.Item grow align='center' style={{ textAlign: 'center' }} tokens={{ padding: '0px', margin: '0px' }}>
                                    <DefaultButton type='submit' className={styles.btndefault} text="Save As Draft"
                                        onClick={async () => {
                                            formik.setFieldValue("condition", "Draft");
                                            formik.values.condition = "Draft";
                                            formik.values.isDraft = true;
                                            await formik.validateForm().then(async (frmResult) => {
                                                //formik.isValid && 
                                                if (Object.keys(frmResult).length <= 0) {
                                                    await onRequestInitiate(formik.values);
                                                }
                                            });
                                        }} value={'Draft'} iconProps={{ iconName: 'SaveAs' }} />
                                    <PrimaryButton type='submit' className={styles.btnprimary} text="Submit"
                                        onClick={async () => {
                                            formik.setFieldValue("condition", "Submitted");
                                            formik.values.condition = "Submitted";
                                            formik.values.isDraft = false;
                                            await formik.validateForm().then(async (frmResult) => {
                                                //formik.isValid && 
                                                if (Object.keys(frmResult).length <= 0) {
                                                    await onRequestInitiate(formik.values);
                                                }
                                            });
                                        }} value={'Submitted'} iconProps={{ iconName: 'Save' }} />
                                    <Link to='/'>
                                        <PrimaryButton text="Cancel" className={styles.btndefault} iconProps={{ iconName: 'Cancel' }} />
                                    </Link>
                                </Stack.Item>
                            </Stack>
                            {/* <button id='btnSaveDraft'>Save as Draft</button>
                            <button id='btnSave'>Save</button>
                            <button id='btncancel'>Cancel</button> */}
                        </div>
                    </div>
                )
            }
        </Formik>

        // <div>
        //     Vedant
        // </div>
    );
}
