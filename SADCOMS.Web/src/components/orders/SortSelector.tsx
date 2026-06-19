interface SortSelectorProps {
  sort: string;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
}

export const SortSelector = ({ sort, setSort, setPage }: SortSelectorProps) => {
  return (
    <select
      value={sort}
      onChange={e => { setSort(e.target.value); setPage(1); }}
    >
      <option value="">Default</option>
      <option value="-createdAt">Newest First</option>
      <option value="createdAt">Oldest First</option>
      <option value="-totalAmount">Amount: High to Low</option>
      <option value="totalAmount">Amount: Low to High</option>
    </select>
  );
}
