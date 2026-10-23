import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CloseButtonComponent } from "./closeButton.component";

const { closeWindow, getCurrentWindow } = vi.hoisted(() => ({
  closeWindow: vi.fn(),
  getCurrentWindow: vi.fn(),
}));

vi.mock("@tauri-apps/api/window", () => ({ getCurrentWindow }));

describe("CloseButtonComponent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    closeWindow.mockResolvedValue(undefined);
    getCurrentWindow.mockReturnValue({ close: closeWindow });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders an accessible close button without closing the window", () => {
    render(<CloseButtonComponent />);

    expect(screen.getByRole("button", { name: "Cerrar reloj" })).toBeEnabled();
    expect(getCurrentWindow).not.toHaveBeenCalled();
    expect(closeWindow).not.toHaveBeenCalled();
  });

  it("closes the current window when clicked", async () => {
    const user = userEvent.setup();
    render(<CloseButtonComponent />);

    await user.click(screen.getByRole("button", { name: "Cerrar reloj" }));

    expect(getCurrentWindow).toHaveBeenCalledTimes(1);
    expect(closeWindow).toHaveBeenCalledTimes(1);
  });

  it("closes the window when the SVG icon is clicked", async () => {
    const user = userEvent.setup();
    render(<CloseButtonComponent />);
    const icon = screen.getByRole("button", { name: "Cerrar reloj" }).querySelector("svg");
    expect(icon).not.toBeNull();

    await user.click(icon!);

    expect(closeWindow).toHaveBeenCalledTimes(1);
  });

  it.each(["{Enter}", " "])("supports keyboard activation with %s", async (key) => {
    const user = userEvent.setup();
    render(<CloseButtonComponent />);
    const button = screen.getByRole("button", { name: "Cerrar reloj" });

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard(key);

    expect(closeWindow).toHaveBeenCalledTimes(1);
  });

  it("reports a rejected close request", async () => {
    const error = new Error("Close permission denied");
    closeWindow.mockRejectedValueOnce(error);
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<CloseButtonComponent />);

    await user.click(screen.getByRole("button", { name: "Cerrar reloj" }));

    await waitFor(() => {
      expect(logError).toHaveBeenCalledWith("Failed to close the clock:", error);
    });
    expect(closeWindow).toHaveBeenCalledTimes(1);
  });

  it("reports a failure to access the native window", async () => {
    const error = new Error("Native window unavailable");
    getCurrentWindow.mockImplementationOnce(() => { throw error; });
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<CloseButtonComponent />);

    await user.click(screen.getByRole("button", { name: "Cerrar reloj" }));

    expect(logError).toHaveBeenCalledWith("Failed to close the clock:", error);
    expect(closeWindow).not.toHaveBeenCalled();
  });
});
