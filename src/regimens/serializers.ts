import { Regimen, ApiRegimen, ApiRegimenItem } from "./interfaces";
import { Color } from "../interfaces";
import * as _ from "lodash";

/**
 * Transforms local Regimen object into format suitable for use with FarmBot
 * API's "/api/regimens" endpoint.
// export function regimenItemDeserializer(input: ApiRegimenItem): 
// RegimenItem[] {
//   return {};
// };
 */
export function regimenSerializer(input: Regimen): ApiRegimen {
  const regimen = _.clone<Regimen>(input);
  const regimen_items = regimen
    .regimen_items
    .map<ApiRegimenItem>(function wow(r) {
      if (r && r.sequence && r.sequence.id) {
        return {
          time_offset: r.time_offset,
          sequence_id: r.sequence.id
        };
      } else {
        throw new Error(`Array regimen.regimen_items may only contain
                         objects with an "id" property.`);
      }
    });

  return {
    name: regimen.name,
    color: regimen.color,
    regimen_items
  };
};
