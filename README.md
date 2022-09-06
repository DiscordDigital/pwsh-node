# pwsh-node
With node-pwsh you can run PowerShell code inside Node.js.

This module allows you to stream new lines during code execution to different functions, and asynchronously visualize your PowerShell code execution, using the `onData` callback.

# How to use

Import the module from the file:

```javascript
{ pwsh } = require('./pwsh.js');
```

#### Example 1: Run code, save output

```javascript
output = await pwsh({code: '(Get-ComputerInfo).OsName'})
```

#### Example 2: Run code, specify arguments

```javascript
output = await pwsh({code: 'ping', args: ['1.1.1.1', '-n', '5']})
```

#### Example 3: Run code, stream data to a function

```javascript
output = await pwsh({code: 'ping', args: ['1.1.1.1', '-n', '5']}, data => console.log(data))
```
