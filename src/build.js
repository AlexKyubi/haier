// Builds ../index.html: wraps page.html into a full document and inlines images from img/ as data URIs.
// Usage: node src/build.js
const fs = require('fs');
const path = require('path');

const dir = __dirname;
let page = fs.readFileSync(path.join(dir, 'page.html'), 'utf8');

for (const file of fs.readdirSync(path.join(dir, 'img'))) {
  if (!file.endsWith('.webp')) continue;
  const key = file.slice(0, -5);
  const data = 'data:image/webp;base64,' + fs.readFileSync(path.join(dir, 'img', file)).toString('base64');
  page = page.split('%%IMG_' + key + '%%').join(data);
}
if (page.includes('%%IMG_')) throw new Error('Missing image for placeholder: ' + page.match(/%%IMG_\w+%%/)[0]);

// Everything before the first <header> is head material (title, fonts, styles).
const cut = page.indexOf('<header');
const head = page.slice(0, cut);
const body = page.slice(cut);

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#090D18">
<meta name="description" content="Игра-инструкция: прокачка Android-телевизора Haier на Google TV пультом и с помощью ИИ-агента.">
<meta property="og:title" content="Haier на максималках">
<meta property="og:description" content="Скрытые фишки Google TV и ИИ-агент, который настраивает телевизор за вас.">
<style>:root{padding-top:env(safe-area-inset-top,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(path.join(dir, '..', 'index.html'), html);
console.log('index.html', Math.round(html.length / 1024) + ' KB');
