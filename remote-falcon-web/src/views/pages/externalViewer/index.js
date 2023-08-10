/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react';

import { TextField } from '@mui/material';
import htmlToReact from 'html-to-react';
import sign from 'jwt-encode';
import _ from 'lodash';
import mixpanel from 'mixpanel-browser';
import Loading from 'react-fullscreen-loading';
import { Helmet } from 'react-helmet';

import useInterval from 'hooks/useInterval';
import {
  getExternalViewerPageService,
  getExternalViewerPageDetailsService,
  addSequenceToQueueService,
  voteForSequenceService,
  insertViewerPageStatsService,
  updateActiveViewerService
} from 'services/viewer/viewerPage.service';
import { useDispatch } from 'store';
import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import axios from 'utils/axios';
import { getSubdomain } from 'utils/route-guard/helpers/helpers';

import { defaultProcessingInstructions, processingInstructions, viewerPageMessageElements } from './helpers/helpers';

const ExternalViewerPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewerTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [remoteViewerPage, setRemoteViewerPage] = useState(null);
  const [externalViewerPageDetails, setExternalViewerPageDetails] = useState(null);
  const [remoteViewerReactPage, setRemoteViewerReactPage] = useState(null);
  const [viewerLatitude, setViewerLatitude] = useState(0.0);
  const [viewerLongitude, setViewerLongitude] = useState(0.0);
  const [enteredLocationCode, setEnteredLocationCode] = useState(null);
  const [messageDisplayTime] = useState(6000);
  const [makeItSnowScript, setMakeItSnowScript] = useState(null);

  const setSession = (serviceToken) => {
    if (serviceToken) {
      localStorage.setItem('serviceToken', serviceToken);
      axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
      localStorage.removeItem('serviceToken');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const signViewerJwt = useCallback(async () => {
    const subdomain = getSubdomain();
    const viewerJwtData = {
      subdomain,
      expiresIn: 86400,
      iss: 'remotefalcon'
    };
    const viewerJwt = sign(viewerJwtData, process?.env?.REACT_APP_JWT_VIEWER_SIGN_KEY);
    setSession(viewerJwt);
  }, []);

  const fetchExternalViewerPage = useCallback(async () => {
    try {
      const externalViewerPageResponse = await getExternalViewerPageService();
      const viewerPage = externalViewerPageResponse.data;
      setRemoteViewerPage(viewerPage);
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: unexpectedErrorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
  }, [dispatch]);

  const getExternalViewerPageDetails = useCallback(async () => {
    let remoteName = '';
    try {
      const externalViewerPageDetailsResponse = await getExternalViewerPageDetailsService();
      setExternalViewerPageDetails({
        ...externalViewerPageDetailsResponse.data
      });
      remoteName = externalViewerPageDetailsResponse.data?.remotePreferences?.remoteName;
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: unexpectedErrorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true
        })
      );
    }
    return remoteName;
  }, [dispatch]);

  const showViewerMessage = useCallback(
    (response) => {
      if (response?.status === 200) {
        viewerPageMessageElements.requestSuccessful.current = viewerPageMessageElements?.requestSuccessful?.block;
      } else if (response?.status === 202 && response?.data?.message === 'SONG_REQUESTED') {
        viewerPageMessageElements.requestPlaying.current = viewerPageMessageElements?.requestPlaying?.block;
      } else if (response?.status === 202 && response?.data?.message === 'INVALID_LOCATION') {
        viewerPageMessageElements.invalidLocation.current = viewerPageMessageElements?.invalidLocation?.block;
      } else if (response?.status === 202 && response?.data?.message === 'QUEUE_FULL') {
        viewerPageMessageElements.queueFull.current = viewerPageMessageElements?.queueFull?.block;
      } else if (response?.status === 202 && response?.data?.message === 'INVALID_CODE') {
        viewerPageMessageElements.invalidLocationCode.current = viewerPageMessageElements?.invalidLocationCode?.block;
      } else if (response?.status === 202 && response?.data?.message === 'ALREADY_VOTED') {
        viewerPageMessageElements.alreadyVoted.current = viewerPageMessageElements?.alreadyVoted?.block;
      } else {
        viewerPageMessageElements.requestFailed.current = viewerPageMessageElements?.requestFailed?.block;
      }
      setTimeout(() => {
        _.map(viewerPageMessageElements, (message) => {
          message.current = message?.none;
        });
      }, messageDisplayTime);
    },
    [messageDisplayTime]
  );

  const insertViewerPageStats = useCallback(async (remoteName) => {
    const inserViewerPageStatsResponse = await insertViewerPageStatsService();
    if (inserViewerPageStatsResponse?.status === 200) {
      mixpanel.track('External Viewer Page View', { 'Show Name': remoteName });
    }
  }, []);

  const setViewerLocation = useCallback(async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewerLatitude(position.coords.latitude.toFixed(5));
        setViewerLongitude(position.coords.longitude.toFixed(5));
      });
    }
  }, []);

  const addSequenceToQueue = useCallback(
    async (e) => {
      const sequenceName = e.target.attributes.getNamedItem('data-key') ? e.target.attributes.getNamedItem('data-key').value : '';
      if (externalViewerPageDetails?.remotePreferences?.enableGeolocation) {
        await setViewerLocation();
      }
      if (externalViewerPageDetails?.remotePreferences?.enableLocationCode) {
        if (enteredLocationCode?.target?.value !== externalViewerPageDetails?.remotePreferences?.locationCode) {
          const invalidCodeResponse = {
            status: 202,
            data: {
              message: 'INVALID_CODE'
            }
          };
          showViewerMessage(invalidCodeResponse);
          setEnteredLocationCode(null);
          return;
        }
      }
      const request = {
        viewerLatitude,
        viewerLongitude,
        timezone: viewerTimezone,
        date: new Date().getTime(),
        playlist: sequenceName
      };
      const addSequenceToQueueResponse = await addSequenceToQueueService(request);
      showViewerMessage(addSequenceToQueueResponse);
    },
    [
      enteredLocationCode?.target?.value,
      externalViewerPageDetails?.remotePreferences?.enableGeolocation,
      externalViewerPageDetails?.remotePreferences?.enableLocationCode,
      externalViewerPageDetails?.remotePreferences?.locationCode,
      setViewerLocation,
      showViewerMessage,
      viewerLatitude,
      viewerLongitude,
      viewerTimezone
    ]
  );

  const voteForSequence = useCallback(
    async (e) => {
      const sequenceName = e.target.attributes.getNamedItem('data-key') ? e.target.attributes.getNamedItem('data-key').value : '';
      if (externalViewerPageDetails?.remotePreferences?.enableGeolocation) {
        await setViewerLocation();
      }
      if (externalViewerPageDetails?.remotePreferences?.enableLocationCode) {
        if (enteredLocationCode?.target?.value !== externalViewerPageDetails?.remotePreferences?.locationCode) {
          const invalidCodeResponse = {
            status: 202,
            data: {
              message: 'INVALID_CODE'
            }
          };
          showViewerMessage(invalidCodeResponse);
          setEnteredLocationCode(null);
          return;
        }
      }
      const request = {
        viewerLatitude,
        viewerLongitude,
        timezone: viewerTimezone,
        date: new Date().getTime(),
        playlist: sequenceName
      };
      const voteForSequenceResponse = await voteForSequenceService(request);
      showViewerMessage(voteForSequenceResponse);
    },
    [
      enteredLocationCode?.target?.value,
      externalViewerPageDetails?.remotePreferences?.enableGeolocation,
      externalViewerPageDetails?.remotePreferences?.enableLocationCode,
      externalViewerPageDetails?.remotePreferences?.locationCode,
      setViewerLocation,
      showViewerMessage,
      viewerLatitude,
      viewerLongitude,
      viewerTimezone
    ]
  );

  const displayCurrentViewerMessages = (parsedViewerPage) => {
    _.map(viewerPageMessageElements, (message) => {
      parsedViewerPage = parsedViewerPage?.replace(message?.element, message?.current);
    });
    return parsedViewerPage;
  };

  const convertViewerPageToReact = useCallback(async () => {
    const isValidNode = () => true;

    let parsedViewerPage = remoteViewerPage;

    if (externalViewerPageDetails?.remotePreferences?.makeItSnow) {
      setMakeItSnowScript(<script type="text/javascript" src="https://app.embed.im/snow.js" />);
    }

    const htmlToReactParser = new htmlToReact.Parser();
    const processNodeDefinitions = new htmlToReact.ProcessNodeDefinitions(React);
    let instructions = defaultProcessingInstructions(processNodeDefinitions);

    parsedViewerPage = parsedViewerPage?.replace(/{QUEUE_DEPTH}/g, externalViewerPageDetails?.remotePreferences?.jukeboxDepth);
    parsedViewerPage = displayCurrentViewerMessages(parsedViewerPage);

    const sequencesElement = [];
    _.map(externalViewerPageDetails?.sequences, (sequence) => {
      if (sequence.sequenceVisible && sequence.sequenceVisibleCount === 0) {
        let sequenceImageElement = [<></>];
        if (sequence && sequence.sequenceImageUrl && sequence.sequenceImageUrl.replace(/\s/g, '').length) {
          sequenceImageElement = (
            <img alt={sequence.sequenceName} className="sequence-image" src={sequence.sequenceImageUrl} data-key={sequence.sequenceName} />
          );
        }
        if (externalViewerPageDetails?.remotePreferences?.viewerControlMode === 'voting') {
          if (sequence.sequenceVotes !== -1) {
            sequencesElement.push(
              <>
                <div className="cell-vote-playlist" onClick={(e) => voteForSequence(e)} data-key={sequence.sequenceName}>
                  {sequenceImageElement}
                  {sequence.sequenceDisplayName}
                </div>
                <div className="cell-vote">{sequence.sequenceVotes}</div>
              </>
            );
          }
        } else {
          sequencesElement.push(
            <>
              <div className="jukebox-list" onClick={(e) => addSequenceToQueue(e)} data-key={sequence.sequenceName}>
                {sequenceImageElement}
                {sequence.sequenceDisplayName}
              </div>
            </>
          );
        }
      }
    });

    const jukeboxRequestsElement = [];
    _.map(externalViewerPageDetails?.jukeboxRequests, (request) => {
      jukeboxRequestsElement.push(
        <>
          <div className="jukebox-queue">{request}</div>
        </>
      );
    });

    const locationCodeElement = (
      <>
        <TextField type="text" name="locationCode" onChange={setEnteredLocationCode} />
      </>
    );

    instructions = processingInstructions(
      processNodeDefinitions,
      externalViewerPageDetails?.remotePreferences?.viewerControlEnabled,
      externalViewerPageDetails?.remotePreferences?.viewerControlMode,
      externalViewerPageDetails?.remotePreferences?.enableLocationCode,
      sequencesElement,
      jukeboxRequestsElement,
      externalViewerPageDetails?.whatsPlaying,
      externalViewerPageDetails?.nextSequence,
      externalViewerPageDetails?.queueDepth,
      locationCodeElement
    );

    const reactHtml = htmlToReactParser.parseWithInstructions(parsedViewerPage, isValidNode, instructions);
    setRemoteViewerReactPage(reactHtml);
  }, [
    addSequenceToQueue,
    externalViewerPageDetails?.jukeboxRequests,
    externalViewerPageDetails?.nextSequence,
    externalViewerPageDetails?.queueDepth,
    externalViewerPageDetails?.remotePreferences?.enableLocationCode,
    externalViewerPageDetails?.remotePreferences?.jukeboxDepth,
    externalViewerPageDetails?.remotePreferences?.makeItSnow,
    externalViewerPageDetails?.remotePreferences?.viewerControlEnabled,
    externalViewerPageDetails?.remotePreferences?.viewerControlMode,
    externalViewerPageDetails?.sequences,
    externalViewerPageDetails?.whatsPlaying,
    remoteViewerPage,
    voteForSequence
  ]);

  useEffect(() => {
    setViewerLocation();
    const init = async () => {
      setLoading(true);
      await signViewerJwt();
      await fetchExternalViewerPage();
      const remoteName = await getExternalViewerPageDetails();
      insertViewerPageStats(remoteName);
      setLoading(false);
    };

    init();
  }, [fetchExternalViewerPage, getExternalViewerPageDetails, insertViewerPageStats, setViewerLocation, signViewerJwt]);

  useInterval(async () => {
    getExternalViewerPageDetails();
    updateActiveViewerService();
  }, 5000);

  setTimeout(() => {}, 2000);

  useInterval(async () => {
    convertViewerPageToReact();
  }, 500);

  return (
    <>
      <Helmet>
        <style type="text/css">
          {`
            #embedim--snow {
              text-align: inherit;
            }
          `}
        </style>
        <title>{externalViewerPageDetails?.viewerPageMeta?.viewerPageTitle}</title>
        <link rel="icon" href={externalViewerPageDetails?.viewerPageMeta?.viewerPageIconLink} />
        {makeItSnowScript}
      </Helmet>
      <Loading loading={loading} background="black" loaderColor="white" />
      {remoteViewerReactPage}
    </>
  );
};

export default ExternalViewerPage;
