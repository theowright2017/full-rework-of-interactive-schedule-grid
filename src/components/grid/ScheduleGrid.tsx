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
		<div className={styles.grid_wrapper}>
			<div
				id={"table-container"}
				className={styles.table_container}
				ref={containerRef}
			>
				<div
					className={styles.table_wrap}
					style={{ height: `${virtualizer.getTotalSize()}px` }}
				>
					<table className={styles.table}>
						<thead>
							{[...columnGenerator()].map((headerGroup) => (
								<tr key={headerGroup.id} className={styles.header_row}>
									<th className={styles.header_cell}>Day</th>
									{config.slotTimes.map((time) => (
										<th key={time} className={styles.header_cell}>
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
										className={styles.grid_row}
										style={{
											height: `${virtualRow.size}px`,
											transform: `translateY(${
												virtualRow.start - virtualIndex * virtualRow.size
											}px)`,
										}}
									>
										{subRow.index === 0 ? (
											<td>
												<div className={styles.day_title_cell}>
													{rows[subRow.dayIndex].day}
												</div>
											</td>
										) : (
											<td>
												<div className={styles.day_blank_cell} />
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

											return (
												<td
													key={`slotCell_${slotIndex}`}
													className={styles.data_cell}
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
			<div className={styles.session_card}>
				<div className={styles.session_contents}>Session {item.id}</div>
			</div>
		);
	} else {
		return <div className={styles.empty_cell}>Slot</div>;
	}
};
