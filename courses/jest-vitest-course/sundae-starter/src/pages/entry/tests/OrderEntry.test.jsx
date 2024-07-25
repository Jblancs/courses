import { render, screen } from '../../../test-utils/testing-library-utils'
import OrderEntry from '../OrderEntry'
import { expect, test } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../../mocks/server'

const link = 'http://localhost:3030'

test('handles errors for scoops and toppings routes', async () => {
    server.resetHandlers(
        http.get(`${link}/scoops`, () => {
            return new HttpResponse(null, {status: 500})
        }),
        http.get(`${link}/toppings`, () => {
            return new HttpResponse(null, {status: 500})
        })
    )

    render(<OrderEntry />)

    const alerts = await screen.findAllByRole('alert')

    expect(alerts).toHaveLength(2)
})
