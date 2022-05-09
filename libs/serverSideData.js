import { getTeacher } from './teacher';
import { objectFlat } from './common';

export const teacherSelectOption = async () => {
	const t = await getTeacher();
	const teacher = objectFlat(t.teacher, 'teacher_id', 'teacher_name');
	return teacher;
};
