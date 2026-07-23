import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Keep the page-number list short on small screens: current page,
  // its immediate neighbors, and the first/last page, with "…" gaps.
  function getPageNumbers() {
    const pages = [];
    const delta = 1;

    for (let page = 1; page <= totalPages; page++) {
      const isEdge = page === 1 || page === totalPages;
      const isNearCurrent = Math.abs(page - currentPage) <= delta;
      if (isEdge || isNearCurrent) {
        pages.push(page);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }

  return (
    <nav className="pagination" aria-label="Product pages">
      <button
        className="page-btn page-nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span className="page-ellipsis" key={`ellipsis-${index}`}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "page-btn-active" : ""}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-btn page-nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
