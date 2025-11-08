"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatDateRange,
  getLast7Days,
  parseDateRange,
  serializeDateRange,
} from "@/utils/helpers";

export function Calendar() {
  const [dateRange, setDateRange] = useQueryState("dateRange", {
    parse: parseDateRange,
    serialize: serializeDateRange,
    shallow: false,
  });

  const appliedRange: DateRange = dateRange ?? getLast7Days();

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from && !range?.to) {
      setDateRange(null);
    } else {
      setDateRange({ from: range?.from, to: range?.to });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="dates" className="sr-only">
        Select date range
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-60 justify-between font-normal"
          >
            <span className="truncate flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 opacity-70" />
              {formatDateRange(appliedRange)}
            </span>
            <ChevronDownIcon className="w-4 h-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="range"
            selected={appliedRange}
            captionLayout="dropdown"
            numberOfMonths={2}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
