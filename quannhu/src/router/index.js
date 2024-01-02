import Home from "~/pages/Home"
import QuanT from "~/pages/Quantrang"


const publicRoutes = [
    {path: '/', conponent: Home},
    {path: '/quantrang/add', conponent: QuanT.AddQuanNhan, layout: null},
    {path: '/quantrang/criterion', conponent: QuanT.Criterion, layout: null},
    {path: '/quantrang/individual/:slug', conponent: QuanT.Individual, layout: null},
    {path: '/quantrang/dispensation/:id', conponent: QuanT.Dispensation, layout: null},
    {path: '/quantrang/increase', conponent: QuanT.IncreaseMilitaries, layout: null},
    {path: '/quantrang', conponent: QuanT.Quantrang, layout: null},
    
]
    
const privateRoutes = {

}

export {publicRoutes, privateRoutes}