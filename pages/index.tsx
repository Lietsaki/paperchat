import styles from '../styles/layout/layout.module.scss';

const { main, main_section, screen, top, bottom } = styles;

const Home = () => {
  return (
    <div className={main}>
      <div className={main_section}>
        <div className={`${screen} ${top}`}></div>
        <div className={`${screen} ${bottom}`}></div>
      </div>
    </div>
  );
};

export default Home;
