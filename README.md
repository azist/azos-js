# azos-js
Provides Azos base types and services functionality for Java Script apps

ver. 0.0.1 20230923 DKh<br>
rev. 20240918 DKh + KDB


## Naming conventions

### Runner/Unit Testing
1. Unit name: (e.g.`Aver`, `Customer`, `.myMethod()`)
   1. Should use `PascalCase` unless it is a function-specific unit in which case:
   1. Should start with a dot and follows function name with the `()` at the end, example: `.bufToHex()`
2. Case name: (e.g., `my-case-01`)
   1. Should be lowercase
   2. Dashes should replace spaces
   3. Decimal numbers allowed


## Testing

> Since Nov 17, 2023 testing uses `azos/run.js` tiny library (&lt; 300LOC) which replaces `mocha`. We could not use `mocha` anymore due to its problematic ES module support while bundling for browser which we needed to test against all the time.

You can run test using the following JS runtimes:
1. Node
2. Browser/s
3. Other JS runtimes like `Deno` or `Bun` - not tried yet


### Test in Node (and possibly others)
```bash
# in the root of azos-js
# Test everything
npm test

# Test named units
# Use `~` to negate the pattern: `~*xyz` = NOT something which ends with `xyz`
npm test "/Aver*"
npm test "/Aver* /Types* ~null"

# Test named cases (may use multiple)
npm test "*/UInt8Array  */bufToHex()/throws"

# Test named cases under named units
npm test "*/bufToHex()/throws"
```
### Test in Browser
As `azos-js` is a purely ES6+ module-based project it is impossible to load test assets using `file://` protocol, hence you have to bundle and dev-serve your test suite using `Parcel`.

```bash
#navigate to http://localhost:1234 in any browser, open a console (hit F12)
npm run test-bro
```

## UI Dev

```bash
# Starts parcel server with watch+HMR out of ./out/www (temp testing)
# http://localhost:1234
npm run ui
```
