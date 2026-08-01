import Title from './Title'

function Header () {
  const isLive = false;

  return (
  <header>
      <Title />
      <p className="status">{isLive ? "Listening live now." : "Playing from your saved queue."}</p>
    </header>
  ) 
}

export default Header