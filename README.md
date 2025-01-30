 # Codebase Context Generator (NEED A NAME)

> Early-stage VS Code extension for generating AI-friendly codebase context snapshots

## Development Status

`ALPHA` | Active development | Not production-ready

## Key Features (Current Implementation)

- **Smart context generation**
  - File tree visualization with Markdown formatting
  - Automatic exclusion of build artifacts/node_modules
  - Configurable file size limits (default: 1MB)
- **Webview UI**
  - Real-time configuration management
  - Progress tracking with cancellation support
  - Dual-scope exclusions (workspace/global)
- **Core Systems**
  - Cancellation token architecture
  - VS Code configuration sync
  - Clipboard integration
