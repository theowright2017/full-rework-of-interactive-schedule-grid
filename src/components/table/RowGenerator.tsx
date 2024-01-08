import { Session, sessionListGenerator } from "@/pages/api/SessionGenerator";
import { Day, buildConfig } from "@/pages/api/config";
import { gridCoordinatesPerDayRow } from "@/pages/api/gridCoords";
import { config } from "process";



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

export const StaticDayRowGenerator = (
	// num = 10,
	sessionList: Session[],
	days: Day[],
	configSetup: {
		startHour: number,
		displayHours: number,
		selectedDays: Set<Day>
	}
): StaticDayRow[] => {
	const dayRows = days.map((day, rowIndex) => {
		const row: StaticDayRow = {
			day: day,
			id: day,
			subRows: gridCoordinatesPerDayRow(
				sessionList,
				buildConfig(
					configSetup.startHour,
					configSetup.displayHours,
					configSetup.selectedDays
				)
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
