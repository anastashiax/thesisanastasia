import { useRouter } from 'next/router'
import { sanityClient } from "../../../../sanity"
import Image from "../../../../components/Image"
import Link from "next/link"

const University = ({
    unititle,
    location,
    mainImage,
    telephone,
    address,
    description
}) => {
 
const router = useRouter()
    return (
    <div className="container">

       <h1>
        <b>nearest to {unititle}</b>
      </h1>
 
      <div className="images-section">
        <Image identifier="main-image" image={mainImage} />
      </div>  

      <div className="section">
        <div className="information"> 
          <h4>
            Address: {address} , Telephone: {telephone} 
        
          </h4>
          <hr />
          <h4>{description}</h4>
        </div>
      </div>

      <hr />
     


    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const pageUniversity = pageContext.query.university
  
  const query = `*[ _type == "university" && slug.current == $pageUniversity][0]{
    unititle,
    location,
    mainImage,
    telephone,
    address,
    description
  }`

  const university = await sanityClient.fetch(query, { pageUniversity })

  if (!university) {
    return {
      props: null,
      notFound: true,
    }
  } else {
    return {
      props: {
        unititle: university.unititle,
        location: university.location,
        mainImage: university.mainImage,
        telephone: university.telephone,
        address: university.address,
        description: university.description
      },
    }
  }
}

export default University
