import { GetStations, CalculateDistance } from './station'
import express from 'express'

const wrap = fn => (...args) => fn(...args).catch(args[2])

function routes(app) {
    // set proper api path and connect the path with wrap(function)
    // coding here ...
    app.get('/api/getStations', wrap(GetStations));
    app.get('/api/calculateDistance', wrap(CalculateDistance));
}

export default routes
