import { FarmEvent } from "../interfaces";

/** A dictionary that holds an ISO date as a key and a list of FarmEvent IDs
 * that are scheduled at that point in time.
 * TL;DR: It indexes a FarmEvents ID by date.
 * Example:
 * ```
 *   let x: DateLookup = {
 *     "2099-02-17T18:19:20.000Z": [54, 76]
 *   }
 * ```
 */
interface DateLookup {
  [date: string]: number[] | undefined;
}

function putEventIntoCalendarMap(target: DateLookup,
  date: string,
  item: FarmEvent): void {
  let dateList = target[date] || (target[date] = []);
  if (item.id) {
    dateList.push(item.id);
  } else {
    throw new Error("Refusing to process unsaved Event putEventIntoCalendarMap");
  }
  target[date] = _.uniq(dateList, "id");
}

export function generateCalendar(input: FarmEvent[]) {
  let calendar: DateLookup = {};
  input.map(function (fe) {
    if (fe.calendar) {
      fe.calendar.forEach(d => putEventIntoCalendarMap(calendar, d, fe));
    } else {
      throw new Error("Refusing to put unsaved event on calendar.");
    }
  });
}
