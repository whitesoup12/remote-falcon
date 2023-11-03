-- DATABASE
DROP DATABASE IF EXISTS remotefalcon;
CREATE DATABASE remotefalcon;
USE remotefalcon;

-- TABLES
CREATE TABLE `ACTIVE_VIEWER` (
  `activeViewerKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  `viewerIp` varchar(50) DEFAULT NULL,
  `lastUpdateDateTime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`activeViewerKey`),
  KEY `activeViewerKey_viewerIp_remoteToken` (`activeViewerKey`,`remoteToken`,`viewerIp`),
  KEY `activeViewer_activeViewerKey_remoteToken` (`remoteToken`,`activeViewerKey`)
);

CREATE TABLE `CURRENT_PLAYLIST` (
  `remoteToken` varchar(500) NOT NULL,
  `currentPlaylist` varchar(500) NOT NULL,
  `currentPlaylistKey` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`currentPlaylistKey`)
);

CREATE TABLE `DEFAULT_VIEWER_PAGE` (
  `defaultViewerPageKey` int NOT NULL AUTO_INCREMENT,
  `version` decimal(11,8) NOT NULL DEFAULT '0.00000000',
  `versionCreateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `htmlContent` mediumtext NOT NULL,
  `isVersionActive` varchar(1) NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`defaultViewerPageKey`)
);

CREATE TABLE `EASTER_EGG` (
  `easterEggKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  PRIMARY KEY (`easterEggKey`)
);
;
CREATE TABLE `EXTERNAL_API_ACCESS` (
  `externalApiAccessKey` int NOT NULL AUTO_INCREMENT,
  `accessToken` varchar(250) NOT NULL,
  `accessSecret` varchar(250) NOT NULL,
  `remoteToken` varchar(250) NOT NULL,
  `isActive` varchar(1) NOT NULL DEFAULT 'Y',
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`externalApiAccessKey`),
  UNIQUE KEY `access_secret_remote_unique` (`accessToken`,`accessSecret`,`remoteToken`)
);

CREATE TABLE `FPP_SCHEDULE` (
  `fppScheduleKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  `nextScheduledSequence` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`fppScheduleKey`),
  UNIQUE KEY `fppScheduleKey_remoteToken_nextScheduledSequence` (`fppScheduleKey`,`remoteToken`,`nextScheduledSequence`(255)),
  KEY `fppSchedule_fppScheduleKey_remoteToken` (`remoteToken`,`fppScheduleKey`)
);

CREATE TABLE `FPP_STATS` (
  `fppStatsKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `fppdStatus` varchar(50) DEFAULT NULL,
  `fppStatus` varchar(50) DEFAULT NULL,
  `cpuTemp` varchar(50) DEFAULT NULL,
  `volume` int DEFAULT NULL,
  `currentPlayingSequence` varchar(500) DEFAULT NULL,
  `currentPlayingPlaylist` varchar(500) DEFAULT NULL,
  `scheduledPlaylist` varchar(500) DEFAULT NULL,
  `scheduledStartTime` varchar(50) DEFAULT NULL,
  `scheduledEndTime` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`fppStatsKey`)
);

CREATE TABLE `NOTIFICATIONS` (
  `notificationKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  `notificationTitle` varchar(250) NOT NULL,
  `notificationPreview` varchar(250) NOT NULL,
  `notificationText` varchar(1000) NOT NULL,
  `notificationRead` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`notificationKey`)
);

CREATE TABLE `PAGE_GALLERY_HEARTS` (
  `pageGalleryHeartsKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  `viewerPage` varchar(250) NOT NULL,
  `viewerPageHearted` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`pageGalleryHeartsKey`)
);

CREATE TABLE `PASSWORD_RESETS` (
  `passwordResetToken` int NOT NULL AUTO_INCREMENT,
  `email` varchar(250) NOT NULL,
  `remoteToken` varchar(500) NOT NULL,
  `passwordResetLink` varchar(500) NOT NULL,
  `passwordResetExpiry` datetime NOT NULL,
  PRIMARY KEY (`passwordResetToken`)
);

CREATE TABLE `PLAYLISTS` (
  `playlistKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(500) NOT NULL,
  `playlistName` varchar(500) NOT NULL,
  `playlistPrettyName` varchar(500) NOT NULL,
  `playlistDuration` int DEFAULT NULL,
  `playlistVisible` varchar(1) NOT NULL,
  `playlistVotes` int DEFAULT '0',
  `playlistVoteTime` datetime DEFAULT '1999-01-01 00:00:00',
  `playlistVotesTotal` int DEFAULT '0',
  `playlistIndex` int NOT NULL DEFAULT '-1',
  `playlistOrder` int NOT NULL DEFAULT '-1',
  `playlistImageUrl` varchar(1000) DEFAULT NULL,
  `isPlaylistActive` varchar(1) NOT NULL DEFAULT 'Y',
  `ownerVoted` varchar(1) NOT NULL DEFAULT 'N',
  `sequenceVisibleCount` int NOT NULL DEFAULT '0',
  `playlistType` varchar(100) NOT NULL DEFAULT 'SEQUENCE',
  `playlistGroupName` varchar(500) DEFAULT NULL,
  `playlistCategoryName` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`playlistKey`)
);

CREATE TABLE `PLAYLIST_GROUPS` (
  `playlistGroupKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(500) NOT NULL,
  `playlistGroupName` varchar(500) NOT NULL,
  `playlistGroupVotes` int DEFAULT '0',
  `playlistGroupVoteTime` datetime DEFAULT '1999-01-01 00:00:00',
  `playlistGroupVotesTotal` int DEFAULT '0',
  `playlistsInGroup` int DEFAULT '0',
  `sequenceGroupVisibleCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`playlistGroupKey`)
);

CREATE TABLE `PSA_SEQUENCES` (
  `psaSequenceKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(500) NOT NULL,
  `psaSequenceName` varchar(500) NOT NULL,
  `psaSequenceOrder` int DEFAULT '0',
  `psaSequenceLastPlayed` datetime DEFAULT '1999-01-01 00:00:00',
  PRIMARY KEY (`psaSequenceKey`)
);

CREATE TABLE `REMOTES` (
  `remoteToken` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `remoteName` varchar(250) NOT NULL,
  `remoteSubdomain` varchar(250) NOT NULL,
  `emailVerified` varchar(1) NOT NULL,
  `createdDate` datetime NOT NULL,
  `lastLoginDate` datetime DEFAULT NULL,
  `expireDate` datetime NOT NULL,
  `pluginVersion` varchar(100) DEFAULT NULL,
  `activeTheme` varchar(20) DEFAULT 'dark',
  `fppVersion` varchar(100) DEFAULT '0',
  `remoteKey` int NOT NULL AUTO_INCREMENT,
  `lastLoginIp` varchar(100) DEFAULT NULL,
  `htmlContent` mediumtext,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `facebookUrl` varchar(500) DEFAULT NULL,
  `youtubeUrl` varchar(500) DEFAULT NULL,
  `userRole` varchar(25) NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`remoteKey`),
  UNIQUE KEY `remotes_remoteSubdomain_idx` (`remoteSubdomain`),
  UNIQUE KEY `remotes_remoteToken_idx` (`remoteToken`),
  KEY `remotes_remoteToken_reomteSubdomain` (`remoteToken`,`remoteSubdomain`)
);

CREATE TABLE `REMOTE_JUKE` (
  `remoteJukeKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `nextPlaylist` varchar(250) DEFAULT NULL,
  `futurePlaylist` varchar(250) DEFAULT NULL,
  `futurePlaylistSequence` int DEFAULT NULL,
  `ownerRequested` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`remoteJukeKey`),
  KEY `remoteJuke_remoteToken` (`remoteToken`)
);

CREATE TABLE `REMOTE_ONDEMAND` (
  `remoteOnDemandKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(500) NOT NULL,
  `playlist` varchar(500) NOT NULL,
  PRIMARY KEY (`remoteOnDemandKey`)
);

CREATE TABLE `REMOTE_PREFS` (
  `remotePrefToken` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(500) NOT NULL,
  `viewerModeEnabled` varchar(1) NOT NULL DEFAULT 'N',
  `viewerControlEnabled` varchar(1) NOT NULL DEFAULT 'N',
  `viewerControlMode` varchar(250) DEFAULT NULL,
  `resetVotes` varchar(1) DEFAULT NULL,
  `jukeboxDepth` int DEFAULT '0',
  `enableGeolocation` varchar(1) DEFAULT 'N',
  `remoteLatitude` decimal(11,8) DEFAULT '0.00000000',
  `remoteLongitude` decimal(11,8) DEFAULT '0.00000000',
  `allowedRadius` decimal(2,1) DEFAULT '0.5',
  `messageDisplayTime` int DEFAULT '3',
  `checkIfVoted` varchar(1) DEFAULT 'N',
  `interruptSchedule` varchar(1) NOT NULL DEFAULT 'Y',
  `psaEnabled` varchar(1) DEFAULT 'N',
  `psaSequence` varchar(500) DEFAULT NULL,
  `psaFrequency` int DEFAULT '0',
  `jukeboxRequestLimit` int NOT NULL DEFAULT '3',
  `viewerPagePublic` varchar(1) DEFAULT 'N',
  `enableLocationCode` varchar(1) NOT NULL DEFAULT 'N',
  `locationCode` varchar(100) DEFAULT NULL,
  `apiAccessRequested` varchar(1) NOT NULL DEFAULT 'N',
  `autoSwitchControlModeSize` int NOT NULL DEFAULT '0',
  `autoSwitchControlModeToggled` varchar(1) NOT NULL DEFAULT 'N',
  `hideSequenceCount` int NOT NULL DEFAULT '0',
  `jukeboxHistoryLimit` int NOT NULL DEFAULT '3',
  `makeItSnow` varchar(1) NOT NULL DEFAULT 'N',
  `managePsa` varchar(1) DEFAULT 'N',
  `sequencesPlayed` int DEFAULT 0,
  PRIMARY KEY (`remotePrefToken`),
  KEY `all_remote_prefs` (`viewerModeEnabled`,`viewerControlEnabled`,`viewerControlMode`,`enableGeolocation`,`messageDisplayTime`,`jukeboxDepth`,`enableLocationCode`,`locationCode`)
);

CREATE TABLE `REMOTE_VIEWER_PAGES` (
  `remoteViewerPageKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(30) NOT NULL,
  `viewerPageName` varchar(100) NOT NULL,
  `viewerPageActive` varchar(1) NOT NULL DEFAULT 'Y',
  `viewerPageHtml` mediumtext NOT NULL,
  PRIMARY KEY (`remoteViewerPageKey`)
);

CREATE TABLE `REMOTE_VIEWER_PAGE_TEMPLATES` (
  `remoteViewerPageTemplateKey` int NOT NULL AUTO_INCREMENT,
  `viewerPageTemplateName` varchar(100) NOT NULL,
  `viewerPageTemplateHtml` mediumtext NOT NULL,
  `isActive` varchar(1) NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`remoteViewerPageTemplateKey`)
);

CREATE TABLE `REMOTE_VIEWER_VOTES` (
  `remoteViewerVoteKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `viewerIp` varchar(250) NOT NULL,
  PRIMARY KEY (`remoteViewerVoteKey`)
);

