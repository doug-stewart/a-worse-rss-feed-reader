import DOMPurify from 'dompurify';

import { isImageUrl } from './isImageUrl';

import type { ArticleObj } from '@/types';

export const fetchMissingInfo = async (article: ArticleObj): Promise<ArticleObj> => {
    const { url, raw } = article;
    let { body, cover, summary } = article;

    try {
        const page = await fetch(url)
            .then((response) => response.text())
            .catch((error) => {
                throw new Error(error);
            });

        // We only care about content that might include an image, so social meta tags, img tags, video tags and their related attributes
        const dom = DOMPurify.sanitize(page, {
            ALLOWED_ATTR: ['content', 'height', 'name', 'poster', 'property', 'src', 'width'],
            ALLOWED_TAGS: ['meta', 'img', 'video'],
            RETURN_DOM: true,
            WHOLE_DOCUMENT: true,
        }) as HTMLElement;

        const description =
            dom
                .querySelector('meta[property="og:description"], meta[name="description"]')
                ?.getAttribute('content') || '';

        if (summary === '' && description !== '') {
            summary = description;
        }

        if (body === '' && description !== '') {
            body = description;
        }

        if (cover === '') {
            // If the page has a social media image that's our best bet
            const socialImg = dom
                .querySelector(
                    '[property="og:image:secure_url"], [property="og:image"], [name="twitter:image:src"]',
                )
                ?.getAttribute('content');

            // DOMPurify ignores certain attributes regardless of settings so look for any meta tag contianing an image as a backup
            const metaImgs = [...dom.querySelectorAll('meta[content]')]
                .filter((meta) => isImageUrl(meta.getAttribute('content') || ''))
                .at(0)
                ?.getAttribute('content');

            // But we can also use what appears to be the largest image on the page
            const pageImgs = [...dom.querySelectorAll('img[height][width]')]
                .reduce((current, challenger) => {
                    const challengerSize =
                        parseInt(challenger.getAttribute('height') || '1') *
                        parseInt(challenger.getAttribute('width') || '1');
                    const currentSize =
                        parseInt(current?.getAttribute('height') || '1') *
                        parseInt(current?.getAttribute('width') || '1');
                    return challengerSize > currentSize ? challenger : current;
                }, dom.querySelector('img[height][width]'))
                ?.getAttribute('src');

            cover = socialImg || metaImgs || pageImgs || '';
        }
    } catch (error) {
        console.error('Failed to fetch full page:', url, error);
        return article;
    }

    if (cover === '') {
        // Last ditch effort to find a cover image, just grab anything vaguely image-like from the page and the first one wins
        const srcOptions = raw.match(/(?<=src=("|')).*?(?=("|'))/g) || [];
        const posterOptions = raw.match(/(?<=poster=("|')).*?(?=("|'))/g) || [];
        const urlOptions = raw.match(/(?<=("|')url("|'):("|')).*?(?=("|'))/g) || [];

        const options = [...srcOptions, ...posterOptions, ...urlOptions];
        const filtered = options?.filter((option) => isImageUrl(option));

        cover = filtered?.at(0) || '';
    }

    // On the chance they don't use absolute URLs, just fix that for them.
    if (cover && cover !== '' && !cover.startsWith('http')) {
        cover = `${new URL(article.url).origin}/${cover.startsWith('/') ? cover.slice(1) : cover}`;
    }

    return { ...article, body: body, cover: cover, summary: summary };
};
