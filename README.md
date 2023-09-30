# azos-js
Provides Azos base types and services functionality for Java Script apps 

ver 0.0.1 20230923 DKh

## Testing

```bash
# in the root of azos-js
# Test everything
npm test

# Test named fixture form global scope (across all workspaces)
npm test Types
npm test Localization
npm test Strings

## Test by workspace -------------------------------------------

# test just azos workspace
npm run test-azos

# Test strings fixture in azos workspace
npm run test-azos Strings
```
