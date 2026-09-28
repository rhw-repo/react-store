import { useStoreItems } from "../hooks/useStoreItems";
import { StoreItemCard } from "../components/StoreItemCard";

const categories = ["Face", "Home Hygge", "Gift Sets", "Candles"];

export const Store: React.FC = () => {
  const { data: storeItems = [], error } = useStoreItems();

  // Rethrown during render so the ErrorBoundary catches it; a failed fetch
  // never reaches a boundary on its own.
  if (error) throw error;

  return (
    <section className="max-w-content mt-4">
      {categories.map((category) => (
        <div key={category} className="m-4 mb-12">
          <h2 className="font-ui text-2xl lg:text-3xl text-stone-900 mb-4 px-4 md:px-0">
            {category}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeItems
              .filter((item) => item.category === category)
              .map((item) => (
                <StoreItemCard key={item.id} {...item} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
};
