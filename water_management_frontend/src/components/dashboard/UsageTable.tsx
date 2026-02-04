import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { WaterEntry, USAGE_TYPES } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from '../ui/table';
    import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    } from '../ui/alert-dialog';

    interface UsageTableProps {
    entries: WaterEntry[];
    onEdit: (entry: WaterEntry) => void;
    onDelete: (id: string) => void;
    }

    export function UsageTable({ entries, onEdit, onDelete }: UsageTableProps) {
    const getUsageLabel = (type: string) => {
        return USAGE_TYPES.find((t) => t.value === type)?.label || type;
    };

    if (entries.length === 0) {
        return (
        <Card>
            <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No water usage entries yet.</p>
                <p className="text-sm text-muted-foreground">
                Start tracking by adding your first entry!
                </p>
            </div>
            </CardContent>
        </Card>
        );
    }

    return (
        <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {entries.map((entry) => (
                    <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                        <span className="capitalize">
                        {entry.usageType === 'others' && entry.customType
                            ? entry.customType
                            : getUsageLabel(entry.usageType)}
                        </span>
                    </TableCell>
                    <TableCell className="text-right">{entry.amount}L</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(entry)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                                <AlertDialogDescription>
                                Are you sure you want to delete this water usage entry?
                                This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                onClick={() => onDelete(entry.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </CardContent>
        </Card>
    );
}