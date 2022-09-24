import * as React from 'react';
import { useState, useMemo } from 'react';
import * as ReactDOM from 'react-dom';
import styles from '../PurchaseRequisitions.module.scss';
import { IPurchaseRequisitionsProps } from '../IPurchaseRequisitionsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import USESPCRUD, { ISPCRUD } from '../../../services/bal/spcrud';
import PurchaseRequisitionOps from '../../../services/bal/PurchaseRequisition';
import { IPurchaseRequisition } from '../../../services/interface/IPurchaseRequisition';
import VendorOps from '../../../services/bal/Vendor';
import { IVendor } from '../../../services/interface/IVendor';
import CompanyOps from '../../../services/bal/Comapny';
import { ICompany } from '../../../services/interface/ICompany';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { Formik, FormikProps, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
import { DetailsList, IColumn, DetailsListLayoutMode, DetailsHeader, IDetailsHeaderProps, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import ReactPaginate from 'react-paginate';
import {
  Stack, IStackTokens, ITag, TagPicker, IBasePickerSuggestionsProps, IBasePicker, IInputProps, Checkbox, TextField
  , FontIcon, ConstrainMode
  , PrimaryButton, ICheckboxProps, MessageBar, MessageBarType, DefaultButton
} from '@fluentui/react';
import { Label } from '@fluentui/react/lib/Label';
import { Link } from 'react-router-dom';

export const FinanceApprovalDashboard: React.FunctionComponent<IPurchaseRequisitionsProps> = (props: IPurchaseRequisitionsProps) => {
  const [spCrud, setSPCRUD] = React.useState<ISPCRUD>();
  const [EmployeeColl, setEmployeeMaster] = React.useState<IPurchaseRequisition[]>([]);
  const [VendorColl, setVendor] = React.useState<IVendor[]>([]);
  const [CompanyColl, setCompany] = React.useState<ICompany[]>([]);
  const [employeeDetail, setEmployeeDetail] = React.useState<IPurchaseRequisition>();
  const [PurchaseRequestsColl, setPurchaseRequests] = React.useState<IPurchaseRequisition[]>();
  const [paginatedPurchaseRequestsColl, setPaginatedPurchaseRequestsColl] = React.useState<IPurchaseRequisition[]>();
  const [PurchaseRequestsFilter, setPurchaseRequestsFilter] = React.useState<IPurchaseRequisition[]>();
  const pickerCustomer = React.useRef<IBasePicker<ITag>>(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [Columns, setCoulmns] = React.useState<IColumn[]>();

  const [paginationConfig, setPaginationConfig] = React.useState<{
    currentPage?: number
    , itemPerPage?: number
    , indexOfLastItem?: number
    , indexOfFirstItem?: number
    , totalPages?: number
  }>({
    currentPage: 1
    , itemPerPage: 10
    , indexOfLastItem: (1 * 10)//currentPage * itemPerPage
    , indexOfFirstItem: 10 - 10 //indexOfLastItem - itemPerPage
    , totalPages: 0
  });

  let spCrudObj: ISPCRUD;
  let itemsPerPage: number;
  itemsPerPage = 5;


  const getPurchaseRequisitions = async (): Promise<IPurchaseRequisition[]> => {
    spCrudObj = await USESPCRUD(); 

    setSPCRUD(spCrudObj);
    return await PurchaseRequisitionOps().getPurchaseRequisitions("NextApproversId eq " + props.currentSPContext.pageContext.legacyPageContext.userId + " and ApproverStatus eq 'Pending'"
      , { column: 'Id', isAscending: false }, props).then(brrResults => {
        setPurchaseRequests(brrResults);
        setPaginatedPurchaseRequestsColl(brrResults);
        // Fetch items from another resources.
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        if (brrResults !== undefined) {
          setPaginatedPurchaseRequestsColl(brrResults.slice(itemOffset, endOffset));
          setPageCount(Math.ceil(brrResults.length / itemsPerPage));
        }
        return brrResults;
      });
  };

  function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
  }


  React.useEffect(() => {
    getPurchaseRequisitions().then((brrColl) => {
      console.log(brrColl);

    }, error => {
      console.log(error);
    });


  }, []);

  React.useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    if (PurchaseRequestsColl !== undefined) {
      setPaginatedPurchaseRequestsColl(PurchaseRequestsColl.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(PurchaseRequestsColl.length / itemsPerPage));
    }
  }, [itemOffset, itemsPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % PurchaseRequestsColl.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  function _getPage(pageNo: number) {
    let iLastItem = (pageNo * paginationConfig.itemPerPage);
    setPaginationConfig({
      currentPage: pageNo
      , itemPerPage: paginationConfig.itemPerPage
      , indexOfLastItem: iLastItem
      , indexOfFirstItem: iLastItem - paginationConfig.itemPerPage
      , totalPages: Math.ceil(PurchaseRequestsFilter.length / paginationConfig.itemPerPage)
    });
  }
  return (

    <div >
      <div className='py-2'>
        <h1 className={styles.heading}>Finance Approver Dashboard</h1>

        {paginatedPurchaseRequestsColl !== undefined && paginatedPurchaseRequestsColl.length > 0 ?
          <div>
            <table className={styles.tblrequest + ' ' + styles.tablebordered}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Company ID</th>
                  <th>Vendor Name</th>
                  <th>Request Header</th>
                </tr>
              </thead>
              <tbody>
              {paginatedPurchaseRequestsColl.map((purchaseReqObj) =>
              <tr>
                <td>
                <Link to={'/FAPR/' + purchaseReqObj.Id}>{purchaseReqObj.Id}</Link>
                </td>
                <td>{purchaseReqObj.CompanyName}</td>
                <td>{purchaseReqObj.VendorName}</td>
                <td>{purchaseReqObj.RequestHeader}</td>
              </tr>
            )}

              </tbody>
            </table>
          </div>
          :
          <MessageBar>
            No requests found.
          </MessageBar>
        }
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="Previous"
        renderOnZeroPageCount={null}
        className={styles.pagination}
      />
    </div>
  );

}
