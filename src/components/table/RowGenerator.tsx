import { Session, sessionListGenerator } from "@/pages/api/SessionGenerator";
import { gridCoordinatesPerDayRow } from "@/pages/api/gridCoords";

export type Day = "Mon" | "Tue" | "Wed" | "Thur" | "Fri" | "Sat" | "Sun";
export type TimeSlot =
	| "10:00"
	| "10:30"
	| "11:00"
	| "11:30"
	| "12:00"
	| "12:30"
	| "13:00"
	| "13:30"
	| "14:00"
	| "14:30"
	| "15:00";
export type SlotNum =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 23
	| 24
	| 25
	| 26
	| 27
	| 28
	| 29
	| 30
	| 31
	| 32
	| 33
	| 34
	| 35
	| 36;
// , "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
export const config: {
	numDays: number;
	daysToShow: Day[];
	tempslotStart: number;
	slotsPerHour: number;
	lastAvailableSlotNum: number;
	slotTimes: TimeSlot[];
	slotNumbers: SlotNum[];
} = {
	numDays: 7,
	daysToShow: ["Mon", "Tue", "Wed", "Thur"],
	tempslotStart: 20,
	slotsPerHour: 2,
	lastAvailableSlotNum: 30,
	slotTimes: [
		"10:00",
		"10:30",
		"11:00",
		"11:30",
		"12:00",
		"12:30",
		"13:00",
		"13:30",
		"14:00",
		"14:30",
		"15:00",
	],
	slotNumbers: [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
		22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
	],
};

export type SubRow = {
	index: number;
	subRowMap: Map<number, Session>;
	dayIndex: number;
};

export type StaticDayRow = {
	day: Day;
	id: string;
	subRows: SubRow[];
};

export const StaticDayRowGenerator = (): StaticDayRow[] => {
	const dayRows = config.daysToShow.map((day, rowIndex) => {
		const row: StaticDayRow = {
			day: day,
			id: day,
			subRows: gridCoordinatesPerDayRow(
				sessionListGenerator(day, 1000 - 100 * rowIndex),
				config
			).map((map, index) => {
				return {
					index: index,
					subRowMap: map,
					dayIndex: rowIndex,
				};
			}),
		};

		return row;
	});

	return dayRows;
};