CREATE TABLE `SWAGGER_ACCESS` (
  `swaggerAccessKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(500) NOT NULL,
  PRIMARY KEY (`swaggerAccessKey`)
);

CREATE TABLE `USER_ROLES` (
  `userRoleKey` int unsigned NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  `userRole` varchar(100) NOT NULL,
  `userRoleActive` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`userRoleKey`)
);

CREATE TABLE `VIEWER_JUKE_STATS` (
  `viewerJukeStatKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `playlistName` varchar(500) DEFAULT NULL,
  `requestDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`viewerJukeStatKey`),
  KEY `viewer_juke_stats_remoteToken_playlistName` (`remoteToken`,`playlistName`(255))
);

CREATE TABLE `VIEWER_PAGE_META` (
  `viewerPageMetaKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(100) NOT NULL,
  `viewerPageTitle` varchar(500) DEFAULT NULL,
  `viewerPageIconLink` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`viewerPageMetaKey`)
);

CREATE TABLE `VIEWER_PAGE_STATS` (
  `viewerPageStatKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `pageVisitIp` varchar(50) DEFAULT NULL,
  `pageVisitDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`viewerPageStatKey`),
  KEY `viewer_page_stats_pageVisitDateTime_pageVisitIp_idx` (`pageVisitDateTime`,`pageVisitIp`)
);

CREATE TABLE `VIEWER_VOTE_STATS` (
  `viewerVoteStatKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `playlistName` varchar(500) DEFAULT NULL,
  `voteDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`viewerVoteStatKey`),
  KEY `viewer_vote_stats_remoteToken_playlistName` (`remoteToken`,`playlistName`(255))
);

CREATE TABLE `VIEWER_VOTE_WIN_STATS` (
  `viewerVoteWinStatKey` int NOT NULL AUTO_INCREMENT,
  `remoteToken` varchar(250) NOT NULL,
  `playlistName` varchar(500) DEFAULT NULL,
  `voteWinDateTime` datetime DEFAULT NULL,
  `totalVotes` int DEFAULT NULL,
  PRIMARY KEY (`viewerVoteWinStatKey`),
  KEY `viewer_vote_win_stats_remoteToken_playlistName` (`remoteToken`,`playlistName`(255))
);

