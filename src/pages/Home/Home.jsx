import NavBar from '../../components/Navbar/NavBar';
import Hero from '../../components/Hero/Hero';
import SearchSection from '../../components/SearchBar/SearchSEction';
import FeaturedHostels from '../../components/FeaturedHostels/FeaturedHostels';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import Colleges from '../../components/Colleges/Colleges';
import Testimonials from '../../components/Testimonials/Testimonials';
import CallToAction from '../../components/CallToAction/CallToAction';
import Footer from '../../components/Footer/Footer';

const Home = () => {
	return (
		<>
			<NavBar />
			<main>
				<Hero />
				<SearchSection />
				<FeaturedHostels />
				<Colleges />
				<WhyChooseUs />
				<Testimonials />
				<CallToAction />
			</main>
			<Footer />
		</>
	);
};

export default Home;
