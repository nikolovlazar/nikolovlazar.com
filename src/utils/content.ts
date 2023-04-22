import getReadingTime from 'reading-time'
import { getCollection, type CollectionEntry } from 'astro:content'
import { toString } from 'mdast-util-to-string'

import type { collections } from '../content/config'

type Collections = keyof typeof collections

export const remarkReadingTime = () => {
    return function(tree, { data }) {
        const textOnPage = toString(tree)
        const readingTime = getReadingTime(textOnPage)

        data.astro.frontmatter.estReadingTime = readingTime.minutes
    }
}

type HomepageCollectionResult<C extends Collections> = [boolean, CollectionEntry<C>[]];
export const getHomepageCollection = async <C extends Collections>(name: C): Promise<HomepageCollectionResult<C>> => {
    const allItems = await getCollection(name) as unknown as Array<CollectionEntry<C>>
    const hasMoreItems = allItems.length > 3;
    // @ts-ignore
    const items = allItems.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).slice(0, 3);

    return [hasMoreItems, items];
}
