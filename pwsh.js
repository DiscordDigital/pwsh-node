module.exports.pwsh = (argCol = {}, onData = (data) => {}) => {
    return new Promise((resolve) => {
        const path = require('path');
        const fs = require('fs');
        const { spawn } = require('child_process');

        const argTemplate = {code: undefined, args: [], workdir: ''}
        const allArgKeys = Object.keys(argTemplate);

        let args = {};
        for (const arg of allArgKeys) {
            arg in argCol ? args[arg] = argCol[arg] : args[arg] = argTemplate[arg];
        }

        if (!args['code']) {
            return resolve(false);
        }

        const escape = (arr) => {
            col = [];
            arr.forEach((string)=>{
                const regex1 = /[^a-zA-Z\d\s_:-]/;
                const regex2 = /\s/;
                string = string.replace(regex1, '^$&');
                col.push(regex2.test(string) ? `'${string}'` : string);
            })
            return col.join(' ');
        }

        let cwd;
        if (args['workdir'] === '') {
            cwd = __dirname;
        } else {
            cwd = args['workdir'];
        }

        const codeArgs = escape(args['args']);
        const code = escape([args['code']]);
        const execution = spawn("chcp 65001 >NUL & powershell.exe",['-ExecutionPolicy', 'Bypass', code, codeArgs], {cwd: cwd, shell: true});

        let executionData = [];
        execution.stdout.on('data', (data) => {
            onData(data.toString());
            executionData.push(data);
        });

        execution.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            return resolve(false);
        });

        execution.on('close', (code) => {
            return resolve(executionData.join(""));
        });
    });
}
