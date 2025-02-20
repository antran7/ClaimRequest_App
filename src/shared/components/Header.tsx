import './Header.css'

const Header = () => {
  return (
    <div className='layout-header'>
      <div className='layout-header-left'>
        Claim Request
      </div>
      <div className='layout-header-right'>
        <div className='header-right-item'>Services</div>
        <div className='header-right-item'>About</div>
        <div className='header-right-item'>Contact</div>
      </div>
    </div>
  )
}

export default Header