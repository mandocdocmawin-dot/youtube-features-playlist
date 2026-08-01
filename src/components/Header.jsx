import Title from './Title'

function Header () {
  const isLive = true;

  return (
    <header>
      <Title />
      <p>{isLive ? "Listening live now." : "Playing from your saved queue."}</p>
    </header>
  ) 
}

export default Header