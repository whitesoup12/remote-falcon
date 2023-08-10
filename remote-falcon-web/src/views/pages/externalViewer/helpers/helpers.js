// eslint-disable-next-line import/prefer-default-export
const locationCodeNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{LOCATION_CODE}';
  },
  processNode() {
    return value;
  }
});

const sequencesNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{PLAYLISTS}';
  },
  processNode() {
    return value;
  }
});

const votesNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{VOTES}';
  },
  processNode() {
    return value;
  }
});

const nowPlayingNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{NOW_PLAYING}';
  },
  processNode() {
    return value;
  }
});

const nextSequenceNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{NEXT_PLAYLIST}';
  },
  processNode() {
    return value;
  }
});

const queueSizeNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{QUEUE_SIZE}';
  },
  processNode() {
    return value;
  }
});

const jukeboxQueueNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node && node.children && node.children[0] && node.children[0].data && node.children[0].data.trim() === '{JUKEBOX_QUEUE}';
  },
  processNode() {
    return value;
  }
});

const afterHoursNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node.attribs && node.attribs['{after-hours-message}'] === '';
  },
  processNode() {
    return value;
  }
});

const votingDynamicContainerNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node.attribs && node.attribs['{on-demand-and-voting-dynamic-container}'] === '';
  },
  processNode() {
    return value;
  }
});

const jukeboxDynamicContainerNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node.attribs && node.attribs['{jukebox-dynamic-container}'] === '';
  },
  processNode() {
    return value;
  }
});

const votingPlaylistsDynamicContainerNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node.attribs && node.attribs['{playlist-voting-dynamic-container}'] === '';
  },
  processNode() {
    return value;
  }
});

const jukeboxPlaylistsDynamicContainerNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node.attribs && node.attribs['{playlist-standard-dynamic-container}'] === '';
  },
  processNode() {
    return value;
  }
});

const locationCodeDynamicContainerNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode(node) {
    return node.attribs && node.attribs['{location-code-dynamic-container}'] === '';
  },
  processNode() {
    return value;
  }
});

const allNodes = (processNodeDefinitions) => ({
  shouldProcessNode() {
    return true;
  },
  processNode: processNodeDefinitions.processDefaultNode
});

const blankNode = (value) => ({
  replaceChildren: true,
  shouldProcessNode() {
    return '';
  },
  processNode() {
    return value;
  }
});

export const defaultProcessingInstructions = (processNodeDefinitions) => [allNodes(processNodeDefinitions)];

export const processingInstructions = (
  processNodeDefinitions,
  viewerControlEnabled,
  viewerControlMode,
  enableLocationCode,
  sequences,
  jukeboxRequests,
  nowPlaying,
  nextSequence,
  queueDepth,
  locationCode
) => {
  let processedNodes = [];
  if (!viewerControlEnabled) {
    processedNodes = [
      locationCodeNode(<></>),
      sequencesNode(<></>),
      votesNode(<></>),
      nowPlayingNode(<></>),
      nextSequenceNode(<></>),
      queueSizeNode(<></>),
      jukeboxQueueNode(<></>),
      votingDynamicContainerNode(<></>),
      jukeboxDynamicContainerNode(<></>),
      votingPlaylistsDynamicContainerNode(<></>),
      jukeboxPlaylistsDynamicContainerNode(<></>),
      locationCodeDynamicContainerNode(<></>),
      allNodes(processNodeDefinitions)
    ];
  } else if (viewerControlMode === 'jukebox') {
    processedNodes = [
      locationCodeNode(<>{locationCode}</>),
      sequencesNode(<>{sequences}</>),
      nowPlayingNode(<>{nowPlaying}</>),
      nextSequenceNode(<>{nextSequence}</>),
      queueSizeNode(<>{queueDepth}</>),
      jukeboxQueueNode(<>{jukeboxRequests}</>),
      votingDynamicContainerNode(<></>),
      votingPlaylistsDynamicContainerNode(<></>),
      enableLocationCode ? blankNode(null) : locationCodeDynamicContainerNode(<></>),
      afterHoursNode(<></>),
      allNodes(processNodeDefinitions)
    ];
  } else {
    processedNodes = [
      locationCodeNode(<>{locationCode}</>),
      sequencesNode(<>{sequences}</>),
      votesNode(<></>),
      nowPlayingNode(<>{nowPlaying}</>),
      nextSequenceNode(<>{nextSequence}</>),
      queueSizeNode(<></>),
      jukeboxQueueNode(<></>),
      jukeboxDynamicContainerNode(<></>),
      jukeboxPlaylistsDynamicContainerNode(<></>),
      enableLocationCode ? blankNode(null) : locationCodeDynamicContainerNode(<></>),
      afterHoursNode(<></>),
      allNodes(processNodeDefinitions)
    ];
  }
  return processedNodes;
};

export const viewerPageMessageElements = {
  requestSuccessful: {
    element: /id="requestSuccessful"/g,
    current: 'id="requestSuccessful" style="display: none"',
    block: 'id="requestSuccessful" style="display: block"',
    none: 'id="requestSuccessful" style="display: none"'
  },
  requestPlaying: {
    element: /id="requestPlaying"/g,
    current: 'id="requestPlaying" style="display: none"',
    block: 'id="requestPlaying" style="display: block"',
    none: 'id="requestPlaying" style="display: none"'
  },
  queueFull: {
    element: /id="queueFull"/g,
    current: 'id="queueFull" style="display: none"',
    block: 'id="queueFull" style="display: block"',
    none: 'id="queueFull" style="display: none"'
  },
  invalidLocation: {
    element: /id="invalidLocation"/g,
    current: 'id="invalidLocation" style="display: none"',
    block: 'id="invalidLocation" style="display: block"',
    none: 'id="invalidLocation" style="display: none"'
  },
  alreadyVoted: {
    element: /id="alreadyVoted"/g,
    current: 'id="alreadyVoted" style="display: none"',
    block: 'id="alreadyVoted" style="display: block"',
    none: 'id="alreadyVoted" style="display: none"'
  },
  requestFailed: {
    element: /id="requestFailed"/g,
    current: 'id="requestFailed" style="display: none"',
    block: 'id="requestFailed" style="display: block"',
    none: 'id="requestFailed" style="display: none"'
  },
  invalidLocationCode: {
    element: /id="invalidLocationCode"/g,
    current: 'id="invalidLocationCode" style="display: none"',
    block: 'id="invalidLocationCode" style="display: block"',
    none: 'id="invalidLocationCode" style="display: none"'
  }
};
