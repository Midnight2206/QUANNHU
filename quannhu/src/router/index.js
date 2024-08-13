import Home from "~/pages/Home"
import QuanT from "~/pages/Quantrang"


const publicRoutes = [
    {path: '/', conponent: Home},
    {path: '/quantrang/add', conponent: QuanT.AddQuanNhan, layout: null},
    {path: '/quantrang/criterion', conponent: QuanT.Criterion, layout: null},
    {path: '/quantrang/individual/:slug', conponent: QuanT.Individual, layout: null},
    {path: '/quantrang/dispensation/:id', conponent: QuanT.Dispensation, layout: null},
    {path: '/quantrang/increase/list', conponent: QuanT.IncreaseList, layout: null},
    {path: '/quantrang/increase', conponent: QuanT.IncreaseMilitaries, layout: null},
    {path: '/quantrang/importlist', conponent: QuanT.importList, layout: null},
    {path: '/quantrang/shared', conponent: QuanT.SharedMilitaryEquipment, layout: null},
    {path: '/quantrang', conponent: QuanT.Quantrang, layout: null},
    {path: '/quantrang/decrease/list', conponent: QuanT.DecreaseList, layout: null},
    {path: '/quantrang/decrease', conponent: QuanT.DecreaseMilitaries, layout: null},
    {path: '/quantrang/test', conponent: QuanT.Test, layout: null},

]
    
const privateRoutes = {

}

export {publicRoutes, privateRoutes}