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

    --cols-n: 1;

    grid-template-columns: repeat(var(--cols-n), 1fr);

    .span2, .span3, .span4, .span5, .span6, .span7, .span8, .span9, .span10, .span11, .span12{
      --span-n: span 1;
      grid-column: var(--span-n);
    }

    &.cols1{ --cols-n: 1; }
    &.cols2{ --cols-n: 2; }
    &.cols3{ --cols-n: 3; }
    &.cols4{ --cols-n: 4; }
    &.cols5{ --cols-n: 5; }
    &.cols6{ --cols-n: 6; }
    &.cols7{ --cols-n: 7; }
    &.cols8{ --cols-n: 8; }
    &.cols9{ --cols-n: 9; }
    &.cols10{ --cols-n: 10; }
    &.cols11{ --cols-n: 11; }
    &.cols12{ --cols-n: 12; }

    .span2{ --span-n: span 2; }
    .span3{ --span-n: span 3; }
    .span4{ --span-n: span 4; }
    .span5{ --span-n: span 5; }
    .span6{ --span-n: span 6; }
    .span7{ --span-n: span 7; }
    .span8{ --span-n: span 8; }
    .span9{ --span-n: span 9; }
    .span10{ --span-n: span 10; }
    .span11{ --span-n: span 11; }
    .span12{ --span-n: span 12; }
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    .row{ grid-template-columns: repeat(1, 1fr) !important; }
  }
`;

export default STL_INLINE_GRID;
