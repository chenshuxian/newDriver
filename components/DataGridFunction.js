import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { IconButton, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

function escapeRegExp(value) {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const requestSearch = (searchValue, setRows, setSearchText, totalRows) => {
	setSearchText(searchValue);
	const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
	const filteredRows = totalRows.filter((row) => {
		return Object.keys(row).some((field) => {
			console.log(typeof row[field] === 'string');
			return searchRegex.test(
				typeof row[field] === 'string' ? row[field].toString() : row[field]
			);
		});
	});
	setRows(filteredRows);
};

const defaultTheme = createTheme();
const useStyles = makeStyles(
	(theme) =>
		createStyles({
			root: {
				padding: theme.spacing(0.5, 0.5, 0),
				justifyContent: 'space-between',
				display: 'flex',
				alignItems: 'flex-start',
				flexWrap: 'wrap',
			},
			textField: {
				[theme.breakpoints.down('xs')]: {
					width: '100%',
				},
				margin: theme.spacing(1, 0.5, 1.5),
				'& .MuiSvgIcon-root': {
					marginRight: theme.spacing(0.5),
				},
				'& .MuiInput-underline:before': {
					borderBottom: `1px solid ${theme.palette.divider}`,
				},
			},
		}),
	{ defaultTheme }
);

function QuickSearchToolbar(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<TextField
				variant='standard'
				value={props.value}
				onChange={props.onChange}
				placeholder='Search…'
				className={classes.textField}
				InputProps={{
					startAdornment: <Search fontSize='small' />,
					endAdornment: (
						<IconButton
							title='Clear'
							aria-label='Clear'
							size='small'
							style={{ visibility: props.value ? 'visible' : 'hidden' }}
							onClick={props.clearSearch}>
							<Clear fontSize='small' />
						</IconButton>
					),
				}}
			/>
		</div>
	);
}

QuickSearchToolbar.propTypes = {
	clearSearch: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
};

export { requestSearch, QuickSearchToolbar };
