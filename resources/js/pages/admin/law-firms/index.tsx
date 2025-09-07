import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

interface LawFirm {
    id: number;
    name: string;
    location: string;
    contact: string;
}

const LawFirms = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Sample data - replace with your actual data fetching
    const data: LawFirm[] = [
        { id: 1, name: 'Smith & Co', location: 'London', contact: '01234 567890' },
        { id: 2, name: 'Johnson Legal', location: 'New York', contact: '555-0123' },
        { id: 3, name: 'Williams & Partners', location: 'Sydney', contact: '+61 2 1234 5678' },
        { id: 4, name: 'Brown Law Firm', location: 'Toronto', contact: '416-555-7890' },
        { id: 5, name: 'Davis & Associates', location: 'San Francisco', contact: '415-555-1234' },
        { id: 6, name: 'Miller Legal Group', location: 'Chicago', contact: '312-555-5678' },
        { id: 7, name: 'Wilson & Co', location: 'Los Angeles', contact: '213-555-8765' },
        { id: 8, name: 'Moore Law Offices', location: 'Miami', contact: '305-555-4321' },
        { id: 9, name: 'Taylor & Partners', location: 'Boston', contact: '617-555-6789' },
        { id: 10, name: 'Anderson Legal Services', location: 'Seattle', contact: '206-555-3456' },
        { id: 11, name: 'Thomas & Co', location: 'Austin', contact: '512-555-7890' },
        { id: 12, name: 'Jackson Law Firm', location: 'Denver', contact: '303-555-1234' },
        { id: 13, name: 'White & Associates', location: 'Atlanta', contact: '404-555-5678' },
        { id: 14, name: 'Harris Legal Group', location: 'Dallas', contact: '214-555-8765' },
        { id: 15, name: 'Martin & Co', location: 'Philadelphia', contact: '215-555-4321' },
        { id: 16, name: 'Thompson Law Offices', location: 'Phoenix', contact: '602-555-6789' },
        { id: 17, name: 'Garcia & Partners', location: 'San Diego', contact: '619-555-3456' },
        { id: 18, name: 'Martinez Legal Services', location: 'Houston', contact: '713-555-7890' },
        { id: 19, name: 'Robinson & Co', location: 'Orlando', contact: '407-555-1234' },
        { id: 20, name: 'Clark Law Firm', location: 'Minneapolis', contact: '612-555-5678' },
        { id: 21, name: 'Rodriguez & Associates', location: 'Nashville', contact: '615-555-8765' },
        // Add more data...
    ];

    const columns = useMemo<ColumnDef<LawFirm>[]>(
        () => [
            {
                accessorKey: 'id',
                header: '#',
                size: 60,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
            },
            {
                accessorKey: 'location',
                header: 'Location',
            },
            {
                accessorKey: 'contact',
                header: 'Contact',
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original)}>
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const handleEdit = (firm: LawFirm) => {
        console.log('Edit firm:', firm);
    };

    const handleDelete = (firm: LawFirm) => {
        if (confirm(`Are you sure you want to delete ${firm.name}?`)) {
            console.log('Delete firm:', firm);
        }
    };

    return (
        <div className="px-4 py-3">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Law Firms</h1>
                <Button className="bg-blue-600 hover:bg-blue-700">Add New Listing</Button>
            </div>

            <div className="mb-4">
                <Input
                    placeholder="Search all columns..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Showing {table.getFilteredRowModel().rows.length} results</div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="h-8 w-[70px] rounded border border-gray-300"
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

LawFirms.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default LawFirms;
