import styles from '../styles/layout/layout.module.scss';

const { main, main_section, screen } = styles;

const Home = () => {
  return (
    <div className={main}>
      <div className={main_section}>
        <div className={screen}></div>
        <div className={screen}></div>
      </div>
    </div>
  );
};

export default Home;
