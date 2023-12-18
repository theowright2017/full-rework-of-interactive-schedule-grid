import {
	Table,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import React, { useState } from "react";

import styles from "../../styles/Table.module.scss";
import { columnGenerator } from "./ColumnGenerator";
import {  StaticDayRow, config, StaticDayRowGenerator } from "./RowGenerator";

interface Props {
	children: (table: Table<StaticDayRow>) => React.JSX.Element[];
}

const TableBase = (props: Props) => {
	const [data, setData] = useState(() => [...StaticDayRowGenerator()]);

	const [columns] = useState(() => [...columnGenerator()]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSubRows: (row: StaticDayRow) => {
			if (row.subRows) {
				return row.subRows
			} else {
				return []
			}
		}
	});

	return (
		<div id={"table-container"}>
			<div className={styles.table_wrap} style={{ height: "300px" }}>
				<table style={{borderCollapse: 'collapse'}}>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th id={"header-cell"} key={header.id}>
											<div id={"inner"}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</div>
										</th>
									);
								})}
                                {config.slotTimes.map((time) => (
                                    <th key={time} style={{width: '50px'}}>{time}</th>
                                ))}
							</tr>
						))}
					</thead>
					{props.children(table)}
				</table>
			</div>
		</div>
	);
};

export default TableBase;
