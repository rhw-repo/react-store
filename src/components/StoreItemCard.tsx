import { useShoppingCart } from "../context/ShoppingCartContext";
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
    <div className="flex flex-col shadow-lg hover:shadow-xl transition-shadow p-4 rounded-sm h-full">
      <div className="aspect-3/2 w-full overflow-hidden rounded-sm shadow-media">
        <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex justify-between items-baseline mb-8 mt-2">
        <h4 className="text-xl sm:text-2xl md:text-2xl lg:text-xl xl:text-xl 2xl:text-xl text-stone-950 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950">
          {name}
        </h4>
        <p className="text-lg font-bold text-gray-800 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950">
          {formatCurrency(price)}
        </p>
      </div>

      <div>
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
