import * as React from "react";
import { Table } from "antd";
import {
  MarketingListResponse,
  MarketingModel,
} from "../../../redux-logic/marketing/Type";
import {
  fetchMarketingListByPagination,
  BasePaginationWithFilter,
} from "../../../redux-logic/marketing/Action";
import { AppState } from "../../../redux-logic/Store";
import { connect } from "react-redux";
import LayoutManagement from "../../../components/management/layout/LayoutManagement";
import { pathProject } from "../../../service/constants/defaultValues";

export interface IAppProps {
  marketingListResponse: MarketingListResponse;
  fetchMarketingListByPagination: any;
}

class Marketing extends React.Component<IAppProps> {
  columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Survey Status",
      key: "x",
      render: (marketing: MarketingModel) => {
        return marketing.taxes.map((tax: string) => {
          return <div className="row">{tax}</div>;
        });
      },
    },
    {
      title: "Appointments",
      key: "x",
      render: (marketing: MarketingModel) => {
        return marketing.appointments.map((appointment: string) => {
          return <div className="row">{appointment}</div>;
        });
      },
    },
    {
      title: "Payment Status",
      key: "x",
      render: (marketing: MarketingModel) => {
        return marketing.invoices.map((tax: string) => {
          return <div className="row">{tax}</div>;
        });
      },
    },
  ];

  listRequestBody: BasePaginationWithFilter = {
    pageNumber: 0,
    pageSize: 10,
  };

  firstTime: boolean = false;
  render() {
    if (!this.firstTime) {
      this.firstTime = true;
      this.props.fetchMarketingListByPagination(this.listRequestBody);
    }

    return (
      <LayoutManagement pagePath={pathProject.management.marketing}>

      <div>
        <div className="row">
          <div className="col-sm-12 col-md-3 text-left">
            <h3 className="mt-2 grid-title">Marketing</h3>
          </div>
        </div>

        <div className="card">
          <div className="crud-theme-one">
            <Table
              columns={this.columns}
              dataSource={this.props.marketingListResponse.items}
              loading={!this.props.marketingListResponse.success}
              pagination={{
                current: this.listRequestBody.pageNumber + 1,
                pageSize: this.listRequestBody.pageSize,
                onChange: (page: number, pageSize: any) => {
                  this.listRequestBody = {
                    pageNumber: page,
                    pageSize: 10,
                  };
                  this.props.fetchMarketingListByPagination(
                    this.listRequestBody
                  );
                },
              }}
            />
          </div>
        </div>
      </div>
      </LayoutManagement>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    marketingListResponse: state.fetchMarketingList,
  };
}

export default connect(mapStateToProps, { fetchMarketingListByPagination })(
  Marketing
);
