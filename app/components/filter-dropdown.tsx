import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // インポート先は設定に合わせて変更
import { HiOutlineSelector } from "react-icons/hi";

const filters: Filter[] = ["all", "checked", "unchecked", "removed"];

function getFilterLabel(filter: Filter) {
  switch (filter) {
    case "all":
      return "すべてのタスク";
    case "checked":
      return "完了したタスク";
    case "unchecked":
      return "現在のタスク";
    case "removed":
      return "ごみ箱";
    default:
      return "フィルター";
  }
}

const MenuItem = ({
  handleFilter,
  filter,
  text,
}: {
  handleFilter: (filter: Filter) => void;
  filter: Filter;
  text: string;
}): React.ReactNode => {
  return (
    <DropdownMenuItem onSelect={() => handleFilter(filter)}>
      {text}
    </DropdownMenuItem>
  );
};

export const TaskFilter = ({
  handleFilter,
  currentFilter,
  className,
}: {
  handleFilter: (filter: Filter) => void;
  currentFilter: Filter;
  className?: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <HiOutlineSelector className="size-6" />
        {getFilterLabel(currentFilter)}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {filters.map((filter) => {
          return (
            <MenuItem
              key={filter}
              handleFilter={handleFilter}
              filter={filter}
              text={getFilterLabel(filter)}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
