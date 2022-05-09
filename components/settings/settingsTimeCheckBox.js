import { Card, CardHeader, CardContent, Divider } from '@mui/material';
import { objectFlat } from '../../libs/common';
import { CommonDataGrid } from './commonDataGrid';
import {
	deletedTime,
	createdTime,
	updatedTime,
} from '../../libs/front/time';

const SettingsTimeCk = ({ timeList }) => {
	const title = '上課時間';
	const id = 'time_id';
	const name = 'time_name';

	let cl = JSON.parse(timeList);
	let state = objectFlat(cl, id, 'is_delete');
	// let timeListState = objectFlat(JSON.parse(timeList), 'time_id', 'is_delete');
	return (
		<Card>
			<CardHeader subheader={`${title}管理`} title={title} />
			<Divider />
			<CardContent>
				<CommonDataGrid
					switchState={state}
					label={title}
					id={id}
					name={name}
					delFn={deletedTime}
					updateFn={updatedTime}
					createFn={createdTime}
					list={cl}
				/>
				{/* <TimeDataGrid timeList={timeList} timeListState={timeListState} /> */}
			</CardContent>
		</Card>
	);
};

export default SettingsTimeCk;
