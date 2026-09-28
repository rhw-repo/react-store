import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Store } from "../pages/Store";
import ErrorBoundary from "../components/ErrorBoundary";
import { formatCurrency } from "../utilities/formatCurrency";
import { renderWithProviders } from "./renderWithProviders";
import { testItems } from "./testItems";

function mockFetchItems() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => testItems })),
  );
}

// The cart drawer is always mounted and has its own quantity buttons, so
// queries are scoped to one category block (its heading plus product grid).
function getCategory(name: string) {
  const heading = screen.getByRole("heading", { name });
  return heading.parentElement as HTMLElement;
}

async function renderStore() {
  mockFetchItems();
  renderWithProviders(<Store />);
  await screen.findByRole("heading", { name: "Test Mascara" });
}

describe("Store page", () => {
  it("shows a heading for each category", async () => {
    await renderStore();

    for (const category of ["Face", "Home Hygge", "Gift Sets", "Candles"]) {
      expect(screen.getByRole("heading", { name: category })).toBeTruthy();
    }
  });

  it("shows each product's image, name, price and Add To Cart button under its category", async () => {
    await renderStore();

    for (const item of testItems) {
      const category = getCategory(item.category);

      expect(category.querySelector(`img[src="${item.imgUrl}"]`)).not.toBeNull();
      expect(within(category).getByRole("heading", { name: item.name })).toBeTruthy();
      expect(within(category).getByText(formatCurrency(item.price))).toBeTruthy();
      expect(within(category).getByRole("button", { name: "Add To Cart" })).toBeTruthy();
    }
  });

  it("swaps Add To Cart for the quantity buttons", async () => {
    const user = userEvent.setup();
    await renderStore();
    const face = within(getCategory("Face"));

    await user.click(face.getByRole("button", { name: "Add To Cart" }));

    expect(face.getByRole("button", { name: "Remove from cart" })).toBeTruthy();
    expect(face.getByText("1")).toBeTruthy();
    expect(face.getByRole("button", { name: "Increase quantity" })).toBeTruthy();
    expect(face.queryByRole("button", { name: "Add To Cart" })).toBeNull();
  });

  it("shows Decrease quantity instead of the bin once there are two", async () => {
    const user = userEvent.setup();
    await renderStore();
    const face = within(getCategory("Face"));

    await user.click(face.getByRole("button", { name: "Add To Cart" }));
    await user.click(face.getByRole("button", { name: "Increase quantity" }));

    expect(face.getByText("2")).toBeTruthy();
    expect(face.getByRole("button", { name: "Decrease quantity" })).toBeTruthy();
    expect(face.queryByRole("button", { name: "Remove from cart" })).toBeNull();
  });

  it("brings Add To Cart back after removing the last one", async () => {
    const user = userEvent.setup();
    await renderStore();
    const face = within(getCategory("Face"));

    await user.click(face.getByRole("button", { name: "Add To Cart" }));
    await user.click(face.getByRole("button", { name: "Remove from cart" }));

    expect(face.getByRole("button", { name: "Add To Cart" })).toBeTruthy();
  });

  it("shows the error screen when products fail to load", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 500 })));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithProviders(
      <ErrorBoundary>
        <Store />
      </ErrorBoundary>,
    );

    expect(await screen.findByRole("heading", { name: "Oops!" })).toBeTruthy();
    consoleError.mockRestore();
  });
});
