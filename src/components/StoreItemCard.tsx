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
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const quantity = getItemQuantity(id);

  return (
    <div key={id} className="flex flex-col shadow-sm p-4 rounded-sm h-full">
      <div className="aspect-3/2 w-full overflow-hidden">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover rounded-sm"
        />
      </div>
      <div className="flex justify-between items-baseline mb-8">
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl text-black-600 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950">
          {name}
        </h2>
        <p className="text-lg font-bold text-gray-800 hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950">
          {formatCurrency(price)}
        </p>
      </div>

      <div className="mt-auto">
        {quantity === 0 ? (
          <Button
            variant="default"
            dataKey="addToCart"
            onClick={() => increaseCartQuantity(id)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="incrementDecrement"
                dataKey="increment"
                onClick={() => increaseCartQuantity(id)}
              />
              <span className="text-1xl">{quantity} in cart</span>
              <Button
                variant="incrementDecrement"
                dataKey="decrement"
                onClick={() => decreaseCartQuantity(id)}
              />
            </div>
            <Button
              variant="removeFromCart"
              dataKey="remove"
              onClick={() => removeFromCart(id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
