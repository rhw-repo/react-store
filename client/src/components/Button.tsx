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
  base: "font-body rounded-sm hover:cursor-pointer transition-shadow",
  variants: {
    variant: {
      default:
        "w-full bg-teal-700 text-neutral-100 hover:bg-teal-800 px-4 py-2 shadow-md shadow-teal-950/40 hover:shadow-lg hover:shadow-teal-950/50 active:shadow-sm",
      pageTemplate:
        "w-full bg-teal-700 text-neutral-100 hover:bg-teal-800 px-4 py-2 landscape:text-sm rounded cursor-pointer mb-4 shadow-md shadow-teal-950/50 hover:shadow-lg hover:shadow-teal-950/50 active:shadow-sm",
      increment:
        "flex justify-center items-center w-8 h-8 bg-transparent text-teal-700 hover:text-teal-800 rounded-sm transition-colors",
      decrement:
        "flex justify-center items-center w-8 h-8 bg-transparent text-teal-700 hover:text-teal-800 rounded-sm transition-colors",
      // Rose only here: on the minus it would signal a destruction that isn't
      // happening. This variant only renders at a quantity of 1.
      remove:
        "flex justify-center items-center w-8 h-8 bg-transparent text-teal-700 hover:text-rose-600 active:text-rose-900 rounded-sm transition-colors",
      removeFromOpenedCart:
        "flex justify-center items-center px-2 py-1 bg-transparent text-sm text-teal-700 hover:text-teal-800 rounded-sm transition-colors",
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
