import { Session } from "@/pages/api/SessionGenerator";
import TableBase from "../table/TableBase";
import { Table } from "@tanstack/react-table";
import { Day, StaticDayRow, SlotNum, config } from "../table/RowGenerator";

const ScheduleGrid = () => {
	return (
		<TableBase>
			{(table: Table<StaticDayRow>) => {
				return table.getRowModel().rows.map((dayRow, dayRowIndex) => {
					return (
						<tbody key={dayRow.original.day}>
							{dayRow.subRows.map((subRow, subRowIndex) => {
								return (
									<tr key={subRowIndex}>
										{[
											...subRow.getVisibleCells().map((cell, cellIndex) => {
												if (
													cell.column.id === "day" &&
													subRowIndex === 0
												) {
													return (
														<td
															rowSpan={dayRow.original.subRows?.length}
															key={`dayCell_${cellIndex}`}
														>
															<DayCell day={dayRow.original.day} />
														</td>
													);
												} else {
													return <></>;
												}
											}),
											...config.slotNumbers.map((slotNum, slotIndex) => {
												return (
													<td
														key={`slotCell_${slotIndex}`}
														style={{ overflow: "visbile" }}
													>
														<SlotCell
															day={dayRow.original.day}
															subRowIdx={subRowIndex}
															slot={slotNum}
														/>
													</td>
												);
											}),
										]}
									</tr>
								);
							})}
						</tbody>
					);
				});
			}}
		</TableBase>
	);
};

export default ScheduleGrid;

const DayCell = ({ day }: { day: string }) => <div>{day}</div>;
const SlotCell = ({
	day,
	subRowIdx,
	slot,
}: {
	day: Day;
	subRowIdx: number;
	slot: SlotNum;
}) => {
	if (day === "Mon" && subRowIdx === 1 && slot === 5) {
		return (
			<div style={{ overflow: "visible", width: '50px' }}>
				<div style={{ width: "100px", backgroundColor: 'lightseagreen', zIndex: 100, position: 'relative' }}>SESSION</div>
			</div>
		);
	} else {
		return <div style={{ backgroundColor: "coral" }}>Slot</div>;
	}
};
