#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const marketplace = readJson('.claude-plugin/marketplace.json');
assert(Array.isArray(marketplace.plugins) && marketplace.plugins.length > 0, 'marketplace must publish at least one plugin');

const names = new Set();
for (const entry of marketplace.plugins) {
  assert(entry.name && !names.has(entry.name), `duplicate or missing marketplace plugin name: ${entry.name ?? ''}`);
  names.add(entry.name);

  const pluginRoot = path.resolve(root, entry.source);
  assert(pluginRoot.startsWith(`${root}${path.sep}`), `plugin source escapes the repository: ${entry.source}`);
  assert(fs.statSync(pluginRoot).isDirectory(), `plugin source is not a directory: ${entry.source}`);

  const manifestPath = path.join(pluginRoot, '.claude-plugin/plugin.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifest.name === entry.name, `${entry.name} manifest name does not match marketplace`);
  assert(manifest.version === entry.version, `${entry.name} manifest version does not match marketplace`);

  const mcpPath = path.resolve(pluginRoot, manifest.mcpServers);
  assert(mcpPath.startsWith(`${pluginRoot}${path.sep}`), `${entry.name} MCP path escapes the plugin`);
  const mcp = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
  assert(Object.keys(mcp.mcpServers ?? {}).length > 0, `${entry.name} must configure at least one MCP server`);

  const skillsRoot = path.join(pluginRoot, 'skills');
  const skillDirectories = fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((item) => item.isDirectory());
  assert(skillDirectories.length > 0, `${entry.name} must include at least one skill`);
  for (const directory of skillDirectories) {
    const skillPath = path.join(skillsRoot, directory.name, 'SKILL.md');
    const source = fs.readFileSync(skillPath, 'utf8');
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
    assert(frontmatter, `${entry.name}/${directory.name} is missing YAML frontmatter`);
    const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    assert(name === directory.name, `${entry.name}/${directory.name} frontmatter name does not match its directory`);
    assert(description, `${entry.name}/${directory.name} is missing a description`);
  }
}

console.log(`Validated ${marketplace.plugins.length} plugin(s).`);
