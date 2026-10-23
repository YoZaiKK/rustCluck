import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const { closeWindow, startDragging } = vi.hoisted(() => ({
  closeWindow: vi.fn(),
  startDragging: vi.fn(),
}));

vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => ({ close: closeWindow, startDragging }),
}));

describe("App close button", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    closeWindow.mockResolvedValue(undefined);
    startDragging.mockResolvedValue(undefined);
  });

  it.each(["button", "icon"])("closes without dragging when clicking the %s", async (target) => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole("button", { name: "Cerrar reloj" });
    const element = target === "icon" ? button.querySelector("path")! : button;

    await user.click(element);

    expect(closeWindow).toHaveBeenCalledTimes(1);
    expect(startDragging).not.toHaveBeenCalled();
  });
});
