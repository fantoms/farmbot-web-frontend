import * as React from "react";
import { Link } from "react-router";
import { Everything } from "../interfaces";
import { DropDownProps, NavBarState } from "./interfaces";
import { EStopButton } from "../devices/components/e_stop_btn";
import { connect } from "react-redux";
import { t } from "i18next";
import { Session } from "../session";
import { Markdown } from "../ui";
import * as moment from "moment";
import { SyncButton } from "./sync_button";

let DropDown = ({ auth, onClick, sync }: DropDownProps) => {
  if (!auth) { return <span></span>; }
  let hasName = auth.user && auth.user.name;
  let greeting = hasName ? `${hasName} ▾` : "";

  return <div className="nav-dropdown">
    <span>{greeting}</span>
    <div className="nav-dropdown-content">
      <ul>
        <li>
          <Link to="/app/account">
            <i className="fa fa-cog"></i>{t("Account Settings")}
          </Link>
        </li>
        <li>
          <a onClick={onClick}>
            <i className="fa fa-sign-out"></i>{t("Logout")}
          </a>
        </li>
      </ul>
      <div className="version-links">
        <span>API:
                    <a href="https://github.com/FarmBot/Farmbot-Web-API"
            target="_blank">{sync.api_version}
          </a>
        </span>
        <span>Frontend:
                    <a href="https://github.com/FarmBot/farmbot-web-frontend"
            target="_blank">{process.env.SHORT_REVISION}
          </a>
        </span>
      </div>
    </div>
  </div>;
};

let links = [
  { name: "Farm Designer", icon: "leaf", url: "/app/designer" },
  { name: "Controls", icon: "keyboard-o", url: "/app/controls" },
  { name: "Device", icon: "cog", url: "/app/device" },
  { name: "Sequences", icon: "server", url: "/app/sequences" },
  { name: "Regimens", icon: "calendar-check-o", url: "/app/regimens" },
  { name: "Tools", icon: "wrench", url: "/app/tools" }
];

@connect((state: Everything) => state)
export class NavBar extends React.Component<Everything, NavBarState> {
  constructor() {
    super();
    this.state = {
      mobileNavExpanded: false,
      tickerExpanded: false
    };
    this.toggleNav = this.toggleNav.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleNav() {
    /** Don't let user scroll when nav is open */
    // document.body.classList.toggle("freeze");
    this.setState({
      mobileNavExpanded: !this.state.mobileNavExpanded
    });
  }

  logout() {
    Session.clear(true);
  }

  render() {
    let mobileMenuClass = this.state.mobileNavExpanded ? "expanded" : "";
    // The way our app is laid out, we'll pretty much always want this bit.
    let pageName = this.props.location.pathname.split("/")[2] || "";
    let { toggleNav, logout } = this;

    return <div className="nav-wrapper">
      <nav role="navigation">
        <button
          className="mobile-and-tablet-only"
          onClick={() => { toggleNav(); }}>
          <i className="fa fa-bars"></i>
        </button>
        <span className="page-name">{pageName}</span>
        <div className={`links ${mobileMenuClass}`}>
          <ul>
            {links.map(link => {
              return (
                <li key={link.url}>
                  <Link to={link.url}
                    activeClassName="active">
                    <i className={`fa fa-${link.icon}`} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/** TODO: Getting the links from the desktop dropdown to the
          mobile slide-out menu involves gnarly (and probably mobile-
          incompatible) CSS. I'll look into this one. -CV */}
          <ul className="mobile-menu-extras">
            <li>
              <Link to="/app/account">
                <i className="fa fa-cog"></i>{t("Account Settings")}
              </Link>
            </li>
            <li>
              <a onClick={logout}>
                <i className="fa fa-sign-out"></i>{t("Logout")}
              </a>
            </li>
          </ul>
          <div className="version-links mobile-only">
            <span>API:
                    <a href="https://github.com/FarmBot/Farmbot-Web-API"
                target="_blank">{this.props.sync.api_version}
              </a>
            </span>
            <span>Frontend:
                    <a href="https://github.com/FarmBot/farmbot-web-frontend"
                target="_blank">{process.env.SHORT_REVISION}
              </a>
            </span>
          </div>
        </div>

        <div className="ticker-list">
          {this.props.sync.logs.map((log, index) => {
            let time = moment.utc(log.created_at).local().format("h:mm a");
            return <div key={index} className="status-ticker-wrapper">
              <div className={`saucer ${log.meta.type}`} />
              <label className="status-ticker-message">
                <Markdown>
                  {log.message.toString() || "Loading"}
                </Markdown>
              </label>
              <label className="status-ticker-created-at">
                {time}
              </label>
            </div>;
          })}
        </div>

        <div className="right-nav-content">
          <SyncButton { ...this.props } />
          <EStopButton { ...this.props } />
          <DropDown onClick={logout} { ...this.props } />
        </div>

        <div className={`underlay ${mobileMenuClass}`}
          onClick={() => { toggleNav(); }}></div>
      </nav>
    </div>;
  }
}
