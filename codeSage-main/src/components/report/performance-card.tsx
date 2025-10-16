'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { useMemo } from 'react';
import { Clock, MemoryStick } from 'lucide-react';

interface PerformanceCardProps {
  executionTime: number;
  memoryUsage: number;
}

const chartConfig = {
  value: {
    label: "Value",
  },
  time: {
    label: "Time (ms)",
    color: "hsl(var(--chart-1))",
  },
  memory: {
    label: "Memory (MB)",
    color: "hsl(var(--chart-2))",
  },
};

export function PerformanceCard({ executionTime, memoryUsage }: PerformanceCardProps) {
  const chartData = useMemo(() => [
    { name: 'Time', value: executionTime, fill: 'var(--color-time)' },
    { name: 'Memory', value: memoryUsage, fill: 'var(--color-memory)' },
  ], [executionTime, memoryUsage]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Clock className="w-4 h-4" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Overview of your code's performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[150px]">
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
            <XAxis type="number" dataKey="value" hide />
            <YAxis 
              type="category" 
              dataKey="name"
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
              width={60}
              tickFormatter={(value) => chartConfig[value.toLowerCase() as keyof typeof chartConfig]?.label}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Bar dataKey="value" radius={4} barSize={32} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
