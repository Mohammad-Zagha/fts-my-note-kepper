
const getPaginationData = ({ page = 1, limit = 10, total }) => {
    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, parseInt(limit));
    
    const skip = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(total / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    
    return {
      skip,
      limit: itemsPerPage,
      
      pagination: {
        total,
        totalPages,
        currentPage,
        limit: itemsPerPage,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null
      }
    };
  };
  
  module.exports = {
    getPaginationData
  };