-- DATA
INSERT INTO DEFAULT_VIEWER_PAGE
(version, versionCreateDate, htmlContent, isVersionActive)
VALUES(1.00000000, '2022-05-23 14:57:06', '<!--
   This HTML template has been provided by Rick Harris and contains everything you should need 
   to get started!
   
   Since this will be embedded in the page, there is no need to add any html or body tags. 
   Simply add and/or modify elements you want and they will be added.
   
   The following are the variables used to populate your lists so DON''T MODIFY THESE!!:
   {PLAYLISTS} - Displays the list of your sequences for the viewer to request.
   {NOW_PLAYING} - Displays the currently playing sequence.
   {NEXT_PLAYLIST} - Displays the next sequence in the queue.
   {QUEUE_SIZE} - Displays the current number of songs in the queue when using Jukebox mode.
   {QUEUE_DEPTH} - Displays the size that you have configured for your queue. This can be used in error messages or your instructions if you want.
   {LOCATION_CODE} - Displays the input field used to capture the location code.
   {JUKEBOX_QUEUE} - Displays the list of sequences currently in the jukebox queue.
   
   Feel free to modify this HTML page as much as you need. All I ask is that you follow this one simple rule...
   Do NOT add ANY scripts or ANY reference to scripts. NONE! ZILCH! NADA!
   Other than that, get creative with it!

   This page is designed to make modifying the looks of your page somewhat straight forward. 
   The <style> section is where you will changes the properties to change the appearance of your page.
   You can move the sections as you need
-->

<!--
    The section between the <style type="text/css"> and </style> is used to customize your viewer page.
    Do not delete any items in this section unless you know what they are doing.
    This section is where you can custom design your webpage the way you want it by changing the values for the particular section. 
-->

<style type="text/css">

    /***************
        Base Config-- This section defines the base configuration for your page, the font and font color
    *******************/

    * {
        box-sizing: border-box;
        font-family: Ubuntu, Helvetica, Arial, sans-serif;
        color: red;
        text-align: center;
    }

    /*******************************
        The body section is for configuring the overall looks of the page such as the background color
        and background image. If you want to use a background image
        delete the comments and it is recommended to set a size to ensure if fits how you intend it.
        If you want the image to tile to fill the whole page then set the background-repeat to repeat.
    *******************************/

    body {
        /** 
        background-image: url(yourBackgroundImage.html);
        background-repeat: repeat;
        background-size: 300px 100px;
        **/
        background-color: #000000; /** sets the overall background color **/
    }

    /*******************************
        The div section is for configuring looks of the div sections
    *******************************/

    div {
        font-size: 11px;
        line-height: 1.5;
        text-align: center;
        /** only needed if you want a different text color
        color: #000000; 
        **/
    }

    /*******************************
        The #header_Img_Content section is for configuring looks for that section
    *******************************/

    #header_Img_Content {
        /** only needed if you want a different background color for that section
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        text-align: center;
    }


    /***************
        the body text is the generic style for your normal text areas
    *****************/

    .body_text {
        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #7e8c8d;
        text-align: center;
        font-size: 18px;
    }

    /*************
        The body_text will provide the format for all the text areas, but if you need more control
        of that specific section, then you can configure it in this section
    ****************/

    /*********************
        #instructional-text{
            background-color: #000000;
            margin: auto;
            width: 90%;
            color: #7e8c8d;
            text-align: center;
            font-size: 18px;
        }
    **********************/

    /*****************
        This will format the footer
    **************************/

    #footer {
        background-color: #D0021B;
        margin: auto;
        width: 90%;
        color: #ffffff;;
        text-align: center;
        font-size: 18px;
    }


    /*******************************
        The #intro section is for configuring looks for that section
    *******************************/

    #intro {

        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        text-align: center;
        font-size: 30px;
    }

    /*******************************
        The hr.separator is used to configure the separator bar
    *******************************/

    hr.separator {
        border-radius: 5px;
        margin-top: 10px;
        margin-right: auto;
        margin-left: auto;
        width: 90%;
        height: 8px;
        border: 0;
        background-color: #009C00;
        padding: 0px;
    }

    /*******************************
        The location_code_text is used to configure the section where the
        location code text lives
    *******************************/

    #location_code_text {
        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #7e8c8d;
        text-align: center;
        font-size: 18px;
        margin-top: 10px;
    }

    /*******************************
        The location_code_container is used to configure the section where the
        location code lives
    *******************************/

    #location_code_container {
        margin: auto;
        width: 25%;
        color: #D0021B;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    /*******************************
        The playlists-container is used to configure the section where the
        list of your songs is shown
    *******************************/

    #playlists_container {
        /** only needed if you want a different background color for this section
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #D0021B;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    /*******************************
        The rf-titles is used to configure the title above the RF imported data
    *******************************/

    .rf-titles {
        /** only needed if you want a different background color for for this section
        background-color: #000000;
        **/
        border-bottom: 5px solid red;
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
        color: #d60000;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
    }

    /*******************************
        The playing-now class is used to configure the text that shows what is currently playing
    *******************************/

    .playing-now {
        /*text-align: left; */
        margin-top: 10px;
        color: white;
        font-size: 20px;
    }

    /*******************************
        The rtable is used to configure table where the rf lists will show
        You shouldn''t modify this
    *******************************/

    .rtable {
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        text-align: center;
        width: 90%;
        padding: 0;
    }

    /*******************************
        The cell-vote-playlist is used to configure the table where the rf lists will show when you are using the voting mode
        You shouldn''t modify this with the exception of the font-size, border and cursor properties
    *******************************/

    .cell-vote-playlist {
        flex-grow: 1;
        width: 85%;
        font-weight: bold;
        overflow: hidden;
        list-style: none;
        font-size: 20px;
        border: solid white;
        border-width: 2px 2px 1px 2px;
        cursor: pointer;
    }

    /*******************************
        The cell-vote is used to configure the table where the rf lists will show when you are using the voting mode
        You shouldn''t modify this with the exception of the font-size, border and cursor properties
    *******************************/

    .cell-vote {
        flex-grow: 1;
        width: 15%;
        font-weight: bold;
        overflow: hidden;
        list-style: none;
        font-size: 20px;
        border: solid white;
        border-width: 2px 2px 1px 0px;

    }

    /*******************************
        The jukebox-list is used to configure the table where the rf lists will show when you are using the jukebox mode
        You shouldn''t modify this with the exception of the font-size, border and cursor properties
    *******************************/


    .jukebox-list {
        width: 100%;
        font-size: 24px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        /**border-width: 2px 2px 1px 2px; **/
        /**cursor:grabbing ; **/

    }

    /*******************************
        The jukebox-queue is used to configure the list of current jukebox requests
    *******************************/

    .jukebox-queue {
        text-align: center;
        color: white;
        font-size: 20px;
    }

    /*******************************
        The sequence image class is to style the image that appears next to the sequence name
    *******************************/

    .sequence-image {
        height: 40px;
        width: auto;
        padding-right: 20px;
    }


    /*******************************
        The jukebox-queue container is the wrapper container for the jukebox queue list
    *******************************/

    .jukebox-queue-container {
        overflow: auto;
        height: 150px;
        width: 70%;
        margin: 0 auto;
    }

    /*******************************
        The after-hours class is used to configure a message to be displayed when
        you don''t have a scheduled playlist playing
    *******************************/

    .after-hours {
        width: 90%;
        font-size: 24px;
        border: none;
        font-weight: bold;
        margin: auto;
    }

    /*******************************
        The button is used to configure your buttons
    *******************************/

    .button {
        background-color: #D0021B;
        border: none;
        border-radius: 10px;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 24px;
        margin: 4px 2px;
        cursor: pointer;
    }

    #submit {
        background-color: #d60000;
        padding: 1em;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 6px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        text-decoration: none;
        border: none;
    }

    #submit:hover {
        border: none;
        background: #e60000;
        box-shadow: 0px 0px 1px #777;
    }

    /*******************************
        The innerRequestSuccessful is used to configure the message for successful requests
    *******************************/

    .innerRequestSuccessful {
        background-color: #009C00;
        margin: auto;
        width: 80%;
        color: #ecf0f1;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    /*******************************
        The failed_Info_Box is used to configure the message for unsuccessful requests
    *******************************/
    .failed_Info_Box {
        background-color: #FF7400;
        margin: auto;
        width: 80%;
        color: #ecf0f1;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>

<h1>Enter your show title</h1>

<!-- if you want a picture in your header, you will have to store it on a secure server or it
might not display correctly. Sample image is scaled to 10% width, so your image might need to 
be adjusted.
-->

<div id="header_Img_Content">
    <img src="https://remotefalcon.com/jukebox-v1-rf-only-cropped.png" style="max-width: 10%;height:auto;margin: auto;">
</div>


<div id="intro">
    Your intro title<br/>
    2020 Christmas Light show
</div>

<div class="body_text" id="intro-text">
    A description of your show and any other info you want to provide.<br/>
    Some more info on your show.<br/>
</div>

<hr class="separator">

<!-- This section is what shows what is currently playing Don''t delete -->

<div class="rf-titles">
    Playing Now
</div>

<div class="playing-now">
    {NOW_PLAYING}
</div>

<!-- This section will display a message if your show isn''t
playing a scheduled playlist-->

<div {after-hours-message}>
    <div class="after-hours">
        Our show hours are <br/>
        Sunday through Thursday from Sunset to 10:00 P.M.
        Friday and Saturday from sunset to 11:00 P.M.
    </div>
</div>

<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {jukebox-dynamic-container}>
    <p class="rf-titles">Next Selection</p>
    <div style="text-align: center; color: white; font-size: 20px;">
        {NEXT_PLAYLIST}
    </div>
    <p class="rf-titles"># Selected Songs</p>
    <div style="text-align: center; color: white;font-size: 20px;">
        {QUEUE_SIZE}
    </div>

    <p class="rf-titles">Current Queue</p>
    <div style="text-align: center; color: white;font-size: 20px;">
        <div class="jukebox-queue-container">
            {JUKEBOX_QUEUE}
        </div>
    </div>

</div>

<!-- This section is used for the instructions that you want if you are using the Jukebox mode. 
If you are using the voting mode, then it will not show.
Note that you can use the {QUEUE_SIZE} in your instructions, You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<div class="body_text" id="instructional-text" {jukebox-dynamic-container}>
    <H2>Pick your Favorite</H2>
    Select the song that you would like to play from the list below.
    Your selection will be added to the end of the list of the songs that are already selected. The list is limited to
    {QUEUE_DEPTH}
    songs. Songs will be played in the order that they are selected
</div>

<!-- This section is used for the instructions that you want if you are using the Voting mode. 
If you are using the jukebox mode, then it will not show.
You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<div class="body_text" id="instructional-text" {playlist-voting-dynamic-container}>
    <H2>Vote for your Favorite</H2>
    Vote for your favorite song from the list below. Your vote will be added to the
    song you chose. The song with the most votes will play
    when the current song is finished.<br/>
    You can only vote one time per round and the voting will start over once the
    song with the highest votes starts to play. <br/>
    Merry Christmas
</div>

<!--
  This is the section for the location code for the viewer to enter, if you have
  location code enabled. It appears twice here, once for jukebox and once for 
  voting. 
-->
<div {location-code-dynamic-container}>
    <div id="location_code_text">
        Enter the code below to submit a request:
    </div>
    <div id="location_code_container">
        {LOCATION_CODE}
    </div>
</div>

<hr class="separator">

<!-- The section below will only display if your show is set for Voting mode, there
is no need to delete it if you are using the Jukebox mode, and you might change your
mind on the selection method later! -->

<div {playlist-voting-dynamic-container}>
    <div class="rtable">
        <div class="cell-vote-playlist" style="border: none; cursor: text">
            Song List
        </div>
        <div class="cell-vote" style="border: none; cursor: text">
            Votes
        </div>
    </div>
    <div class="rtable">
        {PLAYLISTS}
    </div>
</div>


<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {jukebox-dynamic-container}>
    <div id="playlists_container">
        {PLAYLISTS}
    </div>
</div>
<!-- *****************************************
    The sections below are for the error messages, don''t delete them!
    ************************************* -->

<div id="requestSuccessful" style="display: none">
    <div class="innerRequestSuccessful">
        Successfully Added!
    </div>
</div>

<div id="requestFailed" style="display: none">
    <div class="failed_Info_Box">
        ERROR <br/>
        An unexpected error has occurred! Sorry for the inconvenience.
    </div>
</div>

<div id="requestPlaying" style="display: none">
    <div class="failed_Info_Box">
        SONG ALREADY REQUESTED <br/>
        The selected song has already been requested.
    </div>
</div>

<div id="queueFull" style="display: none">
    <div class="failed_Info_Box">
        QUEUE FULL<br/>
        The queue is full. The maximum number of request is {QUEUE_DEPTH}
    </div>
</div>

<div id="invalidLocation" style="display: none">
    <div class="failed_Info_Box">
        INVALID LOCATION <br/>
        You are not located where the show is or didn''t allow your location to be identified!
    </div>
</div>

<div id="alreadyVoted" style="display: none">
    <div class="failed_Info_Box">
        ALREADY VOTED <br/>
        You can only vote once per round, you will have to wait for the current song to finish before you can vote
        again.
    </div>
</div>

<div id="invalidLocationCode" style="display: none">
    <div class="failed_Info_Box">
        INVALID CODE <br/>
        The code you entered is not correct!
    </div>
</div>

<!-- end of error messages -->

<hr class="separator">

<div class="body_text" id="footer_text">
    <h3>About our show</h3>
    Enter whatever information you want like maybe details about your show or show times
</div>

<a href="https://remotefalcon.com" class="button">Visit our
    Website</a> <!-- change this to your website or delete if not needed -->

<div class="body_text" id="social_links"> <!-- modify or delete the links as needed -->
    <h3>FOLLOW US</h3>

    <a style="display: inline-block;"
       href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/facebook.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;" href="https://twitter.com/home?status=https://www.twitter.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/twitter.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;"
       href="https://www.linkedin.com/shareArticle?mini=true&amp;url=[[SHORT_PERMALINK]]&amp;title=&amp;summary=&amp;source="
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/linkedin.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;" href="[[SHORT_PERMALINK]]" target="_blank"> <img
            style="border-radius: 3px; display: block;"
            src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/instagram.png"
            alt="" width="35" height="35"/> </a>
</div>
<div id="footer">
    Hosted by RemoteFalcon 2020
</div>
', 'Y');

INSERT INTO REMOTE_VIEWER_PAGE_TEMPLATES
(viewerPageTemplateName, viewerPageTemplateHtml, isActive)
VALUES('The OG by Rick Harris', '<!--
   This HTML template has been provided by Rick Harris and contains everything you should need 
   to get started!
   
   Since this will be embedded in the page, there is no need to add any html or body tags. 
   Simply add and/or modify elements you want and they will be added.
   
   The following are the variables used to populate your lists so DON''T MODIFY THESE!!:
   {PLAYLISTS} - Displays the list of your sequences for the viewer to request.
   {NOW_PLAYING} - Displays the currently playing sequence.
   {NEXT_PLAYLIST} - Displays the next sequence in the queue.
   {QUEUE_SIZE} - Displays the current number of songs in the queue when using Jukebox mode.
   {QUEUE_DEPTH} - Displays the size that you have configured for your queue. This can be used in error messages or your instructions if you want.
   {LOCATION_CODE} - Displays the input field used to capture the location code.
   {JUKEBOX_QUEUE} - Displays the list of sequences currently in the jukebox queue.
   
   Feel free to modify this HTML page as much as you need. All I ask is that you follow this one simple rule...
   Do NOT add ANY scripts or ANY reference to scripts. NONE! ZILCH! NADA!
   Other than that, get creative with it!

   This page is designed to make modifying the looks of your page somewhat straight forward. 
   The <style> section is where you will changes the properties to change the appearance of your page.
   You can move the sections as you need
-->

<!--
    The section between the <style type="text/css"> and </style> is used to customize your viewer page.
    Do not delete any items in this section unless you know what they are doing.
    This section is where you can custom design your webpage the way you want it by changing the values for the particular section. 
-->

<style type="text/css">

    /***************
        Base Config-- This section defines the base configuration for your page, the font and font color
    *******************/

    * {
        box-sizing: border-box;
        font-family: Ubuntu, Helvetica, Arial, sans-serif;
        color: red;
        text-align: center;
    }

    /*******************************
        The body section is for configuring the overall looks of the page such as the background color
        and background image. If you want to use a background image
        delete the comments and it is recommended to set a size to ensure if fits how you intend it.
        If you want the image to tile to fill the whole page then set the background-repeat to repeat.
    *******************************/

    body {
        /** 
        background-image: url(yourBackgroundImage.html);
        background-repeat: repeat;
        background-size: 300px 100px;
        **/
        background-color: #000000; /** sets the overall background color **/
    }

    /*******************************
        The div section is for configuring looks of the div sections
    *******************************/

    div {
        font-size: 11px;
        line-height: 1.5;
        text-align: center;
        /** only needed if you want a different text color
        color: #000000; 
        **/
    }

    /*******************************
        The #header_Img_Content section is for configuring looks for that section
    *******************************/

    #header_Img_Content {
        /** only needed if you want a different background color for that section
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        text-align: center;
    }


    /***************
        the body text is the generic style for your normal text areas
    *****************/

    .body_text {
        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #7e8c8d;
        text-align: center;
        font-size: 18px;
    }

    /*************
        The body_text will provide the format for all the text areas, but if you need more control
        of that specific section, then you can configure it in this section
    ****************/

    /*********************
        #instructional-text{
            background-color: #000000;
            margin: auto;
            width: 90%;
            color: #7e8c8d;
            text-align: center;
            font-size: 18px;
        }
    **********************/

    /*****************
        This will format the footer
    **************************/

    #footer {
        background-color: #D0021B;
        margin: auto;
        width: 90%;
        color: #ffffff;;
        text-align: center;
        font-size: 18px;
    }


    /*******************************
        The #intro section is for configuring looks for that section
    *******************************/

    #intro {

        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        text-align: center;
        font-size: 30px;
    }

    /*******************************
        The hr.separator is used to configure the separator bar
    *******************************/

    hr.separator {
        border-radius: 5px;
        margin-top: 10px;
        margin-right: auto;
        margin-left: auto;
        width: 90%;
        height: 8px;
        border: 0;
        background-color: #009C00;
        padding: 0px;
    }

    /*******************************
        The location_code_text is used to configure the section where the
        location code text lives
    *******************************/

    #location_code_text {
        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #7e8c8d;
        text-align: center;
        font-size: 18px;
        margin-top: 10px;
    }

    /*******************************
        The location_code_container is used to configure the section where the
        location code lives
    *******************************/

    #location_code_container {
        margin: auto;
        width: 25%;
        color: #D0021B;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    /*******************************
        The playlists-container is used to configure the section where the
        list of your songs is shown
    *******************************/

    #playlists_container {
        /** only needed if you want a different background color for this section
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #D0021B;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    /*******************************
        The rf-titles is used to configure the title above the RF imported data
    *******************************/

    .rf-titles {
        /** only needed if you want a different background color for for this section
        background-color: #000000;
        **/
        border-bottom: 5px solid red;
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
        color: #d60000;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
    }

    /*******************************
        The playing-now class is used to configure the text that shows what is currently playing
    *******************************/

    .playing-now {
        /*text-align: left; */
        margin-top: 10px;
        color: white;
        font-size: 20px;
    }

    /*******************************
        The rtable is used to configure table where the rf lists will show
        You shouldn''t modify this
    *******************************/

    .rtable {
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        text-align: center;
        width: 90%;
        padding: 0;
    }

    /*******************************
        The cell-vote-playlist is used to configure the table where the rf lists will show when you are using the voting mode
        You shouldn''t modify this with the exception of the font-size, border and cursor properties
    *******************************/

    .cell-vote-playlist {
        flex-grow: 1;
        width: 85%;
        font-weight: bold;
        overflow: hidden;
        list-style: none;
        font-size: 20px;
        border: solid white;
        border-width: 2px 2px 1px 2px;
        cursor: pointer;
    }

    /*******************************
        The cell-vote is used to configure the table where the rf lists will show when you are using the voting mode
        You shouldn''t modify this with the exception of the font-size, border and cursor properties
    *******************************/

    .cell-vote {
        flex-grow: 1;
        width: 15%;
        font-weight: bold;
        overflow: hidden;
        list-style: none;
        font-size: 20px;
        border: solid white;
        border-width: 2px 2px 1px 0px;

    }

    /*******************************
        The jukebox-list is used to configure the table where the rf lists will show when you are using the jukebox mode
        You shouldn''t modify this with the exception of the font-size, border and cursor properties
    *******************************/


    .jukebox-list {
        width: 100%;
        font-size: 24px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        /**border-width: 2px 2px 1px 2px; **/
        /**cursor:grabbing ; **/

    }

    /*******************************
        The jukebox-queue is used to configure the list of current jukebox requests
    *******************************/

    .jukebox-queue {
        text-align: center;
        color: white;
        font-size: 20px;
    }

    /*******************************
        The sequence image class is to style the image that appears next to the sequence name
    *******************************/

    .sequence-image {
        height: 40px;
        width: auto;
        padding-right: 20px;
    }


    /*******************************
        The jukebox-queue container is the wrapper container for the jukebox queue list
    *******************************/

    .jukebox-queue-container {
        overflow: auto;
        height: 150px;
        width: 70%;
        margin: 0 auto;
    }

    /*******************************
        The after-hours class is used to configure a message to be displayed when
        you don''t have a scheduled playlist playing
    *******************************/

    .after-hours {
        width: 90%;
        font-size: 24px;
        border: none;
        font-weight: bold;
        margin: auto;
    }

    /*******************************
        The button is used to configure your buttons
    *******************************/

    .button {
        background-color: #D0021B;
        border: none;
        border-radius: 10px;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 24px;
        margin: 4px 2px;
        cursor: pointer;
    }

    #submit {
        background-color: #d60000;
        padding: 1em;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 6px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        text-decoration: none;
        border: none;
    }

    #submit:hover {
        border: none;
        background: #e60000;
        box-shadow: 0px 0px 1px #777;
    }

    /*******************************
        The innerRequestSuccessful is used to configure the message for successful requests
    *******************************/

    .innerRequestSuccessful {
        background-color: #009C00;
        margin: auto;
        width: 80%;
        color: #ecf0f1;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    /*******************************
        The failed_Info_Box is used to configure the message for unsuccessful requests
    *******************************/
    .failed_Info_Box {
        background-color: #FF7400;
        margin: auto;
        width: 80%;
        color: #ecf0f1;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>

<h1>Enter your show title</h1>

<!-- if you want a picture in your header, you will have to store it on a secure server or it
might not display correctly. Sample image is scaled to 10% width, so your image might need to 
be adjusted.
-->

<div id="header_Img_Content">
    <img src="https://remotefalcon.com/rf-icon.png" style="max-width: 10%;height:auto;margin: auto;">
</div>


<div id="intro">
    Your intro title<br/>
    2020 Christmas Light show
</div>

<div class="body_text" id="intro-text">
    A description of your show and any other info you want to provide.<br/>
    Some more info on your show.<br/>
</div>

<hr class="separator">

<!-- This section is what shows what is currently playing Don''t delete -->

<div class="rf-titles">
    Playing Now
</div>

<div class="playing-now">
    {NOW_PLAYING}
</div>

<!-- This section will display a message if your show isn''t
playing a scheduled playlist-->

<div {after-hours-message}>
    <div class="after-hours">
        Our show hours are <br/>
        Sunday through Thursday from Sunset to 10:00 P.M.
        Friday and Saturday from sunset to 11:00 P.M.
    </div>
</div>

<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {jukebox-dynamic-container}>
    <p class="rf-titles">Next Selection</p>
    <div style="text-align: center; color: white; font-size: 20px;">
        {NEXT_PLAYLIST}
    </div>
    <p class="rf-titles"># Selected Songs</p>
    <div style="text-align: center; color: white;font-size: 20px;">
        {QUEUE_SIZE}
    </div>

    <p class="rf-titles">Current Queue</p>
    <div style="text-align: center; color: white;font-size: 20px;">
        <div class="jukebox-queue-container">
            {JUKEBOX_QUEUE}
        </div>
    </div>

</div>

<!-- This section is used for the instructions that you want if you are using the Jukebox mode. 
If you are using the voting mode, then it will not show.
Note that you can use the {QUEUE_SIZE} in your instructions, You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<div class="body_text" id="instructional-text" {jukebox-dynamic-container}>
    <H2>Pick your Favorite</H2>
    Select the song that you would like to play from the list below.
    Your selection will be added to the end of the list of the songs that are already selected. The list is limited to
    {QUEUE_DEPTH}
    songs. Songs will be played in the order that they are selected
</div>

<!-- This section is used for the instructions that you want if you are using the Voting mode. 
If you are using the jukebox mode, then it will not show.
You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<div class="body_text" id="instructional-text" {playlist-voting-dynamic-container}>
    <H2>Vote for your Favorite</H2>
    Vote for your favorite song from the list below. Your vote will be added to the
    song you chose. The song with the most votes will play
    when the current song is finished.<br/>
    You can only vote one time per round and the voting will start over once the
    song with the highest votes starts to play. <br/>
    Merry Christmas
</div>

<!--
  This is the section for the location code for the viewer to enter, if you have
  location code enabled. It appears twice here, once for jukebox and once for 
  voting. 
-->
<div {location-code-dynamic-container}>
    <div id="location_code_text">
        Enter the code below to submit a request:
    </div>
    <div id="location_code_container">
        {LOCATION_CODE}
    </div>
</div>

<hr class="separator">

<!-- The section below will only display if your show is set for Voting mode, there
is no need to delete it if you are using the Jukebox mode, and you might change your
mind on the selection method later! -->

<div {playlist-voting-dynamic-container}>
    <div class="rtable">
        <div class="cell-vote-playlist" style="border: none; cursor: text">
            Song List
        </div>
        <div class="cell-vote" style="border: none; cursor: text">
            Votes
        </div>
    </div>
    <div class="rtable">
        {PLAYLISTS}
    </div>
</div>


<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {jukebox-dynamic-container}>
    <div id="playlists_container">
        {PLAYLISTS}
    </div>
</div>
<!-- *****************************************
    The sections below are for the error messages, don''t delete them!
    ************************************* -->

<div id="requestSuccessful" style="display: none">
    <div class="innerRequestSuccessful">
        Successfully Added!
    </div>
</div>

<div id="requestFailed" style="display: none">
    <div class="failed_Info_Box">
        ERROR <br/>
        An unexpected error has occurred! Sorry for the inconvenience.
    </div>
</div>

<div id="requestPlaying" style="display: none">
    <div class="failed_Info_Box">
        SONG ALREADY REQUESTED <br/>
        The selected song has already been requested.
    </div>
</div>

<div id="queueFull" style="display: none">
    <div class="failed_Info_Box">
        QUEUE FULL<br/>
        The queue is full. The maximum number of request is {QUEUE_DEPTH}
    </div>
</div>

<div id="invalidLocation" style="display: none">
    <div class="failed_Info_Box">
        INVALID LOCATION <br/>
        You are not located where the show is or didn''t allow your location to be identified!
    </div>
</div>

<div id="alreadyVoted" style="display: none">
    <div class="failed_Info_Box">
        ALREADY VOTED <br/>
        You can only vote once per round, you will have to wait for the current song to finish before you can vote
        again.
    </div>
</div>

<div id="invalidLocationCode" style="display: none">
    <div class="failed_Info_Box">
        INVALID CODE <br/>
        The code you entered is not correct!
    </div>
</div>

<!-- end of error messages -->

<hr class="separator">

<div class="body_text" id="footer_text">
    <h3>About our show</h3>
    Enter whatever information you want like maybe details about your show or show times
</div>

<a href="https://remotefalcon.com" class="button">Visit our
    Website</a> <!-- change this to your website or delete if not needed -->

<div class="body_text" id="social_links"> <!-- modify or delete the links as needed -->
    <h3>FOLLOW US</h3>

    <a style="display: inline-block;"
       href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/facebook.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;" href="https://twitter.com/home?status=https://www.twitter.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/twitter.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;"
       href="https://www.linkedin.com/shareArticle?mini=true&amp;url=[[SHORT_PERMALINK]]&amp;title=&amp;summary=&amp;source="
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/linkedin.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;" href="[[SHORT_PERMALINK]]" target="_blank"> <img
            style="border-radius: 3px; display: block;"
            src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/instagram.png"
            alt="" width="35" height="35"/> </a>
</div>
<div id="footer">
    Hosted by RemoteFalcon 2020
</div>
', 'Y');

INSERT INTO REMOTE_VIEWER_PAGE_TEMPLATES
(viewerPageTemplateName, viewerPageTemplateHtml, isActive)
VALUES('Purple Halloween by StramMade3D', '<!doctype html>
<html>
<meta charset="UTF-8">
<!--
   This HTML template was coded by Rick Harris. Page graphics and layout are designed by Tracy Stram at StramMade3d.com
   
   Since this will be embedded in the page, there is no need to add any html or body tags. 
   Simply add and/or modify elements you want and they will be added.
   
   The following are the variables used to populate your lists so DON''T MODIFY THESE!!:
   {PLAYLISTS} - Displays the list of your sequences for the viewer to request.
   {NOW_PLAYING} - Displays the currently playing sequence.
   {NEXT_PLAYLIST} - Displays the next sequence in the queue.
   {QUEUE_SIZE} - Displays the current number of songs in the queue when using Jukebox mode.
   {QUEUE_DEPTH} - Displays the size that you have configured for your queue. This can be used in error messages or your instructions if you want.
   {LOCATION_CODE} - Displays the input field used to capture the location code.
   {JUKEBOX_QUEUE} - Displays the list of sequences currently in the jukebox queue.
    
-->

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://use.typekit.net/sni8lom.css">
<style type="text/css">
	
/** If you want to use any images on your page, they will need to be hoste on a secure site like imgur.com **/

/******************* 
     BASE CONFIG 
*******************/
{
box-sizing: border-box;
font-family: ''itc-benguiat-condensed'';
color: greenyellow;
text-align: center;
font-size: 25px;
}

/****** 
  BODY 
*******/    
body {
    background-image: url(''https://i.imgur.com/BkGbkwR.png'');
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: auto;
    height: 100%;
    min-height: 900px;
    background-color: transparent;
    position: relative;
}

/****** 
  DIV 
*******/
div {
    font-size: 11px;
    line-height: 1.5;
    text-align: center;
    color: white;
}

/****************
   HEADER IMAGE
*****************/
#header_Img_Content {
    margin: auto;
    width: 100%;
    text-align: center;
}
#your-logo {
    margin: auto;
    width: 100%;
    text-align: center;
}


/**************
   BODY TEXT
***************/    
.body_text {
    box-sizing: border-box;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    color: white;
    text-align: center;
    font-size: 25px;
    font-family: ''itc-benguiat-condensed'';
    font-weight: normal;
}

/****************** 
	INSTRUCTIONS
******************/
#instructional-text {
    margin: auto;
    width: 90%;
    color: #ffffff;
    text-align: center;
    font-size: 18px;
    font-family: ''itc-benguiat-condensed'';
}

/************** 
	FOOTER
**************/    
#footer {
    margin: auto;
    width: 100%;
    color: transparent;
    text-align: center;
    font-size: 18px;
}

