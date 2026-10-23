import type { MouseEvent } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ClockComponent } from "./components/clock/clock.component";
import "./App.css";
import { CloseButtonComponent } from "./components/closeButton/closeButton.component";

// Conserva aquí tu importación de ClockComponent.

function App() {
	function handleMouseDown(event: MouseEvent<HTMLElement>) {
		if (event.button !== 0) return;

		// Permite agregar botones o ajustes sin iniciar el arrastre.
		const target = event.target as Element;

		if (target.closest("button, input, select, textarea, a, [data-no-drag]")) {
			return;
		}

		event.preventDefault();

		void getCurrentWindow().startDragging().catch(console.error);
	}

	return (
		<main className="container" onMouseDown={handleMouseDown}>
			<div className="clock-stage">
				<div className="clock-container">
					<ClockComponent />
				</div>
				<div className="close-button">
					<CloseButtonComponent />
				</div>
			</div>
		</main>
	);
}

export default App;
