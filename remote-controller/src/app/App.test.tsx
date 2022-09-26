import { fireEvent, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { setCurrentChannel, setError } from "../store/remote/remoteSlice";
import type { store as AppStore } from "../store/store";
import { renderWithProviders } from "../utils/test.utils";
import App from "./App";

const URL_ORIGIN = process.env.REACT_APP_BE_ORIGIN;

describe("Test remote", () => {
  const handlers = [
    rest.get(`${URL_ORIGIN}/socket.io`, (req, res, ctx) => {
      return res(ctx.status(200));
    }),
    rest.get(`${URL_ORIGIN}/remote/nextChannel`, (req, res, ctx) => {
      return res(ctx.status(200));
    }),
    rest.get(`${URL_ORIGIN}/remote/previousChannel`, (req, res, ctx) => {
      return res(ctx.status(200));
    }),
  ];
  const server = setupServer(...handlers);
  let store: typeof AppStore;

  const checkChannelChange = async () => {
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();

    await waitFor(() =>
      store.dispatch(
        setCurrentChannel({
          code: "001",
          description: "channel one",
          type: "image",
          url: "",
        })
      )
    );

    expect(screen.queryByText(/loading/i)).toBeNull();
    expect(screen.getByLabelText("code")).toHaveTextContent("001");
  };

  const showNotificationOnError = async () => {
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

    return notification;
  };

  // Enable API mocking before tests.
  beforeAll(() => server.listen());

  beforeEach(() => {
    const renderObj = renderWithProviders(<App></App>);
    store = renderObj.store;
  });

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  test("should render remote header 'Now showing'", () => {
    const titleElement = screen.getByText(/now showing/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("should show loading spinner and change channel after previous button click", async () => {
    const previousButton = screen.getByRole("button", {
      name: "previousButton",
    });
    expect(previousButton).toBeInTheDocument();
    expect(await screen.getByLabelText("code")).toHaveTextContent("");

    fireEvent.click(previousButton);
    checkChannelChange();
  });

  test("should show loading spinner and change channel after next button click", async () => {
    const nextButton = screen.getByRole("button", { name: "nextButton" });
    expect(nextButton).toBeInTheDocument();
    expect(await screen.getByLabelText("code")).toHaveTextContent("");

    fireEvent.click(nextButton);
    checkChannelChange();
  });

  test("should show notification on error and hide on click", async () => {
    const notification = await showNotificationOnError();

    fireEvent.click(notification);
    expect(notification).toHaveClass("translate-x-full");
    waitFor(async () =>
      expect(await screen.queryByTestId(/notification/i)).toBeNull()
    );
  });

  test("should show notification on error and hide after a delay", async () => {
    const notification = await showNotificationOnError();

    waitFor(
      async () => {
        expect(notification).toHaveClass("translate-x-full");
        expect(await screen.queryByTestId(/notification/i)).toBeNull();
      },
      { timeout: 5000 }
    );
  });
});
