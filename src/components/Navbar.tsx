import { NavLink } from "react-router-dom";
import { useShoppingCart } from "../hooks/useShoppingCart";

export const Navbar = () => {
  const { openCart, cartQuantity } = useShoppingCart();

  return (
    <nav className="font-body sticky top-0 z-30 bg-stone-300 shadow-bar w-full">
      <div className="flex justify-between px-8 gap-1 p-4 lg:max-w-content lg:mx-auto">
        <div className="flex justify-start">
          <NavLink
            to="/"
            className="flex justify-center items-center lg:text-2xl rounded-sm py-2 px-2 text-ink hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950"
          >
            Home
          </NavLink>
          <NavLink
            to="/store"
            className="flex justify-center items-center lg:text-2xl rounded-sm py-2 px-2 text-ink hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950"
          >
            Store
          </NavLink>
          <NavLink
            to="/about"
            className="flex justify-center items-center lg:text-2xl rounded-sm py-2 px-2 text-ink hover:text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 active:text-purple-950"
          >
            About
          </NavLink>
        </div>
        <div>
          {cartQuantity > 0 && (
            <button
              onClick={openCart}
              className="relative rounded-full border-teal-700 border w-[clamp(2.5rem,6vw,3.5rem)] aspect-square p-[clamp(0.25rem,2vw,0.5rem)] transition-shadow shadow-sm shadow-teal-950/65 hover:shadow-md hover:shadow-teal-950/75 active:shadow-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                fill="currentColor"
                className="text-teal-700"
              >
                <path d="M96 0C107.5 0 117.4 8.19 119.6 19.51L121.1 32H541.8C562.1 32 578.3 52.25 572.6 72.66L518.6 264.7C514.7 278.5 502.1 288 487.8 288H170.7L179.9 336H488C501.3 336 512 346.7 512 360C512 373.3 501.3 384 488 384H159.1C148.5 384 138.6 375.8 136.4 364.5L76.14 48H24C10.75 48 0 37.25 0 24C0 10.75 10.75 0 24 0H96zM128 464C128 437.5 149.5 416 176 416C202.5 416 224 437.5 224 464C224 490.5 202.5 512 176 512C149.5 512 128 490.5 128 464zM512 464C512 490.5 490.5 512 464 512C437.5 512 416 490.5 416 464C416 437.5 437.5 416 464 416C490.5 416 512 437.5 512 464z" />
              </svg>
              <div className="rounded-full bg-red-400 flex justify-center items-center text-white text-xs absolute top-6 right-0 sm:top-6 md:top-8 lg:top-8 h-[clamp(1.5rem,1vw,2rem)] w-[clamp(1.5rem,1vw,2rem)]">
                {cartQuantity}
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
