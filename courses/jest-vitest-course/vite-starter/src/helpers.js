export function kebabCaseToTitleCase(colorName) {
    const colorWithSpaces = colorName.replaceAll("-", " ")
    console.log(colorWithSpaces)
    const colorWithCaps = colorWithSpaces.replace(/\b([a-z])/g, (match) => match.toUpperCase())
    console.log(colorWithCaps)
    return colorWithCaps
}
