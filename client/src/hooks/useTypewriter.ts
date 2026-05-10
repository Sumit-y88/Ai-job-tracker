import { useEffect, useState } from 'react'

export function useTypewriter(text: string, delay = 35) {
  const [displayText, setDisplayText] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setIsDone(false)

    if (!text) {
      setIsDone(true)
      return
    }

    const words = text.split(' ')
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex++
      setDisplayText(words.slice(0, currentIndex).join(' '))

      if (currentIndex >= words.length) {
        clearInterval(interval)
        setIsDone(true)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [text, delay])

  return { displayText, isDone }
}
