const DomParser = require('dom-parser');
const fs = require('fs');
const { axiosClient } = require('../utils/axios');

async function generateListResourcesFromIndex(
  html,
  { outputDir, rootElement }
) {
  const listCSS = [];
  const listSyncJS = [];
  const listAsyncJS = [];
  let inlineJS = '';
  try {
    const parser = new DomParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headInlines = [];
    const bodyInlines = [];

    const scripts = doc.getElementsByTagName('script');
    for (const script of scripts) {
      const src = script.getAttribute('src');
      const type = script.getAttribute('type');
      const async = script.getAttribute('async');
      const inline = script.innerHTML;
      try {
        if (inline) {
          bodyInlines.push(script.outerHTML);
        } else {
          let scriptName = src;
          if (src.includes('://')) {
            let filename = src.substring(src.lastIndexOf('/') + 1);
            filename = `cdn.` + filename;
            const response = await axiosClient({
              method: 'get',
              url: src,
              responseType: 'stream',
            });
            const fileStream = fs.createWriteStream(`${outputDir}/${filename}`);
            response.data.pipe(fileStream);

            await new Promise((resolve, reject) => {
              fileStream.on('finish', resolve);
              fileStream.on('error', reject);
            });
            scriptName = filename;
          }
          if (type === 'module' && !scriptName.endsWith('module.js')) {
            const newName = src.slice(0, -3).concat('.module.js');
            fs.rename(scriptName, newName);
            scriptName = newName;
          }
          (async ? listAsyncJS : listSyncJS).push(scriptName);
        }
      } catch (error) {
        console.warn(
          '\n⚠️ Unable to download resource from CDN. Please handle this file manually!',
          src
        );
        console.error(error.message);
      }
    }

    const styles = doc.getElementsByTagName('style');
    styles.forEach((style) => {
      const inline = style.innerHTML;
      if (inline) {
        headInlines.push(style.outerHTML);
      }
    });

    const links = doc.getElementsByTagName('link');
    for (const link of links) {
      const rel = link.getAttribute('rel');
      const href = link.getAttribute('href');
      try {
        if (rel === 'stylesheet') {
          let filename = href;
          if (href.includes('://')) {
            filename = href.substring(href.lastIndexOf('/') + 1);
            filename = `cdn.` + filename;
            const response = await axiosClient({
              method: 'get',
              url: href,
              responseType: 'stream',
            });
            const fileStream = fs.createWriteStream(`${outputDir}/${filename}`);
            response.data.pipe(fileStream);

            await new Promise((resolve, reject) => {
              fileStream.on('finish', resolve);
              fileStream.on('error', reject);
            });
          }
          listCSS.push(filename);
        }
      } catch (error) {
        console.error(
          '\n⚠️ Unable to download resource from CDN. Please handle this file manually!',
          href
        );
        console.error(error.message);
      }
    }

    const metas = doc.getElementsByTagName('meta');
    metas.forEach((meta) => {
      headInlines.push(meta.outerHTML);
    });

    if (rootElement && rootElement !== '#app') {
      let html = `<${rootElement} />`;
      if (rootElement.startsWith('#')) {
        html = `<div id="${rootElement.substring(1)}" />`;
      }
      if (rootElement.startsWith('.')) {
        html = `<div class="${rootElement.substring(1)}" />`;
      }
      if (rootElement.startsWith('<')) {
        html = rootElement;
      }
      bodyInlines.unshift(html);
    }

    inlineJS += headInlines
      .map(
        (inline) =>
          `document.head.innerHTML += \`${inline.replaceAll('`', '\\`')}\`;`
      )
      .join('\n');
    inlineJS += '\n';
    inlineJS += bodyInlines
      .map(
        (inline) =>
          `document.body.innerHTML += \`${inline.replaceAll('`', '\\`')}\`;`
      )
      .join('\n');
    listSyncJS.unshift('inline.js');
  } catch (error) {
    console.error(error.message);
  }
  return { listCSS, listSyncJS, listAsyncJS, inlineJS };
}

module.exports = {
  generateListResourcesFromIndex,
};
