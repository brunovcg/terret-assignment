import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

describe("App", () => {
  it("renders the title and the HMR info text", () => {
    render(<App />);
  });

  it("contains links with logos to Vite and React docs", () => {
    render(<App />);

    const viteLink = screen.getByTestId("logo");

    expect(viteLink).toBeInTheDocument();

    // Ensure the anchors point to the correct destinations
    expect((viteLink as HTMLAnchorElement).href).toContain(
      "https://react.dev/",
    );
  });
});
