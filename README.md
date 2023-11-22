# azos-js
Provides Azos base types and services functionality for Java Script apps

ver. 0.0.1 20230923 DKh<br>rev. 20231122 DKh



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

# Test named unit
npm run test AppModule
npm run test "ModuleLinker AppModule"
npm run test Module

# Test named cases
npm run test "&as"
npm run test "&runner &another"

# Test named cases under named units
npm run test "Module &link"
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
