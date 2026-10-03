# Nicolás SQL ejercicios

Panel en español con 75 ejercicios (cinco por tema) y motor SQLite real mediante sql.js / WebAssembly. Sin servicios externos en el navegador.

## Uso

```sh
npm ci
npm run build
npm start
```

Abre http://localhost:3000. Ctrl+Enter ejecuta una sentencia. Cada intento utiliza una base nueva. Se comparan columnas, alias, filas y duplicados; el orden solo se exige si el ejercicio lo solicita. Se admiten soluciones alternativas que produzcan el mismo resultado en los datos de práctica; esto no demuestra equivalencia sobre todos los datos posibles. CREATE TABLE compara la definición normalizada de la tabla y sus restricciones, por lo que ciertas definiciones equivalentes con otra escritura pueden no ser aceptadas. Una solución consultada marca el ejercicio como práctica guiada.

## Temas

SELECT; WHERE y operadores; LIKE, IN y BETWEEN; ORDER BY, LIMIT y DISTINCT; NULL y CASE; funciones agregadas; GROUP BY y HAVING; INNER JOIN; LEFT JOIN; subconsultas; CTE y UNION; funciones de ventana; INSERT; UPDATE y DELETE; CREATE TABLE.

## Verificación

`npm test` ejecuta las 75 soluciones de referencia y comprueba el corrector, restricciones, errores y flujos de interfaz mediante un DOM simulado. No se completó una comprobación visual en navegador: Chromium no se pudo descargar en el entorno.

## Vercel y GitHub

Nombre del repositorio y proyecto: nicolas-sql-ejercicios. En Vercel importa el repositorio de GitHub, usa Framework Preset Other, comando `npm run build` y carpeta de salida `public`. El archivo vercel.json ya define estos valores. No se requieren variables secretas.

El motor es SQLite, no un servidor MySQL u Oracle. La interfaz explica diferencias de LIMIT, fechas, tipos y PL/SQL. El progreso es local al navegador; no se sincroniza entre dispositivos. Un Web Worker aísla la ejecución y cancela consultas de más de cinco segundos.

sql.js se distribuye bajo licencia MIT; consulta node_modules/sql.js/LICENSE. Sus archivos de motor se copian a public/vendor al construir.
