import { AlertTriangle, X} from "lucide-react";
import {Alert, AlertDescription, AlertTitle, } from '../ui/alert';
import {Button} from '../ui/button';

interface LimitAlertProps{
    overAmount: number;
    onDismiss?: () => void;
}

export function LimitAlert({overAmount, onDismiss} : LimitAlertProps) {
    return (
        <Alert varient='destructive' className='relative'>
            <AlertTriangle className="h-4 w-4"/>
            <AlertTitle>Daily Limit Exceeded</AlertTitle>
            <AlertDescription>
                You have exceeded your daily water usage limit by{''}
                <strong>{overAmount.toFixed(1)} liters</strong>. Consider reducing your
                consumption to conserve water.
            </AlertDescription>
            {onDismiss && (
                <Button variant="ghost" 
                size='icon'
                className="absolute right-2 top-2" onClick={onDismiss}>
                </Button>
            )}
        </Alert>
    )
}