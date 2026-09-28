import { describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "../components/Navbar";
import { Store } from "../pages/Store";
import { renderWithProviders } from "./renderWithProviders";
import { testItems } from "./testItems";

// A successful checkout sets window.location.href, and jsdom can only follow
// hash changes. So checkout fails in most tests, and the redirect test gets a
// same-origin #hash URL instead of a real Stripe one.
const checkoutUrl = `${window.location.origin}/#stripe-checkout`;

function mockFetchWithCheckoutUrl() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      if (url.endsWith("/items")) {
        return { ok: true, json: async () => testItems };
      }
      return { ok: true, json: async () => ({ url: checkoutUrl }) };
    }),
  );
}

function mockFetchWithFailingCheckout() {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.endsWith("/items")) {
      return { ok: true, json: async () => testItems };
    }
    return { ok: false, status: 500 };
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function getCategory(name: string) {
  const heading = screen.getByRole("heading", { name });
  return heading.parentElement as HTMLElement;
}

function getCart() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

async function addTwoMascarasAndOpenCart() {
  const user = userEvent.setup();
  renderWithProviders(
    <>
      <Navbar />
      <Store />
    </>,
  );
  await screen.findByRole("heading", { name: "Test Mascara" });
  const face = within(getCategory("Face"));

  await user.click(face.getByRole("button", { name: "Add To Cart" }));
  await user.click(face.getByRole("button", { name: "Increase quantity" }));
  await user.click(screen.getByRole("button", { name: /Open cart/ }));
  return user;
}

describe("Checkout", () => {
  it("sends only the cart's ids and quantities to the server", async () => {
    const fetchMock = mockFetchWithFailingCheckout();
    const user = await addTwoMascarasAndOpenCart();

    await user.click(within(getCart()).getByRole("button", { name: "Checkout" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/create-checkout-session"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ items: [{ id: 1, quantity: 2 }] }),
        }),
      );
    });
  });

  it("redirects to the checkout URL the server returns", async () => {
    mockFetchWithCheckoutUrl();
    const user = await addTwoMascarasAndOpenCart();

    await user.click(within(getCart()).getByRole("button", { name: "Checkout" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#stripe-checkout");
    });
    window.location.hash = "";
  });

  it("shows an error when the server fails", async () => {
    mockFetchWithFailingCheckout();
    const user = await addTwoMascarasAndOpenCart();

    await user.click(within(getCart()).getByRole("button", { name: "Checkout" }));

    expect(
      await within(getCart()).findByText("Checkout failed. Please try again."),
    ).toBeTruthy();
  });

  it("disables Checkout once the cart is empty", async () => {
    mockFetchWithFailingCheckout();
    const user = await addTwoMascarasAndOpenCart();

    await user.click(within(getCart()).getByRole("button", { name: "Delete" }));

    const checkout = within(getCart()).getByRole("button", { name: "Checkout" });
    expect((checkout as HTMLButtonElement).disabled).toBe(true);
  });
});
