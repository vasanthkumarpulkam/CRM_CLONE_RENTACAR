"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function TabsDemo() {
  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="drivers">Drivers</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
          <p className="text-sm text-[var(--color-text-muted)]">Reservation details content goes here.</p>
          <div className="mt-2 flex gap-2">
            <Badge variant="confirmed">Confirmed</Badge>
            <Badge variant="info">Daily</Badge>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="drivers">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
          <p className="text-sm text-[var(--color-text-muted)]">Driver information content.</p>
        </div>
      </TabsContent>
      <TabsContent value="payments">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
          <p className="text-sm text-[var(--color-text-muted)]">Payment records.</p>
        </div>
      </TabsContent>
      <TabsContent value="history">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
          <p className="text-sm text-[var(--color-text-muted)]">Audit history log.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
