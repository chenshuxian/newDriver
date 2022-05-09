import { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Card,
	CardHeader,
	CardContent,
	Divider,
	TextField,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { getTimeList } from '../../libs/front/time';
import { objectAutoComp } from '../../libs/common';

const filter = createFilterOptions();

const SettingsTime = () => {
	const [timeOption, setTimeOption] = useState([]);
	const [value, setValue] = useState(null);

	useEffect(async () => {
		let data = await getTimeList();
		let timeList = await objectAutoComp(data, 'time_id', 'time_name');
		setTimeOption(timeList);
	}, []);

	const onChange = (event, newValue) => {
		if (typeof newValue === 'string') {
			setValue({
				label: newValue,
			});
		} else if (newValue && newValue.inputValue) {
			// Create a new value from the user input
			console.log(`newValue11`);
			setTimeOption((pre) => [
				...pre,
				{ label: newValue.inputValue, id: newValue.id },
			]);
			setValue({
				label: newValue.inputValue,
			});
		} else {
			setValue(newValue);
		}
	};
	return (
		<Card>
			<CardHeader subheader='上課時間管理' title='時間' />
			<Divider />
			<CardContent>
				<Autocomplete
					id='time'
					options={timeOption}
					value={value}
					onChange={(event, newValue) => onChange}
					filterOptions={(options, params) => {
						const filtered = filter(options, params);

						const { inputValue } = params;
						// Suggest the creation of a new value
						const isExisting = options.some(
							(option) => inputValue === option.label
						);
						if (inputValue !== '' && !isExisting) {
							filtered.push({
								inputValue,
								label: `新增 ${inputValue}`,
								id: 99,
							});
						}

						return filtered;
					}}
					getOptionLabel={(option) => {
						// e.g value selected with enter, right from the input
						if (typeof option === 'string') {
							return option;
						}
						if (option.inputValue) {
							return option.inputValue;
						}
						return option.label;
					}}
					sx={{ width: 300 }}
					autoHighlight
					selectOnFocus
					clearOnBlur
					freeSolo
					handleHomeEndKeys
					renderOption={(props, option) => <li {...props}>{option.label}</li>}
					renderInput={(params) => <TextField {...params} label='Time' />}
				/>
			</CardContent>
			<Divider />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					p: 2,
				}}>
				<Button color='primary' variant='contained'>
					Update
				</Button>
			</Box>
		</Card>
	);
};
export default SettingsTime;
