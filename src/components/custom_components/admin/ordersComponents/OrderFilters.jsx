"use client";

import { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon, Clock, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function OrderFilters({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  quickFilter,
  setQuickFilter,
  statusFilter,
  setStatusFilter,
  totalResults,
}) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const quickFilters = ["All", "Today", "Week", "Month"];
  const orderStatuses = ["All", "Pending", "Cooking", "Delivered", "Cancelled"];

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 mb-8 shadow-lg flex flex-col gap-6">
      
      {/* STATUS TABS */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
        <Filter className="w-5 h-5 text-(--color-gold) shrink-0 hidden sm:block" />
        <div className="flex gap-2">
          {orderStatuses.map((status) => (
            <Button
              key={status}
              onClick={() => setStatusFilter(status)}
              variant="ghost"
              className={cn(
                "rounded-full px-5 h-9 text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                statusFilter === status
                  ? "bg-(--color-gold) text-black hover:bg-[#b89445] hover:text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* SEARCH & DATE */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
          <Input
            type="text"
            placeholder="Search by Order ID, Name, Phone or Email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 bg-black/50 border-white/10 rounded-xl text-white focus-visible:ring-1 focus-visible:ring-(--color-gold) focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none placeholder:text-gray-600 text-sm md:text-base"
          />
        </div>

        {/* Date Picker */}
        <div className="w-full md:w-48 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal bg-black/50 border-white/10 text-white hover:bg-white/5 hover:text-white focus-visible:ring-1 focus-visible:ring-(--color-gold)! focus-visible:ring-offset-0 focus-visible:border-(--color-gold) transition-colors outline-none rounded-xl cursor-pointer",
                  !selectedDate && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-(--color-gold)" />
                {selectedDate ? format(new Date(selectedDate), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0 bg-[#0a0a0a] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(format(date, "yyyy-MM-dd"));
                    setQuickFilter("All"); // Reset quick filter when specific date is picked
                  } else {
                    setSelectedDate("");
                  }
                }}
                initialFocus
                className={cn(
                  "p-3 bg-[#0a0a0a] text-white border-0",
                  "**:data-day:cursor-pointer **:data-day:text-gray-300 **:data-day:transition-all",
                  "[&_[data-day]:hover:not([data-selected-single=true])]:bg-white/10 [&_[data-day]:hover:not([data-selected-single=true])]:text-white",
                  "**:data-[selected-single=true]:bg-(--color-gold)! **:data-[selected-single=true]:text-black! **:data-[selected-single=true]:font-bold",
                  "[&_[data-selected-single=true]:hover]:bg-[#b89445]!"
                )}
                classNames={{
                  caption_label: "text-(--color-gold) font-bold tracking-widest uppercase text-sm",
                  button_previous: "size-8 flex items-center justify-center rounded-md text-gray-400 hover:text-(--color-gold) hover:bg-white/10 cursor-pointer transition-colors",
                  button_next: "size-8 flex items-center justify-center rounded-md text-gray-400 hover:text-(--color-gold) hover:bg-white/10 cursor-pointer transition-colors",
                  weekday: "text-gray-500 font-bold uppercase text-[10px] tracking-wider",
                  today: "bg-white/5 text-(--color-gold) font-bold rounded-md",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ALL, TODAY, WEEK, MONTH & RESULT COUNT*/}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Clock className="w-4 h-4 text-gray-500 mr-1 hidden sm:block" />
          {quickFilters.map((filter) => (
            <Button
              key={filter}
              onClick={() => {
                setQuickFilter(filter);
                setSelectedDate("");
              }}
              className={`h-8 px-3 rounded-lg text-xs transition-all flex-1 sm:flex-none cursor-pointer border ${
                quickFilter === filter && !selectedDate
                  ? "bg-gold/20 text-(--color-gold) border-(--color-gold) font-bold hover:bg-gold/30"
                  : "bg-transparent text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400 px-4 py-1.5 rounded-md border border-white/10 font-medium shrink-0 w-full sm:w-auto text-center bg-black/30">
          Showing <span className="text-(--color-gold) font-bold">{totalResults}</span> Results
        </div>
      </div>

    </div>
  );
}