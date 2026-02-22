import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LawFirm } from '@/types/law-firms';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

type LawFirmColumnProps = {
    onDelete: (id: number, name: string) => void;
    isProcessing: boolean;
};

export const createLawFirmColumns = ({ onDelete, isProcessing }: LawFirmColumnProps): ColumnDef<LawFirm>[] => [
    {
        accessorKey: 'name',
        header: 'Firm Name',
        cell: ({ row }) => (
            <div>
                <div className="font-medium text-gray-900">{row.original.name}</div>
                <div className="text-sm text-muted-foreground">
                    {row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '—'}
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'practice_areas',
        header: 'Practice Areas',
        cell: ({ row }) => {
            const practiceAreas = row.original.practice_areas || [];
            const count = practiceAreas.length;
            return (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {count} {count === 1 ? 'area' : 'areas'}
                </span>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.original.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
            >
                {row.original.is_active ? 'Active' : 'Inactive'}
            </span>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => {
            const date = row.original.created_at ? new Date(row.original.created_at).toLocaleDateString() : '—';
            return <span className="text-sm text-gray-600">{date}</span>;
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Modified',
        cell: ({ row }) => {
            const date = row.original.updated_at ? new Date(row.original.updated_at).toLocaleDateString() : '—';
            return <span className="text-sm text-gray-600">{date}</span>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/law-firms/${row.original.id}`} className="flex cursor-pointer items-center">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                View
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href={`/admin/law-firms/${row.original.id}/edit`} className="flex cursor-pointer items-center">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onDelete(row.original.id, row.original.name)}
                            disabled={isProcessing}
                            className="flex cursor-pointer items-center text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];
