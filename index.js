require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url - :response-time ms :body '))

const date = new Date();


/* if (process.argv.length == 5){
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`${person.name} number ${person.number}added to directory`)
    mongoose.connection.close()
  })
}
else if (process.argv.length == 3){
    Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    console.log(process.argv[2])
    mongoose.connection.close()
  })
} */


app.get('/info', (request, response) => {
    var plength = persons.length
    response.send(`
    <p>Phonebook has info for ${plength} people </p>
    <p>${date}</p>`)
  })

  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  })

app.get('', (request, response) => {
  response.send(`
  <p>Welcome to my phone directory </p>`)
})

app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    })
  
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

    /* else if (persons.map(person => person.name).includes(body.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    } */
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson =>{
      response.json(savedPerson)
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
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
    } 
  
    next(error)
  }
  
  // este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
  app.use(errorHandler)


  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })