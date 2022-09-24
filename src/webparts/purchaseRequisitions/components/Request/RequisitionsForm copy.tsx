import * as React from 'react';
import styles from '../PurchaseRequisitions.module.scss';
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
// import ProfitCenterOps from '../../../services/bal/ProfitCenter';
// import { IProfitCenter } from '../../../services/interface/IProfitCenter';
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
    // const [ProfitCenterColl, setProfitCenter] = React.useState<IProfitCenter[]>([]);
    const [GSTColl, setGST] = React.useState<IGST[]>([]);
    const [CostCenterColl, setCostcenter] = React.useState<ICostCenter[]>([]);
    const [employeeDetail, setEmployeeDetail] = React.useState<IEmployeeMaster>();
    const [selectedVendorId, setSelectedVendorId] = React.useState<string>();
    const [selectedGSTId, setSelectedGSTId] = React.useState<string>();
    //const [PRItemColl, setSelectedPRItem] = React.useState<string>();
    const [success, setSuccess] = React.useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
    const [selectedCompId, setSelectedCompId] = React.useState<string>();
    const [VendorDetail, setVendorDetail] = React.useState<IVendor>();
    const [GSTId, setGSTId] = React.useState<IGST>();
    const [GStDetail, setGstAmount] = React.useState<number>();
    const [TotalAmount, setTotalAmount] = React.useState<number>();
    const [CalcuatedVal, setCalcuatedVal] = React.useState<PRItems[]>([]);
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

    // //get Data from Vendor Master
    // const getProfitCenterMaster = async () => {
    //     return await ProfitCenterOps().getProfitCenterMaster(props).then(results => {
    //         setProfitCenter(results);
    //         return results;
    //     });
    // };

    //get Data from Company Master
    const getComapny = async () => {
        return await CompanyOps().getComapnyMaster(props).then(results => {
            setCompany(results);
            return results;
        });
    };

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

    const getGSTId = async (GSTId) => {
        return await GSTOps().getGSTId(GSTId, props).then(results => {
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


    const onAddNewRow = async (formValues: any,GSTAmount,TotalAmount) => {
        let prItemColl: PRItems[];
        await getGSTId(formValues.GSTId);
        

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
            GLCode: formValues.GLCodeId,
            CostCenter: formValues.CostCenterId,
            CostCenterId: formValues.CostCenterId,
            ProfitCenter: "",
            ProfitCenterId: 0,
            PlantId: 0,
            Plant: "",
            Quantity: formValues.Quanity,
            Amount: formValues.Amount,
            GST: formValues.GSTId,
            GSTId: 0,
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
        GSTAmount='';
        //GStDetail='';
        TotalAmount='';
        //TotalAmount('');
        setCalcuatedVal(null);
        setTotalAmount(null);
        //setGLCode(null);
        //await getGLCode();

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
        //alert(props.currentSPContext.pageContext.legacyPageContext.userId);
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

        // getProfitCenterMaster().then(GLResult => {
        //     console.log(ProfitCenterColl);
        // }, error => {
        //     console.log(error);
        // });

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
        isDraft: false

    };

    function getFieldProps(formik: FormikProps<any>, field: string) {
        return { ...formik.getFieldProps(field), errorMessage: formik.errors[field] as string };
    }

    async function onRequestInitiate(formValues: any) {

        setIsSubmitted(true);
        spCrudObj = await USESPCRUD();
        setSPCRUD(spCrudObj);
        await EmployeeOps().getEmployeeMasterId(props.currentSPContext.pageContext.legacyPageContext.userId, props).then(async (empResult) => {

            let PRRequest: any = {
                'EmployeeID': employeeDetail.EmployeeID
                , 'RequestHeader': formValues.Requestheader
                , 'RequestDescription': formValues.ReqDesc
                , 'RequestType': formValues.ReqType
                , 'RequestDate': formValues.ReqDate
                , 'RequestFor': formValues.ReqFor
                // ,'OnBehalf':
                , 'CompanyNameId': parseInt(formValues.CompNameId)
                , 'VendorNameId': selectedVendorId
                , 'VendorAddress': VendorDetail.VendorAddress1
                , 'VendorStateOrSite': formValues.StateName
                , 'DeliveryLocation': formValues.DelLoc
                , 'VendorEstimateNoOrProformaInvoic': formValues.VenEstNo
                , 'InitiatedById': props.currentSPContext.pageContext.legacyPageContext.userId
                , 'ReportingManagerId':employeeDetail.ReportingManagerId

            };

            console.log(formValues);
            console.log(PRRequest);
            //return false;

            await spCrudObj.insertData("PurchaseRequisitions", PRRequest, props).then(async (brrInsertResult) => {
                console.log(brrInsertResult);
                let brPRItemColl = [];
                let index=1;
                for (let n = 0; n < PRItemColl.length; n++) {
                    let PRItem: any = {
                        ItemName: PRItemColl[n].ItemName
                        , RequestIDId: brrInsertResult.data.Id
                        , GLCodeId: PRItemColl[n].GLCodeId
                        , CostCenterId: PRItemColl[n].CostCenter
                        , Quantity: ''+PRItemColl[n].Quantity
                        , Amount: ''+PRItemColl[n].Amount
                        //, GST: PRItemColl[n].GST
                        //, GSTId: PRItemColl[n].GST
                        , GSTAmount: ''+PRItemColl[n].GSTAmount
                        , TotalAmount: ''+PRItemColl[n].TotalAmount
                    };
                    index++;
                    await spCrudObj.insertData("PRItems", PRItem, props).then(async (brPRItemInsertResult) => {
                        console.log(brPRItemInsertResult);
                        if(PRItemColl.length===index)
                        {
                            alert('Added');
                            window.location.reload();
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
                <div className="col-xs-1 col-sm-1 col-md-1">
                    {PRItemObj.CostCenter}
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
                    <div>Initiate Request
                        <div className="row">
                            <h2>Requester Details</h2>
                             
                                <div className="col-md-6">
                                    <div>Requester Name :-</div>

                                    <label id='lblRequesterN' >{employeeDetail !== undefined ? employeeDetail.EmployeeName : ''}</label>
                                </div>
                                <div className="col-md-6">
                                    <div>Department :-</div>
                                    <label id='lblDepartment' >{employeeDetail !== undefined ? employeeDetail.Department : ''}</label>
                                </div>
                            
                            
                            <div className="col-md-6">
                                <div>Employee ID :-</div>
                                <label id='lblEmployeeID' >{employeeDetail !== undefined ? employeeDetail.EmployeeID : ''}</label>
                            </div>
                            <div className="col-md-6">
                                <div>Manager :-</div>
                                <label id='lblManager' >{employeeDetail !== undefined ? employeeDetail.ReportingManager : ''}</label>
                            </div>
                        </div>
                        <div>
                            <h2>PR Request Deatils</h2>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div>Request Header :-</div>
                                    <div>
                                        <input type='text' id='txtReqHeader' {...getFieldProps(formik, 'Requestheader')}></input>
                                    </div>
                                    
                                </div>
                                <div className='col-md-6'>
                                    <div>Request Description :-</div>
                                    <div>
                                        <textarea id='txtReqDesc' {...getFieldProps(formik, 'ReqDesc')}></textarea>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                <div>Request Type :-</div>
                            <div>
                                <select id='ddlRequestType' {...getFieldProps(formik, 'ReqType')}>
                                    <option >Select</option>
                                    <option value="Media Bills">Media Bills</option>
                                    <option value="Non Media Bills">Non Media Bills</option>
                                </select>
                            </div>
                                </div>
                                <div className='col-md-6'>
                                    <div>Request Date :-</div>
                                        <div>
                                            <input id='dtreqDt' type='date' {...getFieldProps(formik, 'ReqDate')}></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Request for :-</div>
                                        <div>
                                            <select id='ddlRequestFor' {...getFieldProps(formik, 'ReqFor')}>
                                                <option >Select</option>
                                                <option id='Self'>Self</option>
                                                <option id='Vendor'>Vendor</option>
                                                <option id='Others'>Others</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>On Behalf :-</div>
                                        <div>
                                            <input id='txtonBehalf' type='text' {...getFieldProps(formik, 'OnBehalf')}></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Request Number :-</div>
                                        <div>
                                            <input id='txtReqNo' type='text' readOnly ></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Company Name :-</div>
                                        <div>
                                            <select id='ddlCompN' value={selectedCompId} {...getFieldProps(formik, 'CompNameId')}>
                                                <option value="">Select</option>
                                                {CompanyColl.map((comp) => <option key={comp.Id} value={comp.Id}>{comp.CompanyName}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                    <div>Vendor Name :-</div>
                                        <div>
                                            <select id='ddlVendor' name='ddlVendor' value={selectedVendorId}
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
                                            <input id='txtDeliverLoc' type='text' {...getFieldProps(formik, 'DelLoc')}></input>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div>Vendor Estimate No :-</div>
                                        <div>
                                            <input id='txtVendorEstNo' type='text' {...getFieldProps(formik, 'VenEstNo')}></input>
                                        </div>
                                    </div>
                            </div>    
                        </div>
                        <div >
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <div className="row document-heading">
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <span>Item Name</span>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <span>GL Code</span>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1"  >

                                            <span>Cost Center</span>
                                        </div>
                                        {/* <div className="col-xs-1 col-sm-1 col-md-1">
                                        <span>Profit Center</span>
                                    </div> */}
                                        {/* <div className="col-xs-2 col-sm-2 col-md-2"  >
                                        <span>Plant</span>
                                    </div> */}
                                        <div className="col-xs-1 col-sm-1 col-md-1"  >
                                            <span>Quantity</span>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1"  >
                                            <span>Amount</span>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <span> GST %</span>
                                        </div>
                                        <div className="col-xs-2 col-sm-2 col-md-1">
                                            <span>GST Amount</span>
                                        </div>
                                        <div className="col-xs-2 col-sm-2 col-md-1">
                                            <span>Total Amount</span>
                                        </div>
                                        <div className="col-xs-2 col-sm-2 col-md-1">
                                            <span>Action</span>
                                        </div>

                                    </div>
                                    <div className="row document-heading">
                                        {
                                            PRItemColl.map((PRItemObj) => {
                                                return (
                                                    <div >
                                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                                            {PRItemObj.ItemName}
                                                        </div>
                                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                                            {PRItemObj.GLCode}
                                                        </div>
                                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                                            {PRItemObj.CostCenter}
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
                                                            <button onClick={handleItemDelete.bind(PRItemObj.Id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div className="row grid-style rowItem document-content">
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <input id='txtPRItemName' type='text' {...getFieldProps(formik, 'ItemName')}></input>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <select id='ddlGLCode'  {...getFieldProps(formik, 'GLCodeId')}>
                                                <option value="">Select</option>
                                                {GLCodeColl.map((GL) => <option key={GL.Id} value={GL.Id}>{GL.GLCodeDescription}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <select id='ddlCostCenter' value={selectedCompId} {...getFieldProps(formik, 'CostCenterId')}>
                                                <option value="">Select</option>
                                                {CostCenterColl.map((CostC) => <option key={CostC.Id} value={CostC.Id}>{CostC.CostCenter}</option>)}
                                            </select>
                                        </div>
                                        {/* <div className="col-xs-1 col-sm-1 col-md-1">
                                        <select id='ddlProfit' value={selectedCompId} {...getFieldProps(formik, 'ProfitCId')}>
                                            <option value="">Select</option>
                                            {ProfitCenterColl.map((ProfitCenter) => <option key={ProfitCenter.Id} value={ProfitCenter.Id}>{ProfitCenter.ProfitCenterName}</option>)}
                                        </select>
                                    </div> */}
                                        {/* <div className="col-xs-2 col-sm-2 col-md-2">
                                        <select id='ddlGLCode' value={selectedCompId} {...getFieldProps(formik, 'GLCodeId')}>
                                            <option value="">Select</option>
                                            {CompanyColl.map((comp) => <option key={comp.Id} value={comp.Id}>{comp.CompanyName}</option>)}
                                        </select>
                                    </div> */}
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <input id='txtQuantity' type='number' {...getFieldProps(formik, 'Quanity')}></input>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <input id='txtAmount' type='number' {...getFieldProps(formik, 'Amount')} ></input>
                                        </div>
                                        <div className="col-xs-1 col-sm-1 col-md-1">
                                            <select id='ddlGST' value={selectedCompId} {...getFieldProps(formik, 'GSTId')} onChange={async (e) => {
                                                formik.setFieldValue('GSTId', e.target.value);
                                                await onGSTChange(e, formik.values);
                                                formik.handleChange("ddlGST");
                                            }} >
                                                <option value="">Select</option>
                                                {GSTColl.map((GST) => <option key={GST.GST} value={GST.GST}>{GST.GST}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-xs-2 col-sm-2 col-md-1">
                                            <label id='txtGSTAMount' {...getFieldProps(formik, 'GSTAmt')}>{GStDetail !== undefined ? GStDetail : ''}</label>
                                            
                                        </div>
                                        <div className="col-xs-2 col-sm-2 col-md-1">
                                            <label id='txtTotAMount' {...getFieldProps(formik, 'TotalAmt')}>{TotalAmount !== undefined ? TotalAmount : ''}</label>

                                        </div>
                                        <div className="col-xs-2 col-sm-2 col-md-1">
                                            <PrimaryButton type='submit' text="Add" onClick={async () => {
                                                formik.setFieldValue("condition", "Draft");
                                                formik.values.condition = "Draft";
                                                formik.values.isDraft = true;
                                                await formik.validateForm().then(async (frmResult) => {
                                                    if (Object.keys(frmResult).length <= 0) {
                                                        await onAddNewRow(formik.values,GStDetail,TotalAmount);
                                                    }
                                                });
                                            }}></PrimaryButton>
                                            <PrimaryButton type='submit' text="Remove" ></PrimaryButton>
                                            {/* <i className="fa fa-plus-square  fa-2x"  style={{color: '#1a8f49'}}
                                            onClick={()=> {onAddNewRow(formik.values)}}></i>
                                        <i className="fa fa-minus-square fa-2x" aria-hidden="true" style={{color: '#dc3545', cursor: 'pointer'}}
                                            onClick={()=> {onAddNewRow(formik.values)}}></i>                                   */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '50px' }}>
                            <Stack horizontal wrap tokens={{ childrenGap: 10, maxWidth: '100%', padding: '0px' }} style={{ width: '100%' }}>
                                <Stack.Item grow align='center' style={{ textAlign: 'center' }} tokens={{ padding: '0px', margin: '0px' }}>
                                    <DefaultButton type='submit' text="Save As Draft"
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
                                    <PrimaryButton type='submit' text="Submit"
                                        onClick={async () => {
                                            formik.setFieldValue("condition", "Pending");
                                            formik.values.condition = "Pending";
                                            formik.values.isDraft = false;
                                            await formik.validateForm().then(async (frmResult) => {
                                                //formik.isValid && 
                                                if (Object.keys(frmResult).length <= 0) {
                                                    await onRequestInitiate(formik.values);
                                                }
                                            });
                                        }} value={'Pending'} iconProps={{ iconName: 'Save' }} />
                                    <Link to='/'>
                                        <PrimaryButton text="Cancel" iconProps={{ iconName: 'Cancel' }} />
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
