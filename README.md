# Codebase Context Generator

A VS Code extension that generates shareable codebase context for AI-powered development assistants. Perfect for sharing code context with AI tools, creating documentation snapshots, or preparing code for technical discussions.

## Features

- **Full Codebase Export**: Generate context from your entire codebase with intelligent exclusions
- **Selective File Export**: Choose specific files to include in your context
- **Smart Exclusions**: Automatically excludes common build artifacts, dependencies, and sensitive files
- **Syntax Highlighting**: Proper code formatting with language-specific syntax highlighting
- **File Tree Visualization**: Clear visualization of your project structure
- **Security First**: Built-in protection against exposing sensitive information

## Installation

1. Download the `.vsix` file from the latest release
2. Open VS Code
3. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
4. Type "Install from VSIX" and select it
5. Choose the downloaded `.vsix` file

## Usage

### Generate Full Codebase Context

1. Open your project in VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
3. Type "Generate Codebase Context" and select it
4. The context will be generated and automatically copied to your clipboard

### Generate Context from Selected Files

1. Open your project in VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
3. Type "Generate Context from Selected Files" and select it
4. Choose the files you want to include
5. The context will be generated and automatically copied to your clipboard

## Configuration

You can customize the extension's behavior through VS Code settings:

- `codebaseContext.excludePatterns`: Array of glob patterns for files to exclude
- `codebaseContext.maxFileSizeKB`: Maximum file size to include (in KB)
- `codebaseContext.headerTemplate`: Template for the context header

Example settings.json:

```json
{
  "codebaseContext.maxFileSizeKB": 2048,
  "codebaseContext.headerTemplate": "# Project: {projectName}\nDate: {date}"
}
```

## Smart Exclusions

The extension automatically excludes common patterns:

- Build artifacts (**dist/**, **build/**, **.next/**, etc.)
- Dependencies (**node_modules/**, **vendor/**, etc.)
- Environment files (**.env***)
- Lock files (**package-lock.json**, **yarn.lock**)
- Cache directories (**.cache/**, **pycache/**, etc.)
- IDE files (**.vscode/**, **.idea/**, etc.)
- Minified files (**\*.min.\***)
- Source maps (**\*.map**)
- And more...

## Security

The extension is designed with security in mind:

- Automatic exclusion of sensitive files
- Size limits to prevent accidental large file sharing
- Local processing (no cloud dependencies)
- Configurable exclusion patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

- 0.1.0-alpha
  - Initial release
  - Full codebase context generation
  - Selective file context generation
  - Smart exclusions
  - Syntax highlighting
  - File tree visualization
