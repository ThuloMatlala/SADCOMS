interface SortSelectorProps {
  sort: string;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
}

export default function SortSelector({ sort, setSort, setPage }: SortSelectorProps) {
  return (
    <select
      value={sort}
      onChange={e => { setSort(e.target.value); setPage(1); }}
    >
      <option value="">Default</option>
      <option value="createdAt_desc">Newest First</option>
      <option value="createdAt_asc">Oldest First</option>
      <option value="totalAmount_desc">Amount: High to Low</option>
      <option value="totalAmount_asc">Amount: Low to High</option>
      <option value="status_asc">Status: A–Z</option>
    </select>
  );
}
