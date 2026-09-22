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
  // Elevation sits below the card that holds the button: cards are shadow-lg,
  // primary actions shadow-md, small icon actions shadow-sm, ghost/outline flat
  // until hover. Each level lifts on hover and presses back down on active.
  // Shadows are tinted to the button's own fill — an untinted shadow is close to
  // invisible against saturated backgrounds like teal-700 / cyan-900.
  base: "font-body rounded-sm hover:cursor-pointer transition-shadow",
  variants: {
    variant: {
      default:
        "w-full bg-teal-700 text-neutral-100 hover:bg-teal-800 px-4 py-2 shadow-md shadow-teal-950/40 hover:shadow-lg hover:shadow-teal-950/50 active:shadow-sm",
      blankPages:
        "w-full bg-cyan-900 text-neutral-100 hover:bg-teal-800 px-4 py-2 landscape:text-sm border rounded cursor-pointer mb-4 shadow-md shadow-cyan-950/50 hover:shadow-lg hover:shadow-teal-950/50 active:shadow-sm",
      incrementDecrement:
        "flex justify-center items-center w-8 h-8 bg-teal-700 hover:bg-teal-800 text-neutral-100 rounded-sm shadow-sm shadow-teal-950/40 hover:shadow-md active:shadow-xs",
      removeFromCart:
        "inline-flex justify-center items-center w-8 h-8 bg-rose-400 hover:bg-rose-500 text-neutral-100 rounded-full shadow-sm shadow-rose-900/40 hover:shadow-md active:shadow-xs",
      removeFromOpenedCart:
        "w-8 h-8 flex justify-center items-center border border-rose-400 rounded-sm text-rose-600 transition-all hover:text-neutral-50 hover:bg-rose-600 active:bg-rose-900 active:text-neutral-500 shadow-xs shadow-rose-900/40 hover:shadow-md hover:shadow-rose-900/60 active:shadow-none",
      closeCart:
        "inline-flex justify-center items-center p-2 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-600 rounded hover:shadow-sm hover:shadow-gray-900/30 active:shadow-none",
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
