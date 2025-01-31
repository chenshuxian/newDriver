import { TextField, Checkboxes, Select } from 'mui-rff';
import { Grid, MenuItem, Typography } from '@mui/material/';

const SELECTFIELD = (props) => {
	const { el, i } = props;
	return (
		<Grid key={i} item xs={12} md={el.xs}>
			<Select fullWidth required={el.required} name={el.name} label={el.label}>
				{Object.entries(el.list || {}).map(([k, v]) => (
					<MenuItem key={k} value={k}>
						{v}
					</MenuItem>
				))}
			</Select>
		</Grid>
	);
};

const TEXTFIELD = (props) => {
	const { el, i } = props;
	return (
		<Grid key={i} item xs={12} md={el.xs}>
			{el.value ? (
				<TextField
					fullWidth
					required={el.required}
					name={el.name}
					label={el.label}
					type={el.type ? el.type : 'text'}
					value={el.value}
					onChange={el.onClick ? el.onClick : null}
					disabled={el.disabled ? true : false}
					inputProps={el.inputProps}
					placeholder={el.placeholder}
				/>
			) : (
				<TextField
					fullWidth
					required={el.required}
					name={el.name}
					label={el.label}
					type={el.type ? el.type : 'text'}
					disabled={el.disabled ? true : false}
					inputProps={el.inputProps}
					placeholder={el.placeholder}
				/>
			)}
		</Grid>
	);
};

const CHECKBOX = (props) => {
	let { el, i } = props;

	return (
		<Grid key={i} item xs={12} md={el.xs}>
			<Grid container alignItems='center'>
				<Grid item>
					<Checkboxes
						label={el.label}
						name={el.name}
						required={true}
						data={el.data}
					/>
				</Grid>
				{el.link ? (
					<Grid item>
						<Typography>{el.link}</Typography>
					</Grid>
				) : null}
			</Grid>
		</Grid>
	);
};

export { SELECTFIELD, TEXTFIELD, CHECKBOX };
