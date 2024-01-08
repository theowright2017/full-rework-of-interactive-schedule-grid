import React from "react";
import { Session } from "@/pages/api/SessionGenerator";
import {
	StaticDayRow,
	SubRow,
} from "../table/RowGenerator";
import {ConfigResult, Day, SlotNum } from "@/pages/api/config";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { columnGenerator } from "../table/ColumnGenerator";
import styles from "../../styles/Table.module.scss";

import { Virtuoso } from "react-virtuoso";
import { getSlotFromDurationMins } from "../helpers/gridHelpers";

type Props = {
	allSubRows: SubRow[];
	data: StaticDayRow[];
	config: ConfigResult;
};

const ScheduleGrid = (props: Props) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const rows = props.data;
	const {config} = props;

	const cellWidth = 1000 / config.displayHours;

	return (
		<div style={{width: '1055px'}} className={styles.grid_wrapper}>
			<table className={styles.table}>
				<thead>
					{[...columnGenerator()].map((headerGroup) => (
						<tr
							key={headerGroup.id}
							className={styles.header_row}
							style={{ display: "flex" }}
						>
							<th style={{width: '50px'}} className={styles.header_cell} ></th>
							{/* {config.slotTimes.map((time) => ( */}
							{Array.from(
								{
									length: config.displayHours
								},
								(_, idx) => (config.tempslotStart * 2) + idx -1
							).map((slotNum) => (
								<th
									key={config.slotTimes[slotNum]}
									style={{width: `${cellWidth}px`}}
									className={styles.header_cell}
								>
									{config.slotTimes[slotNum]}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					<Virtuoso
						style={{ height: "400px", overflowX: 'hidden' }}
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
														<td className={borderClass} style={{width: '50px'}}>
															<DayCellWithTitle
																rows={rows}
																subRow={subRow}
																rowIsOpen={rowIsOpen}
															/>
														</td>
													) : (
														<td className={borderClass} style={{width: '50px'}}>
															<DayCellEmpty rowIsOpen={rowIsOpen} />
														</td>
													)}
													{Array.from(
														{
															length:
																config.displayHours,
														},
														(_, idx) => (config.tempslotStart * 2) + idx
													).map((slotNum, slotIndex) => {
														const { subRowMap } = subRow!;
														const slotHasItem = subRowMap.has(
															slotNum as SlotNum
														);

														const item = slotHasItem
															? subRowMap.get(slotNum as number)
															: undefined;

														console.log('subRowMap', subRowMap)
														console.log('NUM', slotNum)

														return (
															<td
																key={`slotCell_${slotIndex}_${slotNum}`}
																style={{width: `${cellWidth}px`}}
																className={`${styles.data_cell} ${borderClass}`}
															>
																{item ? (
																	<SlotCellWithItem
																		item={item}
																		rowIsOpen={rowIsOpen}
																		setRowIsOpen={setRowIsOpen}
																		cellWidth={cellWidth}
																		
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
			className={`${styles.grid_row} ${
				rowIsOpen.size > 0 ? styles.rowOpen : styles.rowClosed
			}`}
			style={{ display: "flex" }}
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
	cellWidth: number;
}) => {
	const [cardIsOpen, setCardIsOpen] = useState(false);

	const { item, setRowIsOpen, cellWidth } = props;

	const itemWidth = (item.isoDuration.endMinsAfterMidnight - item.isoDuration.startMinsAfterMidnight) / 30
	
	console.log('WIDTH', item)
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
				style={{width: `${cellWidth * itemWidth}px`}}
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
