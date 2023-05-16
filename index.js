const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()



app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 1000000000)
}

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date();
  response.json(`phonebook has info for ${persons.length} people, ${date}`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(el => el.id === id)

  if(person) {
    response.json(person)
  }else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(el => el.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  const body = request.body
  const name = request.body.name
  const number = request.body.number
  const nameExists = persons.find(el => el.name == name)
  
  if(!name || !number){
    return response.status(400).json({
      error: 'content missing'
    })
  }else if(nameExists){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    "id": generateId(),
    "name" : name,
    "number": number
  }

  persons = persons.concat(person)
  response.json(person)
  
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})