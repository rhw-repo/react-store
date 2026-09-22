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
          <div className="flex flex-row justify-end items-center w-full gap-2">
            <Button
              variant="increment"
              dataKey="increment"
              onClick={() => increaseCartQuantity(id)}
            />
            <span className="text-1xl">{quantity} in cart</span>
            <Button
              variant="decrement"
              dataKey="decrement"
              onClick={() => decreaseCartQuantity(id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
