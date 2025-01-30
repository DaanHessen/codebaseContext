# Technical Specification

## Architecture Overview

## Delta Generation System

### Components

1. **Version Snapshotter**
   - Stores lightweight manifest of previous state
   - Records file hashes and metadata
2. **Diff Engine**
   - Compares current vs previous file states
   - Generates unified diffs with line markers
3. **Change Visualizer**
   - Formats diffs for human/AI consumption
   - Applies color coding through ANSI/VSCode theming

### Output Example

```markdown
## Changes since 2023-07-20

### src/utils.js (Modified 45%)
```diff
 function calculateTotal(items) {
-  return items.reduce((acc, item) => acc + item.price, 0);
+  return items.filter(i => i.inStock).reduce((acc, item) => acc + item.price, 0);
 }
```

### config.json (Removed)

❗ File removed from codebase

``` md