/********************
	INTRO SECTION
********************/    
#intro {
    margin: auto;
    width: 100%;
    color: darkorange;
    text-align: center;
    font-size: 25px;
	font-weight: bold;
    font-family: ''itc-benguiat-condensed'';
}
#intro-text {
    margin: auto;
    width: 90%;
    color: #ffffff;
    text-align: center;
    font-size: 18px;
    font-family: ''itc-benguiat-condensed'';
}

/********************
	SEPERATOR BAR
********************/
hr.separator {
    border-radius: 5px;
    margin-top: 10px;
    margin-right: auto;
    margin-left: auto;
    width: 90%;
    height: 8px;
    border: 0;
    background-color: #F87B02;
    padding: 0px;
}

/************************
	LOCATION CODE TEXT
************************/
#location_code_text {
    margin: auto;
    width: 90%;
    color: orange;
    text-align: center;
    font-size: 18px;
    font-family: ''itc-benguiat-condensed'';
}
/****************************
	LOCATION CODE CONTAINER
****************************/
#location_code_container {
    margin: auto;
    width: 100%;
    color: white;
    text-align: center;
    font-size: 18px;
    font-family: ''itc-benguiat-condensed'';
}

/************************
	PLAYLISTS CONTAINER
************************/    
#playlists_container {
    margin: auto;
    width: 90%;
    color: #ffffff;
    text-align: center;
    font-size: 18px;
    font-family: ''itc-benguiat-condensed'';
}
#playlist-text {
    margin: auto;
    width: 90%;
    color: #ffffff;
    text-align: center;
    font-size: 18px;
    font-family: ''itc-benguiat-condensed'';
}

