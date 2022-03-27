import Snackbar from '@mui/material/Snackbar';
const CommonSnackBar = ({ open, handleClose, msg }) => {
	const vertical = 'top';
	const horizontal = 'center';

	return (
		<Snackbar
			anchorOrigin={{ vertical, horizontal }}
			open={open}
			onClose={handleClose}
			message={msg}
			key={vertical + horizontal}
		/>
	);
};
export default CommonSnackBar;
