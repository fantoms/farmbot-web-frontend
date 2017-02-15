import * as React from "react";
import { Link } from "react-router";

type OptionComponent = React.ComponentClass<SelectState> | React.StatelessComponent<SelectState>;

export interface Option {
  /** Value passed to the onClick cb and also determines the "chosen" option. */
  value: number;
  /** Name of the item shown in the list. */
  label: string;
  /** Component internal use only unless there's an edge case for it. */
  hidden?: boolean;
  /** Path for `Link`s. */
  pathTo?: string;
  /** Path params for `pathTo`. */
  pathParams?: string;
}

interface DropDownItem {
  /** TODO */
}

export interface SelectProps {
  /** The list of rendered options to select from. */
  dropDownItems: DropDownItem[];
  /** Determine whether the select list should always be open. */
  isOpen?: boolean;
  /** Custom JSX child rendered instead of a default item. */
  optionComponent?: OptionComponent;
  /** Optional className for `select`. */
  className?: string;
  /** Fires when option is selected. */
  onChange?: (newValue: Option) => void;
}

export interface SelectState {
  filter: string;
  // TODO: Figure out option interface layout
  dropDownItems: DropDownItem[];
  isOpen: boolean;
  value: number | null;
}

export class BetaSelect extends React.Component<SelectProps, Partial<SelectState>> {
  constructor() {
    super();
    this.state = {
      filter: "",
      dropDownItems: [],
      isOpen: false,
      value: null
    };
  }

  componentWillMount() {
    this.setState({ dropDownItems: this.props.dropDownItems });
  }

  updateInput(e: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({ filter: e.currentTarget.value });
  }

  open() {
    this.setState({ isOpen: true });
  }

  close() {
    this.setState({ isOpen: false });
  }

  handleSelectOption(option: Option) {
    if (this.props.onChange) {
      this.props.onChange(option);
    }
  }

  render() {
    let filter = (this.state.filter || "").toUpperCase();

    if (this.state.dropDownItems) {
      this.state.dropDownItems.map((option: Option) => {
        if (option.label.toUpperCase().indexOf(filter) > -1) {
          option.hidden = false;
        } else {
          option.hidden = true;
        }
      });
    }

    let isOpen = !!this.state.isOpen;
    let className = this.props.className || "";
    return <div className={"select " + className}>

      <div className="select-search-container">
        <input type="text"
          onChange={this.updateInput.bind(this)}
          onClick={this.open.bind(this)}
          placeholder="Search..." />
      </div>

      <div className={"select-results-container is-open-" + isOpen}>
        {this.state.dropDownItems &&
          this.state.dropDownItems.map((option: Option) => {
            let isHidden = option.hidden ? " is-hidden" : "";

            return <div className={"select-result" + isHidden}
              key={option.value}
              onClick={() => {
                this.handleSelectOption(option);
                this.close();
              }}>
              <label>{option.label}</label>
            </div>;
          })}

        {(
          (this.state.dropDownItems || []).map((option: Option) => {
            let { optionComponent } = this.props;
            if (optionComponent && this.state.value) {

              let CustomComponent = optionComponent;
              let isHidden = option.hidden ? " is-hidden" : "";
              return <div className={"select-result" + isHidden}
                key={option.value}
                onClick={() => {
                  this.handleSelectOption(option);
                  this.close();
                }}>
                <CustomComponent isOpen={!!this.props.isOpen}
                  dropDownItems={this.state.dropDownItems || []}
                  filter={this.state.filter || ""}
                  value={this.state.value || null}
                />
              </div>;
            }
          })
        )}
      </div>

    </div>;
  }
}

