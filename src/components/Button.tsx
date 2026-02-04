import { tv, type VariantProps } from "tailwind-variants";
import type { FC, ButtonHTMLAttributes } from "react";
import { getButtonText, type DataKey } from "../utilities/getButtonText";

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  dataKey: DataKey;
}

const buttonStyles = tv({
  base: "rounded-sm hover:cursor-pointer",
  variants: {
    variant: {
      default:
        "w-full bg-blue-700 text-neutral-100 hover:bg-blue-400 px-4 py-2",
      blankPages:
        "w-full bg-blue-700 text-neutral-100 hover:bg-blue-400 px-4 py-2 landscape:text-sm border rounded cursor-pointer mb-4",
      incrementDecrement:
        "flex justify-center items-center w-8 h-8 font-bold bg-blue-700 text-neutral-100 rounded-sm px-4 py-0.5",
      removeFromCart:
        "bg-red-400 text-xs sm:text-sm md:text-base text-neutral-100 rounded-sm py-1.5 px-4 m-3",
      removeFromOpenedCart:
        "w-8 h-8 flex justify-center items-center border border-red-600 rounded-sm text-red-600 transition-colors hover:text-white hover:bg-red-600 active:bg-red-900 active:text-white",
      closeCart:
        "p-2 text-gray-600 text-xs hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-600 rounded",
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
