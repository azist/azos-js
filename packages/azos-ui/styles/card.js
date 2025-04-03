import { css } from "../ui";

/**
 * Provides a basic card style that can be imported and used in other components.
 */
export const  STL_CARD = css`
  .card {
    border-radius: var(--r3-brad-win);
    box-shadow: var(--ctl-box-shadow);
    padding: 1.5rem;
    background-color: var(--s-default-bg-ctl);
    transition: transform 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }
  .card-title {
    font-size: var(--r2-fs, 1.2rem);
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--s-default-fg-ctl);
  }
  .card-id {
    font-size: var(--r5-fs);
    color: var(--ink2);
    margin: 0 0 1.5rem 0;
    font-family: var(--vcl-codebox-ffamily);
  }
`;
