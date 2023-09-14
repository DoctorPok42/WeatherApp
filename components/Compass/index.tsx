import styles from './styles.module.scss'

interface CompassProps {
    direction: number;
}

const Compass = ({ direction }: CompassProps) => {
    return (
        <div className={styles.compass}>
            <div className={styles.compass__container}>
                <div className={styles.compass__container__arrow}>
                    <div className={styles.compass__container__arrow__north}>
                        <span>N</span>
                    </div>
                    <div className={styles.compass__container__arrow__south}>
                        <span>S</span>
                    </div>
                    <div className={styles.compass__container__arrow__east}>
                        <span>E</span>
                    </div>
                    <div className={styles.compass__container__arrow__west}>
                        <span>W</span>
                    </div>
                </div>
                <div className={styles.compass__container__circle}>
                    <div className={styles.compass__container__circle__arrow} style={{
                        transform: `rotate(${direction}deg)`
                    }}></div>
                </div>
            </div>
        </div>
    )
}

export default Compass
