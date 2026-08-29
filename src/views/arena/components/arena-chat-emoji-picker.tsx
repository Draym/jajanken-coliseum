'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {useEffect, useRef} from 'react'

type EmojiSelection = {
    native?: string
}

type ArenaChatEmojiPickerProps = {
    onSelect: (emoji: string) => void
    onClose: () => void
}

export default function ArenaChatEmojiPicker({onSelect, onClose}: ArenaChatEmojiPickerProps) {
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                onClose()
            }
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [onClose])

    return (
        <div
            ref={rootRef}
            className="arena-emoji-picker absolute bottom-[calc(100%+0.5rem)] right-0 z-30 overflow-hidden rounded-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
            role="dialog"
            aria-label="Emoji picker"
        >
            <Picker
                data={data}
                theme="dark"
                previewPosition="none"
                skinTonePosition="search"
                navPosition="bottom"
                searchPosition="sticky"
                perLine={8}
                emojiSize={20}
                emojiButtonSize={32}
                maxFrequentRows={1}
                onEmojiSelect={(emoji: EmojiSelection) => {
                    if (!emoji.native) return
                    onSelect(emoji.native)
                }}
            />
        </div>
    )
}
