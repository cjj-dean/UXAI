import type { Fixer } from "../types"

import { fixIntentCompliance } from "./layout"
import { fixOrphanElements } from "./layout"
import { fixGreedyWidth } from "./layout"
import { fixElevationNesting } from "./layout"
import { fixSectionStyles } from "./layout"
import { fixRedundantPadding } from "./layout"
import { fixOverflow } from "./layout"
import { fixContainerFlex } from "./layout"
import { fixScrollShrink } from "./layout"
import { fixRedundantClass } from "./layout"
import { fixHeaderZIndex } from "./layout"
import { fixMainBackground } from "./layout"
import { fixMergeTextSpans } from "./layout"
import { fixFlexMinHeight } from "./layout"
import { fixDuplicateRef } from "./layout"
import { fixHeaderLayout } from "./layout"
import { fixHiddenClass } from "./layout"
import { fixBgPadding } from "./layout"
import { fixThreeColCenter } from "./layout"
import { fixImageRadius } from "./component"
import { fixChartHeight } from "./component"
import { fixCircleProcessChart } from "./component"
import {
  fixTableSelectionColumn,
  fixTableColumnWidth,
  fixTableTypography,
  fixTableCellBinding,
  fixTablePagination,
} from "./table"
import { fixTagColors } from "./component"
import { fixMenuIcons } from "./component"
import { fixChartBuiltinLegend } from "./component"
import { fixChartData } from "./component"
import { fixIconProps } from "./component"
import { fixInvalidPaths } from "./component"
import { fixDialogClass } from "./component"
import { fixRedundantLoopWrapper } from "./layout"
import { fixAsideWidth } from "./layout"
import { fixPropsChildren } from "./layout"
import { fixSlotComponents } from "./component"
import { fixStepsFullWidth } from "./component"
import { fixPatStackedBar } from "./component"
import { fixTabContent } from "./component"
import { fixBorderBox } from "./component"
import { fixInlineComponentStretch } from "./component"

export const ALL_FIXERS: { name: string; fn: Fixer }[] = [
  { name: "intent_compliance", fn: fixIntentCompliance },
  { name: "dialog_class", fn: fixDialogClass },
  { name: "hidden_class", fn: fixHiddenClass },
  { name: "orphan_elements", fn: fixOrphanElements },
  { name: "duplicate_ref", fn: fixDuplicateRef },
  { name: "greedy_width", fn: fixGreedyWidth },
  { name: "elevation_nesting", fn: fixElevationNesting },
  { name: "section_styles", fn: fixSectionStyles },
  { name: "redundant_padding", fn: fixRedundantPadding },
  { name: "overflow", fn: fixOverflow },
  { name: "container_flex", fn: fixContainerFlex },
  { name: "bg_padding", fn: fixBgPadding },
  { name: "three_col_center", fn: fixThreeColCenter },
  { name: "scroll_shrink", fn: fixScrollShrink },
  { name: "flex_min_height", fn: fixFlexMinHeight },
  { name: "redundant_class", fn: fixRedundantClass },
  { name: "header_zindex", fn: fixHeaderZIndex },
  { name: "main_background", fn: fixMainBackground },
  { name: "merge_text_spans", fn: fixMergeTextSpans },
  { name: "image_radius", fn: fixImageRadius },
  { name: "chart_height", fn: fixChartHeight },
  { name: "circle_process_chart", fn: fixCircleProcessChart },
  { name: "table_selection_column", fn: fixTableSelectionColumn },
  { name: "table_column_width", fn: fixTableColumnWidth },
  { name: "tag_colors", fn: fixTagColors },
  { name: "menu_icons", fn: fixMenuIcons },
  { name: "chart_builtin_legend", fn: fixChartBuiltinLegend },
  { name: "chart_data", fn: fixChartData },
  { name: "table_typography", fn: fixTableTypography },
  { name: "table_cell_binding", fn: fixTableCellBinding },
  { name: "table_pagination", fn: fixTablePagination },
  { name: "header_layout", fn: fixHeaderLayout },
  { name: "icon_props", fn: fixIconProps },
  { name: "invalid_paths", fn: fixInvalidPaths },
  { name: "slot_components", fn: fixSlotComponents },
  { name: "redundant_loop_wrapper", fn: fixRedundantLoopWrapper },
  { name: "steps_full_width", fn: fixStepsFullWidth },
  { name: "pat_stacked_bar", fn: fixPatStackedBar },
  { name: "tab_content", fn: fixTabContent },
  { name: "border_box", fn: fixBorderBox },
  { name: "aside_width", fn: fixAsideWidth },
  { name: "props_children", fn: fixPropsChildren },
  { name: "inline_component_stretch", fn: fixInlineComponentStretch },
]
