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

import { Virtuoso } from "react-virtuoso";

type Props = {
	allSubRows: SubRow[];
	data: StaticDayRow[];
};

const ScheduleGrid = (props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);


	const rows = props.data;

	return (
		<div className={styles.table}>
			<div>
				{[...columnGenerator()].map((headerGroup) => (
					<div
						key={headerGroup.id}
						className={styles.header_row}
						style={{ display: "flex" }}
					>
						<div className={styles.header_cell}>Day</div>
						{config.slotTimes.map((time) => (
							<div key={time} className={styles.header_cell}>
								{time}
							</div>
						))}
					</div>
				))}
			</div>
			<div>
				<Virtuoso
					style={{ height: "400px" }}
					data={props.allSubRows}
					itemContent={(subRowIndex, subRow) => {
						return (
							<TableRow key={subRowIndex}>
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
													<div
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
													</div>
												);
											})}
										</React.Fragment>
									);
								}}
							</TableRow>
						);
					}}
				/>
			</div>
		</div>
	);
};

export default ScheduleGrid;

const TableRow = (props: {
	children: (
		rowIsOpen: Set<number>,
		setRowIsOpen: Dispatch<SetStateAction<Set<number>>>
	) => React.JSX.Element;
}) => {
	const [rowIsOpen, setRowIsOpen] = useState(new Set<number>());

	return (
		<div
			className={`${styles.grid_row}`}
			style={{ height: rowIsOpen.size > 0 ? "120px" : "80px", display: "flex" }}
		>
			{props.children(rowIsOpen, setRowIsOpen)}
		</div>
	);
};

const DayCellWithTitle = (props: {
	rows: StaticDayRow[];
	subRow: SubRow;
	rowIsOpen: Set<number>;
}) => {
	const { rows, subRow } = props;
	return (
		<div style={{ width: "50px" }}>
			<div
				className={`${styles.day_title_cell} ${
					props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
				}`}
			>
				{rows[subRow.dayIndex].day}
			</div>
		</div>
	);
};

const DayCellEmpty = (props: { rowIsOpen: Set<number> }) => (
	<div style={{ width: "50px" }}>
		<div
			className={`${styles.day_blank_cell} ${
				props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
		/>
	</div>
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
