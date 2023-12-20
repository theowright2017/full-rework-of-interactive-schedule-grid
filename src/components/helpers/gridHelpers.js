function getSlotFromDurationMins(mins, config) {
	const minsPerSlot = 60 / config.slotsPerHour;

	return mins / minsPerSlot;
}

export { getSlotFromDurationMins };
