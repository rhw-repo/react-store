import { useStoreItems } from "../hooks/useStoreItems";
import { StoreItemCard } from "../components/StoreItemCard";

export const Store: React.FC = () => {
  const { data: storeItems = [], error } = useStoreItems();

  // Rethrown during render so the ErrorBoundary catches it; a failed fetch
  // never reaches a boundary on its own.
  if (error) throw error;

  return (
    <section className="max-w-content mt-4">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-4">
        {storeItems.map((item) => (
          <StoreItemCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
};
