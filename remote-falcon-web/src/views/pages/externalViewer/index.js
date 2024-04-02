/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react';

import { TextField } from '@mui/material';
import htmlToReact from 'html-to-react';
import sign from 'jwt-encode';
import _ from 'lodash';
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

  const setViewerLocation = useCallback(async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewerLatitude(position.coords.latitude.toFixed(5));
        setViewerLongitude(position.coords.longitude.toFixed(5));
      });
    }
  }, []);

  const getExternalViewerPageDetails = useCallback(async () => {
    let showName = '';
    try {
      const externalViewerPageDetailsResponse = await getExternalViewerPageDetailsService();
      setExternalViewerPageDetails({
        ...externalViewerPageDetailsResponse.data
      });
      showName = externalViewerPageDetailsResponse.data?.remotePreferences?.showName;
      if (externalViewerPageDetails?.remotePreferences?.enableGeolocation) {
        setViewerLocation();
      }
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
    return showName;
  }, [dispatch, externalViewerPageDetails?.remotePreferences?.enableGeolocation, setViewerLocation]);

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

  const insertViewerPageStats = useCallback(async () => {
    await insertViewerPageStatsService();
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
        sequence: sequenceName
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
        sequence: sequenceName
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
    const categoriesPlaced = [];

    _.map(externalViewerPageDetails?.sequences, (sequence) => {
      if (sequence.sequenceVisible && sequence.sequenceVisibleCount === 0) {
        let sequenceImageElement = [<></>];
        if (sequence && sequence.sequenceImageUrl && sequence.sequenceImageUrl.replace(/\s/g, '').length) {
          const classname = `sequence-image sequence-image-${sequence.sequenceKey}`;
          sequenceImageElement = (
            <img alt={sequence.sequenceName} className={classname} src={sequence.sequenceImageUrl} data-key={sequence.sequenceName} />
          );
        }
        if (externalViewerPageDetails?.remotePreferences?.viewerControlMode === 'voting') {
          if (sequence.sequenceVotes !== -1) {
            if (sequence.sequenceCategory == null || sequence.sequenceCategory === '') {
              const votingListClassname = `cell-vote-playlist cell-vote-playlist-${sequence.sequenceKey}`;
              const votingListArtistClassname = `cell-vote-playlist-artist cell-vote-playlist-artist-${sequence.sequenceKey}`;
              sequencesElement.push(
                <>
                  <div className={votingListClassname} onClick={(e) => voteForSequence(e)} data-key={sequence.sequenceName}>
                    {sequenceImageElement}
                    {sequence.sequenceDisplayName}
                    <div className={votingListArtistClassname}>{sequence.sequenceArtist}</div>
                  </div>
                  <div className="cell-vote">{sequence.sequenceVotes}</div>
                </>
              );
            } else if (!_.includes(categoriesPlaced, sequence.sequenceCategory)) {
              categoriesPlaced.push(sequence.sequenceCategory);
              const categorizedSequencesArray = [];
              const categorizedSequencesToIterate = _.cloneDeep(externalViewerPageDetails?.sequences);
              _.map(categorizedSequencesToIterate, (categorizedSequence) => {
                if (categorizedSequence.sequenceVisible) {
                  if (categorizedSequence.sequenceCategory === sequence.sequenceCategory) {
                    sequenceImageElement = [<></>];
                    if (
                      categorizedSequence &&
                      categorizedSequence.sequenceImageUrl &&
                      categorizedSequence.sequenceImageUrl.replace(/\s/g, '').length
                    ) {
                      const classname = `sequence-image sequence-image-${categorizedSequence.sequenceKey}`;
                      sequenceImageElement = (
                        <img
                          alt={categorizedSequence.sequenceName}
                          className={classname}
                          src={categorizedSequence.sequenceImageUrl}
                          data-key={categorizedSequence.sequenceName}
                        />
                      );
                    }
                    const categorizedVotingListClassname = `cell-vote-playlist cell-vote-playlist-${sequence.sequenceKey}`;
                    const categorizedVotingListArtistClassname = `cell-vote-playlist-artist cell-vote-playlist-artist-${sequence.sequenceKey}`;
                    const theElement = (
                      <>
                        <div
                          className={categorizedVotingListClassname}
                          onClick={(e) => voteForSequence(e)}
                          data-key={categorizedSequence.sequenceName}
                        >
                          {sequenceImageElement}
                          {categorizedSequence.sequenceDisplayName}
                          <div className={categorizedVotingListArtistClassname}>{categorizedSequence.sequenceArtist}</div>
                        </div>
                        <div className="cell-vote">{categorizedSequence.sequenceVotes}</div>
                      </>
                    );
                    categorizedSequencesArray.push(theElement);
                  }
                }
              });

              sequencesElement.push(
                <>
                  <div className="category-section" style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                    <div className="category-label">{sequence.sequenceCategory}</div>
                    {categorizedSequencesArray}
                  </div>
                </>
              );
            }
          }
        } else if (externalViewerPageDetails?.remotePreferences?.viewerControlMode === 'jukebox') {
          if (sequence.sequenceCategory == null || sequence.sequenceCategory === '') {
            const jukeboxListClassname = `jukebox-list jukebox-list-${sequence.sequenceKey}`;
            const jukeboxListArtistClassname = `jukebox-list-artist jukebox-list-artist-${sequence.sequenceKey}`;
            sequencesElement.push(
              <>
                <div className={jukeboxListClassname} onClick={(e) => addSequenceToQueue(e)} data-key={sequence.sequenceName}>
                  {sequenceImageElement}
                  {sequence.sequenceDisplayName}
                  <div className={jukeboxListArtistClassname}>{sequence.sequenceArtist}</div>
                </div>
              </>
            );
          } else if (!_.includes(categoriesPlaced, sequence.sequenceCategory)) {
            categoriesPlaced.push(sequence.sequenceCategory);
            const categorizedSequencesArray = [];
            const categorizedSequencesToIterate = _.cloneDeep(externalViewerPageDetails?.sequences);
            _.map(categorizedSequencesToIterate, (categorizedSequence) => {
              if (categorizedSequence.sequenceVisible) {
                if (categorizedSequence.sequenceCategory === sequence.sequenceCategory) {
                  sequenceImageElement = [<></>];
                  if (
                    categorizedSequence &&
                    categorizedSequence.sequenceImageUrl &&
                    categorizedSequence.sequenceImageUrl.replace(/\s/g, '').length
                  ) {
                    const classname = `sequence-image sequence-image-${categorizedSequence.sequenceKey}`;
                    sequenceImageElement = (
                      <img
                        alt={categorizedSequence.sequenceName}
                        className={classname}
                        src={categorizedSequence.sequenceImageUrl}
                        data-key={categorizedSequence.sequenceName}
                      />
                    );
                  }
                  const categorizedJukeboxListClassname = `jukebox-list jukebox-list-${categorizedSequence.sequenceKey}`;
                  const categorizedJukeboxListArtistClassname = `jukebox-list-artist jukebox-list-artist-${categorizedSequence.sequenceKey}`;
                  const theElement = (
                    <>
                      <div
                        className={categorizedJukeboxListClassname}
                        onClick={(e) => addSequenceToQueue(e)}
                        data-key={categorizedSequence.sequenceName}
                      >
                        {sequenceImageElement}
                        {categorizedSequence.sequenceDisplayName}
                        <div className={categorizedJukeboxListArtistClassname}>{categorizedSequence.sequenceArtist}</div>
                      </div>
                    </>
                  );
                  categorizedSequencesArray.push(theElement);
                }
              }
            });

            sequencesElement.push(
              <>
                <div className="category-section ">
                  <div className="category-label">{sequence.sequenceCategory}</div>
                  {categorizedSequencesArray}
                </div>
              </>
            );
          }
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
    const init = async () => {
      setLoading(true);
      await signViewerJwt();
      await fetchExternalViewerPage();
      setLoading(false);
      insertViewerPageStats();
    };

    init();
  }, [fetchExternalViewerPage, insertViewerPageStats, signViewerJwt]);

  useInterval(async () => {
    getExternalViewerPageDetails();
    updateActiveViewerService();
  }, 5000);

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
