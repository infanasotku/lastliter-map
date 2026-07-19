import type { Station } from '@/domain/station';
import type {
  StationHost,
  StationHostContext,
} from '@/features/stations/ports';

const PROTOCOL_VERSION = 1;
const CONTEXT_TIMEOUT_MS = 1_500;
const READY_RETRY_MS = 250;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseStation(value: unknown): Station | null {
  if (!isRecord(value)) return null;

  const { id, name, address, latitude, longitude } = value;
  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof address !== 'string' ||
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  return { id, name, address, latitude, longitude };
}

function parseContext(value: unknown): StationHostContext | null {
  if (
    !isRecord(value) ||
    value.type !== 'lastliter:admin-context' ||
    value.version !== PROTOCOL_VERSION ||
    value.mode !== 'admin' ||
    !Array.isArray(value.stations) ||
    !isRecord(value.capabilities)
  ) {
    return null;
  }

  const stations = value.stations.map(parseStation);
  if (stations.some((station) => station === null)) return null;

  return {
    stations: stations as Station[],
    canOpenStation: value.capabilities.openStation === true,
  };
}

function getParentOrigin(): string | null {
  if (!document.referrer) return null;

  try {
    return new URL(document.referrer).origin;
  } catch {
    return null;
  }
}

export class PostMessageStationHost implements StationHost {
  private readonly embedded = window.parent !== window;
  private readonly parentOrigin = getParentOrigin();
  private context: StationHostContext | null = null;
  private contextRequest: Promise<StationHostContext | null> | null = null;

  getContext(): Promise<StationHostContext | null> {
    if (!this.embedded) return Promise.resolve(null);
    this.contextRequest ??= this.requestContext();
    return this.contextRequest;
  }

  canOpenStation(): boolean {
    return this.context?.canOpenStation === true;
  }

  openStation(stationId: string): void {
    if (!this.embedded || !this.canOpenStation()) return;

    window.parent.postMessage(
      {
        type: 'lastliter:station-open',
        version: PROTOCOL_VERSION,
        stationId,
      },
      this.parentOrigin ?? '*',
    );
  }

  private requestContext(): Promise<StationHostContext | null> {
    return new Promise((resolve) => {
      let settled = false;

      const finish = (context: StationHostContext | null): void => {
        if (settled) return;
        settled = true;
        clearInterval(retryId);
        clearTimeout(timeoutId);
        window.removeEventListener('message', onMessage);
        this.context = context;
        resolve(context);
      };

      const onMessage = (event: MessageEvent<unknown>): void => {
        if (
          event.source !== window.parent ||
          (this.parentOrigin !== null && event.origin !== this.parentOrigin)
        ) {
          return;
        }

        const context = parseContext(event.data);
        if (context) finish(context);
      };

      const announceReady = (): void => {
        window.parent.postMessage(
          { type: 'lastliter:map-ready', version: PROTOCOL_VERSION },
          this.parentOrigin ?? '*',
        );
      };

      window.addEventListener('message', onMessage);
      const retryId = window.setInterval(announceReady, READY_RETRY_MS);
      const timeoutId = window.setTimeout(
        () => finish(null),
        CONTEXT_TIMEOUT_MS,
      );
      announceReady();
    });
  }
}
