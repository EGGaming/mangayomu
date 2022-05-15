import {
  Flex,
  Spacer,
  IconButton,
  Icon,
  Header,
  Progress,
  Container,
  Modal,
  Typography,
  SortTypeItem,
  List,
} from '@components/core';
import useAPICall from '@hooks/useAPICall';

import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import MangaValidator from '@utils/MangaValidator';
import StatusIndicator from '@screens/MangaViewer/components/StatusIndicator';
import connector, { MangaViewerProps } from '@screens/MangaViewer/MangaViewer.redux';
import { MangaViewerContainer } from '@screens/MangaViewer/MangaViewer.base';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import { AnimatedProvider } from '@context/AnimatedContext';
import useLazyLoading from '@hooks/useLazyLoading';
import useSort from '@hooks/useSort';
import { MangaChapter, WithDate } from '@services/scraper/scraper.interfaces';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
import { ISOLangCode } from '@utils/languageCodes';
import { Linking, Share } from 'react-native';
const Genres = React.lazy(() => import('@screens/MangaViewer/components/Genres'));
const ChapterHeader = React.lazy(() => import('@screens/MangaViewer/components/ChapterHeader'));
const Title = React.lazy(() => import('@screens/MangaViewer/components/Title'));
const Description = React.lazy(() => import('@screens/MangaViewer/components/Description'));
const Authors = React.lazy(() => import('@screens/MangaViewer/components/Authors'));
const MangaCover = React.lazy(() => import('@screens/MangaViewer/components/MangaCover'));
const MangaAction = React.lazy(() => import('@screens/MangaViewer/components/MangaAction'));
const Overview = React.lazy(() => import('@screens/MangaViewer/components/Overview'));
const MangaRating = React.lazy(() => import('@screens/MangaViewer/components/MangaRating'));

const MangaViewer: React.FC<MangaViewerProps> = (props) => {
  const {
    route: {
      params: { manga },
    },
    navigation,
    viewManga,
    userMangaInfo,
    source,
  } = props;
  const {
    state: [meta],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.getMeta(manga));
  const [language, setLanguage] = React.useState<ISOLangCode>('en');
  const options: UseCollapsibleOptions = React.useMemo(
    () => ({
      navigationOptions: {
        header: Header,
        headerRight: () => (
          <>
            <IconButton
              icon={<Icon bundle='Feather' name='share-2' />}
              onPress={async () => {
                try {
                  await Share.share({
                    title: 'Share URL',
                    message: manga.link,
                    url: manga.link,
                  });
                } catch (e) {
                  alert(e);
                }
              }}
            />
            <IconButton
              icon={<Icon bundle='Feather' name='globe' />}
              onPress={() => {
                Linking.openURL(manga.link);
              }}
            />
          </>
        ),
        headerTitle: '',
      },
      config: {
        useNativeDriver: true,
      },
    }),
    [userMangaInfo?.inLibrary]
  );

  const { sort, visible, handleOnCloseModal, handleOnOpenModal, sortOptions, selectedSortOption } = useSort(
    (createSort) => ({
      Chapter: createSort((a: MangaChapter, b: MangaChapter) => (a.name && b.name ? a.index - b.index : 0)),
      ...(MangaValidator.hasDate(userMangaInfo?.chapters[0] ?? {})
        ? {
            'Date Released': createSort((a: WithDate, b: WithDate) => Date.parse(a.date) - Date.parse(b.date)),
          }
        : {}),
    }),
    'Chapter'
  );

  const collapsible = useCollapsibleHeader(options);
  const { ready, Fallback } = useLazyLoading();
  const loadingAnimation = useAnimatedLoading();
  const isAdult = React.useMemo(
    () => userMangaInfo && MangaValidator.isNSFW(userMangaInfo.genres),
    [userMangaInfo?.genres]
  );

  React.useEffect(() => {
    if (meta) {
      viewManga({ ...manga, ...meta });
    }
  }, [meta]);

  const sorted = React.useMemo(
    () => userMangaInfo?.chapters.sort(selectedSortOption as any),
    [userMangaInfo?.chapters, selectedSortOption]
  );

  if (ready) {
    return (
      <React.Suspense
        fallback={
          <Flex grow alignItems='center' justifyContent='center'>
            <Progress />
          </Flex>
        }>
        <AnimatedProvider style={loadingAnimation}>
          <Overview
            loading={loading}
            onChangeLanguage={setLanguage}
            chapters={sorted}
            language={language}
            currentChapter={userMangaInfo?.currentlyReadingChapter}
            collapsible={collapsible}>
            <MangaViewerContainer>
              <Flex container horizontalPadding={3} verticalPadding={0}>
                <MangaCover mangaCoverURI={manga.imageCover} title={manga.title} />
                <Spacer x={2} />
                <Flex direction='column' shrink>
                  <Title title={manga.title} isAdult={isAdult} />
                  <Authors
                    manga={manga}
                    authors={userMangaInfo && MangaValidator.hasAuthors(userMangaInfo) ? userMangaInfo.authors : null}
                  />
                  <Spacer y={1} />
                  <Genres genres={userMangaInfo?.genres} source={source} />
                  <Spacer y={1} />
                  <StatusIndicator meta={userMangaInfo} />
                  <MangaRating
                    {...(userMangaInfo && MangaValidator.hasRating(userMangaInfo)
                      ? { rating: { rating: userMangaInfo.rating } }
                      : { rating: null })}
                  />
                </Flex>
              </Flex>
              <MangaAction manga={manga} userMangaInfo={userMangaInfo} />

              <Description description={userMangaInfo?.description} />
              <Genres buttons genres={userMangaInfo?.genres} source={source} />
            </MangaViewerContainer>
            <ChapterHeader
              onChangeLanguage={setLanguage}
              language={language}
              refresh={refresh}
              chapters={meta?.chapters}
              sort={sort}
              handleOnOpenModal={handleOnOpenModal}
              loading={loading}
            />
            <Modal visible={visible} onClose={handleOnCloseModal}>
              <HeaderBuilder paper removeStatusBarPadding horizontalPadding verticalPadding>
                <Typography variant='subheader'>Sort Chapters</Typography>
              </HeaderBuilder>
              {sortOptions}
            </Modal>
          </Overview>
        </AnimatedProvider>
      </React.Suspense>
    );
  }
  return Fallback;
};

export default connector(MangaViewer);
