# rustclock

A desktop clock built with Tauri 2, React 19, TypeScript, and Vite. It combines a digital time display with circular hour, minute, and second indicators in a transparent, frameless window.

## Screenshots

<p align="center">
  <img src="docs/screenshots/clock-default.png" alt="Centered rustclock display" width="45%" />
  <img src="docs/screenshots/clock-close-button.png" alt="rustclock display with the close button revealed on hover" width="45%" />
</p>

## Features

- Local time in `HH:mm:ss` format, updated every second.
- A 12-hour ring and 60-position minute and second rings, with green hour/minute indicators and a red second indicator.
- Bold white numbers in Montserrat Alternates.
- A fixed-size clock that remains centered as the window is resized.
- A centered clock at rest. On hover, the clock slides left and a close button emerges to its right; both return when the pointer leaves.
- Reduced-motion support for the animations.
- Drag the window from the clock or surrounding non-interactive area.
- A system tray icon configured from `src-tauri/icons/icon.ico`.

## Development

Install Node.js compatible with the Vite version in `package.json`, pnpm, and a Rust toolchain with Cargo and Rust 2024 edition support. You also need the native Tauri build prerequisites for your operating system; on Windows, these include the MSVC C++ build tools and WebView2 runtime.

From the repository root:

```sh
pnpm install
pnpm tauri dev
```

Tauri starts the Vite server at `http://localhost:1420` and opens the desktop window. The initial configured window size is 800 × 600.

For frontend-only development:

```sh
pnpm dev
```

Open `http://localhost:1420` in a browser to preview the clock. Native window dragging and closing require the Tauri desktop runtime.

## Build and checks

| Command | Purpose |
| --- | --- |
| `pnpm build` | Check TypeScript and build the frontend into `dist/`. |
| `pnpm preview` | Serve the built frontend locally. |
| `pnpm tauri build` | Build the desktop executable and platform bundles. |
| `cargo check --manifest-path src-tauri/Cargo.toml` | Check the Rust backend. |

With Cargo's default target directory, desktop bundles are written under `src-tauri/target/release/bundle/`. Tauri runs `pnpm build` automatically before packaging. There is currently no automated test suite or test script.

## Project layout and customization

| Location | Contents |
| --- | --- |
| `src/App.tsx` | Window dragging and composition of the clock and close button. |
| `src/App.css` | Centering, fixed shadow size, spacing, and hover transitions. |
| `src/components/clock/` | Time updates, circular indicators, typography, and indicator colors. |
| `src/components/closeButton/` | Close action, SVG icon, and button styles. |
| `src-tauri/src/lib.rs` | Native application startup, plugin registration, and Rust commands. |
| `src-tauri/tauri.conf.json` | Window settings, tray icon, build commands, and application bundle icons. |
| `src-tauri/capabilities/` | Permissions for native APIs and plugins. |
| `src-tauri/icons/` | Application and tray icon assets. |

Change the clock radius, marker sizes, active colors, and number styling in the clock component's CSS. The clock size, button spacing, and animation duration are defined in `src/App.css`; keep the stage's `--clock-size` consistent with the clock container dimensions.

The tray uses `app.trayIcon.iconPath` in `src-tauri/tauri.conf.json`, currently `icons/icon.ico`. Replace it with a valid ICO file and restart the desktop build to apply the change. The application bundle also references separate PNG and ICNS assets; replacing the ICO alone does not update those files.

## Current limitations

- Montserrat Alternates is loaded from Google Fonts in `index.html`. Without network access, the clock uses a sans-serif fallback.
- The tray currently has an icon and tooltip only; no tray menu or click actions are implemented. The close button closes the window rather than hiding it to the tray.
- The autostart plugin is registered, but the app does not enable startup at login or provide a toggle for it.
- The window-state plugin is configured in the Rust startup code, including position and size persistence. Both window-state and autostart currently have duplicate registrations in `lib.rs` that should be consolidated.
- The fixed layout may overflow windows smaller than the clock and button group.
