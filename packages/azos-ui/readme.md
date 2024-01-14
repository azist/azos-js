# Package `azos-ui` aka `AZU` (ah-zoo)

Contains base services and components for user interface construction.

> AZU solution is created for large complex enterprise systems and high modularity of controls/screens/forms/applets and even whole UI app modules

Key concepts in AZU architecture:
- All AZU apps run on azos application chassis
- All business logic is in modules - use inversion of control linker DI/svc location
- View Models agnostic of actual rasterizer/UI renderer
- Web Components for modularity
- Modular private CSS with global theming via css vars
- Layered application design: Arena, Menu, Applet, Area


## UI Architecture

A complex UI solution needs a layered design which allows for interoperability, reuse, and re-composition of bites and pieces of
a large system constituent pieces, for example, we may need to reuse a data entry form which can be displayed as a modal popup/dialog
in different places. That form may have an accompanying business logic which may be complex and should not be duplicated, however
it is also possible that such form would not have much logic at all.

After azos `Application` object gets initialized, you load an `Arena` UI component which provides system menus, title bars etc.
The menu choices are fed from `IMenu` service which is really a business logic. An `Arena` displays only one `Applet` at a time.
You may spawn multiple arenas in different browser tabs.

The topology is:
```
Application - Chassis provided by azos.js (not UI specific)
  Arena (azos-ui.js) <--- fed from model Menu Hierarchy (tree of applets); performs routing
    Applet
      Area 1 - may have custom toolbars/submenus
      ...
      Area X - may have custom toolbars/submenus
```

### Structure
AZU applications start from the top `Menu`.
It is a configurable class which maps a hierarchical structure starting from a root instance of `Section`,
each `Section` having:
- Sections - a list of child section
- Items - upon click/tap activates `Applet`s
- Dividers (such as text/divider lines)

Menu items point/link to applets, instances of `Applet` class. An applet is further broken into `Area`s.
The applet areas are flat. This is by design for simplicity. You can think of applets as logically-complete screens
which serve a concrete purpose. A few examples of applets and their areas:
- Outlook applet: has "Mail", "Calendar" and "Contacts" areas.
- Settings applet: has "Profile", "Security", "System" areas
- File manager applet: has a default area which shows a file tree which is connected to a file viewer pane at the right etc...



