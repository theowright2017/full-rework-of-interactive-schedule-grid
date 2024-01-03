import React from "react";
import { Session } from "@/pages/api/SessionGenerator";
import {
	Day,
	StaticDayRow,
	SlotNum,
	config,
	SubRow,
} from "../table/RowGenerator";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { Dispatch, SetStateAction, useRef, useState } from "react";
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
		estimateSize: () => 80,
		overscan: 50,
	});

	const rows = props.data;
	const virtualRows = virtualizer.getVirtualItems();

	console.log('total size', virtualizer.getTotalSize())
	console.log('allRows', props.allSubRows.length)

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
									<TableRow
										key={virtualRow.index}
										virtualRow={virtualRow}
										virtualIndex={virtualIndex}
									>
										{(
											rowIsOpen: Set<number>,
											setRowIsOpen: Dispatch<SetStateAction<Set<number>>>
										) => {
											return (
												<React.Fragment>
													{subRow.index === 0 ? (
														<DayCellWithTitle
															rows={rows}
															subRow={subRow}
															rowIsOpen={rowIsOpen}
														/>
													) : (
														<DayCellEmpty rowIsOpen={rowIsOpen} />
													)}
													{Array.from(
														{
															length:
																config.lastAvailableSlotNum -
																config.tempslotStart,
														},
														(_, idx) => config.tempslotStart + idx
													).map((slotNum, slotIndex) => {
														const { subRowMap } = subRow!;
														const slotHasItem = subRowMap.has(
															slotNum as SlotNum
														);

														const item = slotHasItem
															? subRowMap.get(slotNum as number)
															: undefined;

														return (
															<td
																key={`slotCell_${slotIndex}_${slotNum}`}
																className={styles.data_cell}
															>
																{item ? (
																	<SlotCellWithItem
																		item={item}
																		rowIsOpen={rowIsOpen}
																		setRowIsOpen={setRowIsOpen}
																	/>
																) : (
																	<SlotCellEmpty rowIsOpen={rowIsOpen} />
																)}
															</td>
														);
													})}
												</React.Fragment>
											);
										}}
									</TableRow>
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

const TableRow = (props: {
	virtualRow: VirtualItem;
	virtualIndex: number;
	children: (
		rowIsOpen: Set<number>,
		setRowIsOpen: Dispatch<SetStateAction<Set<number>>>
	) => React.JSX.Element;
}) => {
	const [rowIsOpen, setRowIsOpen] = useState(new Set<number>());

	const { virtualRow, virtualIndex } = props;

	return (
		<tr
			className={
				`${styles.grid_row}`
			}
			style={{
				height: rowIsOpen.size > 0 ? "120px" : `${virtualRow.size}px`,
				transform: `translateY(${
					virtualRow.start - virtualIndex * virtualRow.size
				}px)`,
			}}
		>
			{props.children(rowIsOpen, setRowIsOpen)}
		</tr>
	);
};

const DayCellWithTitle = (props: {
	rows: StaticDayRow[];
	subRow: SubRow;
	rowIsOpen: Set<number>;
}) => {
	const { rows, subRow } = props;
	return (
		<td>
			<div
				className={`${styles.day_title_cell} ${
					props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
				}`}
			>
				{rows[subRow.dayIndex].day}
			</div>
		</td>
	);
};

const DayCellEmpty = (props: { rowIsOpen: Set<number> }) => (
	<td>
		<div
			className={`${styles.day_blank_cell} ${
				props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
		/>
	</td>
);

const SlotCellWithItem = (props: {
	item: Session;
	rowIsOpen: Set<number>;
	setRowIsOpen: Dispatch<SetStateAction<Set<number>>>;
}) => {
	const [cardIsOpen, setCardIsOpen] = useState(false);

	const { item, setRowIsOpen } = props;

	return (
		<div
			className={`${styles.grid_cell} ${
				props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
		>
			<div
				className={`${styles.session_card} ${
					cardIsOpen ? styles.cardOpen : styles.cardClosed
				}`}
				onClick={() => {
					if (cardIsOpen) {
						setRowIsOpen((set) => {
							set.delete(item.id);
							return new Set(set);
						});
					} else {
						setRowIsOpen((set) => new Set(set.add(item.id)));
					}
					setCardIsOpen(() => !cardIsOpen);
				}}
			>
				<div className={styles.session_contents}>Session {item.id}</div>
			</div>
		</div>
	);
};

const SlotCellEmpty = (props: { rowIsOpen: Set<number> }) => {
	return (
		<div
			className={`${styles.grid_cell} ${
				props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
		>
			Slot
		</div>
	);
};
