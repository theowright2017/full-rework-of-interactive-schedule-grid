import { Day, SlotNum } from "@/components/table/RowGenerator";

export type ISODuration = {
	ISODAY: number;
	ISOWEEK: number;
	ISOYEAR: number;
	endDay: number;
	endWeek: number;
	endYear: number;
	startMinsAfterMidnight: number;
	endMinsAfterMidnight: number;
};

export type Session = {
	id: number;
	day: Day;
	isoDuration: ISODuration;
};

const isoGenerator = (
	startDay: number,
	endDay: number,
	startMins: number,
	endMins: number
): ISODuration => {
	return {
		ISODAY: startDay,
		ISOWEEK: 1,
		ISOYEAR: 2023,
		endDay: endDay,
		endWeek: 1,
		endYear: 2023,
		startMinsAfterMidnight: startMins,
		endMinsAfterMidnight: endMins,
	};
};

const isoList = [
	isoGenerator(1, 1, 660, 720),
	isoGenerator(1, 1, 660, 720),
	isoGenerator(1, 1, 660, 720),
	isoGenerator(1, 1, 780, 840),
	isoGenerator(1, 1, 720, 780),
]

export const sessionListGenerator = (day: Day): Session[] => {
	const sessions = Array.from({ length: 5 }, (__, idx) => idx).map((index) => {
		const isoDuration = isoList[index]
		const session: Session = {
			id: index,
			day: day,
			isoDuration: isoDuration,
		};

		return session;
	});

	return sessions;
};
