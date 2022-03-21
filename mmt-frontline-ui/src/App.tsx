import React, { useState } from 'react'
import Swal from 'sweetalert2'
import {Route, BrowserRouter as Router, Link, Switch} from 'react-router-dom'
import Tool from './Tool'
import NotFound from './components/NotFound'

function App() {
  return(
    <Router>
    <Switch>
      <Route path='/' exact component={Tool} />
      <Route path='/mmt' component={Tool} />
      <Route component={NotFound} />
    </Switch>
  </Router>
  )
}

export default App
