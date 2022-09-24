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
// import Pagination from '../react-pagination/src/Pagination';
// import Pagination from '../react-pagination/src/pagination';
//import Pagination from '../../react-pagination/src/Pagination';
// import Pagination from '../Pagination';
import { Formik, FormikProps, ErrorMessage, Field } from 'formik';
import * as yup from 'yup';
//import PropTypes from 'prop-types';
import { DetailsList, IColumn, DetailsListLayoutMode, DetailsHeader, IDetailsHeaderProps, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import ReactPaginate from 'react-paginate';

// import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import {
  Stack, IStackTokens, ITag, TagPicker, IBasePickerSuggestionsProps, IBasePicker, IInputProps, Checkbox, TextField
  , FontIcon, ConstrainMode
  , PrimaryButton, ICheckboxProps, MessageBar, MessageBarType, DefaultButton
} from '@fluentui/react';
import { Label } from '@fluentui/react/lib/Label';
import { Link } from 'react-router-dom';

export const InitiatorDashboard: React.FunctionComponent<IPurchaseRequisitionsProps> = (props: IPurchaseRequisitionsProps) => {
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
  const _getKey = (item: any, index?: number): string => {
    return item.key;
  };
  const _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    let draftCols: IColumn[];
    let draftBlockReleaseReq: IPurchaseRequisition[];
    setCoulmns(previous => { draftCols = previous; return draftCols; });
    setPurchaseRequestsFilter(previous => { draftBlockReleaseReq = previous; return draftBlockReleaseReq });

    const newColumns: IColumn[] = draftCols.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(draftBlockReleaseReq, currColumn.fieldName === "Title" ? "Id"! : currColumn.fieldName!
      , !currColumn.isSortedDescending);
    setPurchaseRequestsFilter(newItems);
    setCoulmns(newColumns);
  };
  const _Columns: IColumn[] = [
    {
      key: 'column1', name: 'Request ID', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true, isSorted: true
      , isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A', onColumnClick: _onColumnClick
    },
    {
      key: 'column2', name: 'Company Name', fieldName: 'CompanyName', minWidth: 200, maxWidth: 200, isResizable: true
      , isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A', onColumnClick: _onColumnClick
    },
    {
      key: 'column3', name: 'Vendor name', fieldName: 'VendorName', minWidth: 100, maxWidth: 200, isResizable: true
      , isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A', onColumnClick: _onColumnClick
    },
    {
      key: 'column4', name: 'RequestHeader', fieldName: 'RequestHeader', minWidth: 100, maxWidth: 200, isResizable: true
      , isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A', onColumnClick: _onColumnClick
    },
    {
      key: 'column5', name: 'RequestType', fieldName: 'RequestType', minWidth: 100, maxWidth: 200, isResizable: true
      , isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A', onColumnClick: _onColumnClick
    }
    // {
    //     key: 'column6', name: 'Status', fieldName: 'Condition', minWidth: 100, maxWidth: 200, isResizable: true
    //     , isSortedDescending: false,
    //     sortAscendingAriaLabel: 'Sorted A to Z',
    //     sortDescendingAriaLabel: 'Sorted Z to A', onColumnClick: _onColumnClick
    // },
    // {
    //     key: 'column7', name: 'Action', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true
    //     , onRender: (item: any, index: number, column: IColumn) => {
    //         const brId = item['Id'];
    //         return <div>
    //             <Link to={'/EditBRR/' + brId}>
    //                 <FontIcon iconName="PageEdit" className={styles.icon} />
    //             </Link>
    //             &nbsp;&nbsp;&nbsp;
    //             <Link to={'/View/' + brId}>
    //                 <FontIcon iconName="View" className={styles.icon} />
    //             </Link>
    //         </div>;
    //     }
    // }
  ];

  const _onItemInvoked = (item: IPurchaseRequisition): void => {
    //alert(`Item invoked: ${item.CustomerName}`);
  };
  // const getPurchaseRequisitions = async (): Promise<IPurchaseRequisition[]> => {
  //   spCrudObj = await USESPCRUD();

  //   setSPCRUD(spCrudObj);
  //   return await PurchaseRequisitionOps().getPurchaseRequisitions("InitiatedById eq " + props.currentSPContext.pageContext.legacyPageContext.userId + ""
  //     , { column: 'Id', isAscending: false }, props).then(brrResults => {
  //       setPurchaseRequests(brrResults);
  //       setPurchaseRequestsFilter(brrResults.sort((a, b) => (((new Date(b.ModifiedOn).getTime() * 10000) + 621355968000000000) - ((new Date(a.ModifiedOn).getTime() * 10000) + 621355968000000000))));
  //       setCoulmns(_Columns);
  //       setPaginationConfig({
  //         currentPage: paginationConfig.currentPage
  //         , itemPerPage: paginationConfig.itemPerPage
  //         , indexOfLastItem: (paginationConfig.currentPage * paginationConfig.itemPerPage)
  //         , indexOfFirstItem: paginationConfig.indexOfLastItem - paginationConfig.itemPerPage
  //         , totalPages: Math.ceil(brrResults.length / paginationConfig.itemPerPage)
  //       });
  //       return brrResults;
  //     });
  // };
  const getPurchaseRequisitions = async (): Promise<IPurchaseRequisition[]> => {
    spCrudObj = await USESPCRUD();

    setSPCRUD(spCrudObj);
    return await PurchaseRequisitionOps().getPurchaseRequisitions("InitiatedById eq " + props.currentSPContext.pageContext.legacyPageContext.userId + ""
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

      //Utilities().hideShow(true, props.currentSPContext, 'approve or reject block requests');
    });


  }, []);

  React.useEffect(() => {
    // Fetch items from another resources.
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
        <h1 className={styles.heading}> Initiator Dashboard </h1>

        {paginatedPurchaseRequestsColl !== undefined && paginatedPurchaseRequestsColl.length > 0 ?
          // <DetailsList
          //     items={PurchaseRequestsFilter !== undefined ? PurchaseRequestsFilter.slice(paginationConfig.indexOfFirstItem, paginationConfig.indexOfLastItem) : []}
          //     compact={true}
          //     columns={Columns !== undefined ? Columns : _Columns}
          //     selectionMode={SelectionMode.none}
          //     getKey={_getKey}
          //     setKey="none"
          //     layoutMode={DetailsListLayoutMode.justified}
          //     onItemInvoked={_onItemInvoked}
          //     //onRenderDetailsHeader={renderDetailsHeader}
          // />
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
           {paginatedPurchaseRequestsColl.sort((a, b) => b.Id - a.Id).map((purchaseReqObj) =>
              <tr>               
                <td>
                <Link className={styles.linkcolor} to={'/PRView/' + purchaseReqObj.Id}>{purchaseReqObj.Id}</Link>
                </td>
                <td>
                  {purchaseReqObj.CompanyName}
                  </td>
                <td>
                  {purchaseReqObj.VendorName}
                  </td>
                <td>
                  {purchaseReqObj.RequestHeader}
                  </td>
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
      {/* <Pagination
        currentPage={paginationConfig.currentPage}
        totalPages={paginationConfig.totalPages}
        onChange={(page) => _getPage(page)}
        limiter={3} // Optional - default value 3
        hideFirstPageJump={PurchaseRequestsFilter === undefined ? true : !(PurchaseRequestsFilter.length > 0)}
        hideLastPageJump={PurchaseRequestsFilter === undefined ? true : !(PurchaseRequestsFilter.length > 0)}
      /> */}
    </div>
  );

}
