export type Day = "Mon" | "Tue" | "Wed" | "Thur" | "Fri" | "Sat" | "Sun";
export type TimeSlot =
	| "00:00"
	| "00:30"
	| "01:00"
	| "01:30"
	| "02:00"
	| "02:30"
	| "03:00"
	| "03:30"
	| "04:00"
	| "04:30"
	| "05:30"
	| "06:00"
	| "06:30"
	| "07:00"
	| "07:30"
	| "08:00"
	| "08:30"
	| "09:00"
	| "09:30"
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
	| "15:00"
	| "15:30"
	| "16:00"
	| "16:30"
	| "17:00"
	| "17:30"
	| "18:00"
	| "18:30"
	| "19:00"
	| "19:30"
	| "20:00";
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
	| 36
	| 37
	| 38
	| 39
	| 40;
// , "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"

export interface ConfigResult {
	numDays: number;
	daysToShow: Day[];
	tempslotStart: number;
	slotsPerHour: number;
	lastAvailableSlotNum: number;
	slotTimes: TimeSlot[];
	slotNumbers: SlotNum[];
    endSlot: SlotNum;
    displayHours: number;
}

export const buildConfig = (
	startHour = 10,
	displayHours = 10,
	selectedDays: Set<Day>
): ConfigResult => {
    
    return {
	numDays: 7,
	daysToShow: Array.from(selectedDays),
	tempslotStart: startHour,
	slotsPerHour: 2,
	lastAvailableSlotNum: 35,
    endSlot: 40,
    displayHours: displayHours,
	slotTimes: [
		"00:00",
		"00:30",
		"01:00",
		"01:30",
		"02:00",
		"02:30",
		"03:00",
		"03:30",
		"04:00",
		"04:30",
		"05:30",
		"06:00",
		"06:30",
		"07:00",
		"07:30",
		"08:00",
		"08:30",
		"09:00",
		"09:30",
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
		"15:30",
		"16:00",
		"16:30",
		"17:00",
		"17:30",
		"18:00",
		"18:30",
		"19:00",
		"19:30",
		"20:00",
	],
	slotNumbers: [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
		22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
	],
}};
