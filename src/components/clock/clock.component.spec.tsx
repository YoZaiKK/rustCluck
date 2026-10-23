import { StrictMode } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClockComponent } from "./clock.component";

function expectActiveIndicator(unit: "hours" | "minutes" | "seconds", index: number) {
  const ring = screen.getByRole("timer").querySelector(`.clock-widget__ring--${unit}`);
  expect(ring).not.toBeNull();
  expect(ring!.querySelectorAll(".clock-widget__dot--active")).toHaveLength(1);
  expect(ring!.children[index]).toHaveClass("clock-widget__dot--active");
}

function advanceSecond() {
  act(() => { vi.advanceTimersByTime(1000); });
}

describe("ClockComponent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 22, 13, 5, 9));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("muestra la hora local en formato de 24 horas", () => {
    render(<ClockComponent />);
    expect(screen.getByRole("timer")).toHaveTextContent("13:05:09");
  });

  it("expone la hora accesible sin anunciar cada segundo", () => {
    render(<ClockComponent />);
    expect(screen.getByRole("region", { name: "Reloj" })).toBeInTheDocument();
    expect(screen.getByRole("timer", { name: "13:05:09" })).toHaveAttribute("aria-live", "off");
  });

  it("mantiene sincronizado el atributo datetime", () => {
    render(<ClockComponent />);
    expect(screen.getByRole("timer").querySelector("time")).toHaveAttribute("datetime", "13:05:09");
    advanceSecond();
    expect(screen.getByRole("timer").querySelector("time")).toHaveAttribute("datetime", "13:05:10");
  });

  it.each([
    [0, 0, 0, "00:00:00"],
    [1, 2, 3, "01:02:03"],
    [12, 0, 0, "12:00:00"],
    [23, 59, 59, "23:59:59"],
  ])("formatea %i:%i:%i como %s", (hour, minute, second, expected) => {
    vi.setSystemTime(new Date(2026, 9, 22, hour, minute, second));
    render(<ClockComponent />);
    expect(screen.getByRole("timer", { name: expected })).toHaveTextContent(expected);
  });

  it("actualiza la hora y el indicador de segundos cada segundo", () => {
    render(<ClockComponent />);
    advanceSecond();
    expect(screen.getByRole("timer", { name: "13:05:10" })).toHaveTextContent("13:05:10");
    expectActiveIndicator("seconds", 10);
    expectActiveIndicator("minutes", 5);
  });

  it.each([
    [10, 5, 59, "10:06:00", 10, 6],
    [10, 59, 59, "11:00:00", 11, 0],
    [11, 59, 59, "12:00:00", 0, 0],
    [23, 59, 59, "00:00:00", 0, 0],
  ])("sincroniza los anillos al avanzar desde %i:%i:%i", (hour, minute, second, expected, activeHour, activeMinute) => {
    vi.setSystemTime(new Date(2026, 9, 22, hour, minute, second));
    render(<ClockComponent />);
    advanceSecond();
    expect(screen.getByRole("timer", { name: expected })).toHaveTextContent(expected);
    expectActiveIndicator("hours", activeHour);
    expectActiveIndicator("minutes", activeMinute);
    expectActiveIndicator("seconds", 0);
  });

  it.each([[0, 0], [12, 0], [13, 1], [23, 11]])(
    "representa las %i horas en la posicion %i del anillo de 12 horas",
    (hour, activeHour) => {
      vi.setSystemTime(new Date(2026, 9, 22, hour, 5, 9));
      render(<ClockComponent />);
      expectActiveIndicator("hours", activeHour);
      expectActiveIndicator("minutes", 5);
      expectActiveIndicator("seconds", 9);
    },
  );

  it("usa la hora actual del sistema tras un cambio del reloj", () => {
    render(<ClockComponent />);
    vi.setSystemTime(new Date(2026, 9, 22, 8, 30, 40));
    advanceSecond();
    expect(screen.getByRole("timer", { name: "08:30:41" })).toHaveTextContent("08:30:41");
    expectActiveIndicator("hours", 8);
    expectActiveIndicator("minutes", 30);
    expectActiveIndicator("seconds", 41);
  });

  it("elimina el temporizador al desmontarse", () => {
    const { unmount } = render(<ClockComponent />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("mantiene un solo temporizador bajo StrictMode", () => {
    const { unmount } = render(<StrictMode><ClockComponent /></StrictMode>);
    expect(vi.getTimerCount()).toBe(1);
    advanceSecond();
    expect(screen.getByRole("timer")).toHaveTextContent("13:05:10");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
