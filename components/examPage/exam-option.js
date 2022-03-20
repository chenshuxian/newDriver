import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
const LI = styled('li')(() => ({
	float: { md: 'left', xs: '' },
	minWidth: '290px',
	padding: 2,
}));

const ExamOption = ({ setAns, examAns, examNum, examList }) => {
	return (
		<Box component='ul' sx={{ listStyleType: 'none' }}>
			{examList[examNum].exam_option.split(';').map((v, i) => {
				let examId = examList[examNum].exam_id;
				return (
					<LI key={i}>
						<Button
							sx={{ padding: '2px', height: '55px', width: '100%' }}
							variant='contained'
							color={examAns[examNum] === i + 1 ? 'primary' : 'info'}
							onClick={() => setAns(examNum, i + 1, examId)}>
							{v}
						</Button>
					</LI>
				);
			})}
		</Box>
	);
};
export default ExamOption;
