import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Fragment } from 'react';

import { publicRoutes } from '~/router';
import { DefaultLayout } from './components/Layouts';

function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              var Layout = DefaultLayout
              const Page = route.conponent
              if(route.layout) {
                Layout = route.layout
              } else if(route.layout === null) {
                Layout = Fragment
              }
              return <Route key={index} path={route.path} element={<Layout><Page/></Layout>} />
            })}
          </Routes>
      </div>
    </Router>
  );
}

export default App;
