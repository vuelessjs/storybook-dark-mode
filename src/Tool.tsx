import * as React from "react";
import { Button } from "storybook/internal/components";
import { MoonIcon, SunIcon } from "@storybook/icons";
import { API, useParameter } from "storybook/manager-api";
import { SET_STORIES, DOCS_RENDERED, STORY_CHANGED } from "storybook/internal/core-events";
import { DARK_MODE_EVENT_NAME, UPDATE_DARK_MODE_EVENT_NAME } from "./constants";
import {
  store,
  prefersDark,
  updateStore,
  updateManager,
  updatePreview,
  type DarkModeStore,
  type Mode,
} from "./store";

interface DarkModeProps {
  /** The storybook API */
  api: API;
}

/** A toolbar icon to toggle between dark and light themes in storybook */
export function DarkMode({ api }: DarkModeProps) {
  const [isDark, setDark] = React.useState(prefersDark.matches);
  const darkModeParams = useParameter<Partial<DarkModeStore>>("darkMode", {});
  const { current: defaultMode, stylePreview, ...params } = darkModeParams;
  const channel = api.getChannel();
  // Save custom themes on init
  const userHasExplicitlySetTheTheme = React.useMemo(
    () => store(params).userHasExplicitlySetTheTheme,
    [params],
  );
  /** Set the theme in storybook, update the local state, and emit an event */
  const setMode = React.useCallback(
    (mode: Mode) => {
      const currentStore = store();

      api.setOptions({ theme: currentStore[mode] });
      setDark(mode === "dark");
      api.getChannel().emit(DARK_MODE_EVENT_NAME, mode === "dark");
      updateManager(currentStore);

      if (stylePreview) {
        updatePreview(currentStore);
      }
    },
    [api, stylePreview],
  );

  /** Update the theme settings in localStorage, react, and storybook */
  const updateMode = React.useCallback(
    (mode?: Mode) => {
      const currentStore = store();
      const current = mode || (currentStore.current === "dark" ? "light" : "dark");

      updateStore({ ...currentStore, current });
      setMode(current);
    },
    [setMode],
  );

  /** Update the theme based on the color preference */
  function prefersDarkUpdate(event: MediaQueryListEvent) {
    if (userHasExplicitlySetTheTheme || defaultMode) {
      return;
    }

    updateMode(event.matches ? "dark" : "light");
  }

  /** Render the current theme */
  const renderTheme = React.useCallback(() => {
    const { current = "light" } = store();

    setMode(current);
  }, [setMode]);

  /** Handle the user event and side effects */
  const handleIconClick = () => {
    updateMode();
    const currentStore = store();

    updateStore({ ...currentStore, userHasExplicitlySetTheTheme: true });
  };

  /** When storybook params change update the stored themes */
  React.useEffect(() => {
    const currentStore = store();

    // Ensure we use the stores `current` value first to persist
    // themeing between page loads and story changes.
    updateStore({
      ...currentStore,
      ...darkModeParams,
      current: currentStore.current || darkModeParams.current,
    });
    renderTheme();
  }, [darkModeParams, renderTheme]);
  React.useEffect(() => {
    channel.on(STORY_CHANGED, renderTheme);
    channel.on(SET_STORIES, renderTheme);
    channel.on(DOCS_RENDERED, renderTheme);
    prefersDark.addListener(prefersDarkUpdate);

    return () => {
      channel.removeListener(STORY_CHANGED, renderTheme);
      channel.removeListener(SET_STORIES, renderTheme);
      channel.removeListener(DOCS_RENDERED, renderTheme);
      prefersDark.removeListener(prefersDarkUpdate);
    };
  });
  React.useEffect(() => {
    channel.on(UPDATE_DARK_MODE_EVENT_NAME, updateMode);

    return () => {
      channel.removeListener(UPDATE_DARK_MODE_EVENT_NAME, updateMode);
    };
  });
  // Storybook's first render doesn't have the global user params loaded so we
  // need the effect to run whenever defaultMode is updated
  React.useEffect(() => {
    // If a users has set the mode this is respected
    if (userHasExplicitlySetTheTheme) {
      return;
    }

    if (defaultMode) {
      updateMode(defaultMode);
    } else if (prefersDark.matches) {
      updateMode("dark");
    }
  }, [defaultMode, updateMode, userHasExplicitlySetTheTheme]);

  return (
    <Button
      key="dark-mode"
      variant="ghost"
      padding="small"
      title={isDark ? "Change theme to light mode" : "Change theme to dark mode"}
      aria-label={isDark ? "Change theme to light mode" : "Change theme to dark mode"}
      onClick={handleIconClick}
    >
      {isDark ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
    </Button>
  );
}

export default DarkMode;
