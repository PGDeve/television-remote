import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import type { store as AppStore } from "../store/store";
import {
  setCurrentChannelData,
  setError,
} from "../store/television/televisionSlice";
import { renderWithProviders } from "../utils/test.utils";
import App from "./App";

const URL_ORIGIN = process.env.REACT_APP_BE_ORIGIN;

describe("Test Television", () => {
  const handlers = [
    rest.get(`${URL_ORIGIN}/socket.io`, (req, res, ctx) => {
      return res(ctx.status(200));
    }),
  ];
  const server = setupServer(...handlers);
  let store: typeof AppStore;

  // Enable API mocking before tests.
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    const renderObj = renderWithProviders(<App></App>);
    store = renderObj.store;
  });
  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  test("should show loading spinner and render on canvas after channel change", async () => {
    await waitFor(() =>
      store.dispatch(
        setCurrentChannelData({
          code: "001",
          description: "channel one",
          type: "image",
          url: "src/public/testImage.png",
        })
      )
    );
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();

    const canvas: HTMLCanvasElement = screen.getByLabelText(/canvas/i);
    expect(canvas).toBeInTheDocument();
  });

  test("should show notification on error and hide on click", async () => {
    expect(screen.queryByTestId(/notification/i)).toBeNull();

    await waitFor(() =>
      store.dispatch(
        setError({
          title: "An error occurred!",
          description: "Occurred error description",
        })
      )
    );

    const notification = await screen.findByTestId(/notification/i);
    expect(notification).toBeInTheDocument();

    const notificationTitle = screen.getByText(/An error occurred!/i);
    expect(notificationTitle).toBeInTheDocument();
    expect(notificationTitle).toBeVisible();

    fireEvent.click(notification);
    expect(notification).toHaveClass("translate-x-full");
    waitFor(async () =>
      expect(await screen.queryByTestId(/notification/i)).toBeNull()
    );
  });
});
