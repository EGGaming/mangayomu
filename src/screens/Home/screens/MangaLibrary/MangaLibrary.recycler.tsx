import { Container } from '@components/Container';
import Manga from '@components/Manga';
import { calculateCoverWidth, calculateCoverHeight } from '@components/Manga/Cover/Cover.helpers';
import { LibraryManga } from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
import { MangaInLibrary } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { Dimensions } from 'react-native';
import { LayoutProvider } from 'recyclerlistview';
const { width } = Dimensions.get('window');

export const LayoutLibraryMangaType = {
  FIRST: 0,
  LAST: 1,
  INBETWEEN: 2,
};

export const dataProviderFn = (r1: LibraryManga, r2: LibraryManga) => r1.manga.title === r2.manga.title;

export const generateNewLayout = (cols: number, fontSize: number) => {
  const spacing = SPACE_MULTIPLIER * 2;
  const totalMangasPerRow = width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + spacing);
  const maxMangasPerRow = Math.floor(totalMangasPerRow);
  return new LayoutProvider(
    (i) => {
      if (i % maxMangasPerRow === 0) return LayoutLibraryMangaType.FIRST;
      return LayoutLibraryMangaType.INBETWEEN;
    },
    (type, dim) => {
      const containerWidth = calculateCoverWidth(cols) * SPACE_MULTIPLIER + spacing;
      const totalMangasPerRow = width / containerWidth;
      const maxMangasPerRow = Math.floor(totalMangasPerRow);
      const marginLeft = (width - containerWidth * maxMangasPerRow) / 2;
      switch (type) {
        case LayoutLibraryMangaType.FIRST:
          dim.width = containerWidth + marginLeft;
          break;
        default:
          dim.width = containerWidth;
          break;
      }
      dim.height = calculateCoverHeight(cols) * SPACE_MULTIPLIER + fontSize * 5;
    }
  );
};

export const rowRenderer: RowRenderer = (type, data: LibraryManga) => {
  switch (type) {
    case LayoutLibraryMangaType.FIRST:
      return <MangaInLibrary manga={data.manga} first />;

    default:
    case LayoutLibraryMangaType.INBETWEEN:
      return <MangaInLibrary manga={data.manga} />;
  }
};
