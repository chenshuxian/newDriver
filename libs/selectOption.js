import { getTrainPeriod } from './trainPeriod';
import { getTime } from './time';
import { getCarType } from './carType';
import { getPostCode } from './postCode';
import { getClassType } from './classType';
import { getSource } from './source';
import { getTeacher } from './teacher';
import { objectFlat } from './common';

export const trainPeriodSelect = async () => {
	const train = await getTrainPeriod();
	const select = objectFlat(
		train.trainPeriod,
		'train_period_id',
		'train_period_name'
	);

	return select;
};

export const teacherSelect = async () => {
	const list = await getTeacher({ is_delete: false });
	const select = objectFlat(list.teacher, 'teacher_id', 'teacher_name');
	return select;
};

export const timeSelect = async () => {
	const list = await getTime({ is_delete: true });
	const select = objectFlat(list.time, 'time_id', 'time_name');
	return select;
};

export const carTypeSelect = async () => {
	const list = await getCarType({ is_delete: true });
	const select = objectFlat(list.carType, 'car_type_id', 'car_type_name');
	return select;
};

export const classTypeSelect = async () => {
	const list = await getClassType({ is_delete: true });
	const select = objectFlat(list.classType, 'class_type_id', 'class_type_name');
	return select;
};

export const postCodeSelect = async () => {
	const list = await getPostCode();
	const select = objectFlat(list.postCode, 'post_code_name', 'post_code_addr');
	return select;
};

export const sourceSelect = async () => {
	const list = await getSource({ is_delete: true });
	const select = objectFlat(list.source, 'source_id', 'source_name');

	return select;
};
