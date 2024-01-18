npm audit fix
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'amqplib@0.5.2',
npm WARN EBADENGINE   required: { node: '>=0.8 <=9' },
npm WARN EBADENGINE   current: { node: 'v20.10.0', npm: '10.2.3' }
npm WARN EBADENGINE }

up to date, audited 766 packages in 903ms

149 packages are looking for funding
  run `npm fund` for details

# npm audit report

ajv  <6.12.3
Severity: moderate
Prototype Pollution in Ajv - https://github.com/advisories/GHSA-v88g-cgmw-v5xw
No fix available
node_modules/tailwind/node_modules/ajv
  tailwind  *
  Depends on vulnerable versions of ajv
  Depends on vulnerable versions of body-parser
  Depends on vulnerable versions of datasette
  Depends on vulnerable versions of express
  Depends on vulnerable versions of flaschenpost
  Depends on vulnerable versions of limes
  Depends on vulnerable versions of lodash
  Depends on vulnerable versions of ws
  node_modules/tailwind

jsonwebtoken  <=8.5.1
Severity: moderate
jsonwebtoken unrestricted key type could lead to legacy keys usage  - https://github.com/advisories/GHSA-8cf7-32gw-wr33
jsonwebtoken's insecure implementation of key retrieval function could lead to Forgeable Public/Private Tokens from RSA to HMAC - https://github.com/advisories/GHSA-hjrf-2m68-5959
jsonwebtoken vulnerable to signature validation bypass due to insecure default algorithm in jwt.verify() - https://github.com/advisories/GHSA-qwph-4952-7xr6
fix available via `npm audit fix`
node_modules/jsonwebtoken
  limes  *
  Depends on vulnerable versions of jsonwebtoken
  node_modules/limes

lodash  <=4.17.20
Severity: critical
Regular Expression Denial of Service (ReDoS) in lodash - https://github.com/advisories/GHSA-x5rq-j2xg-h7qm
Prototype Pollution in lodash - https://github.com/advisories/GHSA-p6mc-m468-83gw
Prototype Pollution in lodash - https://github.com/advisories/GHSA-jf85-cpcp-j695
Command Injection in lodash - https://github.com/advisories/GHSA-35jh-r3h4-6jhm
Prototype Pollution in lodash - https://github.com/advisories/GHSA-4xc9-xhrj-v574
Regular Expression Denial of Service (ReDoS) in lodash - https://github.com/advisories/GHSA-29mw-wpgm-hmr9
fix available via `npm audit fix`
node_modules/datasette/node_modules/lodash
node_modules/lodash
  datasette  *
  Depends on vulnerable versions of lodash
  node_modules/datasette
  flaschenpost  0.8.4 - 4.0.19
  Depends on vulnerable versions of lodash
  Depends on vulnerable versions of moment
  node_modules/flaschenpost

moment  <=2.29.3
Severity: high
Moment.js vulnerable to Inefficient Regular Expression Complexity - https://github.com/advisories/GHSA-wc69-rhjr-hc9g
Path Traversal: 'dir/../../filename' in moment.locale - https://github.com/advisories/GHSA-8hfj-j24r-96c4
fix available via `npm audit fix`
node_modules/moment

qs  6.5.0 - 6.5.2
Severity: high
qs vulnerable to Prototype Pollution - https://github.com/advisories/GHSA-hrpp-h998-j3pp
No fix available
node_modules/qs
  body-parser  1.18.0 - 1.18.3
  Depends on vulnerable versions of qs
  node_modules/body-parser
    express  4.15.4 - 4.16.4 || 5.0.0-alpha.1 - 5.0.0-alpha.7
    Depends on vulnerable versions of body-parser
    Depends on vulnerable versions of qs
    node_modules/express

ws  6.0.0 - 6.2.1
Severity: moderate
ReDoS in Sec-Websocket-Protocol header - https://github.com/advisories/GHSA-6fc8-4gx4-v693
No fix available
node_modules/ws

12 vulnerabilities (4 moderate, 7 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.