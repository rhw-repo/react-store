import { tv, type VariantProps } from "tailwind-variants";
import type { FC, ButtonHTMLAttributes } from "react";
import { getButtonText, type DataKey } from "../utilities/getButtonText.tsx";

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  dataKey: DataKey;
}

const buttonStyles = tv({
  // Elevation sits one step below the card that holds the button: cards are
  // shadow-md, primary actions shadow-sm, small icon actions shadow-xs, and
  // ghost/outline actions stay flat. Every level lifts on hover, presses on active.
  base: "font-body rounded-sm hover:cursor-pointer transition-shadow",
  variants: {
    variant: {
      default:
        "w-full bg-teal-700 text-neutral-100 hover:bg-teal-800 px-4 py-2 shadow-sm hover:shadow-md active:shadow-xs",
      blankPages:
        "w-full bg-cyan-900 text-neutral-100 hover:bg-teal-800 px-4 py-2 landscape:text-sm border rounded cursor-pointer mb-4 shadow-sm hover:shadow-md active:shadow-xs",
      incrementDecrement:
        "flex justify-center items-center w-8 h-8 bg-teal-700 hover:bg-teal-800 text-neutral-100 rounded-sm shadow-xs hover:shadow-sm active:shadow-none",
      removeFromCart:
        "inline-flex justify-center items-center w-8 h-8 bg-rose-400 hover:bg-rose-500 text-neutral-100 rounded-full shadow-xs hover:shadow-sm active:shadow-none",
      removeFromOpenedCart:
        "w-8 h-8 flex justify-center items-center border border-rose-400 rounded-sm text-rose-600 transition-all hover:text-neutral-50 hover:bg-rose-600 active:bg-rose-900 active:text-neutral-500 hover:shadow-xs active:shadow-none",
      closeCart:
        "inline-flex justify-center items-center p-2 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-600 rounded",
    },
  },
});

const Button: FC<ButtonProps> = ({ variant, dataKey, ...props }) => {
  return (
    <button className={buttonStyles({ variant })} data-key={dataKey} {...props}>
      {getButtonText(dataKey)}
    </button>
  );
};

export default Button;
