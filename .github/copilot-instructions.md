# Copilot Instructions for azos-js

## Project Overview
- **azos-js** provides base types, services, and UI components for modular JavaScript applications, targeting large enterprise systems.
- The architecture is layered: core logic (`packages/azos`), UI framework (`packages/azos-ui`), and design assets (`elm/design`).
- All business logic is organized in modules, using inversion of control and service location via the linker.
- UI follows a uniform design system with modular CSS and theming via CSS variables.

## Key Patterns & Conventions
- **Testing:**
  - Custom test runner in `packages/azos/run.js` replaces Mocha for ES module compatibility.
  - Run all tests: `npm test` (Node)
  - Run browser tests: `npm run test-bro` (served via Parcel, open http://localhost:1234)
  - Test selection uses patterns: `/Unit*`, `/Unit* /OtherUnit* ~exclude`, `*/bufToHex()/throws`
- **Naming:**
  - Units: PascalCase or `.functionName()` for function-specific units
  - Cases: lowercase, dash-separated
- **UI Structure:**
  - UI apps start with an `Application` chassis, then load an `Arena` (system menus, routing), which displays one `Applet` at a time.
  - Applets contain flat "Area" sections for logical separation (e.g., Mail, Calendar, Contacts).
  - Menu hierarchy is defined by `Section` objects, linking to applets and areas.
- **Modularity:**
  - Web Components are used for UI modularity.
  - CSS is private and modular, themed via design system variables.
  - View Models are renderer-agnostic.

## Developer Workflows
- **Build:** Uses Parcel for bundling and dev server (`npm run ui` for UI dev at http://localhost:1234)
- **Test:** See above for Node and browser workflows.
- **Debug:** Use browser dev tools for UI; Node for core logic.

## Integration Points
- **External:**
  - Parcel (bundler/dev server)
  - Node.js v18+
  - Material Design Icons (for UI assets)
- **Internal:**
  - `packages/azos` (core types/services)
  - `packages/azos-ui` (UI components/services)
  - `elm/design` (design assets)

## Examples
- To add a new UI applet: create a new class in `packages/azos-ui/` and link it via the menu hierarchy.
- To add a test: follow naming conventions and place in `packages/azos/test/`.

## References
- See `README.md` in root and key packages for more details.
- For UI architecture, see `packages/azos-ui/README.md`.

---
*Update this file as project conventions evolve. Focus on actionable, project-specific guidance for AI agents.*
