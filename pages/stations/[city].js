import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

export default function CityStations({ city }) {
  const router = useRouter();
  if (router.isFallback) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>{city} EV Charging Stations | EV Helper</title>
        <meta name="description" content={`Find EV charging stations in ${city}. Live map, subsidies, and EV calculator.`} />
      </Head>
      <h1 className="text-2xl font-bold text-center my-6">{city} EV Charging Stations</h1>
      <Map defaultCity={city} />
    </>
  );
}

// Static generation for SEO
export async function getStaticPaths() {
  const cities = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"];
  return {
    paths: cities.map(city => ({ params: { city: city.toLowerCase() } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  return { props: { city: params.city.charAt(0).toUpperCase() + params.city.slice(1) } };
}
