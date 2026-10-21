import { useCallback, useEffect, useState } from "react";
import { apiFetch, getApiError, toQueryString } from "../../services/api";
import type { PagedQuery, PagedResult } from "../../services/types";

type UsePagedListOptions = {
    endpoint: string;
    query?: PagedQuery;
    initialPageSize?: number;
    sortBy?: string;
    descending?: boolean;
};

type UsePagedListReturn<T> = {
    items: T[];
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
    sortBy: string;
    descending: boolean;
    setPagination: (pageNumber: number, pageSize: number) => void;
    goToFirstPage: () => void;
    refetch: () => void;
    goToPreviousPage: () => void;
    setSorting: (sortBy: string, descending: boolean) => void;
};

export function usePagedList<T>({
    endpoint,
    query = {},
    initialPageSize = 10,
    sortBy: initialSortBy = "name",
    descending: initialDescending = false
}: UsePagedListOptions): UsePagedListReturn<T> {
    const [result, setResult] = useState<PagedResult<T> | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState(0);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [descending, setDescending] = useState(initialDescending);

    const setPagination = useCallback(
        (nextPageNumber: number, nextPageSize: number) => {
            if (nextPageSize !== pageSize) {
                setPageNumber(1);
                setPageSize(nextPageSize);
                return;
            }

            setPageNumber(nextPageNumber);
        },
        [pageSize]
    );

    const goToFirstPage = useCallback(() => {
        setPageNumber(1);
    }, []);

    const goToPreviousPage = useCallback(() => {
        setPageNumber(prev => Math.max(1, prev - 1));
    }, []);

    const refetch = useCallback(() => {
        setReloadToken(prev => prev + 1);
    }, []);

    const setSorting = useCallback((nextSortBy: string, nextDescending: boolean) => {
        setSortBy(nextSortBy);
        setDescending(nextDescending);
        setPageNumber(1);
    }, []);

    const queryString = toQueryString({
        ...query,
        pageNumber,
        pageSize,
        sortBy,
        descending
    });

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function fetchPage() {
            setIsLoading(true);
            setError(null);

            try {
                const res = await apiFetch(
                    `${endpoint}${queryString}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    const apiError = await getApiError(res);

                    if (!ignore) {
                        setError(apiError.message);
                    }

                    return;
                }

                const data = await res.json() as PagedResult<T>;

                if (!ignore) {
                    setResult(data);
                }
            } catch {
                if (!ignore && !controller.signal.aborted) {
                    setError("Không thể tải dữ liệu. Vui lòng thử lại.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchPage();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [
        endpoint,
        queryString,
        reloadToken
    ]);

    return {
        items: result?.items ?? [],
        totalCount: result?.totalCount ?? 0,
        totalPages: result?.totalPages ?? 0,
        pageNumber,
        pageSize,
        isLoading,
        error,
        sortBy,
        descending,
        setSorting,
        setPagination,
        goToFirstPage,
        refetch,
        goToPreviousPage
    };
}