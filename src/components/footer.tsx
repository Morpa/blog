import Container from './container'

const Footer = () => {
  const date = new Date()

  return (
    <footer className="dark-mode">
      <Container>
        <div className="py-4 flex flex-col lg:flex-row items-center">
          <h3 className="text-1xl lg:text-1xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-0 lg:mb-0 lg:pr-4 lg:w-1/2">
            {date.getFullYear()} © Morpa
          </h3>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
