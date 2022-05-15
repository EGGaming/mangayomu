import { digitsOnly, extractChapterTitle, parseTimestamp } from '@services/MangaPark_v3/MangaPark_v3.helpers';
import { MangaParkV3MangaMeta } from '@services/MangaPark_v3/MangaPark_v3.interfaces';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { Manga, MangaChapter, MangaMultilingualChapter } from '@services/scraper/scraper.interfaces';
import { binary } from '@utils/Algorithms';
import { ISOLangCode, languages } from '@utils/languageCodes';
import { Cheerio, Element } from 'cheerio';
import { sub } from 'date-fns';
import { MangaParkV3Filter, MANGAPARKV3_INFO } from './MangaPark_v3.constants';

class MangaParkV3 extends MangaHostWithFilters<MangaParkV3Filter> {
  public getPages(chapter: MangaChapter): Promise<string[]> {
    return Promise.resolve([]);
  }
  public async search(query: string, filters?: MangaParkV3Filter): Promise<Manga[]> {
    const $ = await super.route(`/search?word=${encodeURIComponent(query)}&page=${super.getPage()}`);
    const listElements = $('div#search-list').children();
    return listElements
      .map((_, el) => {
        return {
          link: `https://${super.getLink()}${$(el).find('a').attr('href')!}`,
          imageCover: $(el).find('img').attr('src')!,
          source: super.getName(),
          title: $(el).children('div').children('a').text().trim(),
        } as Manga;
      })
      .get();
  }
  public async getMeta(manga: Manga): Promise<MangaParkV3MangaMeta> {
    const $ = await super.route({ url: manga.link });

    const englishChapters = $('div.d-flex.mt-5:contains("English Chapters")').next().find('div.episode-item');

    const englishChapterAnchorElements = englishChapters
      .find('div.d-flex.align-items-center > a.ms-3.visited[href^="/comic/"]')
      .map((_, el) => ({
        name: $(el).text(),
        link: 'https://' + super.getLink() + $(el).attr('href'),
      }))
      .get();

    const englishChapterDates = englishChapters.find('i.text-nowrap').map((_, el) => {
      const txt = $(el).text();
      return parseTimestamp(txt);
    });

    const englishChapterObjects: MangaMultilingualChapter[] = englishChapterAnchorElements.map(
      ({ link, name }, i) =>
        ({
          link,
          name,
          index: i,
          date: englishChapterDates[i],
          language: 'en',
        } as MangaMultilingualChapter)
    );

    const multilingualEpisodeItemElements = $(
      'div.align-items-center.d-flex.mt-5.justify-content-between:contains("Multilingual Chapters")'
    )
      .next()
      .find('div.scrollable-panel > div#chap-index > div.episode-item');

    const multilingualChapterTitles = multilingualEpisodeItemElements
      .find('div.align-items-center.d-flex:not(.flex-nowrap) > a')
      .map((_, el) => extractChapterTitle($(el).text()))
      .get();

    const multilingualChapterDates = multilingualEpisodeItemElements
      .find('div.flex-nowrap > i.text-nowrap')
      .map((_, el) => $(el).text())
      .get();

    const referenceMultilingualChapter: Record<string, { title: string; dateUpdated: string }> =
      multilingualChapterTitles.reduce((prev, curr, i) => {
        const chapterNum = curr.substring(curr.lastIndexOf(' ') + 1);
        return {
          ...prev,
          [chapterNum]: {
            title: curr,
            dateUpdated: multilingualChapterDates[i],
          },
        };
      }, {});

    const multilingualChapterObjects: MangaMultilingualChapter[] = multilingualEpisodeItemElements
      .find('div.d-flex.flex-fill[style="height: 24px;"] > div > div > a')
      .map((i, el) => {
        const href: string = $(el).attr('href')!;
        const { title, dateUpdated } =
          referenceMultilingualChapter[digitsOnly(href.substring(href.lastIndexOf('/') + 1, href.lastIndexOf('-')))];
        const isoCode = href.substring(href.lastIndexOf('-') + 1, href.lastIndexOf('-') + 3);

        return {
          name: `${title} (${languages[isoCode as ISOLangCode].name})`,
          language: isoCode,
          date: dateUpdated,
          link: 'https://' + super.getLink() + href,
        } as MangaMultilingualChapter;
      })
      .get();

    const genres = $('b.text-muted:contains("Genres:")')
      .siblings('span')
      .text()
      .trim()
      .split(/\n\s+,\s+/);

    const ratingValue = parseFloat($('div.rating-display > div > b').text());

    return {
      description:
        $('div#limit-height-body-descr')
          .children('div.limit-html')
          .html()
          ?.replace(/<br[^>]*>/gi, '\n') ?? 'This manga has no description.',
      genres,
      rating: {
        value: !Number.isNaN(ratingValue) ? ratingValue : 'N/A',
        voteCount: parseInt(
          $('div.rating-display > div > div > div.rate-star').siblings('small').text().replace(/\D/g, '')
        ),
      },
      status: {
        publish: $('b.text-muted:contains("Official status:")').siblings().text(),
      },
      chapters: [...englishChapterObjects, ...multilingualChapterObjects],
    };
  }
}

export default new MangaParkV3(MANGAPARKV3_INFO);
