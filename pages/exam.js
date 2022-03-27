import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getExam, getScore } from '../libs/front/exam';
import { Grid, Box, Button } from '@mui/material';
import ExamPageToolbar from '../components/examPage/exam-page-toolbar';
import ExamTitle from '../components/examPage/exam-title';
import ExamOption from '../components/examPage/exam-option';
import ExamPagination from '../components/examPage/exam-pagination';
let ans;
const Exam = () => {
	let exam;

	let limitQ = 39;
	let initAns = new Array(40).fill(0);
	const { data: session, status } = useSession();
	const userId = session.user.user_id;
	const userName = session.user.name;
	const [examList, setExamList] = useState(null);
	const [examNum, setExamNum] = useState(0); // 題號
	const [examAns, setExamAns] = useState(initAns); // 回答答案

	useEffect(async () => {
		ans = {};
		exam = await getExam(userId);
		setExamList(exam.data.examList);
		exam.data.examList.map((v) => (ans[v.exam_id] = '0'));
	}, []);

	// 換題改變題目button顏色
	const changeQ = (i) => {
		setExamNum(i);
	};

	const upQ = (i) => {
		console.log(i);
		if (i !== 0) {
			setExamNum(i - 1);
		}
	};

	const nextQ = (i) => {
		if (i !== limitQ) {
			setExamNum(i + 1);
		}
	};
	// 設定答案
	const setAns = (i, answer, examId) => {
		let newA = [...examAns];
		newA[i] = answer;
		ans[examId] = answer.toString();
		setExamAns(newA);
		nextQ(i);
	};
	// 取得成績
	const score = () => {
		//console.log(`getScore: ${JSON.stringify(ans)}`)
		getScore(ans);
	};

	return (
		<>
			<ExamPageToolbar userName={userName} />
			<Box sx={{ position: 'relative', top: 64, padding: 2 }}>
				{examList !== null ? (
					<Grid
						container
						direction='column'
						justifyContent='center'
						alignItems='center'
						spacing={2}>
						<Grid item xs={12} sx={{ minHeight: 350 }}>
							<ExamTitle examList={examList} examNum={examNum} />
						</Grid>
						<Grid item xs={12} sx={{ minHeight: 200 }}>
							<ExamOption
								examList={examList}
								examNum={examNum}
								setAns={setAns}
								examAns={examAns}
							/>
						</Grid>
						<Grid item xs={12} sx={{ maxHeight: 100 }}>
							<ExamPagination
								examNum={examNum}
								examAns={examAns}
								changeQ={changeQ}
								upQ={upQ}
								nextQ={nextQ}
							/>
						</Grid>
						<Grid item xs={12} sx={{ maxHeight: 100 }}>
							<Button variant='contained' color='info' onClick={score}>
								交卷
							</Button>
						</Grid>
					</Grid>
				) : null}
			</Box>
		</>
	);
};
export default Exam;

Exam.auth = {
	unauthorized: '/',
};
