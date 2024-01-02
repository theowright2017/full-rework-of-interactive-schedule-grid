import { Session } from "@/pages/api/SessionGenerator";
import {
	Day,
	StaticDayRow,
	SlotNum,
	config,
	SubRow,
} from "../table/RowGenerator";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { columnGenerator } from "../table/ColumnGenerator";
import styles from "../../styles/Table.module.scss";

type Props = {
	allSubRows: SubRow[];
	data: StaticDayRow[];
};

const ScheduleGrid = (props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: props.allSubRows.length || 1,
		getScrollElement: () => containerRef.current,
		estimateSize: () => 20,
		overscan: 5,
	});

	const rows = props.data;
	const virtualRows = virtualizer.getVirtualItems();

	return (
		<div style={{ display: "flex", height: "300px", overflow: "auto" }}>
			<div
				id={"table-container"}
				style={{ height: "100%", overflow: "auto" }}
				ref={containerRef}
			>
				<div
					className={styles.table_wrap}
					style={{ height: `${virtualizer.getTotalSize()}px` }}
				>
					<table style={{ borderCollapse: "collapse" }}>
						<thead>
							{[...columnGenerator()].map((headerGroup) => (
								<tr
									key={headerGroup.id}
									style={{
										position: "sticky",
										top: 0,
										left: 0,
										backgroundColor: "lightgrey",
										zIndex: 2,
									}}
								>
									<th style={{ width: "50px" }}>Day</th>
									{config.slotTimes.map((time) => (
										<th key={time} style={{ width: "50px" }}>
											{time}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody>
							{virtualRows.map((virtualRow, virtualIndex) => {
								const subRow = props.allSubRows[virtualRow.index];

								return (
									<tr
										key={virtualRow.index}
										style={{
											height: `${virtualRow.size}px`,
											transform: `translateY(${
												virtualRow.start - virtualIndex * virtualRow.size
											}px)`,
										}}
									>
										{virtualIndex === 0 ? (
											<td>
												<div
													style={{
														backgroundColor: "lightblue",
														height: "20px",
														borderBottom: "1px solid lightblue",
														borderLeft: "1px solid red",
														borderRight: "1px solid red",
														borderTop: "1px solid red",
													}}
												>
													{rows[subRow.dayIndex].day}
												</div>
											</td>
										) : subRow.index === 0 ? (
											<td>
												<div
													style={{
														backgroundColor: "lightblue",
														height: "20px",
														borderBottom: "1px solid lightblue",
														borderLeft: "1px solid red",
														borderRight: "1px solid red",
														borderTop: "1px solid red",
													}}
												>
													{rows[subRow.dayIndex].day}
												</div>
											</td>
										) : (
											<td>
												<div
													style={{
														backgroundColor: "lightblue",
														height: "20px",
														borderBottom: "1px solid lightblue",
														borderLeft: "1px solid red",
														borderRight: "1px solid red",
														borderTop: "1px solid lightblue",
													}}
												/>
											</td>
										)}
										{Array.from(
											{
												length:
													config.lastAvailableSlotNum - config.tempslotStart,
											},
											(_, idx) => config.tempslotStart + idx
										).map((slotNum, slotIndex) => {
											const { subRowMap } = subRow!;
											const slotHasItem = subRowMap.has(slotNum as SlotNum);

											const item = slotHasItem
												? subRowMap.get(slotNum as number)
												: undefined;

											if (virtualIndex === 0) {
												console.log(" new day");
											}

											return (
												<td
													key={`slotCell_${slotIndex}`}
													style={{ overflow: "visbile" }}
												>
													<SlotCell slot={slotNum as SlotNum} item={item} />
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ScheduleGrid;

const DayCell = ({ day }: { day: string }) => <div>{day}</div>;
const SlotCell = ({ slot, item }: { slot: SlotNum; item?: Session }) => {
	if (item) {
		return (
			<div style={{ overflow: "visible", width: "50px", height: "20px" }}>
				<div
					style={{
						width: "100px",
						backgroundColor: "lightseagreen",
						zIndex: 100,
						position: "relative",
						border: "1px solid black",
					}}
				>
					Session {item.id}
				</div>
			</div>
		);
	} else {
		return (
			<div
				style={{
					backgroundColor: "coral",
					border: "1px solid black",
					height: "20px",
				}}
			>
				Slot
			</div>
		);
	}
};
