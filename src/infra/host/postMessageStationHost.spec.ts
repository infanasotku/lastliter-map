import { PostMessageStationHost } from "@/infra/host/postMessageStationHost";
import { hostTest } from "@/test/fixtures/host";
import { makeStation } from "@/test/fixtures/stations";
import { afterEach, expect, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
});

hostTest(
  "receives station context from the admin host",
  async ({ notifications, parentWindow }) => {
    const host = new PostMessageStationHost(notifications);
    const contextPromise = host.getContext();
    const station = makeStation();

    window.dispatchEvent(
      new MessageEvent("message", {
        source: parentWindow.window,
        origin: "http://localhost:8000",
        data: {
          type: "lastliter:admin-context",
          version: 2,
          mode: "admin",
          capabilities: { openStation: true },
          stations: [station],
        },
      }),
    );

    await expect(contextPromise).resolves.toEqual({
      stations: [station],
      canOpenStation: true,
    });
    expect(host.hasHost()).toBe(true);
    expect(host.canOpenStation()).toBe(true);
    expect(parentWindow.postMessage).toHaveBeenCalledWith(
      { type: "lastliter:map-ready", version: 2 },
      "*",
    );
  },
);

hostTest(
  "asks the admin host to open a station",
  async ({ notifications, parentWindow }) => {
    const host = new PostMessageStationHost(notifications);
    const contextPromise = host.getContext();

    window.dispatchEvent(
      new MessageEvent("message", {
        source: parentWindow.window,
        data: {
          type: "lastliter:admin-context",
          version: 2,
          mode: "admin",
          capabilities: { openStation: true },
          stations: [makeStation()],
        },
      }),
    );
    await contextPromise;

    host.openStation("station-42");

    expect(parentWindow.postMessage).toHaveBeenLastCalledWith(
      {
        type: "lastliter:station-open",
        version: 2,
        stationId: "station-42",
      },
      "*",
    );
  },
);

hostTest(
  "reports an incompatible protocol version",
  async ({ notifications, parentWindow }) => {
    const host = new PostMessageStationHost(notifications);
    const contextPromise = host.getContext();

    window.dispatchEvent(
      new MessageEvent("message", {
        source: parentWindow.window,
        data: {
          type: "lastliter:admin-context",
          version: 1,
        },
      }),
    );

    await expect(contextPromise).resolves.toBeNull();
    expect(notifications.error).toHaveBeenCalledWith(
      "Несовместимая версия карты и панели администратора (карта: 2, панель: 1)",
    );
  },
);

hostTest(
  "reports a context request timeout",
  async ({ notifications, parentWindow }) => {
    void parentWindow;
    vi.useFakeTimers();
    const host = new PostMessageStationHost(notifications);

    const contextPromise = host.getContext();
    await vi.advanceTimersByTimeAsync(1_500);

    await expect(contextPromise).resolves.toBeNull();
    expect(notifications.error).toHaveBeenCalledWith(
      "Не удалось получить данные станций от панели администратора",
    );
  },
);
