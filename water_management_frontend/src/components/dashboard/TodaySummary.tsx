import { AlertTriangle, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

interface TodaySummaryProps {
    totalUsed: number;
    dailyLimit: number;
    }

    export function TodaySummary({ totalUsed, dailyLimit }: TodaySummaryProps) {
    const percentage = Math.min((totalUsed / dailyLimit) * 100, 100);
    const isOverLimit = totalUsed > dailyLimit;
    const remaining = dailyLimit - totalUsed;

    return (
        <Card className={cn(isOverLimit && 'border-destructive')}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
                {totalUsed.toFixed(1)}L
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {dailyLimit}L
                </span>
            </div>
            {isOverLimit && (
                <div className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Over limit!</span>
                </div>
            )}
            </div>
            
            <Progress
            value={percentage}
            className={cn(
                'mt-3 h-2',
                isOverLimit && '[&>div]:bg-destructive'
            )}
            />
            
            <p className="mt-2 text-sm text-muted-foreground">
            {isOverLimit
                ? `${Math.abs(remaining).toFixed(1)}L over your daily limit`
                : `${remaining.toFixed(1)}L remaining today`}
            </p>
        </CardContent>
        </Card>
    );
}