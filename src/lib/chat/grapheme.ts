/**
 * Truncate by user-perceived characters so emoji (incl. ZWJ sequences) stay intact.
 */
export function truncateByGrapheme(value: string, maxLength: number) {
    if (maxLength <= 0 || value.length === 0) return ''

    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
        const segmenter = new Intl.Segmenter(undefined, {granularity: 'grapheme'})
        let result = ''
        let count = 0
        for (const {segment} of segmenter.segment(value)) {
            if (count >= maxLength) break
            result += segment
            count += 1
        }
        return result
    }

    return Array.from(value).slice(0, maxLength).join('')
}

export function countGraphemes(value: string) {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
        const segmenter = new Intl.Segmenter(undefined, {granularity: 'grapheme'})
        return [...segmenter.segment(value)].length
    }
    return Array.from(value).length
}
