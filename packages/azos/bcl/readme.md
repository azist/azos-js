## BCL = Base Class Library

Here we get a collection of base classes in `azos` non-visual package.

> Do not confuse **BCL** (Base Class Library) with `azos-ui` which has a **VCL** (Visual Component Library) counterpart

- Base Class Library can be used without a "UI" portion, e.g. a console JS app  does not need browser services along with WebComponents
- It contains base services which can be used in node/deno server and command line applications
- Things like `ImageRegistry` are not in UI because images are needed on the server, for example for rendering dynamic documents/markup.
- The root of library contains the very fundamental types, whereas BCL is more of a utility/higher level application pieces
- Azos UI has similar "VCL" namespace
