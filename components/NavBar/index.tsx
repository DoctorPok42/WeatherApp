import styles from './styles.module.scss'

interface NavBarProps {
  is_loading?: boolean
}

const NavBar = ({ is_loading }: NavBarProps) => {
  return (
    <main className={styles.containernavbar}>
      <div className={styles.containerlogo}>
        <img
          src="/favicon.ico"
          alt="logo"
          style={{
            animation: is_loading
              ? 'spin 3s infinite cubic-bezier(0.25, 0.72, 0.53, 0.99)'
              : '',
          }}
        />
        <h2>Weather App</h2>
      </div>
    </main>
  )
}

export default NavBar
