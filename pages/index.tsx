import styles from 'styles/home/home.module.scss';

const { top, bottom } = styles;

const Home = () => {
  return (
    <div className="main">
      <div className="main_section">
        <div className={`screen ${top}`}></div>
        <div className={`screen ${bottom}`}></div>
      </div>
    </div>
  );
};

export default Home;
