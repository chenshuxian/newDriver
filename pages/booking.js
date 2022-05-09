import {
	Box,
	Container,
	Grid,
	Card,
	Divider,
	CardHeader,
	CardContent,
} from '@mui/material';
import { getCarList } from '../libs/front/car';
import { getClassList } from '../libs/front/classType';
import { objectFlat } from '../libs/common';
const Booking = () => {
    const [carList, setCarList] = useState([]);
    const [classList, setClassList] = useState([]);
	const title = '線上報名預約';

    useEffect(() => {
        let carlist = getCarList();
        let carOption = objectFlat(carlist.carList, 'car_type_id', 'car_type_name');
        let classlist = getClassList();
        let classOption = objectFlat(classlist.classList, 'class_type_id', 'class_type_name');

    }, []);

	return (
		<>
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					py: 8,
				}}>
				<Container maxWidth={false}>
					<Grid
						container
						justifyContent='center'
						alignItems='center'
						direction='column'
						spacing={3}>
						<Card>
							<CardHeader subheader={`${title}管理`} title={title}  />
							<Divider />
							<CardContent>
								<Grid item xl={3} lg={3} sm={6} xs={12}>
									toolbar
								</Grid>
								<Grid item xl={3} lg={3} sm={6} xs={12}>
									dataGrid
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				</Container>
			</Box>
		</>
	);
};
export default Booking;
