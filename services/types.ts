export type PagedResult<T> = {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

export type PagedQuery = {
    search?: string;
    sortBy?: string;
    descending?: boolean;
    [filter: string]: string | number | boolean | undefined;
};