import * as readline from "readline/promises";
import * as fs from "fs/promises";
import path from "path";

class SystemGenerator {
  /**
   *
   * @param {string} title
   * @param {string} systemId
   * @param {string} namespace
   * @param {string} i18n
   */
  constructor(title, systemId, namespace, i18n) {
    /**
     * The system's title
     * @type {string}
     */
    this.title = title;

    /**
     * The system's ID
     * @type {string}
     */
    this.systemId = systemId;

    /**
     * The system's namespace
     * @type {string}
     */
    this.systemNamespace = namespace;

    /**
     * The system's i18n path
     * @type {string}
     */
    this.i18n = i18n;
  }

  /**
   * The original strings to replace
   */
  get originals() {
    return {
      title: "Foundry System Template",
      systemId: "foundry-system-template",
      systemNamespace: "foundrySystemTemplate",
      i18n: "FoundrySystemTemplate",
    };
  }

  /**
   * The list of directories to copy
   * @type {string[]}
   */
  get targetDirs() {
    return [".vscode/", "assets/", "lang/", "module/", "styles/", "templates/", "tools/"];
  }

  get targetFiles() {
    return [
      ".editorconfig",
      ".gitattributes",
      ".gitignore",
      "CHANGELOG.md",
      "eslint.config.mjs",
      "example-foundry-config.yaml",
      "index.mjs",
      "jsconfig.json",
      "package-lock.json",
      "package.json",
      "README.md",
      "system.json",
    ];
  }

  get systemFolder() {
    return path.join("..", this.systemId);
  }

  async build() {
    for (const folder of this.targetDirs) {
      await fs.cp(folder, path.join(this.systemFolder, folder), {
        recursive: true,
      });
    }
    for (const f of this.targetFiles) {
      await fs.copyFile(f, path.join(this.systemFolder, f));
    }

    await this.updateSystemID();

    await this.updateI18N();

    await this.updateNamespace();
  }

  /**
   * Updates system.json, package.json, and css files
   */
  async updateSystemID() {
    const manifestPath = path.join(this.systemFolder, "system.json");

    // Find and Replace
    const manifest = JSON.parse(await fs.readFile(manifestPath));

    manifest.id = this.systemId;
    manifest.title = this.title;
    manifest.background = manifest.background.replace(this.originals.systemId, this.systemId);
    Object.assign(manifest.media[0], {
      url: manifest.media[0].url.replace(this.originals.systemId, this.systemId),
      thumbnail: manifest.media[0].thumbnail.replace(this.originals.systemId, this.systemId),
    });

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    for await (const file of fs.glob("styles/**/*.css", { cwd: this.systemFolder })) {
      const filePath = path.join(this.systemFolder, file);
      const data = await fs.readFile(filePath);
      const contents = data.toString();
      const newContents = contents.replaceAll(this.originals.systemId, this.systemId);
      await fs.writeFile(filePath, newContents);
    }

    for (const file of ["package.json", "package-lock.json"]) {
      const filePath = path.join(this.systemFolder, file);
      const data = await fs.readFile(filePath);
      const contents = data.toString();
      const newContents = contents.replaceAll(this.originals.systemId, this.systemId);
      await fs.writeFile(filePath, newContents);
    }
  }

  /**
   * Update all ESM & Template files to use the right i18n paths.
   * Also updates the ESM files to use the right system ID
   */
  async updateI18N() {
    for await (const file of fs.glob("module/**/*.mjs", { cwd: this.systemFolder })) {
      const filePath = path.join(this.systemFolder, file);
      const data = await fs.readFile(filePath);
      const contents = data.toString();
      const newContents = contents.replaceAll(this.originals.i18n, this.i18n).replaceAll(this.originals.systemId, this.systemId);
      await fs.writeFile(filePath, newContents);
    }

    for await (const file of fs.glob("templates/**/*.hbs", { cwd: this.systemFolder })) {
      const filePath = path.join(this.systemFolder, file);
      const data = await fs.readFile(filePath);
      const contents = data.toString();
      const newContents = contents.replaceAll(this.originals.i18n, this.i18n);
      await fs.writeFile(filePath, newContents);
    }

    const langFile = path.join(this.systemFolder, "lang", "en.json");
    const data = await fs.readFile(langFile);
    const contents = data.toString();
    const newContents = contents.replaceAll(this.originals.i18n, this.i18n);
    await fs.writeFile(langFile, newContents);
  }

  /**
   * Update the index file to use the correct global namespace
   */
  async updateNamespace() {
    const indexFile = path.join(this.systemFolder, "index.mjs");
    const data = await fs.readFile(indexFile);
    const contents = data.toString();
    const newContents = contents.replaceAll(this.originals.systemNamespace, this.systemNamespace);
    await fs.writeFile(indexFile, newContents);
  }
}

let title = "Foundry System Template";
let systemId = "foundry-system-template";
let systemNamespace = "foundrySystemTemplate";
let i18n = "FoundrySystemTemplate";

/**
 * Converts the title case to kebab-case
 * @param {string} input
 * @returns {string}
 */
function titleToKebab(input) {
  const stripSpecial = input.replaceAll(/[^A-Za-z0-9-_ ]/g, "");
  return stripSpecial.replaceAll(" ", "-").toLowerCase();
}

/**
 * Converts the title case to camelCase
 * @param {string} input
 * @returns {string}
 */
function titleToCamel(input) {
  const stripSpecial = input.replaceAll(/[^A-Za-z0-9-_ ]/g, "");
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
  return stripSpecial.split(" ").map((v, i) => i ? capitalize(v) : v.toLowerCase()).join("");
}

/**
 * Converts the title case to SNAKE_CAPS
 * @param {string} input
 * @returns {string}
 */
function titleToSnakeCaps(input) {
  const stripSpecial = input.replaceAll(/[^A-Za-z0-9-_ ]/g, "");
  return stripSpecial.replaceAll(" ", "_").toUpperCase();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

title = await rl.question("System Title?\n");

const allowedId = /^[A-Za-z0-9-_]+$/;
let validID = false;
let message = `System ID? Package IDs may only be alphanumeric with hyphens or underscores. This will also be the name of the folder for your system.\nDefault: ${titleToKebab(title)}\n`;
while (!validID) {
  systemId = await rl.question(message);
  systemId ||= titleToKebab(title);
  validID = allowedId.test(systemId);
  if (!validID) console.error("Invalid System ID");
}

const allowedNamespace = /^[A-Za-z0-9_]+$/;
let validNamespace = false;
message = `Global System Namespace? Convention is to use camelCase.\nDefault: ${titleToCamel(title)}\n`;
while (!validNamespace) {
  systemNamespace = await rl.question(message);
  systemNamespace ||= titleToCamel(title);
  validNamespace = allowedNamespace.test(systemNamespace);
  if (!validNamespace) console.error("Invalid System Namespace!");
}

let validI18N = false;
message = `Localization Namespace? Convention is to use SNAKE_CAPS.\nDefault: ${titleToSnakeCaps(title)}\n`;
while (!validI18N) {
  i18n = await rl.question(message);
  i18n ||= titleToSnakeCaps(title);
  validI18N = allowedNamespace.test(i18n);
  if (!validI18N) console.error("Invalid I18N Namespace");
}

rl.close();

const generator = new SystemGenerator(title, systemId, systemNamespace, i18n);

generator.build();
