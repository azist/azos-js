import { css } from "../ui";
import { BREAKPOINT_SM } from "./breakpoints";
/**
 * Provides a basic grid system
 */
const STL_INLINE_GRID = css`
  .row {
    display: grid;
    gap: 1em;
    margin-bottom: 1em;
  }

  .cols1 {
    grid-template-columns: repeat(1, 1fr);
  }

  .cols2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .cols3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .cols4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .span2 {
    grid-column: span 2;
  }

  .span3 {
    grid-column: span 3;
  }

  .span4 {
    grid-column: span 4;
  }

  @media (max-width: ${BREAKPOINT_SM}px) {
    .cols2, .cols3, .cols4 {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default STL_INLINE_GRID;
