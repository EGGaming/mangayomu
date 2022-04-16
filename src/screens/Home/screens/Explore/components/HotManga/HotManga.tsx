import { Button, Category, Icon, Spacer, Typography } from '@components/core';
import Flex from '@components/Flex';
import useAPICall from '@hooks/useAPICall';
import { keyExtractor, renderItem } from '@screens/Home/screens/Explore/components/HotManga/HotManga.flatlist';
import { useMangaSource } from '@services/scraper';
import React from 'react';

const HotManga: React.FC = (props) => {
  const {} = props;
  const source = useMangaSource();
  const {
    state: [mangas, setMangas],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.listHotMangas());

  return (
    <Flex direction='column'>
      <Category.Header>
        <Typography variant='subheader'>
          Trending manga <Icon bundle='MaterialCommunityIcons' name='fire' color='secondary' />
        </Typography>
        <Button title='View All' />
      </Category.Header>
      <Spacer y={1} />
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography>{error}</Typography>
      ) : (
        <Category.FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          data={mangas}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      )}
    </Flex>
  );
};

export default HotManga;