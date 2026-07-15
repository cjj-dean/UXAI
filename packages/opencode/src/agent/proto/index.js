import COMPONENTS_CATALOG from "./prompt/stastics/COMPONENTS_CATALOG.txt"
import COMPONENTS_USAGE from "./prompt/stastics/COMPONENTS_USAGE.txt"
import DESIGN_SYSTEM_PROMPT from "./prompt/stastics/DESIGN_SYSTEM_PROMPT.txt"
import A2UI_JSON_PROTOCOL_RAW from "./prompt/stastics/A2UI_JSON_PROTOCOL.txt"
import A2UI_SCHEMA from "./prompt/stastics/A2UI_SCHEMA.txt"
import HTML5_SCHEMA from "./prompt/stastics/HTML5_SCHEMA.txt"
import HTML_EXAMPLE from "./prompt/stastics/HTML_EXAMPLE.txt"
import CARD_EXAMPLE from "./prompt/stastics/CARD_EXAMPLE.txt"
import LIST_EXAMPLE from "./prompt/stastics/LIST_EXAMPLE.txt"
import TABS_EXAMPLE from "./prompt/stastics/TABS_EXAMPLE.txt"
import FORM_EXAMPLE from "./prompt/stastics/FORM_EXAMPLE.txt"
import PLANNER_TEMPLATE from "./prompt/stastics/PLANNER_TEMPLATE.txt"
import INTENT_EXPAND_TEMPLATE from "./prompt/stastics/INTENT_EXPAND_TEMPLATE.txt"
import ISREGION_RULES from "./prompt/stastics/ISREGION_RULES.txt"

import _PROMPT_PROTO_INTENT from "./prompt/proto_intent.txt"
import _PROMPT_PROTO_INTENT_AUDIT from "./prompt/proto_intent_audit.txt"
import _PROMPT_PROTO_MODULE_CREATE from "./prompt/proto_module_create.txt"
import _PROMPT_PROTO_MODULE_MODIFY from "./prompt/proto_module_modify.txt"
import _PROMPT_PROTO_PLANNER_CREATE from "./prompt/proto_planner_create.txt"
import _PROMPT_PROTO_PLANNER_MODIFY from "./prompt/proto_planner_modify.txt"
import _PROMPT_PLANNER_NEW_CREATE from "./prompt/planner_new_create.txt"
import _PROMPT_PROTO_TRIAGE from "./prompt/proto_triage.txt"
import _PROMPT_PROTO_COMPONENT_LOOKUP from "./prompt/proto_component_lookup.txt"
import _PROMPT_INTENT_EXPAND from "./prompt/intent_expand.txt"
import _PROMPT_INTENT_REGION_CHECK from "./prompt/intent_region_check.txt"

const data = {
  COMPONENTS_CATALOG,
  COMPONENTS_USAGE,
  DESIGN_SYSTEM_PROMPT,
  A2UI_SCHEMA,
  HTML5_SCHEMA,
  HTML_EXAMPLE,
  CARD_EXAMPLE,
  LIST_EXAMPLE,
  TABS_EXAMPLE,
  FORM_EXAMPLE,
  PLANNER_TEMPLATE,
  INTENT_EXPAND_TEMPLATE,
  ISREGION_RULES,
}

function formatPrompt(template) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

data.A2UI_JSON_PROTOCOL = formatPrompt(A2UI_JSON_PROTOCOL_RAW)

export const PROMPT_PROTO_INTENT = formatPrompt(_PROMPT_PROTO_INTENT)
export const PROMPT_PROTO_INTENT_AUDIT = formatPrompt(_PROMPT_PROTO_INTENT_AUDIT)
export const PROMPT_PROTO_MODULE_CREATE = formatPrompt(_PROMPT_PROTO_MODULE_CREATE)
export const PROMPT_PROTO_MODULE_MODIFY = formatPrompt(_PROMPT_PROTO_MODULE_MODIFY)
export const PROMPT_PROTO_PLANNER_CREATE = formatPrompt(_PROMPT_PROTO_PLANNER_CREATE)
export const PROMPT_PROTO_PLANNER_MODIFY = formatPrompt(_PROMPT_PROTO_PLANNER_MODIFY)
export const PROMPT_PLANNER_NEW_CREATE = formatPrompt(_PROMPT_PLANNER_NEW_CREATE)
export const PROMPT_PROTO_TRIAGE = formatPrompt(_PROMPT_PROTO_TRIAGE)
export const PROMPT_PROTO_COMPONENT_LOOKUP = formatPrompt(_PROMPT_PROTO_COMPONENT_LOOKUP)
export const PROMPT_INTENT_EXPAND = formatPrompt(_PROMPT_INTENT_EXPAND)
export const PROMPT_INTENT_REGION_CHECK = formatPrompt(_PROMPT_INTENT_REGION_CHECK)
