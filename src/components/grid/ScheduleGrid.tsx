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
		<div style={{padding: '10px 10px 10px 0', backgroundColor: 'white'}}>
		<table className={styles.table}>
			<thead>
				{[...columnGenerator()].map((headerGroup) => (
					<tr
						key={headerGroup.id}
						className={styles.header_row}
						style={{ display: "flex" }}
					>
						<th className={styles.header_cell}></th>
						{config.slotTimes.map((time) => (
							<th key={time} className={styles.header_cell}>
								{time}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				<Virtuoso
					style={{ height: "400px" }}
					data={props.allSubRows}
					itemContent={(subRowIndex, subRow) => {
						const isTopSubOfDayRow = subRow.index === 0;
						const isLastSubOfDayRow =
							props.allSubRows[subRowIndex + 1]?.index === 0;

						const borderClass = isTopSubOfDayRow
							? styles.isTop
							: isLastSubOfDayRow
							? styles.isLast
							: "";

						return (
							<React.Fragment>
								{subRow.index === 0 && <SpacerRow />}
								<TableRow key={subRowIndex}>
									{(
										rowIsOpen: Set<number>,
										setRowIsOpen: Dispatch<SetStateAction<Set<number>>>
									) => {
										return (
											<React.Fragment>
												{subRow.index === 0 ? (
													<td  className={borderClass}>
														<DayCellWithTitle
															rows={rows}
															subRow={subRow}
															rowIsOpen={rowIsOpen}
														/>
													</td>
												) : (
													<td  className={borderClass}>
														<DayCellEmpty rowIsOpen={rowIsOpen} />
													</td>
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
													const slotHasItem = subRowMap.has(slotNum as SlotNum);

													const item = slotHasItem
														? subRowMap.get(slotNum as number)
														: undefined;

													return (
														<td
															key={`slotCell_${slotIndex}_${slotNum}`}
															className={`${styles.data_cell} ${borderClass}`}
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
							</React.Fragment>
						);
					}}
				/>
			</tbody>
		</table>
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
		<tr
			className={`${styles.grid_row} ${rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed}`}
			style={{  display: "flex" }}
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
		<div
			className={`${styles.day_title_cell} ${
				props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
		>
			{rows[subRow.dayIndex].day}
		</div>
	);
};

const DayCellEmpty = (props: { rowIsOpen: Set<number> }) => (
	<div
		className={`${styles.day_blank_cell} ${
			props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
		}`}
	/>
);

const SlotCellWithItem = (props: {
	item: Session;
	rowIsOpen: Set<number>;
	setRowIsOpen: Dispatch<SetStateAction<Set<number>>>;
}) => {
	const [cardIsOpen, setCardIsOpen] = useState(false);

	const { item, setRowIsOpen } = props;

	return (
		<React.Fragment>
			<div
				className={`${styles.grid_cell} ${
					props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
				}`}
			></div>
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
		</React.Fragment>
	);
};

const SlotCellEmpty = (props: { rowIsOpen: Set<number> }) => {
	return (
		<div
			className={`${styles.grid_cell} ${
				props.rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
		></div>
	);
};

const SpacerRow = () => (
	<div
		style={{
			height: "30px",
			width: "100%",
			background: "#fafafa",
		}}
	></div>
);
