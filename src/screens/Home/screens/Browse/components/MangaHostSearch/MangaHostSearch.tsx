import { Category, Flex, Icon, IconButton, Placeholder, Typography, Spacer } from '@components/core';
import useAPICall from '@hooks/useAPICall';
import useMountedEffect from '@hooks/useMountedEffect';
import {
  keyExtractor,
  renderItem,
} from '@screens/Home/screens/Browse/components/MangaHostSearch/MangaHostSearch.flatlist';
import { MangaHostSearchProps } from '@screens/Home/screens/Browse/components/MangaHostSearch/MangaHostSearch.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import { withAnimatedMounting } from '@utils/Animations';
import React from 'react';

const MangaHostSearch: React.FC<MangaHostSearchProps> = (props) => {
  const { host, query } = props;
  const {
    state: [mangas, setMangas],
    loading,
    error,
  } = useAPICall(() => host.search(query), [query]);

  return (
    <Flex direction='column'>
      <Category.Header>
        <Typography variant='subheader'>{host.getName()}</Typography>
        {mangas && mangas.length > 10 && <IconButton icon={<Icon bundle='Feather' name='arrow-right' />} />}
      </Category.Header>
      <Spacer y={2} />
      {loading ? (
        <Category.Header>
          <Placeholder.MangaComponent />
        </Category.Header>
      ) : error ? (
        <Typography>{error}</Typography>
      ) : (
        <Category.FlatList horizontal data={mangas} renderItem={renderItem} keyExtractor={keyExtractor} />
      )}
    </Flex>
  );
};

export default React.memo(withAnimatedMounting(MangaHostSearch));
