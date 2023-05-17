import fastify from 'fastify'
import { generateInvoice } from './invoice'
import { InvoiceBody } from './invoice.types'

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const app = fastify()

app.get<{ Body: InvoiceBody }>('/invoice', async (request, reply) => {
  const data = request.body

  const invoice = await generateInvoice(data)

  reply.header('Content-Type', DOCX_MIME)
  reply.send(invoice)
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Http server running')
  })
