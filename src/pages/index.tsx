import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
// import ScheduleGrid from "@/components/grid/ScheduleGrid";
import { StaticDayRowGenerator, SubRow } from "@/components/table/RowGenerator";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const ScheduleGrid = dynamic(() => import("@/components/grid/ScheduleGrid"), { ssr: false })

export default function Home() {
	const data = [...StaticDayRowGenerator()];
	const allSubRows = data.flatMap((row) => row.subRows);

	return (
		<div>
			<ScheduleGrid
				data={data}
				allSubRows={allSubRows.filter((item): item is SubRow => !!item)}
			/>
		</div>
	);
}
