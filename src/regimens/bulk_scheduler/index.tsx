import * as React from "react";
import { BulkEditorProps } from "./interfaces";
import { AddButton } from "./add_button";
import { SequenceList } from "./sequence_list";
import { TimeInput } from "./time_input";
import { nullSequence } from "../../sequences/actions";
import { WeekGrid } from "./week_grid";
import { commitBulkEditor } from "./actions";
import { Widget, WidgetHeader, WidgetBody, Row, Col } from "../../ui/index";

export function BulkSchedulerWidget({ sequences, dispatch, editor }:
  BulkEditorProps) {
  let click = function () { dispatch(commitBulkEditor()); };
  let active = !!(sequences && sequences.length);
  return <Widget className="bulk-scheduler-widget">
    <WidgetHeader title="Scheduler"
      helpText={`Use this tool to schedule sequences to run on one or many
                days of your regimen.`}>
      <AddButton active={active} click={click} />
    </WidgetHeader>
    <WidgetBody>
      <Row>
        <Col xs={6}>
          <SequenceList sequences={sequences}
            current={editor.sequence || nullSequence()}
            dispatch={dispatch} />
        </Col>
        <Col xs={6}>
          <TimeInput dispatch={dispatch}
            offset={editor.form.dailyOffsetMs} />
        </Col>
      </Row>
      <WeekGrid weeks={editor.form.weeks}
        dispatch={dispatch} />
    </WidgetBody>
  </Widget>;
}
