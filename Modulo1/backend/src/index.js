const express = require('express')
const { uuid } = require('uuidv4')

const app = express()
app.use(express.json())

const projects = []

app.get('/projects', (request, response) => {
    const {title} = request.query
    const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects
  return response.json(results)
})

app.post('/projects', (req, resp) => {
  const { title, owner } = req.body
  const project = {id: uuid(), title, owner}
  projects.push(project)
  return resp.json(project)
})

app.put('/projects/:id', (req, resp) => {
  const {id} = req.params
  const { title, owner } = req.body
  
  const projectIndex = projects.findIndex(project => project.id === id)
  if(projectIndex < 0){
    return resp.status(400).json({error: 'Project not found.'})
  }
  const project = {
    id,
    title,
    owner
  }
  projects[projectIndex] = project
  return resp.json(project)
})

app.delete('/projects/:id', (req, resp) => {
  const {id} = req.params
  const projectIndex = projects.findIndex(project => project.id === id)
  // const deletedProject = projects[projectIndex]
  if(projectIndex < 0){
    return resp.status(400).json({error: 'Project not found.'})
  }
  projects.splice(projectIndex, 1)

  return resp.status(204).send()
})

app.listen(3333, () => {
  console.log('🚀 Back-end Started!')
})