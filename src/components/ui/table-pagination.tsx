'use client';

import React, { useMemo } from "react";
import Select from "react-select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const DOTS = '...';

const usePagination = ({
    total,
    pageSize,
    siblingCount = 1,
    page
}: {
    total: number;
    pageSize: number;
    siblingCount: number;
    page: number;
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(total / pageSize);
        // pages count is determined as sibilingCount + firstpage+ lastpage+ page+ 2*DOTS
        const totalPageNumbers = siblingCount + 5;
        // case 1; if the number of pages is less than the page numbers we want to show in our paginationComponent,we return the range [1,,totalpageCount]
        if (totalPageCount <= totalPageNumbers) {
            return Array.from({ length: totalPageCount }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(page - siblingCount, 1);
        const rightSiblingIndex = Math.min(page + siblingCount, totalPageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstpageIndex = 1;
        const lastpageIndex = totalPageCount;

        // case 2; No left dots to show, but right dots to be shown;
        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, DOTS, totalPageCount]
        }

        // case 3; No right dots to show, but left dots to be shown;
        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPageCount - rightItemCount + i + 1);
            return [firstpageIndex, DOTS, ...rightRange]
        }

        // case 4; both left right dots to be shown
        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstpageIndex, DOTS, ...middleRange, DOTS, lastpageIndex]
        }

        // fallback case to prevent return undefined
        return Array.from({ length: totalPageCount }, (_, i) => i + 1)
    }, [total, pageSize, siblingCount, page]);
    return paginationRange
};

type TablePaginationProps = {
    total: number;
    onPageChange: (page: number) => void;
    page: number;
    onPageSizeChange: (pageSize: number) => void;
    pageSize: number;
    siblingCount?: number;
    className?: string;
}

export default function TablePagination({
    total,
    page,
    pageSize = 5,
    onPageChange,
    onPageSizeChange,
    siblingCount = 1,
    className
}: TablePaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
    const paginationRange = usePagination({
        total,
        page, pageSize, siblingCount
    });

    const onNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1)
        }
    };
    const onPrevious = () => {
        if (page > 1) {
            onPageChange(page - 1)
        }
    }
    const pageSizeOptions = [
        { value: 5, label: '5 / page' },
        { value: 10, label: '10 / page' },
        { value: 15, label: '15 / page' },
    ];

    // select per pagesize ,auto jump page 1
    const handlePageSizeChange = (value: number) => {
        onPageSizeChange(value);
        onPageChange(1)
    }

    return (
        <div className={cn('flex items-center justify-between w-full', className)}>
            <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground w-[100px]">Rows per page</div>
                <Select
                    options={pageSizeOptions}
                    value={pageSizeOptions.find(opt => opt.value === pageSize)}
                    onChange={opt => handlePageSizeChange(opt?.value || 10)}
                    className="w-[100px] text-xs min-h-0"
                    styles={{
                        control: base => ({
                            ...base,
                            minHeight: 28,
                            height: 28,
                            fontSize: 12,
                            padding: 0
                        }),
                        valueContainer: base => ({
                            ...base,
                            height: 28,
                            padding: '0 6px'
                        }),
                        input: base => ({
                            ...base,
                            margin: 0,
                            padding: 0
                        }),
                        indicatorsContainer: base => ({
                            ...base,
                            height: 28,
                        }),
                        dropdownIndicator: base => ({
                            ...base,
                            padding: 2
                        }),
                        option: base => ({
                            ...base,
                            fontSize: 12,
                            padding: '4px 8px'
                        }),
                        menu: base => ({
                            ...base,
                            fontSize: 12,
                        }),
                    }}
                    menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                />

                <div className="text-sm text-muted-foreground w-[100px]">
                    Total:{total}
                </div>
            </div>
            <div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={onPrevious}
                                className={cn({
                                    'cursor-pointer': page > 1,
                                    'opacity-50 pointer-events-none': page <= 1
                                })}
                            />
                        </PaginationItem>
                        {
                            paginationRange?.map((pageNumber, index) => {
                                if (pageNumber === DOTS) {
                                    return <PaginationEllipsis key={index} />
                                }
                                return (
                                    <PaginationItem
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => onPageChange(pageNumber as number)}
                                    >
                                        <PaginationLink isActive={pageNumber === page}>{pageNumber}</PaginationLink>
                                    </PaginationItem>
                                )
                            })
                        }
                        <PaginationItem>
                            <PaginationNext
                                onClick={onNext}
                                className={cn({
                                    'cursor-pointer': page < totalPages,
                                    'opacity-50 pointer-events-none': page >= totalPages
                                })}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}