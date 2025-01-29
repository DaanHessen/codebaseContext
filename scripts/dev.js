const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const extensionDir = path.resolve(__dirname, '..');
const distDir = path.join(extensionDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Start webpack in watch mode
const webpack = spawn('npm', ['run', 'watch'], {
    stdio: 'inherit',
    shell: true
});

let isFirstBuild = true;

// Watch for changes in dist/extension.js
fs.watch(distDir, (eventType, filename) => {
    if (filename === 'extension.js') {
        if (isFirstBuild) {
            console.log('\n✅ Initial build complete - VS Code debug session can now start');
            isFirstBuild = false;
        } else {
            console.log('\n🔄 Extension rebuilt - Ready to reload window in VS Code (Ctrl+R/Cmd+R)');
        }
    }
});

// Cleanup on exit
process.on('SIGINT', () => {
    webpack.kill();
    process.exit();
}); 