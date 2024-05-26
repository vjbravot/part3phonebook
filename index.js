const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url - :response-time ms :body '))
const date = new Date();
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

app.get('/info', (request, response) => {
    var plength = persons.length
    response.send(`
    <p>Phonebook has info for ${plength} people </p>
    <p>${date}</p>`)
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

const generateId = () => {
    const maxValid = 1000000
    const newId = Math.floor(Math.random() * maxValid)
    return newId
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name missing' 
      })
    }

    else if (!body.number){
        return response.status(400).json({
            error: 'Number is missing'
        })
    }

    else if (persons.map(person => person.name).includes(body.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })