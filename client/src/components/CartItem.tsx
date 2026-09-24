import { useShoppingCart } from "../hooks/useShoppingCart";
import { useStoreItems } from "../hooks/useStoreItems";
import { formatCurrency } from "../utilities/formatCurrency";
import Button from "./Button";

type CartItemProps = {
  id: number;
  quantity: number;
};

export const CartItem = ({ id, quantity }: CartItemProps) => {
  const { increaseCartQuantity, decreaseCartQuantity, removeFromCart } =
    useShoppingCart();
  const { data: storeItems = [] } = useStoreItems();

  const item = storeItems.find((i) => i.id === id);
  if (item == null) return null;

  const isLastOne = quantity === 1;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-2 justify-start items-center min-w-0">
          <div className="shadow-media rounded-sm shrink-0">
            <div className="aspect-3/2 w-20">
              {/* alt="" deliberately: the name below is the same string, so a
                  filled alt makes screen readers announce it twice. */}
              <img
                src={item.imgUrl}
                alt=""
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <p className="text-xs font-semibold">{item.name}</p>
            <p className="text-xs">{formatCurrency(item.price)}</p>
          </div>
        </div>
        <p className="text-sm font-bold shrink-0">
          {formatCurrency(item.price * quantity)}
        </p>
      </div>
      <div className="ml-auto flex w-fit flex-row items-center gap-2">
        <Button
          variant="removeFromOpenedCart"
          dataKey="removeFromOpenedCart"
          onClick={() => removeFromCart(item.id)}
        />
        <div className="flex w-fit flex-row items-center gap-2 rounded-sm border border-teal-700 px-2 py-1">
          <Button
            variant={isLastOne ? "remove" : "decrement"}
            dataKey={isLastOne ? "remove" : "decrement"}
            onClick={() => decreaseCartQuantity(item.id)}
          />
          <span className="text-sm">{quantity}</span>
          <Button
            variant="increment"
            dataKey="increment"
            onClick={() => increaseCartQuantity(item.id)}
          />
        </div>
      </div>
    </div>
  );
};
