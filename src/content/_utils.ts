import { getCollection, type CollectionEntry } from 'astro:content'

import type { collections } from './config'

type Collections = keyof typeof collections

type HomepageCollectionResult<C extends Collections> = [boolean, CollectionEntry<C>[]];
export const getHomepageCollection = async <C extends Collections>(name: C): Promise<HomepageCollectionResult<C>> => {
    const allItems = await getCollection(name) as unknown as Array<CollectionEntry<C>>
    const hasMoreItems = allItems.length > 3;
    // @ts-ignore
    const items = allItems.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).slice(0, 3);

    return [hasMoreItems, items];
}
