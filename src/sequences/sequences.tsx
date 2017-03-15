import * as React from "react";
import { SequencesList } from "./sequences_list";
import { StepButtonCluster } from "./step_button_cluster";
import { SequenceEditorMiddle } from "./sequence_editor_middle";
import { MobileSequencesNav } from "./mobile_nav";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { isMobile } from "../util";
import { Page, Col } from "../ui/index";

@connect((state: Everything) => state)
export class Sequences extends React.Component<any, Everything> {
  render() {
    return <Page className="sequences">
      <Col xs={4} md={3}>
        <StepButtonCluster { ...this.props } />
      </Col>
      <Col xs={8} md={6}>
        <SequenceEditorMiddle { ...this.props } />
      </Col>
      {isMobile() && (
        <MobileSequencesNav { ...this.props} />
      )}
      <Col xs={12} md={3}>
        <SequencesList { ...this.props } />
      </Col>
    </Page>;
  }
};
