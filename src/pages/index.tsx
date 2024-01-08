import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
// import ScheduleGrid from "@/components/grid/ScheduleGrid";
import { StaticDayRowGenerator, SubRow } from "@/components/table/RowGenerator";
import { Day, ConfigResult, buildConfig } from "./api/config";
import dynamic from "next/dynamic";
import { useState } from "react";
import Config from "../components/config/ConfigColumn";
import { start } from "repl";
import { sessionListGenerator } from "./api/SessionGenerator";

const inter = Inter({ subsets: ["latin"] });

const ScheduleGrid = dynamic(() => import("@/components/grid/ScheduleGrid"), {
	ssr: false,
});

export default function Home({}) {
	const [sessions, setSessions] = useState(sessionListGenerator(15));
	const [selectedDays, setSelectedDays] = useState(new Set<Day>(["Mon"]));
	const [startHour, setStartHour] = useState(10);
	const [displayHours, setDisplayHours] = useState(10);

	const data = [
		...StaticDayRowGenerator(
			sessions,
			Array.from(selectedDays).map((day) => day),
			{
				startHour,
				displayHours,
				selectedDays: selectedDays,
			}
		),
	];

	console.log('START', startHour)
	const configObj = buildConfig(startHour, displayHours, selectedDays);

	console.log('OBJ', configObj)

	const allSubRows = data.flatMap((row) => row.subRows);

	const contentProps = {
		numOfSessions: sessions.length,
		setNumOfSessions: (num: number) => setSessions(sessionListGenerator(num)),
		selectedDays,
		setSelectedDays,
	};

	const displayProps = {
		startHour,
		setStartHour,
		displayHours,
		setDisplayHours,
	};

	return (
		<div style={{ display: "flex", flexDirection: 'column' }}>
			<ScheduleGrid
				data={data}
				allSubRows={allSubRows.filter((item): item is SubRow => !!item)}
				config={configObj}
			/>
			<Config>
				<Config.Content {...contentProps} />
				<Config.Display {...displayProps} />
			</Config>
		</div>
	);
}