/*********************
    SECTION TITLES - Titles to the different sections of the page
*********************/ 
.rf-titles{
    border-bottom: 5px deeppink;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    color: white;
    text-align: center;
    font-size: 30px;
}
.white-title{
    box-sizing: border-box;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    color: white;
    text-align: center;
    font-size: 40px;
    font-family: ''ccmonstermash'';
}
.green-title{
    box-sizing: border-box;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    color: greenyellow;
    text-align: center;
    font-size: 40px;
    font-family: ''ccmonstermash'';
}
.orange-title{
    box-sizing: border-box;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    color: darkorange;
    text-align: center;
    font-size: 40px;
    font-family: ''ccmonstermash'';
}
.pink-title{
    box-sizing: border-box;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    color: deeppink;
    text-align: center;
    font-size: 40px;
    font-family: ''ccmonstermash'';
}

.rf-header{
    box-sizing: border-box;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    color: greenyellow;
    text-align: center;
    font-size: 25px;
    font-family: ''ccmonstermash'';
}

/******************
	PLAYING NOW
******************/    
.playing-now{
     margin-top: 10px;
     color: white;
        font-size: 20px;
}

/****************
	R-TABLE
****************/  
    .rtable{
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        text-align: center;
        width: 90%;
        padding: 0;
    }

/**************************
	VOTING MODE PLAYLIST
**************************/  
.cell-vote-playlist{
        flex-grow: 1;
        width: 85%;
        overflow: hidden;
        list-style: none;
		font-family: ''itc-benguiat-condensed'';
        font-size: 18px;
        border: transparent;
        border-width: 2px 2px 1px 2px;
        cursor: pointer;
    }

/*****************
	VOTING MODE
*****************/    
    .cell-vote {
        flex-grow: 1;
        width: 15%;
        overflow: hidden;
        list-style: none;
        font-size: 18px;
		font-family: ''itc-benguiat-condensed'';
        border: transparent;
        border-width: 2px 2px 1px 0px;

    }
/***************************
	JUKEBOX MODE PLAYLIST
***************************/   
.jukebox-list {
    width: 100%;
    font-size: 24px;
    border: none;
    cursor: pointer;
	/**border-width: 2px 2px 1px 2px; **/
    /**cursor:grabbing ; **/        
}
/*******************
	JUKEBOX QUEUE
********************/
.jukebox-queue {
    text-align: center;
    font-family: ''itc-benguiat-condensed'';
    color: white;
    font-size: 20px;
}

/***************
	ALBUM ART
***************/
.album-art {
    height: 40px;
    width: auto;
    padding-right: 20px;
}

/*******************************
	JUKEBOX QUEUE CONTAINER
*******************************/
.jukebox-queue-container {
    overflow: auto;
    height: 150px;
    width: 70%;
    margin: 0 auto;
}

/***********************
	AFTER HOURS VIEW
***********************/   
.after-hours {
    width: 100%;
    font-size: 30px;
    border: none;
    margin: auto;
    color: #ffffff;
}

/*************
	BUTTONS
*************/   
.button {
    background-color: #D0021B;
    border: none;
    border-radius: 10px;
    color: ffffff;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 24px;
    margin: 4px 2px;
    cursor: pointer;
}
#submit {
    background-color: #d60000;
    padding: 1em;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 6px;
    color: #ffffff;
    font-size: 20px;
    text-decoration: none;
    border: none;
}
#submit:hover {
    border: none;
    background: #e60000;
    box-shadow: 0px 0px 1px #777;
}

/********************************
	REQUEST SUCCESSFUL MESSAGE
********************************/
.innerRequestSuccessful {
    background-color: #009C00;
    margin: auto;
    width: 80%;
    color: #ecf0f1;
    text-align: center;
    font-size: 24px;
}
/****************************
	REQUEST FAILED MESSAGE
****************************/ 
.failed_Info_Box {
    background-color: #FF7400;
    margin: auto;
    width: 80%;
    color: #ecf0f1;
    text-align: center;
    font-size: 24px;
}
/***********************
    HYPERLINK COLORS
************************/ 
a:link {
    color: black;
    background-color: transparent;
    text-decoration: none;
}
a:visited {
    color: deeppink;
    background-color: transparent;
    text-decoration: none;
}
a:hover {
    color: mediumpurple;
    background-color: transparent;
    text-decoration: underline;
}
a:active {
color: : black;
    background-color: transparent;
    text-decoration: underline;
}

</style>
	

<!-----END OF STYLE OPTIONS-----> 

<!-----START OF PAGE DESIGN----->

<div id="header_img_content"> <img src="https://i.imgur.com/OGXK0w1.png" style="width:100%; height: auto; margin: auto;"> </div>
	
<div id="your_logo"> <img src="https://i.imgur.com/FYlWAI1.png" style="width:10%; height:auto; margin:  auto; position:center ;"> </div>
	
<br />
	
<div class="white-title">
	Your Show''s Name <!--For example: StramMade Lights--><br />
	
<div id="intro"> Welcome To Our<br/>
				2022 Light Show </div>
	
<div class="body_text" id="intro-text"> A description of your show and any other info you want to provide.<br/>
	Some more info on your show.
</div>

<hr class="separator">

<!-- This section is what shows what is currently playing. Don''t delete! -->


	
<!-- This section will be displayed if your show isn''t playing a scheduled playlist-->

<div {after-hours-message}>
<img src="https://i.imgur.com/7p5kpMM.png" alt="off-air" style="max-width: 25%;height:auto;margin: auto;">
    <div class="pink-title">
		Show Hours</div>
	<div class="body_text"> 
        Sunday through Thursday from Sunset to 10:00 P.M.<br/>
        Friday and Saturday from sunset to 11:00 P.M.
    </div>
</div>

<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {jukebox-dynamic-container}>
<div class="pink-title">
    Playing Now
</div>

<div class="playing-now">
    {NOW_PLAYING}<br/>
</div>
<hr class="separator">
    <p class="orange-title">Next Selection</p>
    <div style="text-align: center; color: white; font-size: 20px;">
        {NEXT_PLAYLIST}
    </div>
    <p class="green-title"># Selected Songs</p>
    <div style="text-align: center; color: white;font-size: 20px;">
        {QUEUE_SIZE}
    </div>

    <p class="pink-title">Current Queue</p>
    <div style="text-align: center; color: white;font-size: 20px;">
        <div class="jukebox-queue-container">
            {JUKEBOX_QUEUE}
        </div>
<hr class="separator">
    </div>

</div>

<!-- This section is used for the instructions that you want if you are using the Jukebox mode. 
If you are using the voting mode, then it will not show.
Note that you can use the {QUEUE_SIZE} in your instructions, You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<!-- JUKEBOX MODE INSTRUCTIONS -->
  
  <div class="body_text" id="instructional-text" {jukebox-dynamic-container}> <br />
    <div class="orange-title"> Pick Your Favorite</div>
    🎃 Requests are limited to {QUEUE_DEPTH}  songs 🎃 <br />
    🎃 Select any song that you would like to hear from the list below 🎃<br />
    🎃 Songs will be played in the order that they are selected 🎃 <br />
<hr class="separator">
    <br />
  </div>
  
 <!-- VOTING MODE INSTRUCTIONS -->
  
  <div class="body_text" id="instructional-text" {playlist-voting-dynamic-container}> 
    <div class="green-title">Vote For Your Favorite</div>
    👻 Vote for your favorite song from the list below 👻 <br >
    👻 Your vote will be added to the song you choose 👻 <br />
    👻 The song with the most votes will play next 👻<br />
    👻 You can only vote once per round 👻<br />
    👻 Voting will reset when the song with the highest votes starts to play 👻 <br />
<hr class="separator">
   
  </div>

<!--
  This is the section for the location code for the viewer to enter, if you have
  location code enabled. It appears twice here, once for jukebox and once for 
  voting. 
-->
<div {location-code-dynamic-container}>
    <div id="location_code_text">
        Enter the code below to submit a request:
    </div>
    <div id="location_code_container">
        {LOCATION_CODE}
    </div>
</div>

<!-- The section below will only display if your show is set for Voting mode, there
is no need to delete it if you are using the Jukebox mode, and you might change your
mind on the selection method later! -->

<div {playlist-voting-dynamic-container}>
    <div class="rtable">
        <div class="cell-vote-playlist" style="border: none; cursor: text">
            Song List
        </div>
        <div class="cell-vote" style="border: none; cursor: text">
            Votes
        </div>
    </div>
    <div class="rtable">
        {PLAYLISTS}
    </div><br />
</div>



<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {jukebox-dynamic-container}>
    <div id="playlists_container">
        {PLAYLISTS}
    </div>
</div>
<!-- *****************************************
    The sections below are for the error messages, don''t delete them!
    ************************************* -->

<div id="requestSuccessful" style="display: none">
    <div class="innerRequestSuccessful">
        Successfully Added!
    </div>
</div>

<div id="requestFailed" style="display: none">
    <div class="failed_Info_Box">
        ERROR <br/>
        An unexpected error has occurred! Sorry for the inconvenience.
    </div>
</div>

<div id="requestPlaying" style="display: none">
    <div class="failed_Info_Box">
        SONG ALREADY REQUESTED <br/>
        The selected song has already been requested.
    </div>
</div>

<div id="queueFull" style="display: none">
    <div class="failed_Info_Box">
        QUEUE FULL<br/>
        The queue is full. The maximum number of request is {QUEUE_DEPTH}
    </div>
</div>

<div id="invalidLocation" style="display: none">
    <div class="failed_Info_Box">
        INVALID LOCATION <br/>
        You are not located where the show is or didn''t allow your location to be identified!
    </div>
</div>

<div id="alreadyVoted" style="display: none">
    <div class="failed_Info_Box">
        ALREADY VOTED <br/>
        You can only vote once per round, you will have to wait for the current song to finish before you can vote
        again.
    </div>
</div>

<div id="invalidLocationCode" style="display: none">
    <div class="failed_Info_Box">
        INVALID CODE <br/>
        The code you entered is not correct!
    </div>
</div>

<!-- end of error messages -->

<hr class="separator">

<div class="orange-title">
    About our show</div>
<div id="instructional-text">
    Enter whatever information you want like maybe details about your show or show times
</div>
<a href="https://remotefalcon.com" class="button">Visit Our
    Website</a> <!-- change this to your website or delete if not needed -->

<div class="green-title"> <!-- modify or delete the links as needed -->
    FOLLOW US</div>

    <a style="display: inline-block;"
       href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/facebook.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;" href="https://twitter.com/home?status=https://www.twitter.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/twitter.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;"
       href="https://www.linkedin.com/shareArticle?mini=true&amp;url=[[SHORT_PERMALINK]]&amp;title=&amp;summary=&amp;source="
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/linkedin.png"
                             alt="" width="35" height="35"/> </a>
    <a style="display: inline-block;" href="[[SHORT_PERMALINK]]" target="_blank"> <img
            style="border-radius: 3px; display: block;"
            src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/instagram.png"
            alt="" width="35" height="35"/> </a>
