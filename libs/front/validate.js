const teacherValidate = (values) => {
	const errors = {};

	if (!values.teacher_id) {
		errors.teacher_id = '身分證不可為空';
	} else if (!values.teacher_id.match('^[a-zA-Z][a-zA-Z0-9]\\d{8}$')) {
		errors.teacher_id = '身分證格式錯誤, 本國W123456789, 國外AB12345678';
	}

	if (!values.teacher_name) {
		errors.teacher_name = 'Required';
	} else if (!values.teacher_name.trim().match('^[\u3400-\u9fa5]+$')) {
		errors.teacher_name = '姓名只能輸入中文';
	}

	return errors;
};
const userValidate = (values) => {
	const errors = {};

	if (!values.user_id) {
		errors.user_id = '身分證不可為空';
	} else if (!values.user_id.match('^[a-zA-Z][a-zA-Z0-9]\\d{8}$')) {
		errors.user_id = '身分證格式錯誤, 本國W123456789, 國外AB12345678';
	}

	if (!values.time_id) {
		errors.time_id = 'Required';
	}
	if (!values.user_tel) {
		errors.user_tel = 'Required';
	} else if (isNaN(values.user_tel)) {
		errors.user_tel = '電話號碼只能為數字';
	}

	if (!values.user_name) {
		errors.user_name = 'Required';
	} else if (!values.user_name.trim().match('^[\u3400-\u9fa5]+$')) {
		errors.user_name = '姓名只能輸入中文';
	}

	if (!values.user_email) {
		errors.user_email = 'Required';
	} else if (values.user_email) {
		var emailRule =
			/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (values.user_email.search(emailRule) == -1) {
			errors.user_email = 'email錯誤: ex@gmail.com';
		}
	}
	return errors;
};

const bookValidate = (values) => {
	const errors = {};

	if (!values.user_id) {
		errors.user_id = '身分證不可為空';
	} else if (!values.user_id.match('^[a-zA-Z][a-zA-Z0-9]\\d{8}$')) {
		errors.user_id = '身分證格式錯誤, 本國W123456789, 國外AB12345678';
	}

	if (!values.user_tel) {
		errors.user_tel = 'Required';
	} else if (isNaN(values.user_tel)) {
		errors.user_tel = '電話號碼只能為數字';
	}

	if (!values.user_name) {
		errors.user_name = 'Required';
	} else if (!values.user_name.trim().match('^[\u3400-\u9fa5]+$')) {
		errors.user_name = '姓名只能輸入中文';
	}

	if (!values.user_addr) {
		errors.user_addr = 'Required';
	}

	if (!values.privacy) {
		errors.privacy = 'Required';
	}

	if (!values.user_email) {
		errors.user_email = 'Required';
	} else if (values.user_email) {
		var emailRule =
			/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (values.user_email.search(emailRule) == -1) {
			errors.user_email = 'email錯誤: ex@gmail.com';
		}
	}

	return errors;
};

const examValidate = (values) => {
	const errors = {};

	if (!values.exam_number) {
		errors.exam_number = 'Required';
	}
	if (!values.exam_ans) {
		errors.exam_ans = 'Required';
	} else if (isNaN(values.exam_ans)) {
		errors.exam_ans = '答案只能為數字';
	}

	if (!values.exam_title) {
		errors.exam_title = 'Required';
	}

	if (!values.exam_option) {
		errors.exam_option = 'Required';
	}

	return errors;
};

export { userValidate, examValidate, teacherValidate, bookValidate };
