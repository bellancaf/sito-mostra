import React from 'react';
import './Homepage.css';

interface HomepageProps {
    setIsNavbarVisible: (visible: boolean) => void;
    isNavbarVisible: boolean;
}

const Homepage: React.FC<HomepageProps> = ({ setIsNavbarVisible, isNavbarVisible }) => {
	return (
		<div className="homepage">
			<header className="hero-section">
				<h1>Mostra della fame e del desiderio</h1>
				<p>Dove realtà e tristezza si prendono per mano</p>
			</header>

			<section className="features">
				<h2>Dove andiamo?</h2>
				<div className="features-grid">
					<div className="feature-card">
						<h3>Eazy Peazy</h3>
						<p>Lemon Squeezy</p>
						<img src="/images/lemons-tree.webp" alt="Eazy Peazy" />
					</div>
					<div className="feature-card">
						<h3>Perché le cose non vanno?</h3>
						<p>Sempre meglio che niente</p>
						<img src="/images/bob.png" alt="Perché le cose non vanno?" />
					</div>
					<div className="feature-card">
						<h3>E poi?</h3>
						<p>Cosa facciamo?</p>
						<img src="/images/butter.webp" alt="E poi?" />
					</div>
				</div>
			</section>

			<section className="about">
				<h2>Chi sei?</h2>
				<p>
					La mostra è un viaggio attraverso la realtà e la tristezza, un viaggio che ci porta a riflettere sui nostri desideri e le nostre paure.
				</p>
			</section>

		</div>
	);
};

export default Homepage;