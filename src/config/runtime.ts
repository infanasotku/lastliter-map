interface LastLiterRuntimeConfig {
  yandexTilesApiKey?: string;
}

declare global {
  interface Window {
    __LASTLITER_CONFIG__?: LastLiterRuntimeConfig;
  }
}

export function getYandexTilesApiKey(): string {
  const apiKey = window.__LASTLITER_CONFIG__?.yandexTilesApiKey;

  if (!apiKey) {
    throw new Error("yandexTilesApiKey is required in /config.js");
  }

  return apiKey;
}
