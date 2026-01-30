import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, spam, trash } from '@/routes/admin/reviews';
import { LawFirm } from '@/types/law-firms';
import { router, useForm } from '@inertiajs/react';
import { Filter as FilterIcon, X } from 'lucide-react';

// Sub-component for the Toggle Button
export function FilterToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
    return (
        <Button variant={isOpen ? 'secondary' : 'outline'} onClick={onToggle} className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filters
            {isOpen && <X className="ml-1 h-3 w-3 opacity-50" />}
        </Button>
    );
}

interface ReviewFiltersProps {
    filters: {
        rating?: string;
        law_firm?: string;
        start_date?: string;
        end_date?: string;
        search?: string;
        sort?: string;
    };
    lawFirms: LawFirm[];
    activeTab: 'active' | 'spam' | 'trash';
}

export default function ReviewFilters({ filters, lawFirms, activeTab }: ReviewFiltersProps) {
    const { data, setData, get, processing } = useForm({
        rating: filters.rating || '',
        law_firm: filters.law_firm || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        search: filters.search || '',
        sort: filters.sort || '',
    });

    // Helper to get the current URL based on the tab
    const getCurrentUrl = () => {
        switch (activeTab) {
            case 'spam':
                return spam.url();
            case 'trash':
                return trash.url();
            default:
                return index.url();
        }
    };

    const handleFilter = () => {
        get(getCurrentUrl(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        // reset();
        setData({
            rating: '',
            law_firm: '',
            start_date: '',
            end_date: '',
            search: '',
            sort: '',
        });

        router.get(
            getCurrentUrl(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <Card className="animate-in slide-in-from-top-2">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Filter Reviews</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto px-2 text-muted-foreground">
                        Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <div>
                        <Label htmlFor="search">Search</Label>
                        <Input id="search" value={data.search} onChange={(e) => setData('search', e.target.value)} placeholder="Search reviews..." />
                    </div>

                    <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Select value={data.rating} onValueChange={(value) => setData('rating', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All ratings" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All ratings</SelectItem>
                                <SelectItem value="5">5 stars</SelectItem>
                                <SelectItem value="4">4 stars</SelectItem>
                                <SelectItem value="3">3 stars</SelectItem>
                                <SelectItem value="2">2 stars</SelectItem>
                                <SelectItem value="1">1 star</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="law_firm">Law Firm</Label>
                        <Select value={data.law_firm} onValueChange={(value) => setData('law_firm', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All firms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All firms</SelectItem>
                                {lawFirms.map((firm) => (
                                    <SelectItem key={firm.id} value={firm.id.toString()}>
                                        {firm.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="end_date">End Date</Label>
                        <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="sort">Sort By</Label>
                        <Select value={data.sort} onValueChange={(value) => setData('sort', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Newest first" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Newest first</SelectItem>
                                <SelectItem value="oldest">Oldest first</SelectItem>
                                <SelectItem value="rating_high">Rating: High to Low</SelectItem>
                                <SelectItem value="rating_low">Rating: Low to High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Button onClick={handleFilter} disabled={processing}>
                        Apply Filters
                    </Button>
                    <Button variant="outline" onClick={clearFilters}>
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
// Attach the Toggle to the component for cleaner imports
ReviewFilters.Toggle = FilterToggle;
