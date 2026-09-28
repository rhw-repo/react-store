import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "../components/Navbar";
import { Store } from "../pages/Store";
import { renderWithProviders } from "./renderWithProviders";
import { testItems } from "./testItems";

function getCategory(name: string) {
  const heading = screen.getByRole("heading", { name });
  return heading.parentElement as HTMLElement;
}

function getCart() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

async function renderStoreWithNavbar() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, json: async () => testItems })),
  );
  renderWithProviders(
    <>
      <Navbar />
      <Store />
    </>,
  );
  await screen.findByRole("heading", { name: "Test Mascara" });
}

describe("Cart drawer", () => {
  it("has no cart icon and stays closed while the cart is empty", async () => {
    await renderStoreWithNavbar();

    expect(screen.queryByRole("button", { name: /Open cart/ })).toBeNull();
    expect(getCart().hasAttribute("open")).toBe(false);
  });

  it("shows the cart icon but stays closed when an item is added", async () => {
    const user = userEvent.setup();
    await renderStoreWithNavbar();

    await user.click(
      within(getCategory("Face")).getByRole("button", { name: "Add To Cart" }),
    );

    expect(screen.getByRole("button", { name: "Open cart, 1 items" })).toBeTruthy();
    expect(getCart().hasAttribute("open")).toBe(false);
  });

  it("opens from the cart icon and closes from the close button", async () => {
    const user = userEvent.setup();
    await renderStoreWithNavbar();
    await user.click(
      within(getCategory("Face")).getByRole("button", { name: "Add To Cart" }),
    );

    await user.click(screen.getByRole("button", { name: /Open cart/ }));
    expect(getCart().hasAttribute("open")).toBe(true);
    expect(within(getCart()).getByRole("heading", { name: "Basket" })).toBeTruthy();

    await user.click(within(getCart()).getByRole("button", { name: "Close cart" }));
    expect(getCart().hasAttribute("open")).toBe(false);
  });
});

describe("Basket prices", () => {
  it("shows line totals and the basket total", async () => {
    const user = userEvent.setup();
    await renderStoreWithNavbar();
    const face = within(getCategory("Face"));

    await user.click(face.getByRole("button", { name: "Add To Cart" }));
    await user.click(face.getByRole("button", { name: "Increase quantity" }));
    await user.click(
      within(getCategory("Candles")).getByRole("button", { name: "Add To Cart" }),
    );
    await user.click(screen.getByRole("button", { name: /Open cart/ }));

    const cart = within(getCart());
    expect(cart.getByText("€35.98")).toBeTruthy();
    expect(cart.getByText("Total: €47.97")).toBeTruthy();
  });

  it("lowers the total when a line is deleted", async () => {
    const user = userEvent.setup();
    await renderStoreWithNavbar();
    const face = within(getCategory("Face"));

    await user.click(face.getByRole("button", { name: "Add To Cart" }));
    await user.click(face.getByRole("button", { name: "Increase quantity" }));
    await user.click(
      within(getCategory("Candles")).getByRole("button", { name: "Add To Cart" }),
    );
    await user.click(screen.getByRole("button", { name: /Open cart/ }));

    const cart = within(getCart());
    const deleteButtons = cart.getAllByRole("button", { name: "Delete" });
    await user.click(deleteButtons[0]);

    expect(cart.getByText("Total: €11.99")).toBeTruthy();
  });

  it("shows a zero total for an empty cart", async () => {
    await renderStoreWithNavbar();

    expect(within(getCart()).getByText("Total: €0.00")).toBeTruthy();
  });
});
