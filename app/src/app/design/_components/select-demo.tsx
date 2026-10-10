"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Choose class…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hybrid">+Hybrid — $425/mo</SelectItem>
        <SelectItem value="basic">+Basic — $450/mo</SelectItem>
        <SelectItem value="regular">+Regular — $525/mo</SelectItem>
        <SelectItem value="vip">+VIP — $750/mo</SelectItem>
      </SelectContent>
    </Select>
  );
}
