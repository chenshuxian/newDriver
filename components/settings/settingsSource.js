import { Card, CardHeader, Divider, CardContent } from '@mui/material';
import { objectFlat } from '../../libs/common';
import { CommonDataGrid } from './commonDataGrid';
import {
	deletedSource,
	createdSource,
	updatedSource,
} from '../../libs/front/source';

const SettingsSource = ({ sourceList }) => {
	const title = '報名來源';
	const id = 'source_id';
	const name = 'source_name';

	let cl = JSON.parse(sourceList);
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
					delFn={deletedSource}
					updateFn={updatedSource}
					createFn={createdSource}
					list={cl}
				/>
			</CardContent>
		</Card>
	);
};
export default SettingsSource;
