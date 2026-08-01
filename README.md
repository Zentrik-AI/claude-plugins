# Zentrik plugins for Claude Code

Claude Code plugins published by [Zentrik](https://zentrik.ai).

This repository is a plugin marketplace. Adding it registers the catalog with Claude Code; you then install the plugins you want.

## Install

```bash
claude plugin marketplace add Zentrik-AI/claude-plugins
```

```bash
claude plugin install zentrik@zentrik
```

Then run `/reload-plugins` to activate it in a running session.

Inside Claude Code you can use the interactive equivalents, `/plugin marketplace add Zentrik-AI/claude-plugins` and `/plugin`.

## Start here

Once the connector is authenticated, ask Claude about whatever you are already working on:

> What does our workspace know about the thing I'm building?

You get back the initiative behind the work, what customers actually said, and the questions still open, each with the Zentrik record ID so you can check it. If the workspace turns out to be empty, Claude says so and offers to set it up rather than inventing an answer.

## Plugins

### `zentrik`

Connects Claude to the product context your team keeps in Zentrik: customer signals, insights, ideas, opportunities, initiatives, accounts, OKRs, product context, personas, and feature maps.

The plugin bundles the production Zentrik remote MCP connector with three skills:

| Skill | What it does |
|---|---|
| `/zentrik:brief-product-work` | Briefs the work in front of you with the decisions, customer evidence, and open questions the workspace already holds, each attributed to a record ID. Reads only, so it needs no approval and works for read-only roles. |
| `/zentrik:set-up-product-workspace` | Inventories the connected workspace, asks for the smallest missing set of first-party sources, routes each one to the correct Zentrik surface, applies only approved changes, and returns a setup receipt with tool-returned IDs and the next highest-value actions. |
| `/zentrik:import-product-evidence` | Imports supplied calls, tickets, reviews, feedback, or research as evidence, one coherent source per call, with a preview and approval step for batches or ambiguous metadata. |

Claude also invokes these automatically when the task matches.

## Authentication

The bundled connector points at `https://zentrik.ai/mcp`. Claude opens Zentrik OAuth when authentication is required.

During consent you choose one Zentrik workspace. The resulting access stays bounded by that workspace, your Zentrik role, and the granted OAuth scopes. Read-only use works for Viewer roles; creating, updating, or importing records requires a write-capable role such as Editor, Admin, or Owner.

The plugin contains no credentials and no local executable code. If you already have a Claude connection to the same endpoint, the client may reuse it.

## Requirements

A Zentrik account and membership in at least one Zentrik workspace. No API key.

Briefing is worth most against a workspace that already holds product context or Discovery data. An empty workspace connects fine and Claude will tell you plainly that there is nothing to retrieve rather than filling the gap with generic advice; `set-up-product-workspace` exists for exactly that case.

## Documentation and support

- Connector setup guide: https://zentrik.ai/docs/integrations/mcp-claude
- MCP reference: https://zentrik.ai/docs/integrations/mcp
- Support: support@zentrik.ai
- Privacy: https://zentrik.ai/privacy · Security: https://zentrik.ai/security

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
