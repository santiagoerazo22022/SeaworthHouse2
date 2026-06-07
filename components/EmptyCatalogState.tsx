interface Props {
  categoryName?: string | null;
}

export default function EmptyCatalogState({ categoryName }: Props) {
  return (
    <p className="empty-state" role="status">
      {categoryName
        ? `No hay productos en «${categoryName}».`
        : "No hay productos."}
    </p>
  );
}
