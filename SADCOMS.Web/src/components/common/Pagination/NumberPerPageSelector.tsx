import type { Dispatch, SetStateAction } from "react";

const PAGE_SIZE_OPTIONS = [3, 6, 9, 12];

interface NumberPerPageSelectorProps{
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>
}

export const NumberPerPageSelector = ({
  setPage,
  pageSize,
  setPageSize
}: NumberPerPageSelectorProps) => {
  return (
      <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            {PAGE_SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s} per page</option>
            ))}
      </select>
  )
}
