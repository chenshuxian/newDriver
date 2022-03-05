import React from 'react';
import { Box, Container } from '@mui/material';
import { ExamListResults } from '../components/exam/exam-list-results';
import { DashboardLayout } from '../components/dashboard-layout';
import { getExam } from  '../libs/exam';


const Exams = ({data}) => {
  // console.log(data.trainPeriodDetail);
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mt: 3 }}>
            <ExamListResults data={data} />
          </Box>
        </Container>
      </Box>
    </>
  )
};

Exams.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export async function getServerSideProps(context) {
  let data = {};
  let filter = {};
  filter['is_delete'] = false;
  const exam = await getExam(filter);
  data.exam = JSON.stringify(exam.exam);

  // console.log(`data.trainPeriodDetail==========${data.exam}`)

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}

export default Exams;
