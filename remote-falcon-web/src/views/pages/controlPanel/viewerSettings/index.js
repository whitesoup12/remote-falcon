import { useState } from 'react';

import ControlCameraTwoToneIcon from '@mui/icons-material/ControlCameraTwoTone';
import HowToVoteTwoToneIcon from '@mui/icons-material/HowToVoteTwoTone';
import HtmlTwoToneIcon from '@mui/icons-material/HtmlTwoTone';
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import { Box, Grid, CardContent, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { RFTabPanel, RFTab } from 'ui-component/RFTabPanel';

import InteractionSettings from './InteractionSettings';
import JukeboxSettings from './JukeboxSettings';
import MainSettings from './MainSettings';
import ViewerPageSettings from './ViewerPageSettings';
import VotingSettings from './VotingSettings';

export const tabOptions = [
  {
    label: 'Viewer Control',
    icon: <ControlCameraTwoToneIcon />,
    caption: 'Main viewer control settings'
  },
  {
    label: 'Viewer Page',
    icon: <HtmlTwoToneIcon />,
    caption: 'Viewer page settings'
  },
  {
    label: 'Jukebox',
    icon: <LibraryMusicTwoToneIcon />,
    caption: 'Jukebox Viewer Control Mode settings'
  },
  {
    label: 'Voting',
    icon: <HowToVoteTwoToneIcon />,
    caption: 'Voting Viewer Control Mode settings'
  },
  {
    label: 'Interaction Safeguards',
    icon: <LayersTwoToneIcon />,
    caption: 'PSA, viewer location, and other safeguard settings'
  }
];

const ViewerSettings = () => {
  const theme = useTheme();

  const [showLinearProgress, setShowLinearProgress] = useState(false);

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Remote Falcon Settings" content={false}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                {showLinearProgress && <LinearProgress />}
              </Grid>
              <Grid item xs={12} lg={4}>
                <CardContent>
                  <RFTabPanel tabOptions={tabOptions} orientation="vertical" />
                </CardContent>
              </Grid>
              <Grid item xs={12} lg={8}>
                <CardContent
                  sx={{
                    borderLeft: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                    height: '100%'
                  }}
                >
                  <RFTab index={0} value="MainSettings">
                    <MainSettings setShowLinearProgress={setShowLinearProgress} />
                  </RFTab>
                  <RFTab index={1} value="ViewerPageSettings">
                    <ViewerPageSettings setShowLinearProgress={setShowLinearProgress} />
                  </RFTab>
                  <RFTab index={2} value="JukeboxSettings">
                    <JukeboxSettings setShowLinearProgress={setShowLinearProgress} />
                  </RFTab>
                  <RFTab index={3} value="VotingSettings">
                    <VotingSettings setShowLinearProgress={setShowLinearProgress} />
                  </RFTab>
                  <RFTab index={4} value="InteractionSettings">
                    <InteractionSettings setShowLinearProgress={setShowLinearProgress} />
                  </RFTab>
                </CardContent>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewerSettings;
