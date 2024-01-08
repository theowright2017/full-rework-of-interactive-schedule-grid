import { Session } from "@/pages/api/SessionGenerator";
import { createColumnHelper } from "@tanstack/react-table";
import {  StaticDayRow } from "./RowGenerator";

const columnHelper = createColumnHelper<StaticDayRow>();

export const columnGenerator = () => [
	columnHelper.accessor("day", {
		cell: (info) => info.getValue(),
		header: () => <div>Day</div>,
	}),
];
