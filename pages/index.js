import { sanityClient, urlFor } from "../sanity"
import Link from "next/link"
import { isMultiple } from "../utils"
import DashboardMap from "../components/DashboardMap"
import NavBar from "../components/NavBar"

const Home = ({ properties }) => {
  console.log(properties)
  return (
    <>
      {properties && (
        <div className="main">
          
          <div className="feed-container">
            <h2>Daftar Alamat Entitas Anak/Entitas Asosiasi PT Ciputra Development </h2>
            <div className="feed">
              {properties.map((property) => (
                <Link href={`property/${property.slug.current}`}>
                  <div key={property.id} className="card">
                    <img src={urlFor(property.mainImage)} />

                    <h3>{property.title}</h3>
                    <h3>
                      <b>Total Asset = Rp{property.pricePerAssets}</b>
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="map">
            <DashboardMap properties={properties} />
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]'
  const properties = await sanityClient.fetch(query)

  if (!properties.length) {
    return {
      props: {
        properties: [],
      },
    }
  } else {
    return {
      props: {
        properties,
      },
    }
  }
}

export default Home
