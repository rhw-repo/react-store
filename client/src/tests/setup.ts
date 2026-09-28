import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom has no showModal() or close() on <dialog>; the cart drawer needs both.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
  this.dispatchEvent(new Event("close"));
};

// Without `globals: true`, Testing Library doesn't unmount between tests on
// its own, so earlier renders would stay in the DOM and break later queries.
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});
