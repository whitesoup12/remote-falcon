import { useState, useEffect, useCallback } from 'react';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Box, Grid, TableRow, TableCell, TableContainer, Table, TableHead, TableBody, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

import { fetchGitHubIssuesService } from 'services/controlPanel/tracker.service';
import { useDispatch, useSelector } from 'store';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import TrackerSkeleton from 'ui-component/cards/Skeleton/TrackerSkeleton';
import { showAlertOld } from 'views/pages/globalPageHelpers';

import TrackerRow from './TrackerRow';

const Tracker = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [isLoading, setIsLoading] = useState(0);
  const [workItems, setWorkItems] = useState([]);

  const fetchWorkItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const workItemsResponse = await fetchGitHubIssuesService();
      const workItems = workItemsResponse.data;
      setWorkItems(workItems);
    } catch (err) {
      showAlertOld({ dispatch, alert: 'error' });
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchWorkItems();
      setIsLoading(false);
    };

    init();
  }, [dispatch, fetchWorkItems, show]);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Work Item Tracker" content={false}>
            {isLoading ? (
              <TrackerSkeleton />
            ) : (
              <TableContainer>
                <Table size="small" aria-label="collapsible table">
                  <TableHead sx={{ '& th,& td': { whiteSpace: 'nowrap' } }}>
                    <TableRow>
                      <TableCell sx={{ pl: 3 }}>
                        <Tooltip placement="top" title="Add Work Item">
                          <IconButton
                            color="primary"
                            sx={{
                              color: theme.palette.green.dark,
                              borderColor: theme.palette.green.main
                            }}
                            size="small"
                            onClick={() =>
                              window.open('https://github.com/whitesoup12/remote-falcon/issues/new/choose', '_blank', 'noreferrer')
                            }
                          >
                            <AddTwoToneIcon sx={{ fontSize: '1.5rem' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell sx={{ pl: 3 }}>Type</TableCell>
                      <TableCell>Title</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <>
                      {_.map(workItems, (workItem) => (
                        <TrackerRow workItem={workItem} show={show} setIsLoading={setIsLoading} fetchWorkItems={fetchWorkItems} />
                      ))}
                    </>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tracker;
