type Day = 'Mon' | 'Tue' | 'Wed' | 'Thur' | 'Fri' |'Sat' | 'Sun'

export type Session = {
	id: string;
	date: Date;
	time: string;
    day: Day;
    length: number
};

const timesTemp = ['10:30', '11:30', '12:30']

export const sessionListGenerator = (): Session[] => {
	const sessions = Array.from({ length: 3 }, (__, idx) => idx).map((index) => {
		const session: Session = {
			id: index.toString(),
			date: new Date(),
			time: timesTemp[index],
            day: 'Mon',
            length: 1
		};

		return session;
	});

	return sessions;
};