</div>
	<div id="footer">
    <img src="https://i.imgur.com/uj7gfcT.png" style="width:100%; height: auto; margin: auto;">
</div>
', 'Y');

INSERT INTO REMOTE_VIEWER_PAGE_TEMPLATES
(viewerPageTemplateName, viewerPageTemplateHtml, isActive)
VALUES('Red & White by StramMade3D', '<!doctype html>
<html>
<meta charset="UTF-8">
<!--
   This HTML template was coded by Rick Harris. Page graphics and layout are designed by Tracy Stram at StramMade3d.com
   
   Since this will be embedded in the page, there is no need to add any html or body tags. 
   Simply add and/or modify elements you want and they will be added.
   
   The following are the variables used to populate your lists so DON''T MODIFY THESE!!:
   {PLAYLISTS} - Displays the list of your sequences for the viewer to request.
   {NOW_PLAYING} - Displays the currently playing sequence.
   {NEXT_PLAYLIST} - Displays the next sequence in the queue.
   {QUEUE_SIZE} - Displays the current number of songs in the queue when using Jukebox mode.
   {QUEUE_DEPTH} - Displays the size that you have configured for your queue. This can be used in error messages or your instructions if you want.
   {LOCATION_CODE} - Displays the input field used to capture the location code.
   {JUKEBOX_QUEUE} - Displays the list of sequences currently in the jukebox queue.
    
-->

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://use.typekit.net/ygm8agc.css">
<style type="text/css">
/** If you want to use any images on your page, they will need to be hoste on a secure site like imgur.com **/

/******************* 
     BASE CONFIG 
*******************/
{
box-sizing: border-box;
font-family: ''poppins'';
color: white;
text-align: center;
font-size: 25px;
}
/****** 
  BODY 
*******/    
body {
	-webkit-background-size: cover;
	-moz-background-size: cover;
	-o-background-size: cover;
	background-size: cover;
	width: auto;
	height: 100%;
	min-height: 900px;
	background-color: #ac1224;
	position: relative;
}
/****** 
  DIV 
*******/
div {
	font-size: 11px;
	line-height: 1.5;
	text-align: center;
	color: white;
}
/****************
   HEADER IMAGE
*****************/
#header_Img_Content {
	margin: auto;
	width: 100%;
	text-align: center;
}
#your-logo {
	margin: auto;
	text-align: center;
}
/**************
   BODY TEXT
***************/    
.body_text {
	box-sizing: border-box;
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	color: white;
	text-align: center;
	font-size: 20px;
	font-family: ''poppins'';
	font-weight: normal;
}
/****************** 
	INSTRUCTIONS
******************/
#instructional-text {
	margin: auto;
	width: 90%;
	color: #ffffff;
	text-align: center;
	font-size: 18px;
	font-family: ''poppins'';
}
/************** 
	FOOTER
**************/    
#footer {
	margin: auto;
	width: 100%;
	color: transparent;
	text-align: center;
	font-size: 18px;
}
/********************
	INTRO SECTION
********************/    
#intro {
	margin: auto;
	width: 100%;
	color: lightgoldenrodyellow;
	text-align: center;
	font-size: 30px;
	font-weight: bold;
	font-family: ''haboro-contrast-normal'';
}
#intro-text {
	margin: auto;
	width: 90%;
	color: #ffffff;
	text-align: center;
	font-size: 20px;
	font-family: ''haboro-contrast-normal'';
}
/********************
	SEPERATOR BAR
********************/
hr.separator {
	border-radius: 5px;
	margin-top: 10px;
	margin-right: auto;
	margin-left: auto;
	width: 90%;
	height: 8px;
	border: 0;
	background-color: #F87B02;
	padding: 0px;
}
/************************
	LOCATION CODE TEXT
************************/
#location_code_text {
	margin: auto;
	width: 90%;
	color: goldenrod;
	text-align: center;
	font-size: 40px;
	font-family: ''eds-market-upright-script'';
}
/****************************
	LOCATION CODE CONTAINER
****************************/
#location_code_container {
	margin: auto;
	width: 100%;
	color: white;
	text-align: center;
	font-size: 18px;
	font-family: ''poppins'';
}
/************************
	PLAYLISTS CONTAINER
************************/    
#playlists_container {
	margin: auto;
	width: 90%;
	color: #ffffff;
	text-align: center;
	font-size: 18px;
	font-family: ''poppins'';
}
#playlist-text {
	margin: auto;
	width: 90%;
	color: #ffffff;
	text-align: center;
	font-size: 18px;
	font-family: ''poppins'';
}
/*********************
    SECTION TITLES - Titles to the different sections of the page
*********************/ 
.rf-titles {
	border-bottom: 5px white;
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	color: white;
	text-align: center;
	font-size: 30px;
}
.white-title {
	box-sizing: border-box;
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	color: white;
	text-align: center;
	font-size: 40px;
	font-family: ''kari-display-pro'';
}
.light-gold-title {
	box-sizing: border-box;
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	color: lightgoldenrodyellow;
	text-align: center;
	font-size: 30px;
	font-family: ''kari-pro'';
}
.gold-title {
	box-sizing: border-box;
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	color: goldenrod;
	text-align: center;
	font-size: 60px;
	font-family: ''wreath'';
}
.follow-us {
	box-sizing: border-box;
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	color: goldenrod;
	text-align: center;
	font-size: 25px;
	font-family: ''poppins'';
}
/******************
	PLAYING NOW
******************/    
.playing-now {
	margin-top: 10px;
	color: white;
	font-size: 20px;
}
/****************
	R-TABLE
****************/  
.rtable {
	display: flex;
	flex-wrap: wrap;
	margin: auto;
	text-align: left;
	width: 50%;
	padding: 0;
}
/**************************
	VOTING MODE PLAYLIST
**************************/  
.cell-vote-playlist {
	flex-grow: 1;
	width: 85%;
	overflow: hidden;
	list-style: none;
	font-family: ''poppins'';
	font-size: 18px;
	text-align: left;
	border: transparent;
	border-width: 2px 2px 1px 2px;
	cursor: pointer;
}
/*****************
	VOTING MODE
*****************/    
.cell-vote {
	flex-grow: 1;
	width: 15%;
	overflow: hidden;
	list-style: none;
	font-size: 18px;
	font-family: ''poppins'';
	border: transparent;
	border-width: 2px 2px 1px 0px;
}
/***************************
	JUKEBOX MODE PLAYLIST
***************************/   
.jukebox-list {
	width: 100%;
	font-size: 24px;
	border: none;
	cursor: pointer;/**border-width: 2px 2px 1px 2px; **//**cursor:grabbing ; **/        
}
/*******************
	JUKEBOX QUEUE
********************/
.jukebox-queue {
	text-align: center;
	font-family: ''poppins'';
	color: white;
	font-size: 20px;
}
/***************
	ALBUM ART
***************/
.album-art {
	height: 40px;
	width: auto;
	padding-right: 20px;
}
/*******************************
	JUKEBOX QUEUE CONTAINER
*******************************/
.jukebox-queue-container {
	overflow: auto;
	height: 150px;
	width: 70%;
	margin: 0 auto;
}
/***********************
	AFTER HOURS VIEW
***********************/   
.after-hours {
	width: 100%;
	font-size: 30px;
	border: none;
	margin: auto;
	color: #ffffff;
}
/*************
	BUTTONS
*************/   
.button {
	background-color: #D0021B;
	border: none;
	border-radius: 10px;
	color: ffffff;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 40px;
	margin: 4px 2px;
	cursor: pointer;
}
#submit {
	background-color: #d60000;
	padding: 1em;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 6px;
	color: #ffffff;
	font-size: 20px;
	text-decoration: none;
	border: none;
}
#submit:hover {
	border: none;
	background: #e60000;
	box-shadow: 0px 0px 1px #777;
}
/********************************
	REQUEST SUCCESSFUL MESSAGE
********************************/
.innerRequestSuccessful {
	background-color: #009C00;
	margin: auto;
	width: 80%;
	color: #ecf0f1;
	text-align: center;
	font-size: 24px;
}
/****************************
	REQUEST FAILED MESSAGE
****************************/ 
.failed_Info_Box {
	background-color: #FF7400;
	margin: auto;
	width: 80%;
	color: #ecf0f1;
	text-align: center;
	font-size: 24px;
}
/***********************
    HYPERLINK COLORS
************************/ 
a:link {
	color: white;
	background-color: transparent;
	text-decoration: none;
}
a:visited {
	color: lightblue;
	background-color: transparent;
	text-decoration: none;
}
</style>

<!-----END OF STYLE OPTIONS-----> 

<!-----START OF PAGE DESIGN----->

<div id="header_img_content"> <img src="https://i.imgur.com/pInGkcj.png" style="width:105%; height: auto; margin: auto;"> </div>
<div id="your_logo"> <img src="https://i.imgur.com/lFISCwM.png" style="width:15%; height:auto; margin:  auto; position:center ;"> </div>
<br />
<div class="white-title"> Your Show''s Name <!--For example: StramMade Lights--><br />
  <div id="intro"> Welcome To Our<br/>
    2022 Light Show </div>
  <div class="body_text" id="intro-text"> A description of your show and any other info you want to provide.<br/>
    Some more info on your show. </div>
  <img src="https://i.imgur.com/lDiXtkp.png" style="width:50%; height: auto; margin: auto;"> 
  
  <!-- This section is what shows what is currently playing. Don''t delete! --> 
  
  <!-- This section will be displayed if your show isn''t playing a scheduled playlist-->
  
  <div {after-hours-message}> <img src="https://i.imgur.com/pPP1V5m.png" alt="off-air" style="max-width: 23%;height:auto;margin: auto;">
    <div class="gold-title"> Show Hours</div>
    <div class="body_text"> Sunday through Thursday from Sunset to 10:00 P.M.<br/>
      Friday and Saturday from sunset to 11:00 P.M. </div>
  </div>
  
  <!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->
  
  <div {jukebox-dynamic-container}>
    <div class="gold-title"> Playing Now </div>
    <div class="body_text"> {NOW_PLAYING}<br/>
    </div>
    <div><img src="https://i.imgur.com/lDiXtkp.png" style="width:50%; height: auto; margin: auto;"></div>
    <p class="light-gold-title">Next Selection</p>
    <div class="body_text"> {NEXT_PLAYLIST} </div>
    <p class="light-gold-title"># Selected Songs</p>
    <div class="body_text"> {QUEUE_SIZE} </div>
    <p class="light-gold-title">Current Queue</p>
    <div style="text-align: center; color: white;font-size: 20px;">
      <div class="body_text"> {JUKEBOX_QUEUE} </div>
      <br />
      <div><img src="https://i.imgur.com/lDiXtkp.png" style="width:50%; height: auto; margin: auto;"></div>
    </div>
  </div>
  
  <!-- This section is used for the instructions that you want if you are using the Jukebox mode. 
If you are using the voting mode, then it will not show.
Note that you can use the {QUEUE_SIZE} in your instructions, You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience--> 
  
  <!-- JUKEBOX MODE INSTRUCTIONS -->
	
