const fs = require('fs');
fs.mkdirSync('public/vendor', {recursive:true});
for (const file of ['sql-wasm.js','sql-wasm.wasm']) fs.copyFileSync('node_modules/sql.js/dist/'+file,'public/vendor/'+file);
