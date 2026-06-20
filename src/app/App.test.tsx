import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { AppProviders } from "./providers";

describe("App", () => {
  it("renders the builder", () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>
    );

    expect(screen.getByRole("heading", { name: "PixelStub" })).toBeInTheDocument();
  });
});
