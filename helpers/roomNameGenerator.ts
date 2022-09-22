const getRoomName = (lastestName?: string) => {
  if (!lastestName) return 'A'
  if (lastestName === 'Z') return 'A1'
  const unicodeAlphabetStart = 65
  const aphabetCodes = Array.from(Array(26)).map((code, i) => i + unicodeAlphabetStart)
  const alphabet = aphabetCodes.map((x) => String.fromCharCode(x))

  const receivedSingleLetter = lastestName.length === 1

  if (receivedSingleLetter) {
    const letterIndex = alphabet.indexOf(lastestName)
    return alphabet[letterIndex + 1]
  } else {
    const number = Number(lastestName.substring(1))
    if (lastestName[0] === 'Z') return `A${number + 1}`

    const letterIndex = alphabet.indexOf(lastestName[0])
    return `${alphabet[letterIndex + 1]}${number}`
  }
}

export default getRoomName
