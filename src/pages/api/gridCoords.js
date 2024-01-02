import { getSlotFromDurationMins } from "../../components/helpers/gridHelpers";

export function gridCoordinatesPerDayRow(sessionsForDay, config) {
	const subRowToContentsMap = new Map();

	function subRowContents() {
		return {
			sessionsInSubRowMap: new Map(),
			unavailableSlotRanges: [],
		};
	}

	if (subRowToContentsMap.size === 0) {
		subRowToContentsMap.set(0, subRowContents());
	}

	sessionLoop: for (const session of sessionsForDay) {
		const sessionStartSlot = getSlotFromDurationMins(
			session.isoDuration.startMinsAfterMidnight,
			config
		);
		const sessionEndSlot = getSlotFromDurationMins(
			session.isoDuration.endMinsAfterMidnight,
			config
		);

		subRowLoop: for (const [index, contents] of [
			...subRowToContentsMap.entries(),
		]) {
			const { sessionsInSubRowMap, unavailableSlotRanges } = contents;

			/** every could be changed to some ?? */
			const canFitInSubRow = unavailableSlotRanges.every((range) => {
				const [start, end] = range;

				return (
					(sessionStartSlot < start && sessionEndSlot <= start) ||
					(sessionStartSlot >= end && sessionEndSlot > end)
				);
			});

			if (canFitInSubRow) {
				sessionsInSubRowMap.set(sessionStartSlot, session);
				subRowToContentsMap.set(index, {
					sessionsInSubRowMap: sessionsInSubRowMap,
					unavailableSlotRanges: [
						...unavailableSlotRanges,
						[sessionStartSlot, sessionEndSlot],
					],
				});
				continue sessionLoop;
			} else if (subRowToContentsMap.size === index + 1) {
				subRowToContentsMap.set(index + 1, {
					sessionsInSubRowMap: new Map([[sessionStartSlot, session]]),
					unavailableSlotRanges: [[sessionStartSlot, sessionEndSlot]],
				});
			}
		}
	}

	return [...subRowToContentsMap.values()].map(
		(content) => content.sessionsInSubRowMap
	);
}
