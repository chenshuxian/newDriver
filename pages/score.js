import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DataGrid } from '@mui/x-data-grid';
import ExamPageToolbar from '../components/examPage/exam-page-toolbar';
import { Grid, Box, Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const Score = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const userName = session.user.name;

	const [score, setScore] = useState();
	const [ansList, setAnsList] = useState();
	const [title, setTitle] = useState('');

	useEffect(() => {
		let t = sessionStorage.getItem('score') >= 85 ? '恭喜過關' : '繼續加油';
		setTitle(t);
		setScore(sessionStorage.getItem('score'));
		setAnsList(JSON.parse(sessionStorage.getItem('ansList')));
	}, []);

	const cols = [
		{ field: 'exam_id', headerName: 'id' },
		{
			field: 'exam_title',
			headerName: '題目',
			width: 700,
		},
		{ field: 'exam_ans', headerName: '正確答案', width: 300 },
		{ field: 'exam_ans_err', headerName: '錯誤答案', width: 300 },
	];
	return (
		<>
			<ExamPageToolbar userName={userName} />
			<div style={{ height: 600, width: '100%', marginTop: 100, padding: 10 }}>
				<div style={{ margin: 8 }}>
					<Typography variant='h2'>{`成績: ${score}, ${title}`}</Typography>
				</div>
				<div style={{ display: 'flex', height: '100%' }}>
					<div style={{ flexGrow: 1 }}>
						<DataGrid
							sx={{
								p: 2,
								boxShadow: 2,
								border: 2,
								borderColor: 'primary.light',
								'& .MuiDataGrid-cell:hover': {
									color: 'primary.main',
								},
								'& .MuiDataGrid-cell': {
									whiteSpace: 'pre-wrap',
									border: '1px solid #111',
								},
								'& .MuiDataGrid-columnHeader': {
									background: 'rgba(250,36,0, 1)',
									border: '1px solid #111',
									borderButtom: '1px solid #111',
								},
							}}
							autoHeight={true}
							columns={cols}
							rows={ansList}
							getRowId={(r) => r.exam_id}
							withBorder
							columnVisibilityModel={{
								// Hide columns status and traderName, the other columns will remain visible
								exam_id: false,
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default Score;

Score.auth = {
	unauthorized: '/',
};
