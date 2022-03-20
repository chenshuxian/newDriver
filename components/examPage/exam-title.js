import { Typography } from '@mui/material';
const ExamTitle = ({ examList, examNum }) => {
	return (
		<>
			<Typography variant='h5'>
				{examNum + 1}. {examList[examNum].exam_title}
			</Typography>
			{examList[examNum].exam_img_url ? (
				<img src={examList[examNum].exam_img_url} />
			) : null}
		</>
	);
};
export default ExamTitle;
