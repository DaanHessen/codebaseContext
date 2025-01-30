# Technical Decisions

## Platform Choice

- **VS Code Extension**: Direct integration with developer workflow
- **JavaScript**: Lower barrier to entry for initial implementation
- **VS Code Extension API**: Native integration capabilities
- **Node.js Runtime**: Full access to filesystem and extension APIs

## Exclusion System

- **Glob Patterns**: Industry-standard file matching
- **Layered Configuration**:
  1. Default security exclusions (.env, credentials)
  2. User-defined workspace patterns
  3. Per-command overrides

## Performance Considerations

- **Stream Processing**: For large file handling
- **Parallel Processing**: Concurrent file operations
- **Memory Management**: File size thresholds

## Output Design

- **Markdown First**: Human/AI readable format
- **Structured Sections**:
  - Custom header
  - File tree
  - Annotated code blocks
- **Alternate Formats**: Plaintext fallback

## Change Tracking System

- **Delta Generation**:
  - Compare against last generated snapshot
  - Use cryptographic hashing for file changes
- **Diff Visualization**:
  - Unified diff format display
  - Color-coded line changes (red/green)
  - Change percentage indicators
- **Version Storage**:
  - Local cache of last generated state
  - Automatic cleanup of old versions
- **Change States**:
  - 🟢 Unchanged (metadata only)
  - 🔴 Removed (with deletion notice)
  - 🟡 Modified (full diff display)
  - 🟦 New (full content)
  