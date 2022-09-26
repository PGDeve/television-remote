import type { PreloadedState } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";

// As a basic setup, import your same slice reducers
import { RootState, store } from "../store/store";
import televisionReducer from "../store/television/televisionSlice";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: typeof store;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      television: {
        isLoading: true,
        error: null,
        currentChannelData: {
          code: "",
          description: "",
          type: "image",
          url: "",
        },
      },
    },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { television: televisionReducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}> {children} </Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
