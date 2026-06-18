# Material Icons

A JetBrains IDE plugin that brings the [Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) experience to IntelliJ-based products. It replaces project view file and folder icons and applies colorful icons to tool windows in the IDE sidebar.

## Features

- **Project view icons** — File and folder icons are resolved from the Material Icon Theme configuration (`material-icons.json`).
- **Colorful tool window icons** — Sidebar tool windows (Git, Terminal, Run, Debug, Problems, AI Chat, and more) use custom SVG icons with light/dark theme support.
- **New UI compatible** — Icon path patching covers both Classic UI and New UI (`expui`) resource paths where applicable.

## Requirements

- IntelliJ Platform **2025.1** or later (`sinceBuild = 251`)
- Compatible with IntelliJ IDEA Community/Ultimate and other JetBrains IDEs built on the same platform version

## Installation

### From source

1. Clone this repository.
2. Build the plugin:

   ```bash
   ./gradlew buildPlugin
   ```

3. Install the generated plugin archive from `build/distributions/` via **Settings → Plugins → ⚙ → Install Plugin from Disk…**

### Run in a sandbox IDE

```bash
./gradlew runIde
```

## Development

| Path | Description |
|------|-------------|
| `assets/icons/` | File and folder icons bundled into the plugin |
| `assets/material-icons.json` | Icon association rules from Material Icon Theme |
| `assets/color-icons/` | Colorful SVG icons for tool windows |
| `src/main/resources/color_toolwindow_icons.xml` | Maps IDE icon paths to colorful replacements |
| `src/main/kotlin/github/cweijan/materialicons/` | File icon providers and project view integration |
| `src/main/kotlin/github/cweijan/materialicons/toolwindow/` | Tool window icon patcher and lifecycle hooks |

### Adding a tool window icon

1. Place SVG files in `assets/color-icons/` (add a `_dark.svg` variant for dark theme when needed).
2. Register mappings in `src/main/resources/color_toolwindow_icons.xml`:

   ```xml
   <iconReplacement icon="/color-icons/your-icon.svg">
     <replacePath path="/toolwindows/toolWindowExample.svg" />
     <replacePath path="/icons/expui/toolwindows/example@20x20.svg" />
   </iconReplacement>
   ```

3. Rebuild and restart the IDE (or reload the plugin sandbox).

Dark theme icons are resolved automatically: for `your-icon.svg`, the patcher looks for `your-icon_dark.svg`.

## How it works

- **File icons** — `MaterialFileIconProvider` and `MaterialProjectViewDecorator` resolve icons using `material-icons.json`.
- **Tool window icons** — `ColorToolWindowIconsPatcher` is installed early via `AppLifecycleListener` and refreshes icons when a project opens or the look-and-feel changes.

## Credits

- File icon associations and artwork are based on the [VSCode Material Icon Theme](https://github.com/material-extensions/vscode-material-icon-theme) project.
- Tool window colorful icons are inspired by community plugins such as Extra ToolWindow Colorful Icons.

## License

This project is licensed under the [MIT License](LICENSE).
