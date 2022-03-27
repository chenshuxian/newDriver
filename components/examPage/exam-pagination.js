import { useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import styled from '@emotion/styled';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { registerables } from 'chart.js';
const LI = styled('li')(() => ({
	float: 'left',
	padding: 2,
}));

const BTN = ({ examAns, i, focus, changeQ }) => {
	let background = 'rgba(10,220,30,0.8)';
	let border = ' solid rgba(10,220,30,1)';
	if (examAns[i] != 0) {
		background = 'rgba(255,20,30,0.8)';
		border = 'solid rgba(240,90,90,1)';
	}

	if (focus == i) {
		background = 'rgba(250,230,30,0.8)';
		border = ' solid rgba(250,230,30,1)';
	}

	return (
		<LI key={i}>
			<a
				href='#'
				onClick={() => changeQ(i)}
				style={{
					width: 40,
					height: 40,
					display: 'grid',
					placeItems: 'center',
					borderRadius: '50px',
					background,
					border,
					fontWeight: 600,
					textDecoration: 'none',
				}}>
				{i + 1}
			</a>
		</LI>
	);
};

const ExamPagination = ({ examAns, examNum, changeQ, upQ, nextQ }) => {
	return (
		<>
			<Box
				component='ul'
				sx={{
					listStyleType: 'none',
					display: { xs: 'none', md: 'block' },
				}}>
				{examAns.map((v, i) => {
					if (i == 19) {
						return (
							<>
								<BTN
									key={i}
									examAns={examAns}
									i={i}
									focus={examNum}
									changeQ={changeQ}
								/>
								<br />
							</>
						);
					}
					return (
						<BTN
							key={i}
							examAns={examAns}
							i={i}
							focus={examNum}
							changeQ={changeQ}
						/>
					);
				})}
			</Box>
			<Box
				component='ul'
				sx={{
					listStyleType: 'none',
					display: { xs: 'block', md: 'none' },
				}}>
				<LI>
					<Button
						style={{ margin: '2px', height: '40px', width: '100%' }}
						variant='contained'
						onClick={() => upQ(examNum)}>
						{' '}
						上一題{' '}
					</Button>
				</LI>
				<LI>
					<Button
						style={{ margin: '2px', height: '40px', width: '100%' }}
						variant='success'
						onClick={() => nextQ(examNum)}>
						{' '}
						下一題{' '}
					</Button>
				</LI>
			</Box>
		</>
	);
};
export default ExamPagination;
