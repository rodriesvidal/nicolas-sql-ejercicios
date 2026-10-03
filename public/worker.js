self.window = self;
importScripts('vendor/sql-wasm.js','data.js');
let SQL;
const ready=initSqlJs({locateFile:f=>'vendor/'+f}).then(s=>SQL=s);
function database(){const db=new SQL.Database();db.run(SQL_SEED);return db;}
function normalized(s){return s.replace(/\s+/g,' ').trim().toLowerCase();}
function snapshot(db){const tables=db.exec("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0];return tables.values.map(([name,sql])=>({name,schema:normalized(sql),rows:(db.exec('SELECT * FROM "'+name.replaceAll('"','""')+'"')[0]?.values||[]).map(r=>JSON.stringify(r)).sort()}));}
function equivalent(a,b,ordered){if(a.length!==b.length)return false;return a.every((x,i)=>{const y=b[i];if(x.columns.length!==y.columns.length||x.columns.some((c,j)=>c.toLowerCase()!==y.columns[j].toLowerCase()))return false;let av=x.values.map(r=>JSON.stringify(r)),bv=y.values.map(r=>JSON.stringify(r));if(!ordered){av.sort();bv.sort();}return JSON.stringify(av)===JSON.stringify(bv);});}
function errorAdvice(msg){if(/no such table/i.test(msg))return 'Revisa el nombre de la tabla en Base de práctica.';if(/no such column/i.test(msg))return 'Revisa las columnas y sus alias. Los textos necesitan comillas simples.';if(/ambiguous/i.test(msg))return 'Indica el alias de la tabla: por ejemplo, p.nombre o c.nombre.';if(/UNIQUE/i.test(msg))return 'Ese identificador o valor único ya existe. Cada intento parte de los datos originales.';if(/FOREIGN KEY/i.test(msg))return 'La fila referenciada no existe. Revisa el id de cliente o categoría.';if(/syntax|incomplete/i.test(msg))return 'Revisa comas, paréntesis y el orden: SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.';if(/misuse of aggregate/i.test(msg))return 'Las agregaciones para filtrar grupos van en HAVING, no en WHERE.';if(/NOT NULL|CHECK/i.test(msg))return 'El valor incumple una restricción de la tabla.';return 'Consulta la estructura, los nombres y las diferencias entre SQLite, MySQL y Oracle.';}
onmessage=async({data:m})=>{await ready;let db,ref;try{db=database();if(m.type==='init'){postMessage({id:m.id,ok:true,tables:['productos','categorias','clientes','pedidos'].map(name=>({name,result:db.exec('SELECT * FROM '+name)[0],schema:db.exec("SELECT sql FROM sqlite_master WHERE name='"+name+"'")[0].values[0][0]}))});return;}
if(m.type==='expected'){ref=database();const result=ref.exec(m.exercise.solution);postMessage({id:m.id,ok:true,result:result.length?result:[{columns:['Cambios esperados'],values:[[ref.getRowsModified()+' fila(s) afectada(s)']]}],snapshot:m.exercise.mutation?snapshot(ref):null});return;}
if(!m.sql.trim())throw Error('Escribe una consulta antes de ejecutar.');
const it=db.iterateStatements(m.sql);let count=0;for(const st of it){count++;}if(count!==1)throw Error('Ejecuta una sola sentencia por intento.');
// Restrict database/session operations; mutations are allowed only in corresponding challenges or free practice.
const cleaned=m.sql.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g,' ').trim();if(!/^(SELECT|WITH|INSERT|UPDATE|DELETE|CREATE\s+TABLE)\b/i.test(cleaned))throw Error('Practica con SELECT, WITH, INSERT, UPDATE, DELETE o CREATE TABLE.');
if(!m.free&&!m.exercise.mutation&&!/^(SELECT|WITH)\b/i.test(cleaned))throw Error('Este ejercicio pide una consulta de lectura.');
const result=db.exec(m.sql);let correct=null;
if(!m.free){ref=database();const expected=ref.exec(m.exercise.solution);correct=m.exercise.mutation?JSON.stringify(snapshot(db))===JSON.stringify(snapshot(ref)):equivalent(result,expected,m.exercise.ordered);}
const changed=db.getRowsModified();const preview=m.exercise?.mutation||(!/^(SELECT|WITH)\b/i.test(cleaned))?snapshot(db):null;
postMessage({id:m.id,ok:true,result,correct,changed,preview});
}catch(e){postMessage({id:m.id,ok:false,error:e.message,advice:errorAdvice(e.message)});}finally{db?.close();ref?.close();}};
