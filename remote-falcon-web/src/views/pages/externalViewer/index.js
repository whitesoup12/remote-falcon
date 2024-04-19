/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { TextField } from '@mui/material';
import htmlToReact from 'html-to-react';
import sign from 'jwt-encode';
import _ from 'lodash';
import Loading from 'react-fullscreen-loading';
import { Helmet } from 'react-helmet';

import useInterval from 'hooks/useInterval';
import { getExternalViewerPageDetailsService, addSequenceToQueueService, voteForSequenceService } from 'services/viewer/viewerPage.service';
import { useDispatch } from 'store';
import { unexpectedErrorMessage } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import axios from 'utils/axios';
import { getSubdomain } from 'utils/route-guard/helpers/helpers';

import { setGraphqlHeaders } from '../../../index';
import { insertViewerPageStatsService } from '../../../services/viewer/mutations.service';
import { ViewerControlMode } from '../../../utils/enum';
import { INSERT_VIEWER_PAGE_STATS } from '../../../utils/graphql/viewer/mutations';
import { GET_SHOW } from '../../../utils/graphql/viewer/queries';
import { showAlert } from '../globalPageHelpers';
import { defaultProcessingInstructions, processingInstructions, viewerPageMessageElements } from './helpers/helpers';

const ExternalViewerPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewerTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [show, setShow] = useState();
  const [activeViewerPage, setActiveViewerPage] = useState();

  const [remoteViewerReactPage, setRemoteViewerReactPage] = useState(null);
  const [viewerLatitude, setViewerLatitude] = useState(0.0);
  const [viewerLongitude, setViewerLongitude] = useState(0.0);
  const [enteredLocationCode, setEnteredLocationCode] = useState(null);
  const [messageDisplayTime] = useState(6000);
  const [makeItSnowScript, setMakeItSnowScript] = useState(null);

  const [getShowQuery] = useLazyQuery(GET_SHOW);
  const [insertViewerPageStatsMutation] = useMutation(INSERT_VIEWER_PAGE_STATS);

  const setSession = (serviceToken) => {
    if (serviceToken) {
      localStorage.setItem('serviceToken', serviceToken);
      setGraphqlHeaders(serviceToken);
      axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
      localStorage.removeItem('serviceToken');
      setGraphqlHeaders(null);
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const signViewerJwt = useCallback(async () => {
    const showSubdomain = getSubdomain();
    const viewerJwtData = {
      showSubdomain,
      expiresIn: 86400,
      iss: 'remotefalcon'
    };
    const viewerJwt = sign(viewerJwtData, process?.env?.REACT_APP_JWT_VIEWER_SIGN_KEY);
    setSession(viewerJwt);
  }, []);

  const setViewerLocation = useCallback(async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setViewerLatitude(position.coords.latitude.toFixed(5));
        setViewerLongitude(position.coords.longitude.toFixed(5));
      });
    }
  }, []);

  // const getExternalViewerPageDetails = useCallback(async () => {
  //   let showName = '';
  //   try {
  //     const externalViewerPageDetailsResponse = await getExternalViewerPageDetailsService();
  //     setExternalViewerPageDetails({
  //       ...externalViewerPageDetailsResponse.data
  //     });
  //     showName = externalViewerPageDetailsResponse.data?.remotePreferences?.showName;
  //     if (externalViewerPageDetails?.remotePreferences?.enableGeolocation) {
  //       setViewerLocation();
  //     }
  //   } catch (err) {
  //     dispatch(
  //       openSnackbar({
  //         open: true,
  //         message: unexpectedErrorMessage,
  //         variant: 'alert',
  //         alert: {
  //           color: 'error'
  //         },
  //         close: true
  //       })
  //     );
  //   }
  //   return showName;
  // }, [dispatch, externalViewerPageDetails?.remotePreferences?.enableGeolocation, setViewerLocation]);

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

  const addSequenceToQueue = useCallback(
    async (e) => {
      const sequenceName = e.target.attributes.getNamedItem('data-key') ? e.target.attributes.getNamedItem('data-key').value : '';
      if (show?.preferences?.enableGeolocation) {
        await setViewerLocation();
      }
      if (show?.preferences?.enableLocationCode) {
        if (enteredLocationCode?.target?.value !== show?.preferences?.locationCode) {
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
      show?.preferences?.enableGeolocation,
      show?.preferences?.enableLocationCode,
      show?.preferences?.locationCode,
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
      if (show?.preferences?.enableGeolocation) {
        await setViewerLocation();
      }
      if (show?.preferences?.enableLocationCode) {
        if (enteredLocationCode?.target?.value !== show?.preferences?.locationCode) {
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
      show?.preferences?.enableGeolocation,
      show?.preferences?.enableLocationCode,
      show?.preferences?.locationCode,
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

    let parsedViewerPage = activeViewerPage;

    if (show?.preferences?.makeItSnow) {
      setMakeItSnowScript(<script type="text/javascript" src="https://app.embed.im/snow.js" />);
    }

    const htmlToReactParser = new htmlToReact.Parser();
    const processNodeDefinitions = new htmlToReact.ProcessNodeDefinitions(React);
    let instructions = defaultProcessingInstructions(processNodeDefinitions);

    parsedViewerPage = parsedViewerPage?.replace(/{QUEUE_DEPTH}/g, show?.preferences?.jukeboxDepth);
    parsedViewerPage = displayCurrentViewerMessages(parsedViewerPage);

    const sequencesElement = [];
    const categoriesPlaced = [];

    _.map(show?.sequences, (sequence) => {
      if (sequence.visible && sequence.visibilityCount === 0) {
        let sequenceImageElement = [<></>];
        if (sequence && sequence.imageUrl && sequence.imageUrl.replace(/\s/g, '').length) {
          const classname = `sequence-image sequence-image-${sequence.key}`;
          sequenceImageElement = <img alt={sequence.name} className={classname} src={sequence.imageUrl} data-key={sequence.name} />;
        }
        if (show?.preferences?.viewerControlMode === ViewerControlMode.VOTING) {
          if (sequence.votes !== -1) {
            if (sequence.category == null || sequence.category === '') {
              const votingListClassname = `cell-vote-playlist cell-vote-playlist-${sequence.key}`;
              const votingListArtistClassname = `cell-vote-playlist-artist cell-vote-playlist-artist-${sequence.key}`;
              sequencesElement.push(
                <>
                  <div className={votingListClassname} onClick={(e) => voteForSequence(e)} data-key={sequence.name}>
                    {sequenceImageElement}
                    {sequence.displayName}
                    <div className={votingListArtistClassname}>{sequence.artist}</div>
                  </div>
                  <div className="cell-vote">{sequence.votes}</div>
                </>
              );
            } else if (!_.includes(categoriesPlaced, sequence.category)) {
              categoriesPlaced.push(sequence.category);
              const categorizedSequencesArray = [];
              const categorizedSequencesToIterate = _.cloneDeep(show?.sequences);
              _.map(categorizedSequencesToIterate, (categorizedSequence) => {
                if (categorizedSequence.visible) {
                  if (categorizedSequence.category === sequence.category) {
                    sequenceImageElement = [<></>];
                    if (categorizedSequence && categorizedSequence.imageUrl && categorizedSequence.imageUrl.replace(/\s/g, '').length) {
                      const classname = `sequence-image sequence-image-${categorizedSequence.key}`;
                      sequenceImageElement = (
                        <img
                          alt={categorizedSequence.name}
                          className={classname}
                          src={categorizedSequence.imageUrl}
                          data-key={categorizedSequence.name}
                        />
                      );
                    }
                    const categorizedVotingListClassname = `cell-vote-playlist cell-vote-playlist-${sequence.key}`;
                    const categorizedVotingListArtistClassname = `cell-vote-playlist-artist cell-vote-playlist-artist-${sequence.key}`;
                    const theElement = (
                      <>
                        <div
                          className={categorizedVotingListClassname}
                          onClick={(e) => voteForSequence(e)}
                          data-key={categorizedSequence.name}
                        >
                          {sequenceImageElement}
                          {categorizedSequence.displayName}
                          <div className={categorizedVotingListArtistClassname}>{categorizedSequence.artist}</div>
                        </div>
                        <div className="cell-vote">{categorizedSequence.votes}</div>
                      </>
                    );
                    categorizedSequencesArray.push(theElement);
                  }
                }
              });

              sequencesElement.push(
                <>
                  <div className="category-section" style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                    <div className="category-label">{sequence.category}</div>
                    {categorizedSequencesArray}
                  </div>
                </>
              );
            }
          }
        } else if (show?.preferences?.viewerControlMode === ViewerControlMode.JUKEBOX) {
          if (sequence.category == null || sequence.category === '') {
            const jukeboxListClassname = `jukebox-list jukebox-list-${sequence.key}`;
            const jukeboxListArtistClassname = `jukebox-list-artist jukebox-list-artist-${sequence.key}`;
            sequencesElement.push(
              <>
                <div className={jukeboxListClassname} onClick={(e) => addSequenceToQueue(e)} data-key={sequence.name}>
                  {sequenceImageElement}
                  {sequence.displayName}
                  <div className={jukeboxListArtistClassname}>{sequence.artist}</div>
                </div>
              </>
            );
          } else if (!_.includes(categoriesPlaced, sequence.category)) {
            categoriesPlaced.push(sequence.category);
            const categorizedSequencesArray = [];
            const categorizedSequencesToIterate = _.cloneDeep(show?.sequences);
            _.map(categorizedSequencesToIterate, (categorizedSequence) => {
              if (categorizedSequence.visible) {
                if (categorizedSequence.category === sequence.category) {
                  sequenceImageElement = [<></>];
                  if (categorizedSequence && categorizedSequence.imageUrl && categorizedSequence.imageUrl.replace(/\s/g, '').length) {
                    const classname = `sequence-image sequence-image-${categorizedSequence.key}`;
                    sequenceImageElement = (
                      <img
                        alt={categorizedSequence.name}
                        className={classname}
                        src={categorizedSequence.imageUrl}
                        data-key={categorizedSequence.name}
                      />
                    );
                  }
                  const categorizedJukeboxListClassname = `jukebox-list jukebox-list-${categorizedSequence.key}`;
                  const categorizedJukeboxListArtistClassname = `jukebox-list-artist jukebox-list-artist-${categorizedSequence.key}`;
                  const theElement = (
                    <>
                      <div
                        className={categorizedJukeboxListClassname}
                        onClick={(e) => addSequenceToQueue(e)}
                        data-key={categorizedSequence.name}
                      >
                        {sequenceImageElement}
                        {categorizedSequence.displayName}
                        <div className={categorizedJukeboxListArtistClassname}>{categorizedSequence.artist}</div>
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
                  <div className="category-label">{sequence.category}</div>
                  {categorizedSequencesArray}
                </div>
              </>
            );
          }
        }
      }
    });

    const jukeboxRequestsElement = [];
    _.map(show?.jukeboxRequests, (request) => {
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
      show?.preferences?.viewerControlEnabled,
      show?.preferences?.viewerControlMode,
      show?.preferences?.enableLocationCode,
      sequencesElement,
      jukeboxRequestsElement,
      show?.whatsPlaying,
      show?.nextSequence,
      show?.queueDepth,
      locationCodeElement
    );

    const reactHtml = htmlToReactParser.parseWithInstructions(parsedViewerPage, isValidNode, instructions);
    setRemoteViewerReactPage(reactHtml);
  }, [
    addSequenceToQueue,
    show?.jukeboxRequests,
    show?.nextSequence,
    show?.queueDepth,
    show?.preferences?.enableLocationCode,
    show?.preferences?.jukeboxDepth,
    show?.preferences?.makeItSnow,
    show?.preferences?.viewerControlEnabled,
    show?.preferences?.viewerControlMode,
    show?.sequences,
    show?.whatsPlaying,
    activeViewerPage,
    voteForSequence
  ]);

  const getActiveViewerPage = (showData) => {
    _.forEach(showData?.pages, (page) => {
      if (page?.active) {
        setActiveViewerPage(page?.html);
      }
    });
  };

  const getShow = useCallback(() => {
    getShowQuery({
      onCompleted: (data) => {
        const showData = { ...data?.getShow };
        setShow(showData);
        getActiveViewerPage(showData);
        insertViewerPageStatsService(insertViewerPageStatsMutation, () => {});
        setLoading(false);
      },
      onError: () => {
        showAlert(dispatch, { alert: 'error' });
      }
    });
  }, [dispatch, getShowQuery, insertViewerPageStatsMutation]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await signViewerJwt();
      // await fetchExternalViewerPage();

      getShow();

      // insertViewerPageStats();
    };

    init();
  }, [signViewerJwt, getShow]);

  useInterval(async () => {
    getShow();
    // getExternalViewerPageDetails();
    // updateActiveViewerService();
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
        <title>{show?.preferences?.viewerPageTitle}</title>
        <link rel="icon" href={show?.viewerPageMeta?.viewerPageIconLink} />
        {makeItSnowScript}
      </Helmet>
      <Loading loading={loading} background="black" loaderColor="white" />
      {remoteViewerReactPage}
    </>
  );
};

export default ExternalViewerPage;
