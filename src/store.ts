import { global } from "@storybook/global";
import { themes, ThemeVars } from "storybook/theming";
import { isEqual } from "lodash-es";

const { document, window } = global as { document: Document; window: Window };

type Mode = "light" | "dark";

interface DarkModeStore {
  classTarget: string;
  current: Mode;
  dark: ThemeVars;
  darkClass: string | string[];
  light: ThemeVars;
  lightClass: string | string[];
  stylePreview: boolean;
  userHasExplicitlySetTheTheme: boolean;
}

const STORAGE_KEY = "sb-addon-themes-3";

export const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)");

const defaultParams: Required<Omit<DarkModeStore, "current">> = {
  classTarget: "body",
  dark: themes.dark,
  darkClass: ["dark"],
  light: themes.light,
  lightClass: ["light"],
  stylePreview: false,
  userHasExplicitlySetTheTheme: false,
};

export const updateStore = (newStore: DarkModeStore) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
};

const arrayify = (classes: string | string[]): string[] => {
  const arr: string[] = [];

  return arr.concat(classes).map((item) => item);
};

const toggleDarkClass = (
  el: Element,
  {
    current,
    darkClass = defaultParams.darkClass,
    lightClass = defaultParams.lightClass,
  }: DarkModeStore,
) => {
  if (current === "dark") {
    el.classList.remove(...arrayify(lightClass));
    el.classList.add(...arrayify(darkClass));
  } else {
    el.classList.remove(...arrayify(darkClass));
    el.classList.add(...arrayify(lightClass));
  }
};

const updatePreview = (store: DarkModeStore) => {
  const iframe = document.getElementById("storybook-preview-iframe") as HTMLIFrameElement;

  if (!iframe) {
    return;
  }

  const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
  const target = iframeDocument?.querySelector<HTMLElement>(store.classTarget);

  if (!target) {
    return;
  }

  toggleDarkClass(target, store);
};

export const updateManager = (store: DarkModeStore) => {
  const manager = document.querySelector(store.classTarget);

  if (!manager) {
    return;
  }

  toggleDarkClass(manager, store);
};

export const store = (userTheme: Partial<DarkModeStore> = {}): DarkModeStore => {
  const storedItem = window.localStorage.getItem(STORAGE_KEY);

  if (typeof storedItem === "string") {
    const stored = JSON.parse(storedItem) as DarkModeStore;

    if (userTheme) {
      if (userTheme.dark && !isEqual(stored.dark, userTheme.dark)) {
        stored.dark = userTheme.dark;
        updateStore(stored);
      }

      if (userTheme.light && !isEqual(stored.light, userTheme.light)) {
        stored.light = userTheme.light;
        updateStore(stored);
      }
    }

    return stored;
  }

  return { ...defaultParams, ...userTheme } as DarkModeStore;
};

updateManager(store());

export { updatePreview };
export type { DarkModeStore, Mode };
