import type { Dispatch, SetStateAction } from "react"

interface PageSelectorProps{
  page:number
  setPage:Dispatch<SetStateAction<number>>
  totalPages:number
}

export const PageSelector = ({page, setPage, totalPages }:PageSelectorProps) => {
  return (
    <div className='pagination-container'>
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
      <span> Page {page} of {totalPages} </span>
      <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
    </div>
  )
}
