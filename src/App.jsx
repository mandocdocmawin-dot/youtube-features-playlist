import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import YoutubeList from './components/tracks/YoutubeList'

function App () {

  return (
    <>
    <div className="page">
      <Header />
      <YoutubeList />
      <Footer />
    </div>
    </>
  ) 
}

export default App