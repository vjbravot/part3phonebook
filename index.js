const express = require('express')
const app = express()

require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(requestLogger)

const morgan = require('morgan')
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url - :response-time ms :body '))

const date = new Date();


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  })

app.get('', (request, response) => {
  response.send(`
  <p>Welcome to my phone directory </p>`)
})

app.get('/api/persons/:id', (request,response,next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    })
  
app.post('/api/persons/', (request, response, next) => {
    
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
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson =>{
      response.json(savedPerson)
    }).catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
      Person.findOneAndUpdate(
        {name: person.name},
        {number: person.number},
        {new: true, runValidators: true, context: 'query'})
      .then(updatedPerson => {
      response.json(updatedPerson)
      })
      .catch(error => next(error))
    })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // controlador de solicitudes con endpoint desconocido
  app.use(unknownEndpoint)


  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
  app.use(errorHandler)


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })