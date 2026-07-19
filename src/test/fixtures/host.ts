import type { NotificationService } from "@/features/notifications/ports";
import { test as base, vi } from "vitest";

interface ParentWindowFixture {
  window: Window;
  postMessage: ReturnType<typeof vi.fn>;
}

interface HostFixtures {
  notifications: NotificationService;
  parentWindow: ParentWindowFixture;
}

export const hostTest = base.extend<HostFixtures>({
  notifications: async ({}, use) => {
    await use({ error: vi.fn() });
  },
  parentWindow: async ({}, use) => {
    const originalParent = window.parent;
    const postMessage = vi.fn();
    const fakeParent = { postMessage } as unknown as Window;

    Object.defineProperty(window, "parent", {
      configurable: true,
      value: fakeParent,
    });

    await use({ window: fakeParent, postMessage });

    Object.defineProperty(window, "parent", {
      configurable: true,
      value: originalParent,
    });
  },
});
