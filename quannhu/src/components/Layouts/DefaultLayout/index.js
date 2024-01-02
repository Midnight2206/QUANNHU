import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

function DefaultLayout({children}) {
    return (
        <div>
            <Header/>
            <div className='container'>
                <Sidebar/>
                <div className='content'>Content</div>
            </div>
        </div>
    );
}

export default DefaultLayout;