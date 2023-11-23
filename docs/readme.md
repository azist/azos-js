# `azos-js` Documentation Index

## Platforms
The project is designed and tested on the following platforms/runtimes:
- Server side
  - `Node 18+`
  - possibly `Deno`(not tested yet)
  - possibly `Bun` (not tested yet)
- Client / User Agents circa **Summer 2023**
  - Desktop
    - Chrome
    - FireFox
    - Safari
    - Edge
    - Electron
  - Mobile
    - Android WebView (tbd)..
    - IOS WebView (tbd)..

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
2. Modular design - reuse all pieces in different applications a-la "components"
3. OOP used for composition/structural framework
4. FP used for data processing/streaming (iterators)





