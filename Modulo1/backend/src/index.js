const express = require('express')
const { uuid, isUuid } = require('uuidv4')

const app = express()
app.use(express.json())

const projects = []

function logRequests(request, response, next) {
  const { method, url } = request
  const logLabel = `[${method.toUpperCase()}] ${url}`
  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}

function validadeProjectId(request, response, next){
  const {id} = request.params
  if(!isUuid(id)){
    return response.status(400).json({error: 'invalid project ID.'})
  }
  return next()
}
app.use('/project/:id', validadeProjectId)

app.use(logRequests)


app.get('/projects', (request, response) => {
  const { title } = request.query
  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects
  return response.json(results)
})

app.post('/projects', (req, resp) => {
  const { title, owner } = req.body
  const project = { id: uuid(), title, owner }
  projects.push(project)
  return resp.json(project)
})

app.put('/projects/:id', validadeProjectId, (req, resp) => {
  const { id } = req.params
  const { title, owner } = req.body

  const projectIndex = projects.findIndex((project) => project.id === id)
  if (projectIndex < 0) {
    return resp.status(400).json({ error: 'Project not found.' })
  }
  const project = {
    id,
    title,
    owner,
  }
  projects[projectIndex] = project
  return resp.json(project)
})

app.delete('/projects/:id', validadeProjectId, (req, resp) => {
  const { id } = req.params
  const projectIndex = projects.findIndex((project) => project.id === id)
  // const deletedProject = projects[projectIndex]
  if (projectIndex < 0) {
    return resp.status(400).json({ error: 'Project not found.' })
  }
  projects.splice(projectIndex, 1)

  return resp.status(204).send()
})

app.listen(3333, () => {
  console.log('🚀 Back-end Started!')
})
