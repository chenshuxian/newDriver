import { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Grid,
	Card,
	Divider,
	CardHeader,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	Button,
	MenuItem,
	Link,
	Typography,
} from '@mui/material';
import {
	carTypeSelect,
	classTypeSelect,
	sourceSelect,
	timeSelect,
	postCodeSelect,
	teacherSelect,
} from '../libs/selectOption';
import FormDialog from '../components/settings/formDialog';
import { EventNote } from '@mui/icons-material';
import { getAllowPeriod } from '../libs/trainPeriod';
import { getFirstId, getToday } from '../libs/common';
import { WEBTITLE } from '../libs/front/constText';
import { bookValidate } from '../libs/front/validate';
import { createdUser } from '../libs/front/user';
import { getTrainPeriodList } from '../libs/front/trainPeriod';

const Booking = ({ data }) => {
	const [carList, setCarList] = useState(data.carType);
	const [classList, setClassList] = useState(data.classType);
	const [carValue, setCarValue] = useState(getFirstId(data.carType));
	const [classValue, setClassValue] = useState(getFirstId(data.classType));
	const [buttonList, setButtonList] = useState(JSON.parse(data.trainPeriod));
	const [open, setOpen] = useState(false);
	const [trainPeriod, setTrainPeriod] = useState({});
	const [snackOpen, setSnackOpen] = useState(false);
	const [msg, setMsg] = useState();

	const class_type_id = '47398668-5967-11ec-a655-528abe1c4f3a';
	const user_gender = '1';
	const car_type_id = Object.keys(data.carType).toString();
	const model_title = `個人資料填寫`;

	const initialValues = {
		class_type_id,
		user_gender,
		car_type_id,
	};

	const title = '線上報名預約';
	// let tp = JSON.parse(data.trainPeriod);

	// useEffect(async () => {
	// 	let list = await getTrainPeriodList();
	// 	console.log(`list======================${JSON.stringify(list)}`);
	// }, []);

	const booking = (thisTrian) => {
		setTrainPeriod(thisTrian);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const onSubmit = async (values, form) => {
		values.train_period_id = trainPeriod.train_period_id;
		let born = `${values.user_born}T00:00:00Z`;
		values.user_born = born;

		let result = await createdUser(values);

		if (result.status >= 200 && result.status < 300) {
			handleClose();
			setSnackOpen(true);
			let list = await getTrainPeriodList();
			setButtonList(list.data.train_period_list);
			setMsg(`預約成功，我們將盡速與您連絡`);
		} else {
			// console.log(`新增失敗 ${result}`);
			setSnackOpen(true);
			setMsg(`預約失敗 ${result.data.message}`);
		}

		// window.alert(JSON.stringify(values, 0, 2));
	};

	const fieldList = [
		{
			name: 'train_period_name',
			label: '期別',
			type: 'text',
			value: trainPeriod.train_period_name,
			disabled: true,
			xs: 4,
		},
		{
			name: 'train_period_start',
			label: '開訓日期',
			type: 'text',
			value: trainPeriod.train_period_start,
			disabled: true,
			xs: 4,
		},
		{
			name: 'train_period_exam',
			label: '考試日期',
			type: 'text',
			value: trainPeriod.train_period_exam,
			disabled: true,
			xs: 4,
		},
		{
			name: 'car_type_id',
			label: '汽車類別',
			type: 'select',
			list: data.carType,
			xs: 4,
		},
		{
			name: 'user_email',
			label: '電子信箱',
			type: 'email',
			xs: 8,
			required: true,
		},
		{
			name: 'user_id',
			label: '身份證',
			type: 'text',
			xs: 4,
			required: true,
			inputProps: { maxLength: 10 },
		},
		{
			name: 'user_gender',
			label: '性別',
			type: 'select',
			list: data.gender,
			xs: 4,
		},
		{ name: 'user_name', label: '姓名', type: 'text', xs: 4, required: true },

		{
			name: 'user_born',
			type: 'date',
			xs: 6,
			required: true,
		},
		{
			name: 'user_tel',
			label: '電話',
			type: 'tel',
			required: true,
			xs: 6,
			inputProps: { maxLength: 10 },
		},

		{ name: 'post_code_id', label: '區號', type: 'text', xs: 3 },
		{ name: 'user_addr', label: '地址', type: 'text', xs: 9 },
		{
			name: 'privacy',
			type: 'checkbox',
			data: [{ label: `我同意${WEBTITLE}的` }],
			xs: 12,
			link: (
				<Link href='/privacy' target='_blank' underline='none'>
					隱私政策
				</Link>
			),
		},
	];

	return (
		<>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					py: 8,
				}}>
				<Container>
					<Card>
						<CardHeader subheader={`${title}管理`} title={title} />
						<FormControl sx={{ m: 1 }}>
							<InputLabel id='class-type-select-label'>汽車型別</InputLabel>
							<Select
								labelId='class-type-select-label'
								id='class-type-select'
								value={classValue}
								label='汽車型別'>
								{Object.entries(classList).map(([k, v]) => (
									<MenuItem key={k} value={k}>
										{v}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Divider />
						<CardContent>
							<Grid container alignItems='center' spacing={2}>
								{buttonList.map((o, i) => (
									<Grid item md={6} key={o['train_period_id']}>
										<Button
											sx={{ minWidth: '100%', minHeight: 60, fontSize: 18 }}
											variant='contained'
											endIcon={<EventNote fontSize='large' />}
											disabled={o['count'] < 1 ? true : false}
											color={i == 0 ? 'error' : 'success'}
											onClick={() => booking(o)}>
											{`期別: ${o['train_period_name']}`}
										</Button>
										<Typography variant='h6'>
											可預約人數: {o['count']}
										</Typography>
										<Typography>
											開訓: {o['train_period_start']} 考試:{' '}
											{o['train_period_exam']}
										</Typography>
									</Grid>
								))}
							</Grid>
						</CardContent>
					</Card>
				</Container>
				<FormDialog
					handleClose={handleClose}
					open={open}
					fieldList={fieldList}
					initialValues={initialValues}
					model_title={model_title}
					validate={bookValidate}
					onSubmit={onSubmit}
					postCode={data.postCode}
					setSnackOpen={setSnackOpen}
					snackOpen={snackOpen}
					msg={msg}
				/>
			</Box>
		</>
	);
};

export async function getServerSideProps(context) {
	let data = {};
	let tp = await getAllowPeriod();
	data.trainPeriod = JSON.stringify(tp);
	data.teacher = await teacherSelect();
	data.time = await timeSelect();
	data.classType = await classTypeSelect();
	data.carType = await carTypeSelect();
	data.source = await sourceSelect();
	data.postCode = await postCodeSelect();
	data.gender = { 1: '男', 2: '女' };

	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: { data }, // will be passed to the page component as props
	};
}

export default Booking;
