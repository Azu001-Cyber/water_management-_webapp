import { Droplets, UtensilsCrossed, Shirt, Bath, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UsageType, USAGE_TYPES } from '../../types';

    interface CategoryBreakdownProps {
    byCategory: Record<UsageType, number>;
    }

    const CATEGORY_ICONS: Record<UsageType, React.ReactNode> = {
    drinking: <Droplets className="h-5 w-5" />,
    cooking: <UtensilsCrossed className="h-5 w-5" />,
    washing: <Shirt className="h-5 w-5" />,
    bathing: <Bath className="h-5 w-5" />,
    others: <MoreHorizontal className="h-5 w-5" />,
    };

    const CATEGORY_COLORS: Record<UsageType, string> = {
    drinking: 'bg-blue-100 text-blue-600',
    cooking: 'bg-orange-100 text-orange-600',
    washing: 'bg-purple-100 text-purple-600',
    bathing: 'bg-cyan-100 text-cyan-600',
    others: 'bg-gray-100 text-gray-600',
    };

    export function CategoryBreakdown({ byCategory }: CategoryBreakdownProps) {
    const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);

    return (
        <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium">Usage by Category</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {USAGE_TYPES.map(({ value, label }) => {
                const amount = byCategory[value] || 0;
                const percentage = total > 0 ? ((amount / total) * 100).toFixed(0) : 0;
                
                return (
                <div
                    key={value}
                    className="flex flex-col items-center rounded-lg border p-3 text-center"
                >
                    <div className={`mb-2 rounded-full p-2 ${CATEGORY_COLORS[value]}`}>
                    {CATEGORY_ICONS[value]}
                    </div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-lg font-bold">{amount.toFixed(1)}L</p>
                    <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
                );
            })}
            </div>
        </CardContent>
        </Card>
    );
}