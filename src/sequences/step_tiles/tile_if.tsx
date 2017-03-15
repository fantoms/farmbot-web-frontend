import * as React from "react";
import { StepParams } from "./index";
import { Help, FBSelect, DropDownItem } from "../../ui";
import { t } from "i18next";
import { copy, remove } from "./index";
import { changeStepSelect, updateSubSequence } from "../actions";
import { StepTitleBar } from "./step_title_bar";
import { StepInputBox } from "../inputs/step_input_box";
import { If } from "farmbot";
const NOTHING = { label: "Nothing", value: 0 };

let LHSOptions: DropDownItem[] = [
  { value: "busy", label: "Busy Status (0, 1)" },
  { value: "pin0", label: "Pin 0" },
  { value: "pin1", label: "Pin 1" },
  { value: "pin2", label: "Pin 2" },
  { value: "pin3", label: "Pin 3" },
  { value: "pin4", label: "Pin 4" },
  { value: "pin5", label: "Pin 5" },
  { value: "pin6", label: "Pin 6" },
  { value: "pin7", label: "Pin 7" },
  { value: "pin8", label: "Pin 8" },
  { value: "pin9", label: "Pin 9" },
  { value: "pin10", label: "Pin 10" },
  { value: "pin11", label: "Pin 11" },
  { value: "pin12", label: "Pin 12" },
  { value: "pin13", label: "Pin 13" },
  { value: "x", label: "X position" },
  { value: "y", label: "Y Position" },
  { value: "z", label: "Z position" }
];

let operatorOptions: DropDownItem[] = [
  { value: "<", label: "is less than" },
  { value: ">", label: "is greater than" },
  { value: "is", label: "is equal to" },
  { value: "not", label: "is not equal to" }
];
export function TileIf({ dispatch, step, index, all, current }:
  StepParams) {
  let byId = _.indexBy(all, "id");
  step = step as If;
  type ArgName = keyof typeof step.args;
  type FieldName = "sequence_id";
  let args = step.args;
  let { lhs, op } = args;
  let else_optn: DropDownItem | undefined;
  switch (step.args._else.kind) {
    case "execute":
      let seq = byId[step.args._else.args.sequence_id];
      if (seq && seq.id && _.isString(seq.name)) {
        else_optn = { value: seq.id, label: seq.name };
      }
      break;
    case "nothing": else_optn = NOTHING;
  }
  else_optn = else_optn || NOTHING;
  let then_optn: DropDownItem | undefined;
  switch (step.args._then.kind) {
    case "execute":
      let seq = byId[step.args._then.args.sequence_id];
      if (seq && seq.id && _.isString(seq.name)) {
        then_optn = { value: seq.id, label: seq.name };
      }
      break;
    case "nothing": then_optn = NOTHING;
  }
  then_optn = then_optn || NOTHING;
  let update = (field: ArgName) => (e: DropDownItem) => {
    let { value } = e;
    if (value) { dispatch(changeStepSelect(value, index, field)); }
  };

  let updateSubSeq = (field: FieldName, type: ArgName) => (e: DropDownItem) => {
    let { value } = e;
    if (value && field && type) {
      dispatch(updateSubSequence(value, index, field, type));
    }
  };

  var isRecursive = (then_optn && then_optn.value === current.id)
    || (else_optn && else_optn.value === current.id);

  let seqDropDown = _(all)
    .filter(function (seq) {
      // filter out id-less sequences so I can safely type cast
      // in the next call to .map();
      return seq.id;
    })
    .map(function (seq) {
      return { value: (seq.id as number), label: seq.name };
    })
    .tap(list => list.push(NOTHING))
    .value();
  return <div>
    <div className="step-wrapper">
      <div className="row">
        <div className="col-sm-12">
          <div className="step-header if-step">
            <StepTitleBar index={index}
              dispatch={dispatch}
              step={step} />
            <i className="fa fa-arrows-v step-control" />
            <i className="fa fa-clone step-control"
              onClick={() => copy({ dispatch, step })} />
            <i className="fa fa-trash step-control"
              onClick={() => remove({ dispatch, index })} />
            <Help text={(`Detailed documentation coming soon`)} />
            {isRecursive && (
              <span>
                <i className="fa fa-exclamation-triangle"></i>
                &nbsp;Recursive sequence.
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="step-content if-step">
            <div className="row">
              <div className="col-xs-12 col-md-12">
                <h4 className="top">IF...</h4>
              </div>
              <div className="col-xs-4 col-md-4">
                <label>{t("Variable")}</label>
                <FBSelect
                  list={LHSOptions}
                  placeholder="Left hand side"
                  onChange={update("lhs")}
                  initialValue={{ label: lhs, value: lhs }}
                />
              </div>
              <div className="col-xs-4 col-md-4">
                <label>{t("Operator")}</label>
                <FBSelect
                  list={operatorOptions}
                  placeholder="Operation"
                  onChange={update("op")}
                  initialValue={{ label: op, value: op }}
                />
              </div>
              <div className="col-xs-4 col-md-4">
                <label>{t("Right hand side")}</label>
                <StepInputBox dispatch={dispatch}
                  step={step}
                  index={index}
                  field="rhs" />
              </div>
              <div className="col-xs-12 col-md-12">
                <h4>THEN...</h4>
              </div>
              <div className="col-xs-12 col-md-12">
                <label>{t("Execute Sequence")}</label>
                <FBSelect
                  list={seqDropDown}
                  placeholder="Sequence..."
                  onChange={updateSubSeq("sequence_id", "_then")}
                  initialValue={then_optn}
                />
              </div>
              <div className="col-xs-12 col-md-12">
                <h4>ELSE...</h4>
              </div>
              <div className="col-xs-12 col-md-12">
                <label>{t("Execute Sequence")}</label>
                <FBSelect
                  list={seqDropDown}
                  placeholder="None (continue to next step)"
                  onChange={updateSubSeq("sequence_id", "_else")}
                  initialValue={else_optn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
