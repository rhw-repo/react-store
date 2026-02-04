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

export function getButtonText(dataKey: DataKey): string {
  switch (dataKey) {
    case "increment":
      return "+";
    case "decrement":
      return "-";
    case "remove":
      return "Remove";
    case "addToCart":
      return "Add To Cart";
    case "goToStore":
      return "Go To Store";
    case "checkout":
      return "Checkout";
    case "removeFromOpenedCart":
      return "X";
    case "closeCart":
      return "X";
    case "default":
    default:
      return "";
  }
}
