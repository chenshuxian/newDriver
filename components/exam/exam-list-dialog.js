import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Form, Field } from 'react-final-form';
import {
  Grid,
  IconButton,
  Input
} from '@mui/material/';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CancelIcon from '@mui/icons-material/Cancel';
import { createTheme, styled } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { createdExam, updatedExam } from  '../../libs/front/exam';
import { examValidate } from '../../libs/front/validate';
import { SELECTFIELD, TEXTFIELD } from '../formItem';
import axios from 'axios';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(1, 1),
      },
      input: {
        display: 'none'
      }
    }),
  { defaultTheme },
);

export default function ExamFormDialog(props) {

    const { 
      handleClose, 
      open, 
      submittedValues, 
      data,
      setRows
    } = props;

    React.useEffect(()=>{
      if(submittedValues){
        setImages(submittedValues.exam_img_url)
      }
    },[submittedValues])

  
    const classes = useStyles();
    const model_title = `考題資料管理 - ${submittedValues ? "修改" : "新增"}`;
    const initialValues = {};
    const [files, setFiles] = React.useState();
    const [images, setImages] = React.useState();
    const [fileName, setFileName] = React.useState();

    const fieldList = 
    [
        {name: "exam_number", label: "題庫組別", type: "text", xs:12, required: true},
        {name: "exam_title", label: "題目", type: "text", xs:12, required: true},
        {name: "exam_option", label: "選項", type: "text", xs:12, required: true, placeholder:"用 ';'分格開 如: 1.test;2.test "},
        {name: "exam_ans", label: "答案", type: "text", xs:12, required: true, inputProps:{maxLength:1}},
        {name: "exam_img_url", label: "圖片", type: "text", xs:10, disabled: true},
    ];

const onSubmit = async (values, form) => {
  const ADD = submittedValues === undefined ? true : false 
  let confirm = false;
  let result;
  let upload = undefined;

  const addRows = (result) => {
    setRows((prevRows) => {
      let newRows = [...prevRows];
      let data = result.data;
      newRows.unshift(data);
      return newRows;
    })
  }

  const resetForm = async () => {
    form.reset({
      ...values,
      exam_number: '',
      exam_title: '',
      exam_option: '',
      exam_ans: '',
      exam_img_url: ''
    });
  }

  const addFlow = async (values) => {
    result = await createdExam(values);
    if(result) {
      addRows(result);
      confirm = window.confirm('新增完成,是否繼續');
      if(confirm) {
        resetForm();
      } else {
        handleClose();
      }
    } else {
      console.log(`新增失敗 ${result}`)
    }
  }

  const updateFlow = async (values) => {
    result = await updatedExam(values);
    if (result) {
      setRows((prevRows) => {
          let data = result.data;
          const rowToUpdateIndex = data.exam_id;
          return prevRows.map((row, index) => {
            return row.exam_id == rowToUpdateIndex ? {...row, ...data} : row
          });
      });
      handleClose(); 
      window.alert('修改完成');
    }
  }

  if (files) {
    let fileData = new FormData();
    fileData.append('file',files);
    upload = await axios.post('/api/exam/uploadImage', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })  

    values.exam_img_url = `/static/images/${upload.data.imageUrl}`;
  }

  if(ADD) {
    addFlow(values);
  } else {
    updateFlow(values);
  }
  //JSON.stringify(values, 0, 2)
};

const onReset = (f,v) => {
  f.reset({
    ...v,
    exam_number: '',
    exam_title: '',
    exam_option: '',
    exam_ans: '',
    exam_img_url: ''
  })
};

const handleImageChange = (e, f, v) => {
  e.preventDefault();
  let reader = new FileReader();
  let file = e.target.files[0];
  if(file) {
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      setFiles(file)
      setImages(reader.result)
      console.log(file.name)
      f.reset({
        ...v,
        exam_img_url: file.name
      })
    };
  }
}

const cancelImgae = (f, v) => {
  setFiles('')
  setImages('')
  f.reset({
    ...v,
    exam_img_url: ''
  })
}

  return (
    <div>
      <Dialog open={open}  onClose={handleClose}>
        <DialogTitle>{model_title}</DialogTitle>
        <DialogContent>
        <Form
        onSubmit={onSubmit}
        validate={examValidate}
        initialValues={submittedValues ?  submittedValues : initialValues}
        render={({ form, handleSubmit, reset, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
              <Grid container alignItems="center" spacing={2} className={classes.root}>
                {
                    fieldList.map((el,i) => {
                        if(el.type === 'select') {
                            return <SELECTFIELD key={i} el={el} i={i}/>
                        }else{
                            return <TEXTFIELD key={i} el={el} i={i} />
                        }
                    })
                }
                <Grid  item xs={1} md={1}>
                <label htmlFor="icon-button-file">
                  <Input accept="image/*" id="icon-button-file" type="file" className={classes.input} onChange={(e) => handleImageChange(e, form, values)}/>
                  <IconButton color="primary" aria-label="upload picture" component="span" size="large">
                    <PhotoCamera />
                  </IconButton>
                </label>
                </Grid>
                <Grid  item xs={1} md={1}>
                  <IconButton color="primary" aria-label="cancel picture" component="span" size="large" 
                  onClick={() => cancelImgae(form, values) }>
                    <CancelIcon />
                  </IconButton>
                </Grid>
                <Grid item >
                  <img src={images} style={{maxHeight:300, margin:5 , borderRadius: 10}}></img>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => onReset(form, values)}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            {/* <Field>{fieldState => (<pre>{JSON.stringify(fieldState, undefined, 2)}</pre>)}</Field> */}
          </form>
        )}
      />
        </DialogContent>
      </Dialog>
    </div>
  );
}