import landingContent from "public/contents/landing.json";
import Hero from "../components/Hero";

export default function LandingView() {
	const { title, description, tagline } = landingContent;
	return (
		<div>
			<Hero title={title} description={description} tagline={tagline} />
		</div>
	);
}
