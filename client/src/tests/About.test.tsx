import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "../pages/About";
import { aboutParagraphs } from "../content/about";

describe("About page", () => {
  it("shows the heading and subheading", () => {
    render(<About />);

    expect(screen.getByRole("heading", { name: "About Us" })).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Natural skin care, thoughtfully chosen." }),
    ).toBeTruthy();
  });

  it("shows the hero image with its description", () => {
    render(<About />);

    const image = screen.getByRole("img", {
      name: "Store with wooden shelves lined with glass bottles of oils, white candles and trailing green plants.",
    });
    expect(image.getAttribute("src")).toBe("/imgs/about_hero.webp");
  });

  it("shows every paragraph", () => {
    render(<About />);

    for (const paragraph of aboutParagraphs) {
      expect(screen.getByText(paragraph)).toBeTruthy();
    }
  });

  it("shows the illustration-only disclaimer", () => {
    render(<About />);

    expect(
      screen.getByText("Products and prices are for illustration only."),
    ).toBeTruthy();
  });

  it("shows the Go To Store button", () => {
    render(<About />);

    expect(screen.getByRole("button", { name: "Go To Store" })).toBeTruthy();
  });
});
