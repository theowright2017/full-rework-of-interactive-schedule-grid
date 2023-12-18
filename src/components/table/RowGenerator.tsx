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
export type SlotNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const config: {
	numDays: number;
	daysToShow: Day[];
	slotTimes: TimeSlot[];
	slotNumbers: SlotNum[];
} = {
	numDays: 7,
	daysToShow: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
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
	slotNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

type SubRow = {
	day: Day;
	id: string;
	subRowIndex: number;
};

export type StaticDayRow = {
	day: Day;
	id: string;
	subRows?: SubRow[];
};

export const StaticDayRowGenerator = (): StaticDayRow[] => {
	const dayRows = config.daysToShow.map((day, rowIndex) => {
		const row: StaticDayRow = {
			day: day,
			id: day,
			subRows:
				day === "Mon"
					? [
							{
								day: day,
								id: day,
								subRowIndex: 0,
							},
							{
								day: day,
								id: day,
								subRowIndex: 1,
							},
							{
								day: day,
								id: day,
								subRowIndex: 2,
							},
					  ]
					: [
							{
								day: day,
								id: day,
								subRowIndex: 0,
							},
					  ],
		};

		return row;
	});
	console.log("dayRows", dayRows);
	return dayRows;
};

