import * as React from 'react';
import styles from './PurchaseRequisitions.module.scss';
import { IPurchaseRequisitionsProps } from './IPurchaseRequisitionsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import useSPCRUD, { ISPCRUD } from '../../services/bal/spcrud';
import { BrowserRouter as Router, Routes, Route, Link, HashRouter, useParams } from 'react-router-dom';
import { InitiatorDashboard } from './Request/InitiatorDashboard';
import { RequisitionsForm } from './Request/RequisitionsForm';
import { ApprovalDashboard } from './Approval/ApprovalDashboard';
import { FinanceApprovalDashboard } from './FinanceApproval/FinanceApprovalDashboard';
import { FinanceApproverForm } from './FinanceApproval/FinanceApproverForm';
import { ApproverForm } from './Approval/ApproverForm';
import { RequisitionViewForm } from './Request/RequisitionViewForm';
import EmployeeOps from '../../services/bal/EmployeeMaster';
require ('../assets/style.css');
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

export default class PurchaseRequisitions extends React.Component<IPurchaseRequisitionsProps, {}> {

  public render(): React.ReactElement<IPurchaseRequisitionsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.purchaseRequisitions} ${hasTeamsContext ? styles.teams : ''}`}>
        <HashRouter>
          <div className='wrapper'>
            <div className='sidebar'>
              <ul>
                <li>
                  <Link to="/">Dashboard</Link>
                </li>
                <li>
                  <Link to="/request">Request</Link>
                </li>
                <li>
                  <Link to="/Approval">Manager Approval</Link>
                </li>
                <li>
                  <Link to="/FApproval">Finance Approval</Link>
                </li>
              </ul>
            </div>
            <div className='main'>
             <div className='content'>
              <Routes>
                <Route path="/" element={<InitiatorDashboard {...this.props} />} />
                <Route path="/request" element={<RequisitionsForm {...this.props} />} />
                <Route path="/Approval" element={<ApprovalDashboard {...this.props} />} />
                <Route path='/AFPR/:PRId' element={<ApproverForm  {...this.props} />} />
                <Route path="/FApproval" element={<FinanceApprovalDashboard {...this.props} />} />
                <Route path='/FAPR/:PRId' element={<FinanceApproverForm  {...this.props} />} />
                <Route path='/PRView/:PRId' element={<RequisitionViewForm  {...this.props} />} />
              </Routes>
              </div>
            </div>
          </div>

        </HashRouter>
      </section>
    );
  }
}
function props(props: any) {
  throw new Error('Function not implemented.');
}

