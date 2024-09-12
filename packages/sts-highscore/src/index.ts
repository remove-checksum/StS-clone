import Fastify from 'fastify'

const server = Fastify({
  logger: true
})

server.get('/', async() => {
  return 'hello 2'
})

async function start() {
  try {
    await server.listen({ port: 3033 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()