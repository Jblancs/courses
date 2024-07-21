import { http, HttpResponse } from 'msw'

const link = 'http://localhost:3030'

export const handlers = [
  // Intercept the "GET /resource" request.
  http.get(`${link}/scoops`, () => {
    return HttpResponse.json([
      {
        name: 'Vanilla',
        imagePath: '/images/vanilla.png',
      },
      {
        name: 'Chocolate',
        imagePath: '/images/chocolate.png',
      },
    ])
  }),
]
