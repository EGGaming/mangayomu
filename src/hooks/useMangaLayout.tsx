import { AppState } from '@redux/store';
import { generateNewLayout, LayoutLibraryMangaType } from '@screens/Home/screens/MangaLibrary/MangaLibrary.recycler';
import { MangaInLibrary } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { Manga } from '@services/scraper/scraper.interfaces';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { useSelector } from 'react-redux';

const rowRenderer: RowRenderer = (type, data: Manga) => {
  switch (type) {
    case LayoutLibraryMangaType.FIRST:
      return <MangaInLibrary manga={data} first />;

    default:
    case LayoutLibraryMangaType.INBETWEEN:
      return <MangaInLibrary manga={data} />;
  }
};

/**
 * Hook to automatically use a manga layout provider
 * @returns Returns the layout for a list of mangas
 */
export default function useMangaLayout() {
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  return {
    layoutProvider: generateNewLayout(cols, fontSize),
    rowRenderer,
  };
}