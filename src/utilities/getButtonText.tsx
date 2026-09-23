import type { ReactNode } from "react";

export type DataKey =
  | "increment"
  | "decrement"
  | "remove"
  | "addToCart"
  | "goToStore"
  | "removeFromOpenedCart"
  | "checkout"
  | "closeCart"
  | "default";

// Icons: Font Awesome Free v7.3.1 (CC BY 4.0) — https://fontawesome.com/license/free
const trashIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-3.5 shrink-0 fill-current"
  >
    <path d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z" />
  </svg>
);

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-3.5 shrink-0 fill-current"
  >
    <path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z" />
  </svg>
);

const minusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-3.5 shrink-0 fill-current"
  >
    <path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z" />
  </svg>
);

const xMarkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-3 fill-current"
  >
    <path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z" />
  </svg>
);

export function getButtonText(dataKey: DataKey): ReactNode {
  switch (dataKey) {
    case "increment":
      return (
        <>
          {plusIcon}
          <span className="sr-only">Increase quantity</span>
        </>
      );
    case "decrement":
      return (
        <>
          {minusIcon}
          <span className="sr-only">Decrease quantity</span>
        </>
      );
    case "remove":
      return (
        <>
          {trashIcon}
          <span className="sr-only">Remove from cart</span>
        </>
      );
    case "addToCart":
      return "Add To Cart";
    case "goToStore":
      return "Go To Store";
    case "checkout":
      return "Checkout";
    case "removeFromOpenedCart":
      return "Delete";
    case "closeCart":
      return (
        <>
          {xMarkIcon}
          <span className="sr-only">Close cart</span>
        </>
      );
    case "default":
    default:
      return "";
  }
}
