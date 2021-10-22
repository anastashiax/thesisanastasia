import { sanityClient } from "../../sanity"
import { isMultiple } from "../../utils"
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
          <div className="logo">
            <img src="../images/ciputra-logo.svg"/>
          </div>
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
            Address: {address} {isMultiple(address)}, Telephone: {telephone} 
            {isMultiple(telephone)}
          </h4>
          <hr />
          <h4>
            <b>Enhanced Clean</b>
          </h4>
          <p>
            This host is committed to Airbnb's 5-step enhanced cleaning process.
          </p>
          <h4>
            <b>Amenities for everyday living</b>
          </h4>
          <p>
            The host has equipped this place for long stays - kitchen, shampoo,
            conditioner, hairdryer included.
          </p>
          <h4>
            <b>House rules</b>
          </h4>
          <p>
            This place isn't suitable for pets andthe host does not allow
            parties or smoking.
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

      <h4>{description}</h4>


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
