/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { TextField } from '@mui/material';
import htmlToReact from 'html-to-react';
import sign from 'jwt-encode';
import _ from 'lodash';
import moment from 'moment';
import Loading from 'react-fullscreen-loading';
import { Helmet } from 'react-helmet';

import useInterval from 'hooks/useInterval';
import { useDispatch } from 'store';
import { getSubdomain } from 'utils/route-guard/helpers/helpers';

import { setSession } from '../../../contexts/JWTContext';
import { addSequenceToQueueService, voteForSequenceService } from '../../../services/viewer/mutations.service';
import { LocationCheckMethod, ViewerControlMode } from '../../../utils/enum';
import {
  ADD_SEQUENCE_TO_QUEUE,
  INSERT_VIEWER_PAGE_STATS,
  UPDATE_ACTIVE_VIEWERS,
  VOTE_FOR_SEQUENCE
} from '../../../utils/graphql/viewer/mutations';
import { GET_SHOW } from '../../../utils/graphql/viewer/queries';
import { showAlert } from '../globalPageHelpers';
import { defaultProcessingInstructions, processingInstructions, viewerPageMessageElements } from './helpers/helpers';

const ExternalViewerPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
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
  const [updateActiveViewersMutation] = useMutation(UPDATE_ACTIVE_VIEWERS);
  const [addSequenceToQueueMutation] = useMutation(ADD_SEQUENCE_TO_QUEUE);
  const [voteForSequenceMutation] = useMutation(VOTE_FOR_SEQUENCE);

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

  const showViewerMessage = useCallback(
    (response) => {
      if (response?.success) {
        viewerPageMessageElements.requestSuccessful.current = viewerPageMessageElements?.requestSuccessful?.block;
      } else if (response?.error?.message === 'SEQUENCE_REQUESTED') {
        viewerPageMessageElements.requestPlaying.current = viewerPageMessageElements?.requestPlaying?.block;
      } else if (response?.error?.message === 'INVALID_LOCATION') {
        viewerPageMessageElements.invalidLocation.current = viewerPageMessageElements?.invalidLocation?.block;
      } else if (response?.error?.message === 'QUEUE_FULL') {
        viewerPageMessageElements.queueFull.current = viewerPageMessageElements?.queueFull?.block;
      } else if (response?.error?.message === 'INVALID_CODE') {
        viewerPageMessageElements.invalidLocationCode.current = viewerPageMessageElements?.invalidLocationCode?.block;
      } else if (response?.error?.message === 'ALREADY_VOTED') {
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
      if (show?.preferences?.locationCheckMethod === LocationCheckMethod.CODE) {
        if (parseInt(enteredLocationCode, 10) !== parseInt(show?.preferences?.locationCode, 10)) {
          const invalidCodeResponse = {
            error: {
              message: 'INVALID_CODE'
            }
          };
          showViewerMessage(invalidCodeResponse);
          setEnteredLocationCode(null);
          return;
        }
      }
      addSequenceToQueueService(addSequenceToQueueMutation, sequenceName, viewerLatitude || 0.0, viewerLongitude || 0.0, (response) => {
        showViewerMessage(response);
      });
    },
    [
      show?.preferences?.enableGeolocation,
      show?.preferences?.locationCheckMethod,
      show?.preferences?.locationCode,
      addSequenceToQueueMutation,
      viewerLatitude,
      viewerLongitude,
      setViewerLocation,
      enteredLocationCode,
      showViewerMessage
    ]
  );

  const voteForSequence = useCallback(
    async (e) => {
      const sequenceName = e.target.attributes.getNamedItem('data-key') ? e.target.attributes.getNamedItem('data-key').value : '';
      if (show?.preferences?.enableGeolocation) {
        await setViewerLocation();
      }
      if (show?.preferences?.locationCheckMethod === LocationCheckMethod.CODE) {
        if (parseInt(enteredLocationCode, 10) !== parseInt(show?.preferences?.locationCode, 10)) {
          const invalidCodeResponse = {
            error: {
              message: 'INVALID_CODE'
            }
          };
          showViewerMessage(invalidCodeResponse);
          setEnteredLocationCode(null);
          return;
        }
      }
      voteForSequenceService(voteForSequenceMutation, sequenceName, viewerLatitude || 0.0, viewerLongitude || 0.0, (response) => {
        showViewerMessage(response);
      });
    },
    [
      show?.preferences?.enableGeolocation,
      show?.preferences?.locationCheckMethod,
      show?.preferences?.locationCode,
      voteForSequenceMutation,
      viewerLatitude,
      viewerLongitude,
      setViewerLocation,
      enteredLocationCode,
      showViewerMessage
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
          let sequenceVotes = 0;
          _.forEach(show?.votes, (vote) => {
            if (vote?.sequence?.name === sequence?.name) {
              sequenceVotes = vote?.votes;
            }
          });
          // const sequenceVotes = _.find(show?.votes, (vote) => vote?.sequence?.name === sequence?.name);
          // console.log(sequenceVotes);
          if (sequenceVotes !== -1) {
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
                  <div className="cell-vote">{sequenceVotes}</div>
                </>
              );
            } else if (!_.includes(categoriesPlaced, sequence.category)) {
              categoriesPlaced.push(sequence.category);
              const categorizedSequencesArray = [];
              const categorizedSequencesToIterate = _.cloneDeep(show?.sequences);
              _.map(categorizedSequencesToIterate, (categorizedSequence) => {
                let categorizedSequenceVotes = 0;
                _.forEach(show?.votes, (vote) => {
                  if (vote?.sequence?.name === categorizedSequence?.name) {
                    categorizedSequenceVotes = vote?.votes;
                  }
                });
                // const categorizedSequenceVotes = _.find(show?.votes, (vote) => vote?.sequence?.name === categorizedSequence?.name);
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
                        <div className="cell-vote">{categorizedSequenceVotes}</div>
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
    _.map(show?.requests, (request, index) => {
      // Don't add Playing Now to list
      if (index !== 0) {
        jukeboxRequestsElement.push(
          <>
            <div className="jukebox-queue">{request?.sequence?.displayName}</div>
          </>
        );
      }
    });

    const locationCodeElement = (
      <>
        <TextField type="number" name="locationCode" onChange={(e) => setEnteredLocationCode(e?.target?.value)} />
      </>
    );

    instructions = processingInstructions(
      processNodeDefinitions,
      show?.preferences?.viewerControlEnabled,
      show?.preferences?.viewerControlMode,
      show?.preferences?.locationCheckMethod,
      sequencesElement,
      jukeboxRequestsElement,
      show?.playingNow,
      show?.playingNext,
      show?.requests?.length,
      locationCodeElement
    );

    const reactHtml = htmlToReactParser.parseWithInstructions(parsedViewerPage, isValidNode, instructions);
    setRemoteViewerReactPage(reactHtml);
  }, [
    activeViewerPage,
    addSequenceToQueue,
    show?.requests,
    show?.playingNext,
    show?.playingNow,
    show?.preferences?.locationCheckMethod,
    show?.preferences?.jukeboxDepth,
    show?.preferences?.makeItSnow,
    show?.preferences?.viewerControlEnabled,
    show?.preferences?.viewerControlMode,
    show?.requests?.length,
    show?.sequences,
    voteForSequence
  ]);

  const getActiveViewerPage = (showData) => {
    _.forEach(showData?.pages, (page) => {
      if (page?.active) {
        setActiveViewerPage(page?.html);
      }
    });
  };

  const orderSequencesForVoting = (showData) => {
    let updatedSequences = [];
    _.forEach(showData?.sequences, (sequence) => {
      const sequenceVotes = _.find(showData?.votes, (vote) => vote?.sequence?.name === sequence?.name);
      updatedSequences.push({
        ...sequence,
        votes: sequenceVotes?.votes || 0,
        lastVoteTime: sequenceVotes?.lastVoteTime
      });
    });
    updatedSequences = _.orderBy(updatedSequences, ['votes', 'lastVoteTime'], ['desc', 'asc']);
    showData.sequences = updatedSequences;
  };

  const getShow = useCallback(() => {
    getShowQuery({
      onCompleted: (data) => {
        const showData = { ...data?.getShow };
        orderSequencesForVoting(showData);
        setShow(showData);
        getActiveViewerPage(showData);
        if (showData?.preferences?.locationCheckMethod === LocationCheckMethod.GEO) {
          setViewerLocation();
        }
        setLoading(false);
      },
      onError: () => {
        showAlert(dispatch, { alert: 'error' });
      }
    }).then();
  }, [dispatch, getShowQuery, setViewerLocation]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await signViewerJwt();
      // await fetchExternalViewerPage();

      getShow();
      insertViewerPageStatsMutation({
        variables: {
          date: moment().format('YYYY-MM-DDTHH:mm:ss')
        }
      }).then();
      updateActiveViewersMutation().then();
    };

    init().then();
  }, [signViewerJwt, getShow, insertViewerPageStatsMutation, updateActiveViewersMutation]);

  useInterval(() => {
    getShow();
    updateActiveViewersMutation().then();
  }, 5000);

  useInterval(async () => {
    await convertViewerPageToReact();
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
        <title>{show?.preferences?.pageTitle}</title>
        <link rel="icon" href={show?.preferences?.pageIconUrl} />
        {makeItSnowScript}
      </Helmet>
      <Loading loading={loading} background="black" loaderColor="white" />
      {remoteViewerReactPage}
    </>
  );
};

export default ExternalViewerPage;