<div class="body_text" id="instructional-text" {jukebox-dynamic-container}>
    <div class="white-title"> Pick Your Favorite</div> 
    🎅 Requests are limited to {QUEUE_DEPTH}  songs 🎅 <br />
    🎅 Select any song that you would like to hear from the list below 🎅<br />
    🎅 Songs will be played in the order that they are selected 🎅<br> 
	 <img src="https://i.imgur.com/lDiXtkp.png" style="width:50%; height: auto; margin: auto;"> </div>

  
  <!-- VOTING MODE INSTRUCTIONS -->
  
  <div class="body_text" id="instructional-text" {playlist-voting-dynamic-container}>
    <div class="white-title">Vote For Your Favorite</div>
    🎄 Vote for your favorite song from the list below 🎄 <br >
    🎄 Your vote will be added to the song you choose 🎄 <br />
    🎄 The song with the most votes will play next 🎄<br />
    🎄 You can only vote once per round 🎄<br />
    🎄 Voting will reset when the song with the highest votes starts to play 🎄 <br>
  <img src="https://i.imgur.com/lDiXtkp.png" style="width:50%; height: auto; margin: auto;"> </div>
  
 
  <!--
  This is the section for the location code for the viewer to enter, if you have
  location code enabled. It appears twice here, once for jukebox and once for 
  voting. 
-->
  <div {location-code-dynamic-container}>
    <div id="location_code_text"> Enter the code below to submit a request: </div>
    <div id="location_code_container"> {LOCATION_CODE} </div>
  </div>
  
  <!-- The section below will only display if your show is set for Voting mode, there
is no need to delete it if you are using the Jukebox mode, and you might change your
mind on the selection method later! -->
  
  <div {playlist-voting-dynamic-container}>
    <div class="rtable">
      <div class="cell-vote-playlist" style="border: none; font-weight:bold; text-decoration: underline; cursor: text"> Song List </div>
      <div class="cell-vote" style="border: none; font-weight:bold; text-decoration: underline; cursor: text"> Votes </div>
    </div>
    <div class="rtable"> {PLAYLISTS} </div>
  </div>
  
  <!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->
  
  <div {jukebox-dynamic-container}>
    <div id="playlists_container"> {PLAYLISTS} </div>
  </div>
  <!-- *****************************************
    The sections below are for the error messages, don''t delete them!
    ************************************* -->
  
  <div id="requestSuccessful" style="display: none">
    <div class="innerRequestSuccessful"> Successfully Added! </div>
  </div>
  <div id="requestFailed" style="display: none">
    <div class="failed_Info_Box"> ERROR <br/>
      An unexpected error has occurred! Sorry for the inconvenience. </div>
  </div>
  <div id="requestPlaying" style="display: none">
    <div class="failed_Info_Box"> SONG ALREADY REQUESTED <br/>
      The selected song has already been requested. </div>
  </div>
  <div id="queueFull" style="display: none">
    <div class="failed_Info_Box"> QUEUE FULL<br/>
      The queue is full. The maximum number of request is {QUEUE_DEPTH} </div>
  </div>
  <div id="invalidLocation" style="display: none">
    <div class="failed_Info_Box"> INVALID LOCATION <br/>
      You are not located where the show is or didn''t allow your location to be identified! </div>
  </div>
  <div id="alreadyVoted" style="display: none">
    <div class="failed_Info_Box"> ALREADY VOTED <br/>
      You can only vote once per round, you will have to wait for the current song to finish before you can vote
      again. </div>
  </div>
  <div id="invalidLocationCode" style="display: none">
    <div class="failed_Info_Box"> INVALID CODE <br/>
      The code you entered is not correct! </div>
  </div>
  
  <!-- end of error messages --> 
  
  <img src="https://i.imgur.com/lDiXtkp.png" style="width:50%; height: auto; margin: auto;">
  <div class="white-title"> About Our Show</div>
  <div id="instructional-text"> Enter whatever information you want like maybe details about your show or show times </div>
  <a href="https://remotefalcon.com" class="button">Visit Our Website</a> <!-- change this to your website or delete if not needed -->
  
  <div class="follow-us"> <!-- modify or delete the links as needed --> 
    FOLLOW US</div>
  <a style="display: inline-block;"
       href="https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/facebook.png"
                             alt="" width="35" height="35"/> </a> <a style="display: inline-block;" href="https://twitter.com/home?status=https://www.twitter.com/PROFILE"
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/twitter.png"
                             alt="" width="35" height="35"/> </a> <a style="display: inline-block;"
       href="https://www.linkedin.com/shareArticle?mini=true&amp;url=[[SHORT_PERMALINK]]&amp;title=&amp;summary=&amp;source="
       target="_blank"> <img style="border-radius: 3px; display: block;"
                             src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/linkedin.png"
                             alt="" width="35" height="35"/> </a> <a style="display: inline-block;" href="[[SHORT_PERMALINK]]" target="_blank"> <img
            style="border-radius: 3px; display: block;"
            src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/roundedwhite/instagram.png"
            alt="" width="35" height="35"/> </a> </div>
<div id="footer"> <img src="https://i.imgur.com/Jhr5CsV.png" style="width:105%;"> </div>
</html>', 'Y');

INSERT INTO REMOTE_VIEWER_PAGE_TEMPLATES
(viewerPageTemplateName, viewerPageTemplateHtml, isActive)
VALUES('On Air by Jason Toy', '<!--
   For more information on the different parts of the Viewer Page, check out the docs!
   https://docs.remotefalcon.com/docs/control-panel/viewer-page#viewer-page-elements
-->

<!--
    The section between the <style type="text/css"> and </style> is used to customize your viewer page.
    Do not delete any items in this section unless you know what they are doing.
    This section is where you can custom design your webpage the way you want it by changing the values for the particular section. 
-->
<link href=''https://fonts.googleapis.com/css?family=Fredericka the Great|Comfortaa|Rock Salt'' rel=''stylesheet''>
<style type="text/css">

/*************** 
    Base Config-- This section defines the base configuration for your page, the font and font color
*******************/
    
    * {
    box-sizing: border-box;
    font-family: ''Fredericka the Great'', cursive;
    color: #FFFFFF;
    text-align: center;
    }
    
/*******************************
    The body section is for configuring the overall looks of the page such as the background color 
    and background image. If you want to use a background image
    delete the comments and it is recommended to set a size to ensure if fits how you intend it.
    If you want the image to tile to fill the whole page then set the background-repeat to repeat.
*******************************/ 
    
    body {
        /** 
        background-image: url(yourBackgroundImage.html);
        background-repeat: repeat;
        background-size: 300px 100px;
        **/
        background-color: #BF2C31; /** sets the overall background color **/
        border: none;
		margin: auto;
		width: auto;
    }

/*******************************
    The div section is for configuring looks of the div sections
*******************************/ 
    
    div{
        font-size: 11px; 
        line-height: 1.5; 
        text-align: center; 
        /** only needed if you want a different text color
        color: #000000; 
        **/
    }
    a:link, a:visited {
        color: #FFFFFF;
        font-family: ''Comfortaa'', cursive;

}
/*******************************
    The #header_Img_Content section is for configuring looks for that section
*******************************/
    
    #header_Img_Content{
        /** only needed if you want a different background color for that section
        background-color: #000000;
        **/
        margin: auto; 
        width: 100%;
        text-align: center;
    }

    
/***************
    the body text is the generic style for your normal text areas 
*****************/
    
    .body_text{
        /** only needed if you want a different background color for all of the body text sections
        background-color: #000000;
        **/
        margin: auto;
        width: 90%;
        color: #FFFFFF;
        text-align: center;
        font-size: 18px;
        font-family: ''Comfortaa'', cursive;
    }
    
/************* 
    The body_text will provide the format for all the text areas, but if you need more control
    of that specific section, then you can configure it in this section
****************/
    
/*********************
    #instructional-text{
        background-color: #000000; 
        margin: auto; 
        width: 90%;
        color: #7e8c8d;
        text-align: center;
        font-size: 18px;
    }
**********************/
     
/***************** 
    This will format the footer
**************************/
    
    #footer{
        background-color: #1A2F4C;
        margin: auto;
        width: 100%;
        color: #ffffff;;
        text-align: center;
        font-size: 12px;    
    }
    

/*******************************
    The #intro section is for configuring looks for that section
*******************************/ 
    
    #intro{
        
        /** only needed if you want a different background color for all of the body text sections
        background-color: #BF2C31;
        **/
        margin: auto; 
        width: 100%;
        text-align: center;
        font-size: 25px;
    }
	
/*******************************
    The #header section is for configuring looks for that section
*******************************/ 
    
    #header{
    /** only needed if you want a different background color for all of the body text sections**/
    background-color: #BF2C31;
    margin: auto;
    width: 100%;
    text-align: center;
    }
    
/*******************************
    The #bodyarea section is for configuring looks for that section
*******************************/ 
    
    #bodyarea{
    /** only needed if you want a different background color for all of the body text sections**/
    background-color: #008B6B;
    margin: auto;
    width: 100%;
    text-align: center;
    }	
    
/*******************************
    The playlists-container is used to configure the section where the 
    list of your songs is shown
*******************************/
    
    #playlists_container{
        /** only needed if you want a different background color for this section
        background-color: #000000;
        **/ 
        margin: auto; 
        width: 90%;
        color: #FFFFFF;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        font-family: ''Rock Salt'', cursive;
}
 
/*******************************
    The rf-titles is used to configure the title above the RF imported data
*******************************/ 
    
    .rf-titles{
        /** only needed if you want a different background color for for this section
        background-color: #000000;
        **/
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        width: 70%;
        color: #FFFFFF;
        text-align: center;
        font-size: 30px; 
        font-weight: bold;
    }

/*******************************
    The playing-now class is used to configure the text that shows what is currently playing
*******************************/ 
    
    .playing-now {
        /*text-align: left; */
        margin-top: 10px;
        color: FFFFF; 
        font-size: 20px;
        font-family: ''Rock Salt'', cursive;
    }
    
/*******************************
    The rtable is used to configure table where the rf lists will show
    You shouldn''t modify this
*******************************/ 
    
    .rtable {
        display: flex;
        flex-wrap: wrap;
        margin: auto;       
        text-align: center;
        width: 90%; 
        padding: 0;
    }
    
/*******************************
    The cell-vote-playlist is used to configure the table where the rf lists will show when you are using the voting mode
    You shouldn''t modify this with the exception of the font-size, border and cursor properties    
*******************************/      
    
    .cell-vote-playlist {
        flex-grow: 1;
        width: 80%;  
        font-weight: bold;
        overflow: hidden;
        list-style: none;
        font-size: 20px;
        font-family: ''Rock Salt'', cursive;
        border: solid white;
        border-width: 2px 2px 1px 2px;
        cursor: pointer;
    }
    
/*******************************
    The cell-vote is used to configure the table where the rf lists will show when you are using the voting mode
    You shouldn''t modify this with the exception of the font-size, border and cursor properties
*******************************/ 
    
    .cell-vote {
        flex-grow: 1;
        width: 20%;
        font-weight: bold;
        overflow: hidden; 
        list-style: none;
        font-size: 20px;
        font-family: ''Rock Salt'', cursive;
        border: solid white;
        border-width: 2px 2px 1px 0px;
        
    }   

/*******************************
    The jukebox-list is used to configure the table where the rf lists will show when you are using the jukebox mode
    You shouldn''t modify this with the exception of the font-size, border and cursor properties   
*******************************/ 

   
    .jukebox-list{
        width: 100%;
        font-size: 24px;
        border: solid white; 
        cursor: pointer;
        font-family: ''Rock Salt'', cursive;
        font-weight: bold;
        border-width: 2px 2px 1px 2px;
        /**cursor:grabbing ; **/
        
    }
    
/*******************************
    The jukebox-queue is used to configure the list of current jukebox requests
*******************************/ 

    .jukebox-queue {
        text-align: center;
        font-family: ''Rock Salt'', cursive;
        color: white; 
        font-size: 20px;  
    }

