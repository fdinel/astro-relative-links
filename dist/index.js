import { writeFileSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
/**
 * Add leading and trailing slashes to the `base`.
 *
 * @param {string} base
 * @returns {string} - Formatted base.
 */
export function leadingTrailingSlash(base) {
    return base?.replace(/^\/*([^\/]+)(.*)([^\/]+)\/*$/, '/$1$2$3/') || '/';
}
const pattern = {
    htmlAttr: `(href|(data-)?src(set)?|poster|component-url|renderer-url)=["']?([^"']*,)?`,
    styleAttr: `style=("[^"]*|'[^']*|[^\\s]*)`,
    styleUrl: `url\\(\\s*?["']?`,
};
/**
 * Replace absolute paths in HTML files with relative paths.
 *
 * @param {object} options
 * @param {string} options.outDirPath - The path of the directory that `astro build` writes final build to.
 * @param {string} options.filePath - The path of the target file.
 * @param {string} options.base - The base path to deploy to.
 * @param {string} options.html - The content of the HTML file.
 * @returns {string} - Replaced HTML
 */
export function replaceHTML({ outDirPath, filePath, base, html, }) {
    const { htmlAttr, styleAttr, styleUrl } = pattern;
    const arlSkipPattern = `(?!(\/|[^>]*arl:skip))(?=[^>]*>)`;
    const htmlPattern = `<${arlSkipPattern}[^>]+\\s(${htmlAttr}|${styleAttr}${styleUrl})`;
    const cssPattern = `<style>[^<]*` + styleUrl;
    const regex = new RegExp(`(?<=(${htmlPattern}|${cssPattern})\\s*?)${base}${arlSkipPattern}`, 'gm');
    const relativePath = path
        .relative(path.dirname(filePath), outDirPath)
        .split(path.sep)
        .join(path.posix.sep) || '.';
    return html
        .replace(regex, `${relativePath}/`)
        .replace(new RegExp('\\s+arl:skip', 'gm'), '');
}
/**
 * Replace absolute paths in CSS files with relative paths.
 *
 * @param {object} options
 * @param {string} options.outDirPath - The path of the directory that `astro build` writes final build to.
 * @param {string} options.filePath - The path of the target file.
 * @param {string} options.base - The base path to deploy to.
 * @param {string} options.css - The content of the CSS file.
 * @returns {string} - Replaced CSS
 */
export function replaceCSS({ outDirPath, filePath, base, css, }) {
    const { styleUrl } = pattern;
    const regex = new RegExp(`(?<=` + styleUrl + `\\s*?)${base}(?!\/)`, 'gm');
    const relativePath = path
        .relative(path.dirname(filePath), outDirPath)
        .split(path.sep)
        .join(path.posix.sep) || '.';
    return css.replace(regex, `${relativePath}/`);
}
function relativeLinks({ config }) {
    const base = leadingTrailingSlash(config?.base);
    return {
        name: 'relative-links',
        hooks: {
            'astro:build:done': async ({ dir }) => {
                // Use fileURLToPath to get a valid, cross-platform absolute path string
                const outDirPath = fileURLToPath(dir);
                try {
                    // HTML
                    globSync(`${decodeURI(dir.pathname)}**/*.html`).forEach((filePath) => {
                        writeFileSync(filePath, replaceHTML({
                            outDirPath,
                            filePath,
                            base,
                            html: readFileSync(filePath, 'utf8'),
                        }), 'utf8');
                    });
                    // CSS
                    globSync(`${decodeURI(dir.pathname)}**/*.css`).forEach((filePath) => {
                        writeFileSync(filePath, replaceCSS({
                            outDirPath,
                            filePath,
                            base,
                            css: readFileSync(filePath, 'utf8'),
                        }), 'utf8');
                    });
                }
                catch (error) {
                    console.log(error);
                }
            },
        },
    };
}
export default function () {
    return {
        name: 'relative-links',
        hooks: {
            'astro:config:setup': ({ config, updateConfig }) => {
                updateConfig({
                    // Pass the Astro config to the `astro:build:done` hook
                    integrations: [relativeLinks({ config })],
                });
            },
        },
    };
}
