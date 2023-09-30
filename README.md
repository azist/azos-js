# azos-js
Provides Azos base types and services functionality for Java Script apps 

ver 0.0.1 20230923 DKh

## Testing

```bash
# in the root of azos-js
# Test everything
npm test

# Test named fixture (grep) form global scope (across all workspaces)
npm run test-match Types
npm run test-match Localization
npm run test-match Strings

## Test by workspace -------------------------------------------

# test just azos workspace
npm run test-azos

# go to ./packages/azos
# Run matching tests
~/packages/azos/$ npm run test-match Loca
```
