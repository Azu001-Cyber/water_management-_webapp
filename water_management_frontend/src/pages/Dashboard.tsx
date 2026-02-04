import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { waterApi, settingsApi } from '../services/api';
import { WaterEntry, UsageType, DEFAULT_DAILY_LIMIT } from '../types';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { TodaySummary } from '../components/dashboard/TodaySummary';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { UsageTable } from '../components/dashboard/UsageTable';
import { LimitAlert } from '../components/dashboard/LimitAlert';
import { EntryFormModal } from '../components/dashboard/EntryFormModel';
import { useToast } from '../hooks/use-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [dailyLimit, setDailyLimit] = useState(DEFAULT_DAILY_LIMIT);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WaterEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [entriesData, settings] = await Promise.all([
          waterApi.getEntries(user.id),
          settingsApi.getSettings(user.id),
        ]);
        setEntries(entriesData);
        setDailyLimit(settings.dailyLimit);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load data',
          variant: 'destructive',
        });
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const todayStats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayEntries = entries.filter((e) => e.date === today);
    const total = todayEntries.reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory: Record<UsageType, number> = {
      drinking: 0,
      cooking: 0,
      washing: 0,
      bathing: 0,
      others: 0,
    };
    
    todayEntries.forEach((entry) => {
      byCategory[entry.usageType] += entry.amount;
    });

    return { total, byCategory };
  }, [entries]);

  const isOverLimit = todayStats.total > dailyLimit;
  const overAmount = todayStats.total - dailyLimit;

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: WaterEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await waterApi.deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast({ title: 'Entry deleted', description: 'Water usage entry removed.' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitEntry = async (
    data: Omit<WaterEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (editingEntry) {
        const updated = await waterApi.updateEntry(editingEntry.id, data);
        setEntries((prev) =>
          prev.map((e) => (e.id === editingEntry.id ? updated : e))
        );
        toast({ title: 'Entry updated', description: 'Water usage entry updated.' });
      } else {
        const newEntry = await waterApi.createEntry({
          ...data,
          userId: user.id,
        });
        setEntries((prev) => [newEntry, ...prev]);
        toast({ title: 'Entry added', description: 'Water usage entry recorded.' });
      }
      setIsModalOpen(false);
      setEditingEntry(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save entry',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your daily water consumption
              </p>
            </div>
            <Button onClick={handleAddEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>

          {isOverLimit && showAlert && (
            <div className="mb-6">
              <LimitAlert
                overAmount={overAmount}
                onDismiss={() => setShowAlert(false)}
              />
            </div>
          )}

          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <TodaySummary totalUsed={todayStats.total} dailyLimit={dailyLimit} />
              </div>
              <div className="md:col-span-2">
                <CategoryBreakdown byCategory={todayStats.byCategory} />
              </div>
            </div>

            <UsageTable
              entries={entries}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          </div>
        </div>
      </main>

      <EntryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        entry={editingEntry}
        onSubmit={handleSubmitEntry}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
