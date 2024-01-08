import React from "react";
import styles from "../../styles/Config.module.scss";

const Content = (props) => {
	const { numOfSessions, setNumOfSessions, selectedDays, setSelectedDays } =
		props;

	return (
		<div className={styles.content_container}>
			<div className={styles.content_wrap}>
				<label for={"sessions"}>Number of Sessions Per Day</label>
				<input
					id={"sessions"}
					type={"number"}
					value={numOfSessions}
					onChange={(e) => setNumOfSessions(e.target.value)}
				/>
			</div>
			<div className={styles.content_wrap}>
				<label for={"days"}>Days</label>
				{["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map((day) => (
					<div key={day} className={styles.day_check}>
						<label for={day}>{day}: </label>
						<input
							id={"day"}
							key={day}
							type={"checkbox"}
							name={day}
							checked={selectedDays.has(day)}
							onChange={(e) =>
								setSelectedDays((set) => {
									if (set.has(e.target.name)) {
										set.delete(e.target.name);
										return new Set(set);
									} else {
										return new Set(set.add(e.target.name));
									}
								})
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const Display = (props) => {
    const {
        startHour,
        setStartHour,
        displayHours,
        setDisplayHours
    } = props;

    console.log('START', startHour)
	return (
		<div className={styles.display_container}>
			<div className={styles.display_wrap}>
				<label for={"startHour"}>Start Hour</label>
				<input
					id={"startHour"}
					type={"number"}
                    min={0}
                    max={38}
					value={startHour}
                    step={1}
					onChange={(e) => setStartHour(Number(e.target.value))}
				/>
			</div>
            <div className={styles.display_wrap} >
                <label for={'displayHours'}>Display Hours</label>
                <input
                    id={'displayHours'}
                    type={'number'}
                    min={1}
                    max={24}
                    value={displayHours}
                    onChange={(e) => setDisplayHours(Number(e.target.value))}

/>
            </div>
		</div>
	);
};

const Config = (props) => {
	return <div className={styles.config_container}>{props.children}</div>;
};

Config.Content = Content;
Config.Display = Display;

export default Config;
