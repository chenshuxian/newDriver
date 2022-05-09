import { Card, CardHeader, Divider, CardContent } from '@mui/material';
import { CommonDataGrid } from './commonDataGrid';
import { objectFlat } from '../../libs/common';
import {
	deletedCarType,
	createdCarType,
	updatedCarType,
} from '../../libs/front/car';

const SettingsCarType = ({ carList }) => {
	const title = '汽車類別';
	const id = 'car_type_id';
	const name = 'car_type_name';

	let cl = JSON.parse(carList);
	let state = objectFlat(cl, id, 'is_delete');

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
					delFn={deletedCarType}
					updateFn={updatedCarType}
					createFn={createdCarType}
					list={cl}
				/>
			</CardContent>
		</Card>
	);
};
export default SettingsCarType;
