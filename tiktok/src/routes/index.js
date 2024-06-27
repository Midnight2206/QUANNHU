import Home from '~/Pages/Home';
import Following from '~/Pages/Following';
import Upload from '~/Pages/Upload';
import HeaderOnly from '~/components/Layout/HeaderOnly'
const publicRoutes = [
    {path:'/', component: Home},
    {path:'/following', component: Following},
    {path:'/upload', component: Upload, layout: HeaderOnly},
]

const privateRoutes = [

]

export {publicRoutes, privateRoutes}