import type { AstroIntegration } from 'astro';
/**
 * Add leading and trailing slashes to the `base`.
 *
 * @param {string} base
 * @returns {string} - Formatted base.
 */
export declare function leadingTrailingSlash(base?: string): string;
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
export declare function replaceHTML({ outDirPath, filePath, base, html, }: {
    outDirPath: string;
    filePath: string;
    base: string;
    html: string;
}): string;
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
export declare function replaceCSS({ outDirPath, filePath, base, css, }: {
    outDirPath: string;
    filePath: string;
    base: string;
    css: string;
}): string;
export default function (): AstroIntegration;
