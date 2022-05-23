import ButtonBase from '@components/Button/ButtonBase';
import { ChapterProps, ChapterRef } from '@components/Chapter/Chapter.interfaces';
import Flex from '@components/Flex';
import { Typography } from '@components/Typography';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { format } from 'date-fns';
import { persistor } from '@redux/store';
import { Container } from '@components/Container';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import Spacer from '@components/Spacer';
import { ChapterContainer } from '@components/Chapter/Chapter.base';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import Animated from 'react-native-reanimated';
import displayMessage from '@utils/displayMessage';
import Progress from '@components/Progress';
import * as FileSystem from 'expo-file-system';
import useMountedEffect from '@hooks/useMountedEffect';
import useMangaSource from '@hooks/useMangaSource';
import PageDownloadingProgress from './components/PageDownloadingProgress';
import Button from '@components/Button';
import { DownloadStatus } from '@utils/DownloadManager/DownloadManager.interfaces';
import DownloadManager from '@utils/DownloadManager/DownloadManager';
import ChapterSkeleton from '@components/Chapter/Chapter.skeleton';
import { useChapterContext } from '@context/ChapterContext';
import Checkbox from '@components/Checkbox/Checkbox';

const displayChapterInfo = (chapter: any) => {
  if (MangaValidator.hasDate(chapter)) {
    return (
      <>
        <Spacer y={1} />
        <Typography variant='body2' color='textSecondary'>
          {format(Date.parse(chapter.date), 'MM/dd/yyyy')}
        </Typography>
      </>
    );
  }
  return null;
};

