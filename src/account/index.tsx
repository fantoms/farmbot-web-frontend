import * as React from "react";
import { connect } from "react-redux";
import { updateUser } from "./actions";
import { Settings, DeleteAccount, ChangePassword } from "./components";
import { State, Props } from "./interfaces";
import { Page, Row, Col } from "../ui";
import { mapStateToProps } from "./state_to_props";

@connect(mapStateToProps)
export class Account extends React.Component<Props, State> {
  constructor(props: Props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (this.props.auth) {
      let { name, email } = this.props.auth.user;
      this.setState({ name, email });
    }
  }

  set = (event: React.FormEvent<HTMLInputElement>) => {
    let { name, value } = event.currentTarget;
    this.setState({ [name]: value });
  }

  savePassword = () => {
    this.props.dispatch(updateUser(this.state));

    this.setState({
      password: "",
      new_password: "",
      new_password_confirmation: ""
    });
  }

  render() {
    return <Page className="account">
      <Col xs={12} sm={6} smOffset={3}>
        <Row>
          <Settings name={this.state.name || ""}
            email={this.state.email || ""}
            set={this.set}
            save={() => this.props.saveUser(
              this.state, this.props.dispatch
            )} />
        </Row>
        <Row>
          <ChangePassword
            password={this.state.password || ""}
            new_password={this.state.new_password || ""}
            new_password_confirmation=
            {this.state.new_password_confirmation || ""}
            set={this.set}
            save={this.savePassword} />
        </Row>
        <Row>
          <DeleteAccount
            deletion_confirmation=
            {this.state.deletion_confirmation || ""}
            set={this.set}
            save={() => this.props.enactDeletion(
              this.state.deletion_confirmation, this.props.dispatch
            )} />
        </Row>
      </Col>
    </Page>;
  }
}
