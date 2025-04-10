import { css } from "../ui";
 
/**
 * Provides a basic prose (opinionated typography) style
 * Must wrap content with .prose class
 */
const STL_PROSE = css`
  .prose {
    color: var(--ink);
    
    h1 {
      color: var(--brand1-ink-sup);
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: var(--r1-fs);
      font-weight: 700;
    }
    
    h2 {
      color: var(--brand1-ink-sup);
      margin-top: 1.8rem;
      margin-bottom: 0.8rem;
      font-size: var(--r2-fs);
      font-weight: 600;
    }
    
    h3 {
      color: var(--brand2-ink-sup);
      margin-top: 1.5rem;
      margin-bottom: 0.7rem;
      font-size: var(--r2-fs);
      font-weight: 600;
    }
 
    h4 {
      color: var(--brand3-ink-sup);
      margin-top: 1.2rem;
      margin-bottom: 0.5rem;
      font-size: var(--r3-fs);
    }
    
    h5 {
      color: var(--brand3-ink-sup);
      margin-top: 1rem;
      margin-bottom: 0.4rem;
      font-size: var(--r4-fs);
      font-weight: 600;
    }
    
    h6 {
      color: var(--brand3-ink-sup);
      margin-top: 0.8rem;
      margin-bottom: 0.3rem;
      font-size: var(--r5-fs);
      font-weight: 600;
      text-transform: uppercase;
    }
    
    h1:first-child,
    h2:first-child,
    h3:first-child,
    h4:first-child,
    h5:first-child,
    h6:first-child {
      margin-top: 0;
    }
 
    p {
      margin-bottom: 1rem;
      line-height: 1.4;
    }
 
    ul {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
 
    li {
      margin-bottom: 0.8rem;
    }
 
    dt {
      font-weight: bold;
      margin-bottom: 0.3rem;
    }
 
    dd {
      margin-left: 1rem;
      margin-bottom: 0.3rem;
      font-family: var(--vcl-codebox-ffamily);
      background: var(--paper2);
      padding: 0.2rem 0.5rem;
      border-radius: var(--r4-brad-ctl);
      display: inline-block;
    }
 
    .tip {
      background-color: var(--paper2);
      border-left: 3px solid var(--brand1-ink-sup);
      padding: 0.8rem;
      margin: 1rem 0;
      border-radius: 0 4px 4px 0;
    }
 
    .example {
      margin-top: 0.5rem;
      background: var(--paper2);
      padding: 0.5rem;
      border-radius: var(--r4-brad-ctl);
      font-family: var(--vcl-codebox-ffamily);
    }
 
    .category {
      margin-bottom: 1.2rem;
    }

    hr {
      border: 1px solid var(--ink3);
      margin: 1.5rem 0;
    }
  }
`;
 
export default STL_PROSE;