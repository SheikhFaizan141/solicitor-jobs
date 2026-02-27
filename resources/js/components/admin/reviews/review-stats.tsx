import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewStatsProps {
    active: number;
    spam: number;
    trash: number;
}

export default function ReviewStats({ active, spam, trash }: ReviewStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{active}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Spam Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{spam}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Trashed Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-600">{trash}</div>
                </CardContent>
            </Card>
        </div>
    );
}
