import { render, screen } from '@testing-library/react'
import Options from '../Options'
import { expect, test } from 'vitest'

test('displays image for each scoop from server', () => {
    render(<Options optionType='scoops'/>)

    // find images
    const scoopImages = screen.getAllByRole('img', {
        name: /scoop$/i
    })
    expect(scoopImages).toHaveLength(2)

    // confirm alt text of images
    const altText = scoopImages.map((ele) => ele.alt)
    expect(altText).toEqual(['Vanilla scoop', 'Chocolate scoop'])
})
