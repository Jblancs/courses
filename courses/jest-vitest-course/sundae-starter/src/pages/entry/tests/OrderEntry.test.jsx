import { render, screen, logRoles } from '@testing-library/react'
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

    const {container} = render(<OrderEntry />)

    const alerts = await screen.findAllByRole('alert')

    logRoles(container)

    expect(alerts).toHaveLength(2)
})
