import { Session } from "@/pages/api/SessionGenerator";
import TableBase from "../table/TableBase";
import { Table } from "@tanstack/react-table";
// import {useVirtual} from '@tanstack/react-virtual';
import { Day, StaticDayRow, SlotNum, config } from "../table/RowGenerator";

const ScheduleGrid = () => {
	// const rowVirtualizer = useVirtual({

	// })

	return (
		<TableBase>
			{(table: Table<StaticDayRow>) => {
				return table.getRowModel().rows.map((dayRow, dayRowIndex) => {
					return (
						<tbody key={dayRow.original.day} style={{ marginBottom: "5px" }}>
							{dayRow.original.subRows?.map((subRow, subRowIndex) => {
								return (
									<tr key={subRowIndex}>
										{subRowIndex === 0 && (
											<td
												rowSpan={
													dayRow.original.day === "Mon"
														? dayRow.original.subRows?.length
														: 1
												}
												key={`dayCell_${subRowIndex}`}
											>
												<DayCell day={dayRow.original.day} />
											</td>
										)}
										{Array.from(
											{
												length:
													config.lastAvailableSlotNum - config.tempslotStart,
											},
											(_, idx) => config.tempslotStart + idx
										).map((slotNum, slotIndex) => {
											const { subRowMap } = subRow;
											const slotHasItem = subRowMap.has(slotNum as SlotNum);

											const item = slotHasItem
												? subRowMap.get(slotNum as number)
												: undefined;

											return (
												<td
													key={`slotCell_${slotIndex}`}
													style={{ overflow: "visbile" }}
												>
													<SlotCell
														day={dayRow.original.day}
														subRowIdx={subRowIndex}
														slot={slotNum as SlotNum}
														item={item}
													/>
												</td>
											);
										})}
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
	item,
}: {
	day: Day;
	subRowIdx: number;
	slot: SlotNum;
	item?: Session;
}) => {
	if (item) {
		return (
			<div style={{ overflow: "visible", width: "50px" }}>
				<div
					style={{
						width: "100px",
						backgroundColor: "lightseagreen",
						zIndex: 100,
						position: "relative",
						border: "1px solid black",
					}}
				>
					{item.id}
				</div>
			</div>
		);
	} else {
		return (
			<div style={{ backgroundColor: "coral", border: "1px solid black" }}>
				Slot
			</div>
		);
	}
};
