import { useState, useEffect } from "react";
// import {useForm} from 'react-hook-dom';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {format} from 'date-fns';
import {CalendarIcon} from 'lucide-react'
import {WaterEntry, USAGE_TYPES} from '../../types';
import {cn} from '../../lib/utils'
import {Button} from '../ui/button';
import {Input} from '../ui/input';
import {Calendar} from '../ui/calendar';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

import {
    Form, 
    FormControl, 
    FormField, 
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover';

const entrySchema = z.object({
    date: z.date({required_error: 'Date is required' }),
    amount: z.number({required_error: 'Amount is required'})
        .positive('Amount must be positive')
        .max(1000, 'Amount seems to high'),
    UsageType: z.enum(['drinking', 
        'cooking', 
        'washing', 
        'bathing',
        'others'] as const),
    customType: z.string().optional(),

}).refine((data) => {
    if (data.UsageType === 'others') {
        return data.customType && data.customType.trim().length > 0;
    }
    return true;
}, {
    message: 'Please specify the usage type',
    path: ['customType'],
});

type EntryFormData = z.infer<typeof entrySchema>;

interface EntryFormModalProps{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry?: WaterEntry | null;
    onsubmit: (data: Omit<WaterEntry, 'id' | 'userId' | 'createdAt', 'updatedAt'>) => 'void';
    isSubmitting? : boolean;
}

export function EntryFormModal({
    open,
    onOpenChange,
    entry,
    onsubmit,
    isSubmitting,
}: EntryFormModalProps) {
    const [showCustomType, setShowCustomType] = useState(entry?.usageType === 'others');

    const form = useForm<EntryFormData>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            date: entry ? new Date(entry.date) : new Date(),
            amount: entry ?.amount || undefined,
            UsageType: entry?.usageType || 'drinking',
            customType: entry?.customType || '',
        },
    });

    useEffect(() => {
        if (entry) {
            form.reset({
                date:new Date(entry.date),
                amount: entry.amount,
                UsageType: entry.usageType,
                customType: entry.customType || '',
            });
            setShowCustomType(entry.usageType === 'others');
        }else {
            form.reset({
                date: new Date(),
                amount: undefined,
                usageType:'drinking',
                customType: '',
            });
            setShowCustomType(false);
        }
    }, [entry, form, open]);

    const handleSubmit = (data: EntryFormData) => {
        onsubmit({
            date: format(data.date, 'yyyy-MM-dd'),
            amount: data.amount,
            UsageType: data.UsageType,
            customType: data.UsageType === 'others' ? data.customType : undefined,
        });
    };

    const watchUsageType = form.watch('usageType');
    
    useEffect(() => {
        setShowCustomType(watchUsageType === 'others');
    }, [watchUsageType]);
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{entry ? 'Edit Entry' : 'Add Water Usage'}</DialogTitle>
                    <DialogDescription>
                        {entry
                        ? 'Update your water entry details' : 'Record your water consumption for tracking'}
                    </DialogDescription>
                </DialogHeader>
    
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                        control={form.control}
                        name='date'
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline"
                                            className={cn('w-full pl-3 text-left font-normal', 
                                                !field.value && 'text-muted-foreground')}>
                                                    {field.value ? (format(field.value, 'PPP')
                                                ): (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"></CalendarIcon>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align='start'>
                                        <Calender mode="single"
                                        selected={field.value}
                                        onSelect={field.onOpenChange}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                        className="pointer-events-auto">
                                        </Calender>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control}
                        name="usageType"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Usage Type</FormLabel>
                                <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select usage type'/>
                                        </SelectTrigger>
                                    </FormControl>
                                        <SelectContent>
                                            {UsageType.map(({ value, label}) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        {showCustomType && (
                            <FormField
                            control={form.control}
                            name="custom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Custom Usage Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Gardening, Car Wash">{...field}</Input>
                                    </FormControl>
                                </FormItem>
                            )}/>
                        )}

                        <DialogFooter>
                            <Button type="button"
                            varient="outline"
                            onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : entry ? 'Update' : 'Add Entry'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
