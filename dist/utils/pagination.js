"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function paginate(data, currentPage = 1, pageSize = 10) {
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
exports.default = paginate;