/*******************************
    The jukebox-queue container is the wrapper container for the jukebox queue list
*******************************/ 

    .jukebox-queue-container {
        overflow: auto;
        height: 150px;
        width: 70%;
        margin: 0 auto;
    }

/*******************************
    The after-hours class is used to configure a message to be displayed when
    you don''t have a scheduled playlist playing
*******************************/ 
   
    .after-hours{
        width: 90%;
        font-size: 30px;
        border: none; 
        font-weight: bold;
        margin: auto;
    }
    
/*******************************
    The button is used to configure your buttons
*******************************/
    
    .button{
        background-color: #D0021B;
        border: none;
        border-radius: 10px;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 24px;
        margin: 4px 2px;
        cursor: pointer;  
    }
    
    #submit {
        background-color: #d60000;
        padding: 1em;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 6px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        text-decoration: none;
        border: none;
    }
    
    #submit:hover {
        border: none;
        background: #e60000;
        box-shadow: 0px 0px 1px #777;
    }
    
/*******************************
    The innerRequestSuccessful is used to configure the message for sucessful requests
*******************************/ 
    
    .innerRequestSuccessful {
        position: fixed;
        top: 50%;
        margin-left: 10%;
        background-color: #008B6B;
        width: 80%;
        transform: translateY(-50%);
        color: #FFF;
        text-align: center;
        font-family: ''Comfortaa'', cursive;
        font-size: 24px;
        font-weight: bold;
        opacity: .9;
        border-radius: 10px;
    }
    
/*******************************
    The failed_Info_Box is used to configure the message for unsucessful requests
*******************************/ 
   .failed_Info_Box{
        position: fixed;
        background-color: #BF2C31;
        top: 50%;
        margin-left: 10%;
        width: 80%;
        transform: translateY(-50%);
        color: #FFF;
        text-align: center;
        font-family: ''Comfortaa'', cursive;
        font-size: 24px;
        font-weight: bold;
        opacity: .9;
        border-radius: 10px;
    }
</style>

<!-- ######### HEADER AREA #########-->
	
<div id="header">

<!-- if you want a picture in your header, you will have to store it on a secure server or it
might not display correctly
-->

	<div id="header_Img_Content">
    <!-- Note that the Show Name is part of the image sourced below. To modify, you will need to download the image
    from the link and update it using an image tool (I personally use and recommend GIMP). -->
    <img src="https://i.postimg.cc/2SYPrBcn/merryxmas-header-copy.png" alt="merry-xmas" style="max-width: 100%;height:auto;margin: auto;">
	</div>
    <div id="intro">
        <img src="https://i.postimg.cc/nLt45NDM/maps-icon.png" alt="Wesely-Lights" style="max-width: 15%;height:auto;margin: auto;">
        <div style="font-size: 20px; font-family: ''Comfortaa'', cursive;">
            <a href="https://goo.gl/maps/YiCyFAiHX4etgA1PA">
                **Your Address** </a></div>
    <div {after-hours-message}>
            <img src="https://i.postimg.cc/L5X1zDF9/off-air.png" alt="off-air" style="max-width: 30%;height:auto;margin: auto;">
    </div>
        <div {jukebox-dynamic-container}>    
            <img src="https://i.postimg.cc/PxJzdTVr/on-air.gif" alt="on-air" style="max-width: 30%;height:auto;margin: auto;">
            <div style="font-size: 30px; font-family: ''Fredericka the Great'', cursive;">Tune Radio To: <br />**.* FM </div> 
</div>
        <div {playlist-voting-dynamic-container}>    
            <img src="https://i.postimg.cc/PxJzdTVr/on-air.gif" alt="on-air" style="max-width: 30%;height:auto;margin: auto;">
            <div style="font-size: 30px; font-family: ''Fredericka the Great'', cursive;">Tune Radio To: <br />**.* FM </div> 
</div>
	</div>
<div {jukebox-dynamic-container}>
	<div class="body_text" id="intro-text">
<!-- This section is what shows what is currently playing Don''t delete -->
     <div class="rf-titles"> 
    On Now:
</div>
<div class= "playing-now">
    {NOW_PLAYING}
</div>
    <p class="rf-titles">Next Up:</p>
    <div style="text-align: center; color: white; font-size: 20px; font-family: ''Rock Salt'', cursive;">
        {NEXT_PLAYLIST}
    </div>
        <div class="jukebox-queue-container">
            {JUKEBOX_QUEUE}
        </div>
	</div>
    </div>  
<div {playlist-voting-dynamic-container}>
	<div class="body_text" id="intro-text">
<!-- This section is what shows what is currently playing Don''t delete -->

    <div class="rf-titles"> 
    On Now:
</div>

<div class= "playing-now">
    {NOW_PLAYING}
</div>
</div>
    </div>
    	<div>
		<img src="https://iili.io/FvcY2j.png" alt="xmas-holly" style="max-width: 100%; height: auto;margin: auto;"> 
	</div>
</div>
<!-- ######### BODY & NOW PLAYING AREAS ######### -->
	

<div id="bodyarea">


<!-- This section will display a message if your show isn''t
playing a scheduled playlist-->

<div {after-hours-message}>
    <div class="after-hours">
        Show Hours: <br />
        <div style="font-size: 20px; font-family: ''Comfortaa'', cursive;">
        Show Starts November 25th <br />
        Sun - Thurs | Sunset to 10 P.M. <br />
        Fri - Sat | Sunset to 11 P.M.
        <br />
        <br />
        </div>
    </div>
</div>
 
<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->	

<!-- This section is used for the instructions that you want if you are using the Jukebox mode. 
If you are using the voting mode, then it will not show.
Note that you can use the {QUEUE_SIZE} in your instructions, You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<div class="body_text" id="instructional-text" {jukebox-dynamic-container}>
    <H2>Jukebox Player</H2> 
    Select any song that you would like to hear from the list below.
    Requests are limited to {QUEUE_DEPTH}
    songs and will be played in the order that they are selected. <br />
    <br />
</div>
 
<!-- This section is used for the instructions that you want if you are using the Voting mode. 
If you are using the jukebox mode, then it will not show.
You shouldn''t delete this if you are using the voting mode
because you might change your mind later.
Modify this to provide the instructions you want for your audience-->

<div class="body_text" id="instructional-text" {playlist-voting-dynamic-container}>
    <H2>Voting is Open</H2> 
    Vote for your favorite song from the list below. Your vote will be added to the 
    song you choose. <br />
    The song with the most votes will play 
    next!<br />
    **Other voting info such as one vote per round or vote resets** <br />
    <br />
</div>

<!-- *****************************************
    The sections below are for the error messages, don''t delete them!
    ************************************* -->

<div id="requestSuccessful" style="display: none">
  <div class="innerRequestSuccessful">
    HO HO HO <br />
    You''re on the NICE LIST!
  </div>
</div>

<div id="requestFailed" style="display: none">
  <div class="failed_Info_Box">
    RUDOLPH IS MISSIMG <br />
    An unexpected error has occured!
  </div>
</div>

<div id="requestPlaying" style="display: none">
  <div class="failed_Info_Box">
    GREAT TASTE <br />
    The selected song is already requested!
  </div>
</div>

<div id="queueFull" style="display: none">
  <div class="failed_Info_Box">
    SANTA''S LIST IS FULL <br />
    We''ve reached the maximum of {QUEUE_DEPTH} requests
  </div>
</div>

<div id="invalidLocation" style="display: none">
  <div class="failed_Info_Box">
    YOU''RE NOT FROM AROUND HERE <br />
    Did you allow your location?
  </div>
</div>
    
<div id="invalidLocationCode" style="display: none">
  <div class="failed_Info_Box">
    YOU''RE NOT FROM AROUND HERE <br />
    Did you enter the location code correctly?
  </div>
</div>

<div id="alreadyVoted" style="display: none">
  <div class="failed_Info_Box">
    DON''T BE A GRINCH <br />
    You can only vote once per round.
  </div>
</div>

<!-- end of error messages -->
</div>

<!-- ######### FOOTER #########-->
<div {playlist-voting-dynamic-container}>
    <div id="footer">
<div style="background: url(''https://i.postimg.cc/3NgFJS1R/bulbs.png'') repeat-x center top; background-size: auto 100%; height: 54px;"></div>
<!-- The section below will only display if your show is set for Voting mode, there
is no need to delete it if you are using the Jukebox mode, and you might change your
mind on the selection method later! -->  
        <br />

	<div class="rtable">
        <div class="cell-vote-playlist" style="font-family: ''Fredericka the Great'', cursive;border: none; cursor: text">
            <H2>Pick Below</H2>
        </div>
        <div class="cell-vote" style="font-family: ''Fredericka the Great'', cursive;border: none; cursor: text">
            <H2>Votes</H2>
        </div>
    </div>
    <div class="rtable">
        {PLAYLISTS}
    </div>
        <br />
        <br />
</div>
</div>
<!-- The section below will only display if your show is set for Jukebox mode, there
is no need to delete it if you are using the Voting mode, and you might change your
mind on the selection method later! -->

<div {playlist-standard-dynamic-container}>
<div id="footer">
<div style="background: url(''https://i.postimg.cc/3NgFJS1R/bulbs.png'') repeat-x center top; background-size: auto 100%; height: 54px;"></div>
    <br />
	<div id="playlists_container">
		{PLAYLISTS}
    </div>
        <br />remo
        <br />
</div>
</div>

<div id="header">
    <br /> <div style="text-align: center; color: white; font-size: 1.2em; font-family: ''Rock Salt'', cursive;">**Some show info if you want**</div> <br />
	<a href="http://xlights.org/">XLights</a> | <a href="https://remotefalcon.com/">Remote Falcon</a> | <a href="https://www.pixelcontroller.com/">Falcon</a>
    <br />
    <br />
</div>

<!-- ######### SNOW #########-->
<div class="snow" />
<style>
.editor-stage .snow {
  height:50px;
  background: #fff;
}
.snow{
  position:fixed;
  pointer-events:none;
  top:0;
  left:0;
  right:0;
  bottom:0;
  height:100vh;
  background: none;
  background-image: url(''https://i.postimg.cc/BjdCWj0c/s1.png''), url(''https://i.postimg.cc/VrwB625J/s2.png''), url(''https://i.postimg.cc/JyZ5RR7w/s3.png'');
  z-index:100;
  -webkit-animation: snow 10s linear infinite;
  -moz-animation: snow 10s linear infinite;
  -ms-animation: snow 10s linear infinite;
  animation: snow 10s linear infinite;
}
@keyframes snow {
  0% {background-position: 0px 0px, 0px 0px, 0px 0px;}
  50% {background-position: 500px 500px, 100px 200px, -100px 150px;}
  100% {background-position: 500px 1000px, 200px 400px, -100px 300px;}
}
@-moz-keyframes snow {
  0% {background-position: 0px 0px, 0px 0px, 0px 0px;}
  50% {background-position: 500px 500px, 100px 200px, -100px 150px;}
  100% {background-position: 400px 1000px, 200px 400px, 100px 300px;}
}
@-webkit-keyframes snow {
  0% {background-position: 0px 0px, 0px 0px, 0px 0px;}
  50% {background-position: 500px 500px, 100px 200px, -100px 150px;}
  100% {background-position: 500px 1000px, 200px 400px, -100px 300px;}
}
@-ms-keyframes snow {
  0% {background-position: 0px 0px, 0px 0px, 0px 0px;}
  50% {background-position: 500px 500px, 100px 200px, -100px 150px;}
  100% {background-position: 500px 1000px, 200px 400px, -100px 300px;}
}
</style>', 'Y');
