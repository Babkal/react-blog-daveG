const Header = ({ title, width }) => {
    return (
        <header className="Header">
            <h1>{title}</h1><span>{width}</span>
        </header>
    )
}

export default Header
