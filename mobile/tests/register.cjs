// Tests run TypeScript API modules with Node's built-in test runner.
const fs = require("node:fs");
const ts = require("typescript");
const compile = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
