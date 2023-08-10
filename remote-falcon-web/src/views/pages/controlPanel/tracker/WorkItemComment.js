import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Card, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

const WorkItemComment = ({ comment, coreInfo }) => {
  const theme = useTheme();

  const commentDateParse = moment(comment?.createdDate, 'YYYY-MM-DDTHH:mm:ss.SSZ').tz(coreInfo?.timezone);
  const commentDateFormatted = `${commentDateParse.format('YYYY-MM-DD HH:mm:ss')}`;

  return (
    <Card
      sx={{
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        p: 1.5,
        mt: 1.25,
        mb: 3,
        borderBottom: '5px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 20 : theme.palette.grey[200]
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container wrap="nowrap" alignItems="center" spacing={1}>
            <Grid item xs zeroMinWidth>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography align="left" variant="h5" component="div">
                    {comment.createdBy}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align="left" variant="caption">
                    <FiberManualRecordIcon sx={{ width: 10, height: 10, opacity: 0.5, my: 0, mx: 0.625 }} />
                    {commentDateFormatted}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ '&.MuiGrid-root': { pt: 1.5 } }}>
          <Typography align="left" variant="body2">
            {comment.text.replace(/&quot;/g, '"')}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

WorkItemComment.propTypes = {
  comment: PropTypes.object,
  coreInfo: PropTypes.object
};

export default WorkItemComment;
