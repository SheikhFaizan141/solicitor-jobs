import { type ColumnDef } from '@tanstack/react-table'

export type LawFirm = {
  id: number
  name: string
  location: string
  contact: string
}

export const columns: ColumnDef<LawFirm>[] = [
  {
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    size: 40,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: ({ row }) => {
      const firm = row.original as LawFirm
      return (
        <div className="space-x-2">
          <button className="text-blue-600 hover:underline" onClick={() => alert(`Edit ${firm.name}`)}>
            Edit
          </button>
          <button className="text-red-600 hover:underline" onClick={() => alert(`Delete ${firm.name}`)}>
            Delete
          </button>
        </div>
      )
    },
  },
]

export const dummyData: LawFirm[] = Array.from({ length: 48 }).map((_, i) => ({
  id: i + 1,
  name: `Firm ${i + 1}`,
  location: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool'][i % 5],
  contact: `01234 56${(7890 + i).toString().slice(-4)}`,
}))
