import { css } from "../ui.js";
import { BREAKPOINT_SM } from "./breakpoints.js";
/**
 * Provides a basic grid system
 */
const STL_INLINE_GRID = css`
  .row {
    display: grid;
    gap: 1em;
    margin-bottom: 1em;
    grid-template-columns: 1fr; /* defaults to 1 column */

    &.cols2{ grid-template-columns: repeat(2, 1fr); }
    &.cols3{ grid-template-columns: repeat(3, 1fr); }
    &.cols4{ grid-template-columns: repeat(4, 1fr); }
    &.cols5{ grid-template-columns: repeat(5, 1fr); }
    &.cols6{ grid-template-columns: repeat(6, 1fr); }
    &.cols7{ grid-template-columns: repeat(7, 1fr); }
    &.cols8{ grid-template-columns: repeat(8, 1fr); }
    &.cols9{ grid-template-columns: repeat(9, 1fr); }
    &.cols10{ grid-template-columns: repeat(10, 1fr); }
    &.cols11{ grid-template-columns: repeat(11, 1fr); }
    &.cols12{ grid-template-columns: repeat(12, 1fr); }

    .span2{ grid-column: span 2; }
    .span3{ grid-column: span 3; }
    .span4{ grid-column: span 4; }
    .span5{ grid-column: span 5; }
    .span6{ grid-column: span 6; }
    .span7{ grid-column: span 7; }
    .span8{ grid-column: span 8; }
    .span9{ grid-column: span 9; }
    .span10{ grid-column: span 10; }
    .span11{ grid-column: span 11; }
    .span12{ grid-column: span 12; }
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    .row{ grid-template-columns: 1fr !important; }
    [class*="span"] { grid-column: 1 !important; }
  }
`;

export default STL_INLINE_GRID;
