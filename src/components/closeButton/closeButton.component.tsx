import { getCurrentWindow } from "@tauri-apps/api/window";
import "./closeButton.component.css";

export const CloseButtonComponent = () => {
	async function handleClose() {
		try {
			await getCurrentWindow().close();
		} catch (error) {
			console.error("Failed to close the clock:", error);
		}
	}
	return (
		<div className="close-button-widget">
			<button className="btn btn--trash" type="button" onClick={handleClose} aria-label="Cerrar reloj">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="1em"
					height="1em"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
					focusable="false"
					className="btn__icon"
				>
					<path d="M3 6h18" />
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
					<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
					<path d="M10 11v6" />
					<path d="M14 11v6" />
				</svg>
			</button>
		</div>
	);
};
