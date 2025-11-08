import { createParser } from "nuqs";
import { ColumnSort, ColumnFilter } from "@tanstack/react-table";

export const parseAsSort = createParser({
  parse(queryValue) {
    const desc = queryValue.startsWith("-");
    const key = queryValue.replace("-", "");
    return [{ id: key, desc }];
  },
  serialize(value: ColumnSort[]) {
    return value
      .map((field) => (field.desc ? `-${field.id}` : field.id))
      .join(",");
  },
});

export const parseAsFilter = createParser({
  parse(queryValue) {
    const filters = queryValue.split("|");
    return filters.map((filter) => {
      const key = filter.split(":")[0] as string;
      const value = filter.split(":")[1] as string;
      return { id: key, value: value.split(",") };
    });
  },
  serialize(value: ColumnFilter[]) {
    return value.map((item) => `${item.id}:${item.value}`).join("|");
  },
});
