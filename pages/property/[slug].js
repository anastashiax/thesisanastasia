import { sanityClient } from "../../sanity"
import Image from "../../components/Image"
import Map from "../../components/Map"
import Link from "next/link"

const Property = ({
  title,
  location,
  propertyType,
  mainImage,
  images,
  pricePerAssets,
  telephone,
  address,
  description,
  adminhost,
}) => {

  console.log(images)
  return (
    <div className="container">
      <h1>
        <b>{title}</b>
      </h1>

      <div className="images-section">
        <Image identifier="main-image" image={mainImage} />
        <div className="sub-images-section">
          {images.map(({ _key, asset }, image) => (
            <Image key={_key} identifier="image" image={asset} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="information"> 
          <h2>
            <b>
              {propertyType} hosted by {adminhost?.name}
            </b>
          </h2>
          <h4>
            Address: {address} , Telephone: {telephone} 
        
          </h4>
          <hr />
          <h4>{description}</h4>
          <h4>
          <b>Enhanced Clean</b>
          </h4>
          <p>
            Ciputra Group is committed to Ciputra enhanced Hygine and cleanliness process.
          </p>
          <h4>
            <b> Ciputra for everyday living!</b>
          </h4>
          <p>
            Ciputra Jakarta is one of the most strategic locations. The hotel boasts spacious spring-cleaned guest rooms of flexible configurations plus excellent city views, 
            the comfortable all-day dining The Gallery Restaurant, the Executive Lounge with the best views, 
            Large high ceiling ballrooms to cater up to 1,500 delegates, and a fabulous wellness center with a tropical swimming pool.
          </p>
          <h4>
            <b>Safety Commitments </b>
          </h4>
          <p>
            Ciputra Group focuses daily to adhere fully to the highest sanitation, hygiene, health,
            safety protocol standards as currently stipulated by the World Health Organization and the 10 Health, Safety, Hygiene Commitments. 
            Ciputra Group strictly apply the new global health and safety standards as your safety and health is our priority. 
            Ciputra Group have been certified by multiple certification authorities, such as TUVR for HACCP (Hazard Analysis Critical Control Point) certification, 
            Bureau Veritas for Coronavirus free environment, and ECOLAB worldwide standards compliant for our housekeeping and kitchen operations.
          </p>
        </div>
        <div className="price-box">
          <h2>Total Asset = Rp. {pricePerAssets}</h2>

          <Link href="https://www.w3schools.com">
            <div className="button">Buy now!</div>
          </Link>
        </div>
      </div>

      <hr />

     


      <h2>Location</h2>
      <Map location={location}></Map>
    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug

  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    title,
    location,
    propertyType,
    mainImage,
    images,
    pricePerAssets,
    telephone,
    address,
    description,
    adminhost->{
      _id,
      name,
      slug,
      image
    },
  }`

  const property = await sanityClient.fetch(query, { pageSlug })

  if (!property) {
    return {
      props: null,
      notFound: true,
    }
  } else {
    return {
      props: {
        title: property.title,
        location: property.location,
        propertyType: property.propertyType,
        mainImage: property.mainImage,
        images: property.images,
        pricePerAssets: property.pricePerAssets,
        telephone: property.telephone,
        address: property.address,
        description: property.description,
        adminhost: property.adminhost,
      },
    }
  }
}

export default Property
