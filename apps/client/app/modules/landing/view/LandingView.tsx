import Hero from "../components/Hero";
import landingContent from 'public/contents/landing.json';

export default function LandingView() {
    const { title, description, tagline } = landingContent;
    return (
        <div>
            <Hero
                title={title}
                description={description}
                tagline={tagline}
            />
        </div>
    )
}