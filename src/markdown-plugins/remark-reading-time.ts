import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

export default function remarkReadingTime() {
    return function(tree, { data }) {
        const textOnPage = toString(tree)
        const readingTime = getReadingTime(textOnPage)

        data.astro.frontmatter.estReadingTime = readingTime.minutes
    }
}

