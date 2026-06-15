import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AtRiskSummaryCardProps {
  count: number;
  totalStudents: number;
  isLoading: boolean;
}

export function AtRiskSummaryCard({
  count,
  totalStudents,
  isLoading,
}: AtRiskSummaryCardProps) {
  const hasRisk = count > 0;
  const percentage =
    totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;

  return (
    <Card
      className={cn(
        'border transition-colors',
        hasRisk
          ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20'
          : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              hasRisk
                ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            {isLoading ? (
              <div className="space-y-1.5">
                <div className="h-7 w-8 animate-pulse rounded bg-current opacity-20" />
                <div className="h-3.5 w-40 animate-pulse rounded bg-current opacity-20" />
              </div>
            ) : (
              <>
                <p
                  className={cn(
                    'text-2xl font-bold leading-none',
                    hasRisk
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  )}
                >
                  {count}
                </p>
                <p
                  className={cn(
                    'mt-1 text-sm',
                    hasRisk
                      ? 'text-red-600/80 dark:text-red-400/80'
                      : 'text-emerald-600/80 dark:text-emerald-400/80'
                  )}
                >
                  {hasRisk
                    ? `${percentage}% of your students need attention`
                    : 'No students currently at risk'}
                </p>
              </>
            )}
          </div>
        </div>

        {hasRisk && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="shrink-0 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            <Link href="/dashboard/at-risk">
              Review
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}