const Chapter: React.ForwardRefRenderFunction<ChapterRef, ChapterProps> = (props, ref) => {
  const { chapter } = props;
  const [mode, setMode] = useChapterContext();
  const source = useMangaSource(chapter.sourceName);
  function handleOnPress() {
    switch (mode) {
      case 'normal':
        console.log(`Normal action for ${chapter.link}`);
        break;
      case 'selection':
        setChecked((prev) => !prev);
        break;
    }
  }
  const dir =
    FileSystem.documentDirectory + `Mangas/${chapter.mangaName}/${chapter.name ?? `Chapter ${chapter.index}`}/`;

  const downloadManager = React.useRef<DownloadManager>(DownloadManager.of(chapter, dir, source)).current;

  const [downloadStatus, setDownloadStatus] = React.useState<DownloadStatus>(DownloadStatus.VALIDATING);
  const shouldBlockDownload = React.useRef<boolean>(false);
  const [totalProgress, setTotalProgress] = React.useState<number>(downloadManager.getProgress());
  const [checked, setChecked] = React.useState<boolean>(false);

  const listener = React.useRef<NodeJS.Timer>();
  const style = useAnimatedMounting();
  const isDownloading = React.useMemo(
    () => downloadStatus === DownloadStatus.RESUME_DOWNLOADING || downloadStatus === DownloadStatus.START_DOWNLOADING,
    [downloadStatus]
  );

  function handleOnLongPress() {
    switch (mode) {
      case 'normal':
        setMode('selection');
        break;
      case 'selection':
        setMode('normal');
        break;
    }
  }

  function resumeDownload() {
    setDownloadStatus(DownloadStatus.RESUME_DOWNLOADING);
  }

  function pauseDownload() {
    setDownloadStatus(DownloadStatus.PAUSED);
  }

  function cancelDownload() {
    setDownloadStatus(DownloadStatus.CANCELLED);
  }

  function startDownload() {
    setDownloadStatus(DownloadStatus.START_DOWNLOADING);
  }

  function queueForDownload() {
    if (downloadStatus !== DownloadStatus.DOWNLOADED) {
      downloadManager.queue();
      setDownloadStatus(DownloadStatus.QUEUED);
    }
  }

  React.useImperativeHandle(ref, () => ({
    toggleCheck: () => {
      setChecked((prev) => !prev);
    },
    downloadAsync: async () => {
      shouldBlockDownload.current = true;
      setDownloadStatus(DownloadStatus.START_DOWNLOADING);
      await downloadManager.download();
    },
    download: startDownload,
    pause: pauseDownload,
    cancel: cancelDownload,
    resume: resumeDownload,
    queue: queueForDownload,
    getStatus: () => downloadStatus,
    getURL: () => chapter.link,
  }));

  React.useEffect(() => {
    (async () => {
      try {
        const downloaded = await downloadManager.isDownloaded();
        const initialStatus = downloaded ? DownloadStatus.DOWNLOADED : downloadManager.getStatus();
        setDownloadStatus(initialStatus);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  React.useEffect(() => {
    switch (downloadStatus) {
      case DownloadStatus.RESUME_DOWNLOADING:
      case DownloadStatus.DOWNLOADING:
      case DownloadStatus.START_DOWNLOADING:
        listener.current = setInterval(async () => setTotalProgress(downloadManager.getProgress()), 500);
        return () => {
          clearInterval(listener.current);
        };
    }
  }, [downloadStatus]);

  useMountedEffect(() => {
    (async () => {
      switch (downloadStatus) {
        case DownloadStatus.CANCELLED:
          setTotalProgress(0);
          await downloadManager.cancel();
          break;
        case DownloadStatus.PAUSED:
          clearTimeout(listener.current);
          await downloadManager.pause();
          break;
        case DownloadStatus.RESUME_DOWNLOADING:
          await downloadManager.resume();
          break;
        case DownloadStatus.START_DOWNLOADING:
          if (shouldBlockDownload.current) {
            await downloadManager.download();
            return () => {
              clearInterval(listener.current);
            };
          } else shouldBlockDownload.current = false;
      }
    })();
  }, [downloadStatus]);

  React.useEffect(() => {
    return () => {
      clearTimeout(listener.current);
    };
  }, []);

  useMountedEffect(() => {
    if (totalProgress >= 1) {
      setDownloadStatus(DownloadStatus.DOWNLOADED);
      setTotalProgress(0);
      clearInterval(listener.current);
    }
  }, [totalProgress]);

  // return <ChapterSkeleton />;

  return (
    <>
      <Animated.View style={style}>
        <ButtonBase square onPress={handleOnPress} onLongPress={handleOnLongPress}>
          <ChapterContainer>
            <Flex justifyContent='space-between' alignItems='center'>
              <Flex direction='column'>
                <Typography bold>{chapter.name}</Typography>
                {displayChapterInfo(chapter)}
              </Flex>
              {mode === 'normal' ? (
                <Flex alignItems='center'>
                  {totalProgress > 0 && totalProgress < 1 && (
                    <>
                      <Typography variant='bottomtab' color='secondary'>
                        {(totalProgress * 100).toFixed(2)}%
                      </Typography>
                      <Spacer x={1} />
                      {isDownloading && (
                        <IconButton
                          icon={<Icon bundle='MaterialCommunityIcons' name='pause-circle-outline' />}
                          onPress={pauseDownload}
                        />
                      )}

                      {downloadStatus === DownloadStatus.PAUSED && (
                        <IconButton
                          icon={<Icon bundle='MaterialCommunityIcons' name='play-circle-outline' />}
                          onPress={resumeDownload}
                        />
                      )}
                      <IconButton
                        icon={<Icon bundle='MaterialCommunityIcons' name='close-circle-outline' />}
                        onPress={cancelDownload}
                      />
                    </>
                  )}
                  {downloadStatus === DownloadStatus.DOWNLOADED && (
                    <>
                      <Icon
                        bundle='MaterialCommunityIcons'
                        name='check-circle-outline'
                        color='secondary'
                        size='small'
                      />
                      <Spacer x={1.3} />
                    </>
                  )}
                  {(downloadStatus === DownloadStatus.IDLE || downloadStatus === DownloadStatus.CANCELLED) && (
                    <IconButton
                      icon={<Icon bundle='Feather' name='download' />}
                      color='primary'
                      onPress={startDownload}
                    />
                  )}
                  {downloadStatus === DownloadStatus.QUEUED && (
                    <>
                      <Typography color='secondary' variant='bottomtab'>
                        Queued
                      </Typography>
                    </>
                  )}
                  {(isDownloading || downloadStatus === DownloadStatus.VALIDATING) && (
                    <>
                      <Spacer x={1} />
                      <Progress color='disabled' />
                      <Spacer x={1.1} />
                    </>
                  )}
                </Flex>
              ) : (
                <Checkbox checked={checked} onChange={setChecked} />
              )}
            </Flex>
          </ChapterContainer>
        </ButtonBase>
      </Animated.View>
    </>
  );
};

export default React.memo(React.forwardRef(Chapter));
