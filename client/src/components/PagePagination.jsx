import { observer } from 'mobx-react-lite'
import { useContext, useMemo } from 'react'
import { Pagination } from 'react-bootstrap'
import { Context } from '../contexts/GlobalContext'

export const PagePagination = observer(() => {
  const { device } = useContext(Context)
  const { pagination } = device
  const { totalCount = 0, limit = 5, currentPage = 1 } = pagination

  const pageCount = useMemo(
    () => Math.ceil(totalCount / limit),
    [totalCount, limit]
  )

  const pages = useMemo(
    () =>
      pageCount > 0 ? Array.from({ length: pageCount }, (_, i) => i + 1) : [],
    [pageCount]
  )

  const handlePageClick = (page) => {
    device.setPagination({
      ...pagination,
      currentPage: page,
    })
  }

  // Не отображаем пагинацию, если нет страниц или только одна страница
  if (pages.length <= 1) {
    return null
  }

  return (
    <Pagination>
      {pages.map((page) => (
        <Pagination.Item
          key={page}
          active={currentPage === page}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  )
})
