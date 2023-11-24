# `azos-js` Documentation Index

## Platforms
The project is designed and tested on the following platforms/runtimes:
- Server side
  - `Node 18+`
  - possibly `Deno`(not tested yet)
  - possibly `Bun` (not tested yet)
- Client / User Agents circa **Summer 2023**
  - Desktop: Chrome, FireFox, Safari, Edge, Electron
  - Mobile: Android Chrome,  Android WebView (tbd).., IOS WebView (tbd)..

## ECMA script level
It uses the following modern ES6+ features:
1. Exclusively ES modules (`import` no `require`)
2. Classes with private fields e.g. `#field`
3. Iterators, generators, functional style `select/where/group/order` etc.
4. Disposable pattern for [explicit object lifecycle handling](https://github.com/tc39/proposal-explicit-resource-management)
5. `structuredClone`
6. fetch
7. async/await
8. Error.cause, Error.stack

## Chief Traits
1. Minimize dependencies on 3rd party (core pkg has zero run dependencies)
2. Use ES language features expected to be around for a long time
3. For building large-scale complex business applications (e.g. medical/rx, financial, construction, insurance):
   - having hundreds of complex data-entry screens
   - with many fields/tabs/groupings etc.,
   - validation logic, cross-field/section/form
   - lots of metadata driving business rules
2. Modular design - reuse all pieces in different applications a-la "components"
3. OOP used for composition/structural framework
4. FP used for data processing/streaming (iterators) and eventing

## Documentation topics (in order)
### Overview
- Naming Conventions
- Testing
- Overall application architecture
### Part I - Package `azos`
Describes the foundational package which provides the base building blocks per architecture specified above.

- Type System and Strings
- Aver (aka Assert)
- Configuration, Factories
- Application Chassis and Components
- Modules
- Linking dependencies - DI and Service Location
- Logging
- Localization
- Storage
- LINQ - Functional programming
- Client - making service calls
- Session, User, Security
- Run - library for scripting JS functions by name from cli/browser

### Part II - Package `azos-ui`
-





