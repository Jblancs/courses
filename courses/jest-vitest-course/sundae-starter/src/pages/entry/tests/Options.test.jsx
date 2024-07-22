import { render, screen } from '@testing-library/react'
import Options from '../Options'
import { expect, test } from 'vitest'

test('displays image for each scoop from server', async () => {
    render(<Options optionType='scoops'/>)

    // find images
    const scoopImages = await screen.findAllByRole('img', {
        name: /scoop$/i
    })
    expect(scoopImages).toHaveLength(2)

    // confirm alt text of images
    const altText = scoopImages.map((ele) => ele.alt)
    expect(altText).toEqual(['Vanilla scoop', 'Chocolate scoop'])
})

test('displays image for each topping from server', async () => {
    render(<Options optionType={'toppings'}/>)

    // find images
    const toppingImages = await screen.findAllByRole('img', {
        name: /topping$/i
    })

    expect(toppingImages).toHaveLength(2)

    // confirm alt images
    const altText = toppingImages.map((ele) => ele.alt)
    expect(altText).toEqual(['M&Ms topping', 'Hot fudge topping'])
})
