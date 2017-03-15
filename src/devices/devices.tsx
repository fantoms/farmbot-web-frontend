import * as React from "react";
import { connect } from "react-redux";
import { Everything } from "../interfaces";
import { WeedDetector } from "../images";
import { HardwareSettings } from "./components/hardware_settings";
import { FarmbotOsSettings } from "./components/farmbot_os_settings";
import { Farmware } from "../farmware";
import { Page, Col } from "../ui/index";

@connect((state: Everything) => state)
export class Devices extends React.Component<Everything, {}> {
  render() {
    if (this.props.auth) {
      let auth = this.props.auth;
      return <Page className="devices">
        <Col xs={12} sm={6}>
          <Farmware bot={this.props.bot} />
          <FarmbotOsSettings {...this.props} auth={auth} />
        </Col>
        <Col xs={12} sm={6}>
          <WeedDetector {...this.props} />
          <HardwareSettings {...this.props} />
        </Col>
      </Page>;
    } else {
      throw new Error("Log in first");
    }
  }
};

