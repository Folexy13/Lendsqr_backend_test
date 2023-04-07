interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  pageSize: number;
}

function paginate<T>(data: T[], currentPage: number = 1, pageSize: number = 10): PaginatedResponse<T> {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex);
    return {
        total: data.length,
        currentPage,
        pageSize,
        data: paginatedData,
    
  };
}

export default paginate