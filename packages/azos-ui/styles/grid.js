import { css } from "../ui";
 
/**
 * Provides a basic grid system that can be imported and used in other components.
 * See saga-form.js for an example of how to use this.
 */
const STL_GRID = css`
  .grid {
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
 
  @media (max-width: 600px) {
    .cols2, .cols3, .cols4 {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default STL_GRID;