import * as React from "react";
import { BulkSchedulerWidget } from "./bulk_scheduler/index";
import { RegimensList } from "./list/index";
import { RegimenEditorWidget } from "./editor/index";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";
import { MobileRegimensNav } from "./mobile_nav";
import { RegimenPropsWithParams } from "./interfaces";
import { Page, Row, Col } from "../ui/index";

@connect((state: Everything) => state)
export class Regimens extends React.Component<RegimenPropsWithParams, {}> {
  render() {
    let { bulkScheduler } = this.props;

    return <Page className="regimens">
      <Row>
        <Col xs={12} md={4}>
          <BulkSchedulerWidget editor={bulkScheduler}
            sequences={this.props.sequences.all}
            dispatch={this.props.dispatch} />
        </Col>
        <Col xs={12} md={4}>
          <RegimenEditorWidget { ...this.props } />
        </Col>
        {isMobile() && (
          <MobileRegimensNav { ...this.props} />
        )}
        <Col xs={12} md={4}>
          <RegimensList { ...this.props } />
        </Col>
      </Row>
    </Page>;
  }
}
