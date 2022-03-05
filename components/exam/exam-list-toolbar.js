import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { download } from '../../libs/common';

export const ExamListToolbar = ({addUser}) => {
  const TITLE = '考題管理';
  const BUTTON_ONE = '上傳題庫';
  const BUTTON_TWO = '下載題庫';
  const BUTTON_THREE = '新增題庫';

return (
  <Box >
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ m: 1 }}
        variant="h4"
      >
        {TITLE}
      </Typography>
      <Box sx={{ m: 1 }}>
        {/* <Button
          startIcon={(<CloudUploadIcon fontSize="small" />)}
          sx={{ mr: 1 }}
        >
          {BUTTON_ONE}
        </Button>
        <Button
          startIcon={(<CloudDownloadIcon fontSize="small" />)}
          sx={{ mr: 1 }}
        >
          {BUTTON_TWO}
        </Button> */}
        <Button
          color="primary"
          variant="contained"
          onClick={addUser()}
          size="small"
        >
          {BUTTON_THREE}
        </Button>
      </Box>
    </Box>
  </Box>
)};
