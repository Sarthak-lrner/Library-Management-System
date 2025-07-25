export const Pagination: React.FC<{
    currentPage: number,
    totalPages: number,
    paginate: (page: number) => void
}> = ({ currentPage, totalPages, paginate }) => {
    const pageNumbers: number[] = [];

    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="...">
            <ul className="pagination">
                <li className="page-item" onClick={() => paginate(1)}>
                    <button className="page-link">First Page</button>
                </li>
                {pageNumbers.map(number => (
                    <li
                        key={number}
                        onClick={() => paginate(number)}
                        className={"page-item" + (currentPage === number ? " active" : "")}
                    >
                        <button className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
                <li className="page-item" onClick={() => paginate(totalPages)}>
                    <button className="page-link">Last Page</button>
                </li>
            </ul>
        </nav>
    );
}
