'use client';

import { PageHeader } from '@/components/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AnalysisHistoryItem = {
  id: string;
  result: string;
  summary: string;
  advice: string;
  verdict: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  agent: string;
};

function getBadgeVariant(verdict: string | null) {
  if (!verdict) return 'secondary';
  const safeVerdicts = ['Safe', 'Genuine', 'Unrelated'];
  if (safeVerdicts.includes(verdict)) {
    return 'secondary';
  }
  const suspiciousVerdicts = ['Suspicious', 'Medium'];
  if (suspiciousVerdicts.includes(verdict)) {
    return 'default';
  }
  return 'destructive';
}

export default function Home() {
  const { data: history, loading } = useCollection<AnalysisHistoryItem>(
    'analysis_history'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Security Dashboard"
        description="A real-time overview of security analysis events."
      />
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && history?.length === 0 && (
                   <TableRow>
                   <TableCell colSpan={4} className="text-center">
                     No analysis events yet. Try one of the analysis tools.
                   </TableCell>
                 </TableRow>
                )}
                {history?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.agent}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(item.result || item.verdict)}>
                        {item.result || item.verdict}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.summary}</TableCell>
                    <TableCell>
                      {item.createdAt &&
                        formatDistanceToNow(
                          new Date(
                            item.createdAt.seconds * 1000 +
                              item.createdAt.nanoseconds / 1000000
                          ),
                          { addSuffix: true }
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
