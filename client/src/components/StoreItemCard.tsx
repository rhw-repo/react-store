import { useShoppingCart } from "../hooks/useShoppingCart";
import { formatCurrency } from "../utilities/formatCurrency";
import Button from "./Button";

export interface StoreItemCardProps {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
}

export const StoreItemCard: React.FC<StoreItemCardProps> = ({
  id,
  name,
  price,
  imgUrl,
}) => {
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity } =
    useShoppingCart();

  const quantity = getItemQuantity(id);
  const isLastOne = quantity === 1;

  return (
    <div className="flex flex-col bg-stone-100 shadow-xl shadow-stone-900/15 hover:shadow-stone-900/20 transition-shadow p-4 rounded-sm h-full">
      <div className="aspect-3/2 w-full overflow-hidden rounded-sm shadow-media">
        {/* alt="" deliberately: the <h3> below is the same string, so a filled
            alt makes screen readers announce it twice. */}
        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex justify-between items-baseline gap-4 mb-8 mt-2">
        <h3 className="min-h-[2lh] text-lg sm:text-xl lg:text-lg font-normal text-stone-950 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-teal-950 active:text-ring-teal-950">
          {name}
        </h3>
        <h4 className="font-body text-lg font-bold text-gray-800 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-teal-950 active:text-teal-950">
          {formatCurrency(price)}
        </h4>
      </div>

      <div className="mt-auto">
        {quantity === 0 ? (
          <Button
            variant="default"
            dataKey="addToCart"
            onClick={() => increaseCartQuantity(id)}
          />
        ) : (
          <div className="ml-auto flex w-fit flex-row items-center gap-2 rounded-sm border border-teal-700 px-2 py-1">
            <Button
              variant={isLastOne ? "remove" : "decrement"}
              dataKey={isLastOne ? "remove" : "decrement"}
              onClick={() => decreaseCartQuantity(id)}
            />
            <span className="text-1xl">{quantity}</span>
            <Button
              variant="increment"
              dataKey="increment"
              onClick={() => increaseCartQuantity(id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
