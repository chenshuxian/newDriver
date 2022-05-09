import { Card, CardHeader, Divider, CardContent } from '@mui/material';
import { CommonDataGrid } from './commonDataGrid';
import { objectFlat } from '../../libs/common';
import {
	deletedClassType,
	createdClassType,
	updatedClassType,
} from '../../libs/front/classType';

const SettingsClassType = ({ classList }) => {
	let title = '課程類別';
	const id = 'class_type_id';
	const name = 'class_type_name';

	let cl = JSON.parse(classList);
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
					delFn={deletedClassType}
					updateFn={updatedClassType}
					createFn={createdClassType}
					list={cl}
				/>
			</CardContent>
		</Card>
	);
};
export default SettingsClassType;
