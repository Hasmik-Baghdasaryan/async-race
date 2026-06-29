export function validatePagination(page: number, limit: number): void {
  if (page < 1 || limit < 1) {
    throw new Error('Page and limit must be positive numbers');
  }
}
